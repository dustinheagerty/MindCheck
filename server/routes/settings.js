const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", (req, res) => {
  const row = db.prepare("SELECT data FROM settings WHERE user_id = ?").get(req.user.id);
  res.json(row ? JSON.parse(row.data) : {});
});

router.put("/", (req, res) => {
  const row = db.prepare("SELECT data FROM settings WHERE user_id = ?").get(req.user.id);
  const current = row ? JSON.parse(row.data) : {};
  const updated = { ...current, ...req.body };
  db.prepare("INSERT OR REPLACE INTO settings (user_id, data) VALUES (?, ?)").run(
    req.user.id,
    JSON.stringify(updated)
  );
  res.json(updated);
});

module.exports = router;
