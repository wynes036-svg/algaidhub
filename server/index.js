require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const VIDEOS_DIR = path.join(__dirname, "videos");
const CLIENT_BUILD = path.join(__dirname, "../client/dist");

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log("MongoDB error:", e.message));

// Auth & user routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

// Serve React frontend
if (fs.existsSync(CLIENT_BUILD)) {
  app.use(express.static(CLIENT_BUILD));
}

// List videos
app.get("/videos", (req, res) => {
  if (!fs.existsSync(VIDEOS_DIR)) return res.json({ videos: [] });
  const files = fs.readdirSync(VIDEOS_DIR).filter((f) => f.endsWith(".mp4") || f.endsWith(".m3u8"));
  res.json({ videos: files });
});

// Stream video
app.get("/videos/:filename", (req, res) => {
  const filePath = path.join(VIDEOS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Video not found" });
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Length": fileSize, "Content-Type": "video/mp4" });
    fs.createReadStream(filePath).pipe(res);
  }
});

// SPA fallback
app.get("*", (req, res) => {
  const index = path.join(CLIENT_BUILD, "index.html");
  if (fs.existsSync(index)) res.sendFile(index);
  else res.send("Run: cd client && npm run build");
});

if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });

app.listen(PORT, () => console.log(`AlgaidHub running on port ${PORT}`));
