const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /mp4|avi|mkv|mov|wmv|flv|webm/;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isExtensionAllowed = allowedExtensions.test(fileExtension);
    const isMimetypeAllowed = file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream';

    console.log('Received file with mimetype:', file.mimetype);
    console.log('File extension:', fileExtension);

    if (isExtensionAllowed && isMimetypeAllowed) {
        cb(null, true);
    } else {
        cb(new Error('Invalid video file.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: process.env.VIDEO_SIZE }, // 100 MB file size limit
});

module.exports = upload;
