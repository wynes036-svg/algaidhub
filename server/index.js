const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;
const VIDEOS_DIR = path.join(__dirname, "videos");
const CLIENT_BUILD = path.join(__dirname, "../client/dist");

app.use(cors());

// Serve the React frontend build
if (fs.existsSync(CLIENT_BUILD)) {
  app.use(express.static(CLIENT_BUILD));
}

// List all available videos
app.get("/videos", (req, res) => {
  if (!fs.existsSync(VIDEOS_DIR)) {
    return res.json({ videos: [] });
  }
  const files = fs.readdirSync(VIDEOS_DIR).filter((f) => f.endsWith(".mp4"));
  res.json({ videos: files });
});

// Stream a video file by name
app.get("/videos/:filename", (req, res) => {
  const filePath = path.join(VIDEOS_DIR, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Video not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

// Fallback: serve React app for all other routes (SPA support)
app.get("*", (req, res) => {
  const indexPath = path.join(CLIENT_BUILD, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send("Frontend not built yet. Run: cd client && npm run build");
  }
});

// Ensure videos folder exists
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`AlgaidHub running at http://localhost:${PORT}`);
});
