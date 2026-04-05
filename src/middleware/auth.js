const jwt = require("jsonwebtoken");
const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1. أضفنا account_status في الـ SELECT عشان نقدر نفحصه
    const [user] = await pool.query(
      "SELECT Users_id, role_id, account_status FROM users WHERE Users_id = ?", 
      [decoded.id]
    );

    if (!user.length) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 2. فحص الحالة بطريقة مرنة (تحويلها لـ lowercase) لتجنب مشاكل الـ Active/active
    const currentStatus = user[0].account_status ? user[0].account_status.toLowerCase() : "";

    if (currentStatus !== 'active' && currentStatus !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: "Access restricted. Your session has been terminated.",
        forceLogout: true 
      });
    }

    // 3. تخزين البيانات في الـ request
    req.user = { 
      id: user[0].Users_id, 
      role: Number(user[0].role_id) // تأكدي إنها رقم للمقارنات اللاحقة
    };
    
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};