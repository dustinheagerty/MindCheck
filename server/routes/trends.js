const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

function moodDistribution(entries) {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  entries.forEach((e) => dist[e.mood]++);
  return dist;
}

function avgMood(entries) {
  if (!entries.length) return null;
  return Number((entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(2));
}

function calculateStreaks(entries) {
  const dates = [...new Set(entries.map((e) => e.created_at.split("T")[0]))].sort();
  if (!dates.length) return { current_streak: 0, longest_streak: 0 };

  let longest = 1;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]) - new Date(dates[i - 1])) / 86400000;
    if (diff === 1) { streak++; longest = Math.max(longest, streak); }
    else streak = 1;
  }

  const today = new Date().toISOString().split("T")[0];
  const daysSinceLast = (new Date(today) - new Date(dates[dates.length - 1])) / 86400000;

  let current = 0;
  if (daysSinceLast <= 1) {
    current = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const diff = (new Date(dates[i + 1]) - new Date(dates[i])) / 86400000;
      if (diff === 1) current++;
      else break;
    }
  }

  return { current_streak: current, longest_streak: longest };
}

router.get("/weekly", (req, res) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const week_start = weekStart.toISOString().split("T")[0];
  const week_end = now.toISOString().split("T")[0];

  const entries = db
    .prepare("SELECT * FROM entries WHERE user_id = ? AND date(created_at) >= ? ORDER BY created_at ASC")
    .all(req.user.id, week_start);

  res.json({
    week_start,
    week_end,
    avg_mood: avgMood(entries),
    mood_distribution: moodDistribution(entries),
    entries,
  });
});

router.get("/monthly", (req, res) => {
  const now = new Date();
  const month_start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const entries = db
    .prepare("SELECT * FROM entries WHERE user_id = ? AND date(created_at) >= ? ORDER BY created_at ASC")
    .all(req.user.id, month_start);

  res.json({
    month,
    avg_mood: avgMood(entries),
    mood_distribution: moodDistribution(entries),
    entries,
  });
});

router.get("/streak", (req, res) => {
  const entries = db
    .prepare("SELECT created_at FROM entries WHERE user_id = ? ORDER BY created_at ASC")
    .all(req.user.id);
  res.json(calculateStreaks(entries));
});

module.exports = router;
