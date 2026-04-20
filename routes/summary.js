const express = require("express");
const router = express.Router();
const db = require("../db");

function getStartDate(period) {
  const now = new Date();
  if (period === "weekly") now.setDate(now.getDate() - now.getDay());
  else if (period === "monthly") now.setDate(1);
  else if (period === "yearly") now.setMonth(0, 1);
  return now.toISOString().split("T")[0];
}

function summary(period) {
  const start = getStartDate(period);
  const entries = db
    .prepare("SELECT * FROM entries WHERE date >= ? ORDER BY date ASC")
    .all(start);
  const avg = entries.length
    ? Number((entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(2))
    : null;
  return { period, start_date: start, average_mood: avg, entries };
}

router.get("/weekly", (req, res) => res.json(summary("weekly")));
router.get("/monthly", (req, res) => res.json(summary("monthly")));
router.get("/yearly", (req, res) => res.json(summary("yearly")));

module.exports = router;
