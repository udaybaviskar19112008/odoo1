const mongoose = require("mongoose");

const SwapSchema = new mongoose.Schema(
  {
    userA: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userB: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    skillA: String,
    skillB: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    scheduledDate: Date,
    feedback: String,
    contractFile: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swap", SwapSchema);
