  const { body, validationResult } = require("express-validator");

  const signupValidation = [
    body("Full_Name")
      .notEmpty().withMessage("Full name is required")
      .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters"),
    
    body("Email")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    
    body("Password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    
    body("Role")
      .isIn(["customer", "provider", "Admin", "Admin_user"])
      .withMessage("Role must be customer, provider, Admin, or Admin_user")
  ];

  const loginValidation = [
    body("Email")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    
    body("Password")
      .notEmpty().withMessage("Password is required")
  ];

  const checkErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  };

  module.exports = {
    signupValidation,
    loginValidation,
    checkErrors
  };