// backend/src/routes/providerServices.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const controller = require("../controller/providerServiceController");


router.use(auth);

// ==============================================
// ✅ Provider Services Routes
// ==============================================


router.get("/my-services", controller.getMyServices);

// Dashboard Stats - 
router.get("/dashboard-stats", controller.getDashboardStats);

// Service Requests - 
router.get("/service-requests", controller.getServiceRequests);

// تفاصيل طلب خدمة
router.get("/service-requests/:requestId", controller.getServiceRequestById);

// إضافة طلب خدمة جديد
router.post("/service-requests", controller.addServiceRequest);

// حذف طلب خدمة
router.delete("/service-requests/:requestId", controller.deleteServiceRequest);

// إعادة تقديم طلب مرفوض
router.post("/service-requests/:id/resubmit", controller.resubmitServiceRequest);

// تفعيل/تعطيل خدمة معتمدة
router.patch("/:id/toggle", controller.toggleServiceStatus);

// تحديث خدمة معتمدة
router.put("/:id", controller.updateService);

// حذف خدمة معتمدة
router.delete("/:id", controller.deleteService);

// جلب صور الخدمة
router.get("/:providerServiceId/images", controller.getServiceImages);

module.exports = router;