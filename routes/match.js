const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
require("dotenv").config();

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const others = await User.find({ _id: { $ne: user.id } });
    const prompt = `
User offers: ${user.skillsOffered.join(", ")}
User wants: ${user.skillsWanted.join(", ")}

List up to 3 best mutual skill-swap matches from:
${others
  .map(
    (u) =>
      `${u.name}: offers ${u.skillsOffered.join(
        ", "
      )}, wants ${u.skillsWanted.join(", ")}`
  )
  .join("\n")}
    `;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
      temperature: 0.5,
    });
    res.json({ matches: response.data.choices[0].text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI matchmaking error" });
  }
});

module.exports = router;
