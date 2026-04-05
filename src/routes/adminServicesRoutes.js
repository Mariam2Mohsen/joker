const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminServicesController = require("../controller/adminServicesController");

// ✅ Admin Authentication Middleware (Modified)
// const adminAuth = (req, res, next) => {
//     // role_id = 1 = Admin, role_id = 2 = Admin User
//     if (req.user.role !== 1 && req.user.role !== 2) {
//         return res.status(403).json({
//             success: false,
//             message: "Admin access required"
//         });
//     }
//     next();
// };

// router.use(auth);
// router.use(adminAuth);

// Service Requests Management (Provider Services Approval)
router.get("/requests/pending", adminServicesController.getPendingServiceRequests);
router.post("/requests/:requestId/approve", adminServicesController.approveServiceRequest);
router.post("/requests/:requestId/reject", adminServicesController.rejectServiceRequest);

// Global Service Management (Services Catalog)
router.post("/", adminServicesController.addService);
router.get("/", adminServicesController.getServices);
router.get("/:id", adminServicesController.getServiceById);
router.put("/:id", adminServicesController.updateService);
router.delete("/:id", adminServicesController.deleteService);
router.patch("/:id/status", adminServicesController.changeStatus);

module.exports = router;