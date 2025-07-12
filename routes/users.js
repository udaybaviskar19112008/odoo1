const express = require("express");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// Get current user's profile
router.get("/me", authMiddleware, (req, res) => res.json(req.user));

// Update profile
router.put("/me", authMiddleware, async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json({ message: "Profile updated", user: req.user });
});

// Browse/search public profiles
router.get("/", authMiddleware, async (req, res) => {
  const { skill } = req.query;
  const filter = {
    isPublic: true,
    ...(skill ? { skillsOffered: skill } : {}),
  };
  const users = await User.find(filter).select("-password");
  res.json(users);
});

module.exports = router;
