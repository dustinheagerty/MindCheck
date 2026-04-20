const express = require("express");
const router = express.Router();
const db = require("../db");

const LABELS = { 1: "awful", 2: "bad", 3: "okay", 4: "good", 5: "great" };

router.post("/", (req, res) => {
  const { mood, notes } = req.body;
  if (!mood || mood < 1 || mood > 5)
    return res.status(400).json({ error: "Mood must be 1–5." });

  const label = LABELS[mood];
  const date = new Date().toISOString().split("T")[0];
  const result = db
    .prepare("INSERT INTO entries (mood, label, notes, date) VALUES (?, ?, ?, ?)")
    .run(mood, label, notes || null, date);

  res.status(201).json({ id: result.lastInsertRowid, mood, label, notes, date });
});

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM entries ORDER BY date DESC").all());
});

router.get("/:id", (req, res) => {
  const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(req.params.id);
  if (!entry) return res.status(404).json({ error: "Entry not found." });
  res.json(entry);
});

router.put("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM entries WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Entry not found." });

  const mood = req.body.mood ?? row.mood;
  const notes = req.body.notes !== undefined ? req.body.notes : row.notes;
  const label = LABELS[mood] ?? row.label;

  db.prepare("UPDATE entries SET mood = ?, label = ?, notes = ? WHERE id = ?").run(
    mood,
    label,
    notes,
    req.params.id
  );

  res.json({ id: Number(req.params.id), mood, label, notes, date: row.date });
});

router.delete("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM entries WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Entry not found." });
  db.prepare("DELETE FROM entries WHERE id = ?").run(req.params.id);
  res.json({ message: "Entry deleted." });
});

module.exports = router;
