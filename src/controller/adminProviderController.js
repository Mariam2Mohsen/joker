const pool = require("../config/db");

exports.getProviders = async (req, res) => {
    try {
        const { status } = req.query; 

        let statusFilter = "AND u.account_status = ?";
        let params = [status];

        if (status?.toLowerCase() === 'active' || status?.toLowerCase() === 'approved') {
            statusFilter = "AND u.account_status IN ('Active', 'Approved', 'active', 'approved')";
            params = [];
        } else if (status?.toLowerCase() === 'pending') {
            statusFilter = "AND u.account_status IN ('Pending', 'pending')";
            params = [];
        } else if (status?.toLowerCase() === 'rejected') {
            statusFilter = "AND u.account_status IN ('Rejected', 'rejected')";
            params = [];
        } else if (status?.toLowerCase() === 'inactive') {
            statusFilter = "AND u.account_status IN ('Inactive', 'inactive')";
            params = [];
        }

        const query = `
      SELECT 
        u.Users_id, u.Full_Name as Name, u.Email, u.created_at as Joining_Date, 
        u.phone_number as Contact_Number, u.account_status as Status,
        (SELECT COUNT(*) FROM provider_services WHERE provider_id = u.Users_id) as Services_Count,
        (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE provider_id = u.Users_id) as Average_Rating
      FROM users u
      WHERE u.role_id = 4
      ${statusFilter}
      ORDER BY u.created_at DESC`;

        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProviderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [user] = await pool.query("SELECT * FROM users WHERE Users_id = ?", [id]);

        if (!user.length) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        const [services] = await pool.query(`
      SELECT ps.*, s.name as service_name, c.name as category_name
      FROM provider_services ps
      JOIN services s ON ps.service_id = s.service_id
      JOIN categories c ON s.category_id = c.category_id
      WHERE ps.provider_id = ?`, [id]);
        
        const [bookings] = await pool.query("SELECT * FROM bookings WHERE provider_id = ? ORDER BY created_at DESC", [id]);
        
        const [reviews] = await pool.query("SELECT * FROM reviews WHERE provider_id = ?", [id]);

        res.json({
            success: true,
            data: {
                overview: user[0],
                services: services,
                bookings: bookings,
                reviews: reviews,
                settings: { account_status: user[0].account_status }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateProviderAccountStatus = async (req, res) => {
    const connection = await pool.getConnection();
    const io = req.app.get("io"); 

    try {
        const { id } = req.params;
        const { status } = req.body; 
        const normalizedStatus = status?.toLowerCase().trim();
        let dbStatus = status;

       
        if (normalizedStatus === "in active" || normalizedStatus === "inactive") {
            dbStatus = "inactive";
        } else if (normalizedStatus === "active" || normalizedStatus === "approved") {
            dbStatus = "active";
        }

        await connection.beginTransaction();

       
        console.log(`Updating user ${id} to status: ${dbStatus}`);
        await connection.query(
            "UPDATE users SET account_status = ?, updated_at = NOW() WHERE Users_id = ?",
            [dbStatus, id]
        );

   
        if (dbStatus === 'rejected' || dbStatus === 'inactive') {
            await connection.query(
                "UPDATE provider_services SET status = 'Inactive' WHERE provider_id = ?",
                [id]
            );
        }

        await connection.commit();

        
        if (dbStatus === 'active') {
            try {
                const notificationMsg = "Congratulations! Your account has been successfully activated. You can now log in and start adding your services.";
                
                await pool.query(
                    "INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES (?, ?, 'ProviderApproved', 0, NOW())",
                    [id, notificationMsg]
                );
                console.log("Sending socket to room:", `notification_user_${id}`);
                if (io) {
                    io.emit(`notification_user_${id}`, {
                        message: notificationMsg,
                        type: 'ProviderApproved',
                        is_read: 0,
                        created_at: new Date()
                    });
                    console.log(`✅ Socket & DB Notification sent for user: ${id}`);
                }
            } catch (notifErr) {
               
                console.error("⚠️ Notification failed but status was updated:", notifErr.message);
            }
        }

        res.json({ success: true, message: `Provider account status updated to ${dbStatus}` });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error("❌ Controller Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
};


exports.reviewServiceRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, reason } = req.body;

        // Update the request
        await pool.query(
            "UPDATE service_requests SET status = ?, rejection_reason = ? WHERE request_id = ?",
            [status, reason || null, requestId]
        );

        // If approved, update the actual provider_service to 'Active'
        if (status === 'Approved') {
            await pool.query(
                "UPDATE provider_services SET status = 'Active' WHERE request_id = ?",
                [requestId]
            );
        }

        res.json({ success: true, message: `Service request ${status}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Handle provider account action (Approve/Reject)
exports.handleProviderAction = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    // Map action to status
    let status;
    const normalizedAction = action?.toLowerCase().trim();
    
    if (normalizedAction === 'approve' || normalizedAction === 'approved') {
        status = 'active';
    } else if (normalizedAction === 'reject' || normalizedAction === 'rejected') {
        status = 'inactive';
    } else {
        status = 'Rejected';
    }
    
    // Call existing method
    req.body.status = status;
    return exports.updateProviderAccountStatus(req, res);
};