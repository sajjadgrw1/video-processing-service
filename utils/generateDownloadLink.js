// utils/generateDownloadLink.js

const { v4: uuidv4 } = require('uuid');
const videoQueue = require('../bullConfig');

const generateDownloadLink = async (filePath) => {
    // Add the file path to the job data
    const job = await videoQueue.add({ filePath });

    // Generate a unique link ID
    const linkId = uuidv4();

    // Store the job ID in Redis with the link ID as the key
    // You can use any appropriate expiration time here
    await videoQueue.client.set(linkId, job.id, 'EX', process.env.DOWNLOAD_LINK_EXPIRY);

    // Return the download link with the link ID
    return `http://localhost:3000/api/videos/download/${linkId}`;
};

module.exports = { generateDownloadLink };
