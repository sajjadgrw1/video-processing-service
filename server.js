// server.js
const express = require('express');
const videoRoutes = require('./routes/videoRoutes');
const videoQueue = require('./bullConfig');
const processVideoJob = require('./jobs/videoProcessor');

const app = express();
app.use(express.json());

app.use('/api/videos', videoRoutes);

videoQueue.process(async (job) => {
    return await processVideoJob(job);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
