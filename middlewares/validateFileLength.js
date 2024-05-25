// middlewares/validateFileLength.js
const ffmpeg = require('fluent-ffmpeg');

const validateFileLength = (req, res, next) => {
  const filePath = req.file.path;
  ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err) {
      return res.status(400).send('Invalid video file.');
    }
    const duration = metadata.format.duration;
    if (duration > 300) { // example: 5 minutes max duration
      return res.status(400).send('Video exceeds maximum length.');
    }
    next();
  });
};

module.exports = validateFileLength;
