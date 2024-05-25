// jobs/videoProcessor.js
const { applyEffect } = require('../utils/ffmpegCommands');
const path = require('path');

const processVideoJob = async (job) => {
    const { inputPath, effect, dimensions } = job.data;
    const outputPath = path.join('processed', `${Date.now()}-processed.mp4`);

    return new Promise((resolve, reject) => {
        applyEffect(inputPath, outputPath, effect, dimensions, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(outputPath);
            }
        });
    });
};

module.exports = processVideoJob;
