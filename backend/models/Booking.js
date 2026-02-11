import mongoose from "mongoose";
import crypto from "crypto";
import { config } from "../config/constants.js";

/**
 * Booking Schema for Amanpulo Reservation System
 * Represents a guest reservation
 */
const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      index: true,
      // Auto-generated in pre-save hook
    },
    verificationCode: {
      type: String,
      unique: true,
      sparse: true, // Allows null values after confirmation
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room selection is required"],
    },
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
      maxlength: [100, "Guest name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        min: [1, "At least 1 adult is required"],
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: Object.values(config.paymentStatus),
      default: config.paymentStatus.AWAITING_PAYMENT,
    },
    expiresAt: {
      type: Date,
      // Auto-generated in pre-save hook
    },
    confirmedAt: {
      type: Date,
    },
    specialRequests: {
      type: String,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Virtual: Calculate number of nights
 */
bookingSchema.virtual("numberOfNights").get(function () {
  if (this.checkIn && this.checkOut) {
    const diffTime = Math.abs(this.checkOut - this.checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

/**
 * Virtual: Check if booking is expired
 */
bookingSchema.virtual("isExpired").get(function () {
  return (
    this.paymentStatus === config.paymentStatus.AWAITING_PAYMENT &&
    new Date() > this.expiresAt
  );
});

/**
 * Virtual: Total guests count
 */
bookingSchema.virtual("totalGuests").get(function () {
  return (this.guests?.adults || 0) + (this.guests?.children || 0);
});

/**
 * Pre-save middleware: Generate booking reference and verification code
 */
bookingSchema.pre("save", async function (next) {
  // Generate booking reference if new document
  if (this.isNew && !this.bookingReference) {
    this.bookingReference = await generateBookingReference();
  }

  // Generate verification code if new document
  if (this.isNew && !this.verificationCode) {
    this.verificationCode = generateVerificationCode();
  }

  // Set expiration time if new document
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(
      Date.now() + config.booking.expirationHours * 60 * 60 * 1000,
    );
  }

  next();
});

/**
 * Pre-save validation: Check-out date must be after check-in date
 */
bookingSchema.pre("save", function (next) {
  if (this.checkOut <= this.checkIn) {
    next(new Error("Check-out date must be after check-in date"));
  }
  next();
});

/**
 * Generate unique booking reference
 * Format: AMAN-YYYY-NNNNN (e.g., AMAN-2026-00045)
 */
async function generateBookingReference() {
  const year = new Date().getFullYear();
  const prefix = `${config.booking.referencePrefix}-${year}`;

  // Find the last booking of the current year
  const lastBooking = await mongoose
    .model("Booking")
    .findOne({ bookingReference: new RegExp(`^${prefix}`) })
    .sort({ bookingReference: -1 });

  let sequenceNumber = 1;

  if (lastBooking) {
    const lastSequence = parseInt(lastBooking.bookingReference.split("-")[2]);
    sequenceNumber = lastSequence + 1;
  }

  return `${prefix}-${String(sequenceNumber).padStart(5, "0")}`;
}

/**
 * Generate unique verification code
 * Uses crypto for secure random generation
 */
function generateVerificationCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

/**
 * Instance method: Confirm booking
 */
bookingSchema.methods.confirmBooking = function () {
  this.paymentStatus = config.paymentStatus.CONFIRMED;
  this.verificationCode = undefined; // Remove code after confirmation (undefined, not null, for sparse index)
  this.confirmedAt = new Date();
  return this.save();
};

/**
 * Instance method: Mark as expired
 */
bookingSchema.methods.markAsExpired = function () {
  this.paymentStatus = config.paymentStatus.EXPIRED;
  this.verificationCode = undefined;
  return this.save();
};

/**
 * Static method: Find expired bookings
 */
bookingSchema.statics.findExpired = function () {
  return this.find({
    paymentStatus: config.paymentStatus.AWAITING_PAYMENT,
    expiresAt: { $lt: new Date() },
  });
};

/**
 * Static method: Check room availability for date range
 */
bookingSchema.statics.checkAvailability = async function (
  roomId,
  checkIn,
  checkOut,
  excludeBookingId = null,
) {
  const query = {
    roomId,
    paymentStatus: {
      $in: [
        config.paymentStatus.AWAITING_PAYMENT,
        config.paymentStatus.CONFIRMED,
      ],
    },
    $or: [
      { checkIn: { $lt: checkOut, $gte: checkIn } },
      { checkOut: { $gt: checkIn, $lte: checkOut } },
      { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await this.countDocuments(query);
  const Room = mongoose.model("Room");
  const room = await Room.findById(roomId);

  return {
    isAvailable: conflictingBookings < (room?.totalRooms || 0),
    bookedCount: conflictingBookings,
    totalRooms: room?.totalRooms || 0,
  };
};

// Indexes for efficient querying
bookingSchema.index({ email: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ expiresAt: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
