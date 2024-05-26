// utils/ffmpegCommands.js
const ffmpeg = require('fluent-ffmpeg');

const applyEffect = (inputPath, outputPath, effect, dimensions, myprogress , callback) => {
    let command = ffmpeg(inputPath).output(outputPath);

    switch (effect) {
        case 'grayscale':
            command = command.videoFilters('hue=s=0');
            break;
        case 'negate':
            command = command.videoFilters('negate');
            break;
        case 'sepia':
            command = command.videoFilters('colorchannelmixer=.393:.769:.189:.349:.686:.168:.272:.534:.131');
            break;
        case 'blur':
            command = command.videoFilters('boxblur=10');
            break;
        case 'sharpen':
            command = command.videoFilters('unsharp=5:5:1.0:5:5:0.0');
            break;
    }

    if (dimensions) {
        command = command.size(dimensions);
    }

    command.on('progress',(info)=>{
        myprogress(info.percent);
    })

    command.on('end', () => {
        myprogress(100);
        callback(null, outputPath);
    }).on('error', (err) => {
        callback(err);
    }).run();
};

module.exports = { applyEffect };
