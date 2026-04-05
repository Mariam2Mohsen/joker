const pool = require("../config/db");

// --- 1. PROVIDER LISTINGS ---

exports.getApprovedProviders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.Users_id, u.Full_Name, u.Email, u.created_at as joining_date, u.phone_number, u.account_status,
             (SELECT COUNT(*) FROM provider_services WHERE provider_id = u.Users_id) as services_count,
             (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE provider_id = u.Users_id) as avg_rating
             FROM users u WHERE u.account_status IN ('Active', 'Approved') AND u.role_id = 4`, // 4 is Provider
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPendingProviders = async (req, res) => {
  try {
    // If you don't have the procedure, you can use a raw query:
    const [rows] = await pool.query(
      `SELECT Users_id, Full_Name, Email, City, phone_number, created_at, account_status
       FROM users WHERE role_id = 4 AND account_status = 'Pending' 
       ORDER BY created_at DESC`
    );
 
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
};
// --- 2. PROVIDER DETAILS (The 5 sections: Overview, Services, Bookings, Settings, Reviews) ---

exports.getProviderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [overview] = await pool.query(
      "SELECT * FROM users WHERE Users_id = ?",
      [id],
    );
    const [services] = await pool.query(
      `SELECT ps.*, s.name as service_name FROM provider_services ps 
             JOIN services s ON ps.service_id = s.service_id WHERE ps.provider_id = ?`,
      [id],
    );
    const [bookings] = await pool.query(
      "SELECT * FROM bookings WHERE provider_id = ?",
      [id],
    );
    const [reviews] = await pool.query(
      "SELECT * FROM reviews WHERE provider_id = ?",
      [id],
    );

    if (!overview.length) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    res.json({
      success: true,
      data: {
        overview: overview[0],
        services,
        bookings,
        reviews,
        settings: { status: overview[0].account_status },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 3. PROVIDER ACTIONS ---

exports.approveProvider = async (req, res) => {
  try {
    const { id } = req.params; 
    const io = req.app.get("io");
  
    await pool.query(
      "UPDATE users SET account_status = 'active' WHERE Users_id = ?",
      [id],
    );

  
    const notificationMsg = "تهانينا! تم تفعيل حسابك بنجاح. يمكنك الآن الدخول وإضافة خدماتك.";

  
    await pool.query(
      "INSERT INTO notifications (user_id, message, type, is_read) VALUES (?, ?, ?, 0)",
      [id, notificationMsg, 'AccountActivation']
    );

    if (io) {
     
      io.emit(`notification_user_${id}`, {
        message: notificationMsg,
        type: 'AccountActivation',
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      message: "Provider account approved and notified successfully.",
    });
  } catch (err) {
    console.error("Approve Provider Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.rejectProvider = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    await connection.beginTransaction();
    await connection.query(
      "UPDATE users SET account_status = 'Rejected' WHERE Users_id = ?",
      [id],
    );

    // 2. Automated Rule: If provider rejected, all their services become inactive
    await connection.query(
      "UPDATE provider_services SET status = 'Inactive' WHERE provider_id = ?",
      [id],
    );

    await connection.commit();
    res.json({
      success: true,
      message: "Provider rejected and services disabled.",
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    connection.release();
  }
};

exports.handleProviderAction = async (req, res) => {
  const { id } = req.params; 
  const { action } = req.body; 

  let newStatus;
  const normalizedAction = action?.toLowerCase().trim();

  if (normalizedAction === 'approve' || normalizedAction === 'active') {
    newStatus = 'active';
  } else if (normalizedAction === 'reject' || normalizedAction === 'inactive') {
    newStatus = 'inactive';
  } else {
    newStatus = 'pending';
  }

  try {
    const [result] = await pool.query(
      "UPDATE users SET account_status = ? WHERE Users_id = ? AND role_id = 4",
      [newStatus, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Provider not found or not a provider",
        });
    }

    res.json({
      success: true,
      message: `Provider has been ${newStatus} successfully.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 4. SERVICE ACTIONS ---

exports.getPendingServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
                sr.request_id, 
                sr.service_name, 
                sr.status, 
                u.Full_Name AS provider_name
             FROM service_requests sr 
             INNER JOIN users u ON sr.provider_id = u.Users_id
             WHERE sr.status = 'Pending'`,
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
};
exports.approveService = async (req, res) => {
  try {
    const { id } = req.params; // provider_services.id
    await pool.query(
      "UPDATE provider_services SET status = 'Active' WHERE id = ?",
      [id],
    );
    res.json({ success: true, message: "Service approved and is now live." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.rejectService = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Capture rejection reason
    await pool.query(
      "UPDATE provider_services SET status = 'Rejected', rejection_reason = ? WHERE id = ?",
      [reason, id],
    );
    res.json({ success: true, message: "Service request rejected." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.handleServiceAction = async (req, res) => {
    const { id } = req.params; 
    const { action } = req.body; 

   
    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';

    try {
        const [result] = await pool.query(
            "UPDATE service_requests SET status = ? WHERE request_id = ?",
            [newStatus, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Service request not found" 
            });
        }

        res.json({ 
            success: true, 
            message: `Service request #${id} has been ${newStatus} successfully.` 
        });
    } catch (err) {
        console.error("Error updating service status:", err);
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
};
exports.getNotifications = async (req, res) => {
  try {
  
    const userId = req.user.id; 
    const userRole = Number(req.user.role_id || req.user.role); 

    let query = "";
    let queryParams = [userId];

    
    if (userRole === 1 || userRole === 2) {
      console.log(`[Admin View] Fetching for Admin ID: ${userId}`);
      query = `
        SELECT * FROM notifications 
        WHERE user_id = ? 
           OR user_id = 1 
           OR user_id IS NULL 
        ORDER BY created_at DESC 
        LIMIT 30
      `;
    } 
   
    else {
      console.log(`[Provider View] Fetching for Provider ID: ${userId}`);
      query = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30";
    }

    const [rows] = await pool.query(query, queryParams);
    
    res.status(200).json({ 
      success: true, 
      notifications: rows 
    });

  } catch (err) {
    console.error("❌ Notification Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = Number(req.user.role);

    let query = "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0";
    let params = [userId];

    if (userRole === 1 || userRole === 2) {
    
      query = "UPDATE notifications SET is_read = 1 WHERE (user_id = ? OR type = 'ProviderSignup') AND is_read = 0";
    }

    await pool.query(query, params);
    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};