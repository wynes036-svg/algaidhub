const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get profile
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Update avatar
router.put("/avatar", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { avatar: req.body.avatar }, { new: true }).select("-password");
  res.json(user);
});

// Get favorites
router.get("/favorites", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("favorites");
  res.json(user.favorites);
});

// Add favorite
router.post("/favorites", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.favorites.find((m) => m.id === req.body.movie.id)) {
    user.favorites.push(req.body.movie);
    await user.save();
  }
  res.json(user.favorites);
});

// Remove favorite
router.delete("/favorites/:movieId", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter((m) => String(m.id) !== req.params.movieId);
  await user.save();
  res.json(user.favorites);
});

// Get watch progress
router.get("/progress", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("watchProgress");
  res.json(Object.fromEntries(user.watchProgress));
});

// Update watch progress
router.post("/progress", auth, async (req, res) => {
  const { movieId, data } = req.body;
  await User.findByIdAndUpdate(req.user.id, {
    [`watchProgress.${movieId}`]: { ...data, updatedAt: Date.now() }
  });
  res.json({ ok: true });
});

// Remove watch progress
router.delete("/progress/:movieId", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $unset: { [`watchProgress.${req.params.movieId}`]: "" }
  });
  res.json({ ok: true });
});

module.exports = router;
