const express = require("express");
const router = express.Router();
const upload = require("../middleware/Uplods");
const { signupValidation, loginValidation, checkErrors } = require("../middleware/validation");
const userController = require("../controller/authcontroller");


router.post("/user_signup", signupValidation, checkErrors, userController.signup);
router.post("/user_login", loginValidation, checkErrors, userController.login);
router.get("/get_users", userController.getUsers);
router.put("/user_update/:id", userController.updateUser);
router.delete("/user_delete/:id", userController.deleteUser);


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