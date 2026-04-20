const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "db", "mindcheck.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    mood  INTEGER NOT NULL,
    label TEXT NOT NULL,
    notes TEXT,
    date  TEXT NOT NULL
  )
`);

module.exports = db;
