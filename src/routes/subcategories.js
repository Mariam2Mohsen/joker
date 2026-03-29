const router = require("express").Router();
const auth = require("../middleware/auth");
const subController = require("../controller/subCategoryController");

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 1 && req.user.role !== 2) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

// ============== Public Routes (No Auth Required) ==============
router.get("/", subController.getSubCategories);
router.get("/:id", subController.getSubCategoryById);

// ============== Admin Only Routes ==============
router.use(auth);
router.use(adminAuth);

router.post("/", subController.createSubCategory);
router.put("/:id", subController.updateSubCategory);
router.delete("/:id", subController.deleteSubCategory);
router.patch("/:id/status", subController.changeSubCategoryStatus);

module.exports = router;