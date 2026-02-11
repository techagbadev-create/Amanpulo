/**
 * Application configuration constants
 */
export const config = {
  // Booking configuration
  booking: {
    // Hours until booking expires if not confirmed
    expirationHours: 6,
    // Booking reference prefix
    referencePrefix: "AMAN",
    // Verification code length
    verificationCodeLength: 8,
  },

  // Payment status options
  paymentStatus: {
    AWAITING_PAYMENT: "awaiting_payment",
    CONFIRMED: "confirmed",
    EXPIRED: "expired",
    CANCELLED: "cancelled",
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 50,
  },
};

export default config;
