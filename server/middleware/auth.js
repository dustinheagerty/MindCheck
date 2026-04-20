const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mindcheck_dev_secret";

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token provided." });
  const token = header.replace("Bearer ", "");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
};
