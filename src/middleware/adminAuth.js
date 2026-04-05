// backend/src/middleware/adminAuth.js
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized - No token provided" 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [user] = await pool.query(
      "SELECT Users_id, role_id FROM users WHERE Users_id = ?", 
      [decoded.id]
    );
    
    if (!user.length) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // ✅ التحقق من أن المستخدم أدمن (role_id = 1)
    if (user[0].role_id !== 1) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin only." 
      });
    }
    
    req.user = { 
      id: user[0].Users_id, 
      role: user[0].role_id 
    };
    
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};