const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/providers/:id  — Public: no auth required
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [user] = await pool.query(
            `SELECT Users_id, Full_Name, Email, phone_number, City, Address, 
                    account_status, profile_image, created_at
             FROM users 
             WHERE Users_id = ? AND role_id = 4 AND account_status IN ('Active','active','Approved','approved')`,
            [id]
        );

        if (!user.length) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        const [services] = await pool.query(
            `SELECT ps.*, s.name as service_name, c.name as category_name
             FROM provider_services ps
             JOIN services s ON ps.service_id = s.service_id
             JOIN categories c ON s.category_id = c.category_id
             WHERE ps.provider_id = ?`,
            [id]
        );

        const [bookingsAgg] = await pool.query(
            `SELECT COUNT(*) as total FROM bookings WHERE provider_id = ?`,
            [id]
        );

        const [reviewsAgg] = await pool.query(
            `SELECT COUNT(*) as total, ROUND(AVG(rating), 1) as avg_rating 
             FROM reviews WHERE provider_id = ?`,
            [id]
        );

        res.json({
            success: true,
            data: {
                overview: user[0],
                services,
                bookings: { total: bookingsAgg[0].total },
                reviews:  { total: reviewsAgg[0].total, avg_rating: reviewsAgg[0].avg_rating }
            }
        });
    } catch (err) {
        console.error("Public provider details error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
