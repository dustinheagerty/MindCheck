const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

const PROMPTS = [
  { prompt: "You showed up today. That takes courage.", category: "encouragement" },
  { prompt: "Every feeling is valid. You're doing great.", category: "encouragement" },
  { prompt: "Small steps still move you forward.", category: "motivation" },
  { prompt: "Checking in with yourself is an act of self-love.", category: "mindfulness" },
  { prompt: "Progress, not perfection.", category: "motivation" },
  { prompt: "You are allowed to rest and still be worthy.", category: "encouragement" },
  { prompt: "One day at a time is enough.", category: "mindfulness" },
  { prompt: "Your feelings matter. Thank you for tracking them.", category: "encouragement" },
];

router.get("/daily", (req, res) => {
  const dayIndex = new Date().getDay();
  res.json(PROMPTS[dayIndex % PROMPTS.length]);
});

router.get("/random", (req, res) => {
  res.json(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
});

module.exports = router;
