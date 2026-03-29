const express = require("express");
const router = express.Router();
const servicesController = require("../controller/servicesController");

// جلب جميع الخدمات النشطة
router.get("/", servicesController.getActiveServices);

// جلب تفاصيل خدمة معينة
router.get("/:id", servicesController.getServiceById);

module.exports = router;
