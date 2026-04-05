const express = require("express");
const router = express.Router();
const upload = require("../middleware/Uplods");
const { signupValidation, loginValidation, checkErrors } = require("../middleware/validation");
const userController = require("../controller/authcontroller");

// ==============================================
// ✅ User Routes
// ==============================================

// Auth
router.post("/user_signup", signupValidation, checkErrors, userController.signup);
router.post("/user_login", loginValidation, checkErrors, userController.login);
router.post("/user_logout", userController.logout);

// User Management
router.get("/get_users", userController.getUsers);
router.put("/user_update/:id", userController.updateUser);
router.delete("/user_delete/:id", userController.deleteUser);

// Provider Management (Admin)
router.patch("/approve_provider/:id", userController.approveProvider);
router.patch("/reject_provider/:id", userController.rejectProvider);
router.get("/pending_providers", userController.getPendingProviders);

// Upload
router.post("/upload_image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: "No file uploaded" 
    }); 
  }
  res.json({ 
    success: true,
    message: "File uploaded successfully",
    filename: req.file.filename 
  });
});

module.exports = router;