const { applyEffect } = require('../utils/ffmpegCommands');
const path = require('path');

const processVideoJob = async (job) => {
    const { inputPath, effect, dimensions } = job.data;
    if (!inputPath || !effect) {
        throw new Error('Invalid job data');
    }
    const outputPath = path.join('processed', `${Date.now()}-processed.mp4`);

    const myprogress = (progress) => {
        if (progress != NaN) {
            job.progress(progress);
        }
        
        if (progress === 100) {
            job.progress(100);
            //job.moveToCompleted();
        }
    }

    return new Promise((resolve, reject) => {
        applyEffect(inputPath, outputPath, effect, dimensions, myprogress , (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(outputPath);
            }
        });
    });
};

module.exports = processVideoJob;
