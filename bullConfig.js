const Bull = require('bull');

// Define Redis connection options
const redisOptions = {
  // Redis connection URL
  redis: {
    port: process.env.REDIS_PORT,         // Redis port
    host: process.env.REDIS_URL,  // Redis host
    // password: 'auth', // Redis password (if required)
    // db: 0,            // Redis database index (if required)
  },
};

// Create a new Bull queue with Redis connection options
const videoQueue = new Bull('video-processing', redisOptions);

// Listen for the 'error' event
videoQueue.on('error', (error) => {
    console.error('Bull queue error:', error);
  });
  
  // Listen for the 'connected' event
  videoQueue.on('connected', () => {
    console.log('Bull queue connected to Redis successfully.');
  });
  
  // Listen for the 'failed' event
  videoQueue.on('failed', (error) => {
    console.error('Bull queue connection failed:', error);
  });

  videoQueue.on('completed', (job) => {
    console.log(`Job ${job.id} has been completed successfully.`);
  });

  // Check if the queue is ready
if (videoQueue.isReady()) {
    console.log('Bull queue is ready to process jobs.');
  } else {
    console.log('Bull queue is not yet ready.');
  }
  
// Export the configured Bull queue for use in other parts of your application
module.exports = videoQueue;