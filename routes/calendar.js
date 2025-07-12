const express = require("express");
const ical = require("ical-generator");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/generate-ics", authMiddleware, (req, res) => {
  const { title, description, start, end } = req.body;
  const cal = ical({ name: "Skill Swap Calendar" });
  cal.createEvent({
    start: new Date(start),
    end: new Date(end),
    summary: title,
    description,
  });
  res.setHeader("Content-Type", "text/calendar");
  res.send(cal.toString());
});

module.exports = router;
