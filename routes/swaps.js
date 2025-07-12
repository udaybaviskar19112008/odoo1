const express = require("express");
const Swap = require("../models/Swap");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// Request a swap
router.post("/request", authMiddleware, async (req, res) => {
  const swap = await Swap.create({
    userA: req.user._id,
    userB: req.body.userB,
    skillA: req.body.skillA,
    skillB: req.body.skillB,
  });
  res.json(swap);
});

// List user's swaps
router.get("/", authMiddleware, async (req, res) => {
  const swaps = await Swap.find({
    $or: [{ userA: req.user._id }, { userB: req.user._id }],
  }).populate("userA userB");
  res.json(swaps);
});

// Accept a swap
router.post("/:id/accept", authMiddleware, async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (!swap || swap.userB.toString() !== req.user._id.toString()) {
    return res.status(400).json({ error: "Invalid swap" });
  }
  swap.status = "accepted";
  swap.scheduledDate = req.body.scheduledDate;
  await swap.save();
  res.json(swap);
});

// Reject swap
router.post("/:id/reject", authMiddleware, async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (!swap) return res.status(404).json({ error: "Not found" });
  swap.status = "rejected";
  await swap.save();
  res.json(swap);
});

// Delete a swap (if pending)
router.delete("/:id", authMiddleware, async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (swap.status !== "pending") {
    return res.status(400).json({ error: "Cannot delete after acceptance" });
  }
  await swap.remove();
  res.json({ message: "Swap request deleted" });
});

// Provide feedback
router.post("/:id/feedback", authMiddleware, async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  swap.feedback = req.body.feedback;
  await swap.save();
  res.json(swap);
});

module.exports = router;
