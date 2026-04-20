const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "mindcheck_dev_secret";

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

function safeUser(user) {
  return { id: user.id, username: user.username, email: user.email, created_at: user.created_at };
}

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "username, email, and password are required." });

  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email))
    return res.status(409).json({ error: "Email already registered." });

  const password_hash = bcrypt.hashSync(password, 10);
  const created_at = new Date().toISOString();
  const result = db
    .prepare("INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)")
    .run(username, email, password_hash, created_at);

  const user = { id: result.lastInsertRowid, username, email, created_at };
  db.prepare("INSERT INTO settings (user_id, data) VALUES (?, ?)").run(
    user.id,
    JSON.stringify({ reminder_enabled: false, reminder_time: null, timezone: "UTC" })
  );

  res.status(201).json({ token: makeToken(user), user: safeUser(user) });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password are required." });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: "Invalid credentials." });

  res.json({ token: makeToken(user), user: safeUser(user) });
});

router.post("/logout", (req, res) => res.json({ message: "Logged out." }));

router.get("/me", authMiddleware, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: safeUser(user) });
});

module.exports = router;
