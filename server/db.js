const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "db", "mindcheck.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS entries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    mood       INTEGER NOT NULL,
    mood_label TEXT NOT NULL,
    note       TEXT,
    tags       TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    user_id INTEGER PRIMARY KEY,
    data    TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;
