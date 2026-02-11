import express from "express";
import {
  createBooking,
  confirmBooking,
  getBookingByReference,
  checkAvailability,
  sendReceipt,
} from "../controllers/bookingController.js";
import { bookingValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * Booking Routes
 * Public routes for creating and managing bookings
 */

// Create new booking
router.post("/", bookingValidation.create, createBooking);

// Confirm booking with verification code
router.post("/confirm", bookingValidation.confirm, confirmBooking);

// Send receipt PDF to guest email
router.post("/send-receipt", sendReceipt);

// Check room availability
router.get("/availability/:roomId", checkAvailability);

// Get booking by reference
router.get(
  "/:reference",
  bookingValidation.getByReference,
  getBookingByReference,
);

export default router;
