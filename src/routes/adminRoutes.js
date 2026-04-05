const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const adminProviderController = require("../controller/adminProviderController");
const adminController = require('../controller/adminController');

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
    // role_id = 1 = Admin, role_id = 2 = Admin User
    if (req.user.role !== 1 && req.user.role !== 2) {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }
    next();
};

router.use(auth);
router.get('/notifications', adminController.getNotifications);

router.put('/notifications',  adminController.markAllAsRead);

router.use(adminAuth);


// Get list of providers by status
router.get("/providers/pending", (req, res) => {
    req.query.status = 'Pending';
    adminProviderController.getProviders(req, res);
});

router.get("/providers/approved", (req, res) => {
    req.query.status = 'Active';
    adminProviderController.getProviders(req, res);
});

// Get detailed info for a specific provider
router.get("/providers/:id", adminProviderController.getProviderDetails);

// Update provider account status
router.patch("/providers/:id/status", adminProviderController.updateProviderAccountStatus);

// Backward compatibility (if needed by frontend legacy calls)
router.put("/provider-action/:id", adminProviderController.handleProviderAction);
router.get("/pending-providers", (req, res) => {
    req.query.status = 'Pending';
    adminProviderController.getProviders(req, res);
});
router.get("/approved-providers", (req, res) => {
    req.query.status = 'Active';
    adminProviderController.getProviders(req, res);
});


module.exports = router;
