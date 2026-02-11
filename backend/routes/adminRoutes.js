import express from "express";
import {
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
} from "../controllers/bookingController.js";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  toggleDiscount,
} from "../controllers/roomController.js";
import Room from "../models/Room.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Admin Routes
 * Protected routes for admin operations
 * All routes require authentication
 */

// Apply protection to all routes
router.use(protect);

// Booking management
router.get("/bookings", getAllBookings);
router.get("/bookings/stats", getBookingStats);
router.patch("/bookings/:id/status", updateBookingStatus);

// Room management (admin-specific endpoints)
router.get(
  "/rooms",
  asyncHandler(async (req, res) => {
    // Get all rooms including inactive ones for admin
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  }),
);
router.post("/rooms", createRoom);
router.put("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);
router.patch("/rooms/:id/discount", toggleDiscount);

// Dashboard stats
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const [totalRooms, activeRooms, bookingStats] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ isActive: true }),
      // Re-use booking stats logic
      (async () => {
        const Booking = (await import("../models/Booking.js")).default;
        const { config } = await import("../config/constants.js");

        const [confirmed, pending, revenue] = await Promise.all([
          Booking.countDocuments({
            paymentStatus: config.paymentStatus.CONFIRMED,
          }),
          Booking.countDocuments({
            paymentStatus: config.paymentStatus.AWAITING_PAYMENT,
          }),
          Booking.aggregate([
            { $match: { paymentStatus: config.paymentStatus.CONFIRMED } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ]),
        ]);

        return { confirmed, pending, revenue: revenue[0]?.total || 0 };
      })(),
    ]);

    res.json({
      success: true,
      data: {
        rooms: {
          total: totalRooms,
          active: activeRooms,
        },
        bookings: {
          confirmed: bookingStats.confirmed,
          pending: bookingStats.pending,
        },
        totalRevenue: bookingStats.revenue,
      },
    });
  }),
);

export default router;
