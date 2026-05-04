const { Database: _Database } = require("node-sqlite3-wasm");
const path = require("path");
const fs = require("fs");

const dbDir = path.join(__dirname, "db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const _db = new _Database(path.join(dbDir, "mindcheck.db"));

// Wrap statements to accept spread positional args like better-sqlite3
function wrapStmt(stmt) {
  function normalize(args) {
    return args.length === 1 ? args[0] : args;
  }
  return {
    get(...args) { return stmt.get(normalize(args)); },
    all(...args) { return stmt.all(normalize(args)); },
    run(...args) {
      const r = stmt.run(normalize(args));
      return { lastInsertRowid: Number(r.lastInsertRowid), changes: r.changes };
    },
  };
}

const db = {
  exec(sql) { return _db.exec(sql); },
  prepare(sql) { return wrapStmt(_db.prepare(sql)); },
};

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
