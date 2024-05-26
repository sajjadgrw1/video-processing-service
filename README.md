# Video Processing Service

## Setup and Run

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file based on the provided example.
4. Start Redis server.
5. Run `node server.js` to start the server.

## API Endpoints

- `POST /api/videos/upload`: Upload a video file with effects and dimensions.
- `GET /api/videos/progress/:jobId`: Get processing progress.
- `GET /api/videos/download/:jobId`: Get download link for processed video.

## Design Decisions

- **Multer** for handling file uploads.
- **FFmpeg** for video processing.
- **Bull** for job queue management.
- **Redis** for temporary storage of download links.

## Assumptions and Improvements

- Assumed a maximum video length of 5 minutes.
- Download links expire after 2 minutes.
- Potential improvements include better error handling, support for more video effects, and optimized processing for large video files.


brew install ffmpeg 
brew install redis
brew services start redis


`curl -X POST http://localhost:3000/api/videos/upload \
     -H "Content-Type: multipart/form-data" \
     -F "video=@path/to/video;type=video/mp4" \
     -F "effect=grayscale" \
     -F "dimensions=500x500"

curl -X POST http://localhost:3000/api/videos/upload \
     -H "Content-Type: multipart/form-data" \
     -F "video=@path/to/video;type=video/mp4" \
     -F "effect=negate" \
     -F "dimensions=500x500"

curl -X POST http://localhost:3000/api/videos/upload \
     -H "Content-Type: multipart/form-data" \
     -F "video=@path/to/video;type=video/mp4" \
     -F "effect=sepia" \
     -F "dimensions=500x500"

curl -X POST http://localhost:3000/api/videos/upload \
     -H "Content-Type: multipart/form-data" \
     -F "video=@path/to/video;type=video/mp4" \
     -F "effect=blur" \
     -F "dimensions=500x500"

curl -X POST http://localhost:3000/api/videos/upload \
     -H "Content-Type: multipart/form-data" \
     -F "video=@path/to/video;type=video/mp4" \
     -F "effect=sharpen" \
     -F "dimensions=500x500"
`