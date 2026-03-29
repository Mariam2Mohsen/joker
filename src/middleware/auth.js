const jwt = require("jsonwebtoken");
const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await pool.query("SELECT Users_id, role_id FROM users WHERE Users_id = ?", [decoded.id]);
    if (!user.length) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = { id: user[0].Users_id, role: user[0].role_id };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};