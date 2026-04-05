const { body, validationResult } = require("express-validator");

const signupValidation = [
  // Full Name: Required, min 3 chars
  body("Full_Name")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters"),

  // Email: Valid format
  body("Email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  // Phone Number: Numeric only and exactly 11 digits
  body("phone_number")
    .notEmpty().withMessage("Phone number is required")
    .isNumeric().withMessage("Phone number must contain only numbers")
    .isLength({ min: 11, max: 11 }).withMessage("Phone number must be exactly 11 digits"),

  // Password: Min 6 chars
  body("Password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  // Role: Strict selection (case insensitive)
  body("Role")
    .toLowerCase()
    .isIn(["customer", "provider", "admin", "admin_user"])
    .withMessage("Role must be customer, provider, admin, or admin_user"),

  // Provider-only Validation: Services must be an array
  body("services")
    .optional()
    .if(body("Role").equals("provider"))
    .isArray({ min: 1 }).withMessage("At least one service is required for providers"),

  // Provider-only Validation: Price cannot be negative
  body("services.*.prices.*.price")
    .optional()
    .if(body("Role").equals("provider"))
    .isFloat({ min: 0 }).withMessage("Price cannot be a negative value"),

  // Provider-only Validation: service_id is required
  body("services.*.service_id")
    .optional()
    .if(body("Role").equals("provider"))
    .isInt({ min: 1 }).withMessage("Valid service_id is required"),
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
      message: "Validation Error",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
  checkErrors
};