const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/generate", authMiddleware, async (req, res) => {
  const { swap } = req.body;
  const filename = `contract_${Date.now()}.pdf`;
  const doc = new PDFDocument();
  const path = `./${filename}`;
  doc.pipe(fs.createWriteStream(path));
  doc.fontSize(18).text("Skill Swap Contract", { align: "center" }).moveDown();
  doc.fontSize(12).text(`User A: ${swap.userA}\nUser B: ${swap.userB}`);
  doc.text(`Skill A ↔ Skill B: ${swap.skillA} ↔ ${swap.skillB}`);
  doc.text(`Date: ${new Date(swap.date).toLocaleString()}`);
  doc.end();
  doc.on("close", () => res.download(path, filename));
});

module.exports = router;
