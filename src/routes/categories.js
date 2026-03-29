const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

const categoryController = require("../controller/categoryController");

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 1 && req.user.role !== 2) { // 1=admin, 2=admin_user
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

const imagesDir = path.join(__dirname, "../uploads/categories");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, Date.now() + "-" + cleanName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("File type not supported! Only images are allowed."));
  }
});

// ============== Public Routes (No Auth Required) ==============
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategories);

// ============== Admin Only Routes ==============
router.use(auth);
router.use(adminAuth);

router.post("/", upload.single("image"), categoryController.createCategory);
router.put("/:id", upload.single("image"), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.patch("/:id/status", categoryController.changeCategoryStatus);

module.exports = router;