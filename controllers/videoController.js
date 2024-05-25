const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const videoQueue = require('../bullConfig');
const { generateDownloadLink } = require('../utils/generateDownloadLink');
const redis = require('redis');
const client = redis.createClient();

// Function to check video duration
const checkVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
};

// Function to convert video to MP4
const convertToMP4 = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .videoCodec('libx264')
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .run();
    });
};

// Upload and process video
exports.uploadVideo = async (req, res) => {
    const { effect, dimensions } = req.body;
    const filePath = req.file.path;

    try {
        const duration = await checkVideoDuration(filePath);
        const maxDuration = 300; // 5 minutes limit

        if (duration > maxDuration) {
            return res.status(400).send('Video duration exceeds the 5 minutes limit.');
        }

        let convertedFilePath = filePath;

        // Convert the video to MP4 if it's not already in MP4 format
        if (path.extname(filePath).toLowerCase() !== '.mp4') {
            const outputFilePath = path.join('uploads', `${path.basename(filePath, path.extname(filePath))}.mp4`);
            convertedFilePath = await convertToMP4(filePath, outputFilePath);
        }

        // Add video processing job to the queue
        const job = await videoQueue.add({ inputPath: convertedFilePath, effect, dimensions });

        res.json({ jobId: job.id });
    } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Check progress of a video processing job
exports.checkProgress = async (req, res) => {
    const job = await videoQueue.getJob(req.params.jobId);
    if (job) {
        res.json({ progress: job.progress() });
    } else {
        res.status(404).send('Job not found.');
    }
};

// Get download link for the processed video
exports.getDownloadLink = async (req, res) => {
    if (videoQueue.isReady()) {
        console.log('Bull queue is ready to process jobs.');
    } else {
        console.log('Bull queue is not yet ready.');
    }
    const job = await videoQueue.getJob(req.params.jobId);
    if (job && job.finishedOn) {
        const downloadLink = await generateDownloadLink(job.returnvalue);
        console.log('Download link:', downloadLink);
        return res.json({ downloadLink });
    } else {
        return res.status(404).send('Job not completed or not found.');
    }
};

// Download the processed video
exports.downloadVideo = async (req, res) => {
    const { linkId } = req.params;

    try {
        // Get the job ID associated with the link ID from Redis
        const jobId = await videoQueue.client.get(linkId);

        // Check if the job ID exists
        if (!jobId) {
            return res.status(404).send('Link expired or not found.');
        }

        // Get the remaining time for the link to expire in seconds
        const remainingTime = await videoQueue.client.ttl(linkId);

        // Check if the remaining time is negative or zero, indicating the link has expired
        if (remainingTime <= 0) {
            // If the remaining time is zero or negative, consider the link expired
            // Delete the link from Redis
            videoQueue.client.del(linkId, (delErr) => {
                if (delErr) {
                    console.error('Error deleting expired link from Redis:', delErr);
                }
            });
            return res.status(404).send('Link expired or not found.');
        }

        // Get the job from the queue
        const job = await videoQueue.getJob(jobId);

        // Check if the job is completed
        if (!job || !job.finishedOn) {
            // If the job is not completed, consider the link expired
            // Delete the link from Redis
            videoQueue.client.del(linkId, (delErr) => {
                if (delErr) {
                    console.error('Error deleting expired link from Redis:', delErr);
                }
            });
            return res.status(404).send('Link expired or not found.');
        }

        // Get the file path from the job data
        const filePath = job.data.filePath;

        // Send the file as a download
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
            // No need to delete the link from Redis since it's being retained
        });
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('Internal Server Error');
    }
};
