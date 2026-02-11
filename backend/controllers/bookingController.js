import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { config } from "../config/constants.js";
import {
  sendBookingConfirmationEmail,
  sendNewBookingNotification,
  sendReceiptEmail,
} from "../utils/emailService.js";

/**
 * Booking Controller
 * Handles all booking-related operations
 */

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Public
 */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    roomId,
    guestName,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    specialRequests,
  } = req.body;

  // Verify room exists and is active
  const room = await Room.findOne({ _id: roomId, isActive: true });
  if (!room) {
    res.status(404);
    throw new Error("Room not found or unavailable");
  }

  // Check guest count doesn't exceed room capacity
  const totalGuests = (guests.adults || 0) + (guests.children || 0);
  if (totalGuests > room.maxGuests) {
    res.status(400);
    throw new Error(
      `This room accommodates a maximum of ${room.maxGuests} guests`,
    );
  }

  // Check room availability for the dates
  const availability = await Booking.checkAvailability(
    roomId,
    new Date(checkIn),
    new Date(checkOut),
  );
  if (!availability.isAvailable) {
    res.status(400);
    throw new Error("Room is not available for the selected dates");
  }

  // Calculate total amount
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
  );

  // Use effective price (with discount if applicable)
  const pricePerNight = room.effectivePrice || room.price;
  const totalAmount = nights * pricePerNight;

  // Create booking
  const booking = await Booking.create({
    roomId,
    guestName,
    email,
    phone,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    totalAmount,
    specialRequests,
  });

  // Populate room details for response
  await booking.populate("roomId", "name images");

  // Send admin notification (async, don't wait)
  sendNewBookingNotification(booking, room).catch(console.error);

  res.status(201).json({
    success: true,
    message:
      "Booking created successfully. Please complete payment within 6 hours.",
    data: {
      bookingReference: booking.bookingReference,
      roomName: room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights,
      totalAmount: booking.totalAmount,
      expiresAt: booking.expiresAt,
      paymentStatus: booking.paymentStatus,
    },
  });
});

/**
 * @desc    Confirm booking with verification code
 * @route   POST /api/bookings/confirm
 * @access  Public
 */
export const confirmBooking = asyncHandler(async (req, res) => {
  const { bookingReference, verificationCode } = req.body;

  // Find booking by reference
  const booking = await Booking.findOne({
    bookingReference: bookingReference.toUpperCase(),
  }).populate("roomId");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check if already confirmed
  if (booking.paymentStatus === config.paymentStatus.CONFIRMED) {
    res.status(400);
    throw new Error("This booking has already been confirmed");
  }

  // Check if expired
  if (
    booking.paymentStatus === config.paymentStatus.EXPIRED ||
    new Date() > booking.expiresAt
  ) {
    // Mark as expired if not already
    if (booking.paymentStatus !== config.paymentStatus.EXPIRED) {
      await booking.markAsExpired();
    }
    res.status(400);
    throw new Error(
      "This booking has expired. Please create a new reservation.",
    );
  }

  // Verify the code
  if (booking.verificationCode !== verificationCode.toUpperCase()) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  // Confirm the booking
  await booking.confirmBooking();

  // Send confirmation email
  const emailResult = await sendBookingConfirmationEmail(
    booking,
    booking.roomId,
  );

  res.json({
    success: true,
    message: "Booking confirmed successfully",
    data: {
      bookingReference: booking.bookingReference,
      guestName: booking.guestName,
      roomName: booking.roomId.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      confirmedAt: booking.confirmedAt,
      emailSent: emailResult.success,
    },
  });
});

/**
 * @desc    Get booking by reference
 * @route   GET /api/bookings/:reference
 * @access  Public
 */
export const getBookingByReference = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    bookingReference: req.params.reference.toUpperCase(),
  }).populate("roomId", "name images price amenities");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Update status if expired
  if (
    booking.paymentStatus === config.paymentStatus.AWAITING_PAYMENT &&
    new Date() > booking.expiresAt
  ) {
    await booking.markAsExpired();
  }

  res.json({
    success: true,
    data: booking,
  });
});

/**
 * @desc    Check room availability
 * @route   GET /api/bookings/availability/:roomId
 * @access  Public
 */
export const checkAvailability = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    res.status(400);
    throw new Error("Check-in and check-out dates are required");
  }

  const availability = await Booking.checkAvailability(
    roomId,
    new Date(checkIn),
    new Date(checkOut),
  );

  res.json({
    success: true,
    data: availability,
  });
});

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/admin/bookings
 * @access  Admin
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const {
    status,
    page = 1,
    limit = 10,
    startDate,
    endDate,
    search,
  } = req.query;

  const query = {};

  // Filter by status
  if (status) {
    query.paymentStatus = status;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Search by reference, email, or name
  if (search) {
    query.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { guestName: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("roomId", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Booking.countDocuments(query),
  ]);

  // Update expired bookings
  const now = new Date();
  const expiredBookings = bookings.filter(
    (b) =>
      b.paymentStatus === config.paymentStatus.AWAITING_PAYMENT &&
      now > b.expiresAt,
  );

  for (const booking of expiredBookings) {
    await booking.markAsExpired();
  }

  res.json({
    success: true,
    data: bookings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Update booking status (Admin)
 * @route   PATCH /api/admin/bookings/:id/status
 * @access  Admin
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const booking = await Booking.findById(req.params.id).populate("roomId");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.paymentStatus = status;
  if (adminNotes) {
    booking.adminNotes = adminNotes;
  }

  if (status === config.paymentStatus.CONFIRMED) {
    booking.confirmedAt = new Date();
    booking.verificationCode = undefined; // undefined (not null) for sparse index

    // Send confirmation email
    await sendBookingConfirmationEmail(booking, booking.roomId);
  }

  await booking.save();

  res.json({
    success: true,
    message: "Booking status updated",
    data: booking,
  });
});

/**
 * @desc    Get booking statistics (Admin)
 * @route   GET /api/admin/bookings/stats
 * @access  Admin
 */
export const getBookingStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalBookings,
    confirmedBookings,
    pendingBookings,
    expiredBookings,
    recentBookings,
    revenue,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ paymentStatus: config.paymentStatus.CONFIRMED }),
    Booking.countDocuments({
      paymentStatus: config.paymentStatus.AWAITING_PAYMENT,
    }),
    Booking.countDocuments({ paymentStatus: config.paymentStatus.EXPIRED }),
    Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Booking.aggregate([
      { $match: { paymentStatus: config.paymentStatus.CONFIRMED } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      expiredBookings,
      recentBookings,
      totalRevenue: revenue[0]?.total || 0,
    },
  });
});

/**
 * @desc    Send receipt PDF to guest email
 * @route   POST /api/bookings/send-receipt
 * @access  Public
 */
export const sendReceipt = asyncHandler(async (req, res) => {
  const { bookingReference, pdfData } = req.body;

  // Validate required fields
  if (!bookingReference) {
    res.status(400);
    throw new Error("Booking reference is required");
  }

  if (!pdfData) {
    res.status(400);
    throw new Error("PDF data is required");
  }

  // Find the booking
  const booking = await Booking.findOne({ bookingReference }).populate(
    "roomId",
    "name category price",
  );

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Ensure booking is confirmed
  if (booking.paymentStatus !== config.paymentStatus.CONFIRMED) {
    res.status(400);
    throw new Error("Receipt can only be sent for confirmed bookings");
  }

  // Get room details
  const room = booking.roomId;

  // Send receipt email with PDF attachment
  const result = await sendReceiptEmail(booking, room, pdfData);

  if (!result.success) {
    res.status(500);
    throw new Error("Failed to send receipt email: " + result.error);
  }

  res.json({
    success: true,
    message: "Receipt sent successfully to " + booking.email,
    data: {
      messageId: result.messageId,
      sentTo: booking.email,
    },
  });
});

export default {
  createBooking,
  confirmBooking,
  getBookingByReference,
  checkAvailability,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
  sendReceipt,
};
