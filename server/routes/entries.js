const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

const MOOD_LABELS = { 1: "Terrible", 2: "Bad", 3: "Okay", 4: "Good", 5: "Great" };

function formatEntry(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    mood: row.mood,
    mood_label: row.mood_label,
    note: row.note,
    tags: JSON.parse(row.tags || "[]"),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

router.get("/", (req, res) => {
  const { start_date, end_date, limit } = req.query;
  let query = "SELECT * FROM entries WHERE user_id = ?";
  const params = [req.user.id];

  if (start_date) { query += " AND date(created_at) >= ?"; params.push(start_date); }
  if (end_date)   { query += " AND date(created_at) <= ?"; params.push(end_date); }
  query += " ORDER BY created_at DESC";
  if (limit) { query += " LIMIT ?"; params.push(Number(limit)); }

  res.json(db.prepare(query).all(...params).map(formatEntry));
});

// must be before /:id
router.get("/today", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const row = db
    .prepare("SELECT * FROM entries WHERE user_id = ? AND date(created_at) = ? LIMIT 1")
    .get(req.user.id, today);
  res.json(row ? formatEntry(row) : null);
});

router.get("/:id", (req, res) => {
  const row = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: "Entry not found." });
  res.json(formatEntry(row));
});

router.post("/", (req, res) => {
  const { mood, note, tags } = req.body;
  if (!mood || mood < 1 || mood > 5)
    return res.status(400).json({ error: "Mood must be 1–5." });

  const now = new Date().toISOString();
  const result = db
    .prepare(
      "INSERT INTO entries (user_id, mood, mood_label, note, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      req.user.id,
      mood,
      MOOD_LABELS[mood],
      note || null,
      JSON.stringify(tags || []),
      now,
      now
    );

  const row = db.prepare("SELECT * FROM entries WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(formatEntry(row));
});

router.put("/:id", (req, res) => {
  const row = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: "Entry not found." });

  const mood = req.body.mood ?? row.mood;
  const note = req.body.note !== undefined ? req.body.note : row.note;
  const tags = req.body.tags !== undefined ? JSON.stringify(req.body.tags) : row.tags;
  const updated_at = new Date().toISOString();

  db.prepare(
    "UPDATE entries SET mood = ?, mood_label = ?, note = ?, tags = ?, updated_at = ? WHERE id = ?"
  ).run(mood, MOOD_LABELS[mood], note, tags, updated_at, req.params.id);

  const updated = db.prepare("SELECT * FROM entries WHERE id = ?").get(req.params.id);
  res.json(formatEntry(updated));
});

router.delete("/:id", (req, res) => {
  const row = db
    .prepare("SELECT * FROM entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: "Entry not found." });
  db.prepare("DELETE FROM entries WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;
