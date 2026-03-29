const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminServicesController = require("../controller/adminServicesController");

// ✅ Admin Authentication Middleware (Modified)
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
router.use(adminAuth);

// Service Requests Management
router.get("/service-requests/pending", adminServicesController.getPendingServiceRequests);
router.patch("/service-requests/:requestId/approve", adminServicesController.approveServiceRequest);
router.patch("/service-requests/:requestId/reject", adminServicesController.rejectServiceRequest);

// Service Management
router.post("/services", adminServicesController.addService);
router.get("/services", adminServicesController.getServices);
router.get("/services/:id", adminServicesController.getServiceById);
router.put("/services/:id", adminServicesController.updateService);
router.delete("/services/:id", adminServicesController.deleteService);
router.patch("/services/:id/status", adminServicesController.changeStatus);

module.exports = router;