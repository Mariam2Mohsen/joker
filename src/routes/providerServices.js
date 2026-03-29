const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const providerServicesController = require('../controller/providerServiceController');

// جميع هذه النقاط تتطلب تسجيل دخول
router.use(auth);

// جلب الخدمات المعتمدة والنشطة
router.get("/", providerServicesController.getMyServices);

// جلب طلبات الخدمات المعلقة
router.get("/pending", providerServicesController.getPendingServices);

// إضافة خدمة جديدة
router.post("/", providerServicesController.addService);

// تعديل خدمة
router.put("/:id", providerServicesController.updateService);

// تفعيل/تعطيل خدمة
router.patch("/:id/toggle", providerServicesController.toggleServiceStatus);

// حذف خدمة
router.delete("/:id", providerServicesController.deleteService);

module.exports = router;