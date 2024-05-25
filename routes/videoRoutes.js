// routes/videoRoutes.js

const express = require('express');
const videoController = require('../controllers/videoController');
const upload = require('../middlewares/fileUpload');
const validateFileLength = require('../middlewares/validateFileLength');

const router = express.Router();

router.post('/upload', upload.single('video'), validateFileLength, videoController.uploadVideo);
router.get('/progress/:jobId', videoController.checkProgress);
router.get('/download/job/:jobId', videoController.getDownloadLink);
router.get('/download/:linkId', videoController.downloadVideo);

module.exports = router;
