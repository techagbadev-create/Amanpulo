import { body, param, query, validationResult } from "express-validator";

/**
 * Validation error handler middleware
 * Returns formatted validation errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Room validation rules
 */
export const roomValidation = {
  create: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Room name is required")
      .isLength({ max: 100 })
      .withMessage("Name cannot exceed 100 characters"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("price")
      .isNumeric()
      .withMessage("Price must be a number")
      .custom((value) => value >= 0)
      .withMessage("Price cannot be negative"),
    body("totalRooms")
      .isInt({ min: 1 })
      .withMessage("Total rooms must be at least 1"),
    body("maxGuests")
      .isInt({ min: 1 })
      .withMessage("Max guests must be at least 1"),
    body("images")
      .isArray({ min: 1 })
      .withMessage("At least one image is required"),
    body("amenities")
      .optional()
      .isArray()
      .withMessage("Amenities must be an array"),
    body("seasonalDiscount.isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
    body("seasonalDiscount.percentage")
      .optional()
      .isNumeric()
      .withMessage("Percentage must be a number")
      .custom((value) => value >= 0 && value <= 100)
      .withMessage("Percentage must be 0-100"),
    validate,
  ],
  update: [
    param("id").isMongoId().withMessage("Invalid room ID"),
    body("name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Name cannot exceed 100 characters"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    validate,
  ],
};

/**
 * Booking validation rules
 */
export const bookingValidation = {
  create: [
    body("roomId")
      .notEmpty()
      .withMessage("Room selection is required")
      .isMongoId()
      .withMessage("Invalid room ID"),
    body("guestName")
      .trim()
      .notEmpty()
      .withMessage("Guest name is required")
      .isLength({ max: 100 })
      .withMessage("Name cannot exceed 100 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("checkIn")
      .notEmpty()
      .withMessage("Check-in date is required")
      .isISO8601()
      .withMessage("Invalid check-in date format"),
    body("checkOut")
      .notEmpty()
      .withMessage("Check-out date is required")
      .isISO8601()
      .withMessage("Invalid check-out date format"),
    body("guests.adults")
      .isInt({ min: 1 })
      .withMessage("At least 1 adult is required"),
    body("guests.children")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Children count cannot be negative"),
    validate,
  ],
  confirm: [
    body("bookingReference")
      .trim()
      .notEmpty()
      .withMessage("Booking reference is required"),
    body("verificationCode")
      .trim()
      .notEmpty()
      .withMessage("Verification code is required"),
    validate,
  ],
  getByReference: [
    param("reference")
      .trim()
      .notEmpty()
      .withMessage("Booking reference is required"),
    validate,
  ],
};

/**
 * Query validation for pagination
 */
export const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be 1-50"),
  validate,
];

export default {
  validate,
  roomValidation,
  bookingValidation,
  paginationValidation,
};
