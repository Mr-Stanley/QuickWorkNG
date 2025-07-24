const { body, validationResult } = require("express-validator")

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

// Registration validation
const validateRegistration = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role").isIn(["provider", "customer"]).withMessage("Role must be either provider or customer"),
  handleValidationErrors,
]

// Login validation
const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
]

// Provider profile validation
const validateProviderProfile = [
  body("category").trim().notEmpty().withMessage("Service category is required"),
  body("bio").trim().isLength({ min: 10, max: 1000 }).withMessage("Bio must be between 10 and 1000 characters"),
  body("location.state").trim().notEmpty().withMessage("State is required"),
  body("location.city").trim().notEmpty().withMessage("City is required"),
  body("location.lga").trim().notEmpty().withMessage("LGA is required"),
  body("contact.phone")
    .matches(/^(\+234|234|0)[789][01]\d{8}$/)
    .withMessage("Please provide a valid Nigerian phone number"),
  body("contact.whatsapp")
    .matches(/^(\+234|234|0)[789][01]\d{8}$/)
    .withMessage("Please provide a valid Nigerian WhatsApp number"),
  body("contact.email").optional().isEmail().withMessage("Please provide a valid email address"),
  handleValidationErrors,
]

module.exports = {
  validateRegistration,
  validateLogin,
  validateProviderProfile,
  handleValidationErrors,
}
