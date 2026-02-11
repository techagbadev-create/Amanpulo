import api from "./api";

/**
 * Booking API service
 * Handles all booking-related API calls
 */
export const bookingService = {
  /**
   * Create new booking
   * @param {Object} bookingData - Booking details
   * @returns {Promise} Booking result
   */
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  /**
   * Confirm booking with verification code
   * @param {string} bookingReference - Booking reference
   * @param {string} verificationCode - Verification code from admin
   * @returns {Promise} Confirmation result
   */
  confirmBooking: async (bookingReference, verificationCode) => {
    const response = await api.post("/bookings/confirm", {
      bookingReference,
      verificationCode,
    });
    return response.data;
  },

  /**
   * Get booking by reference
   * @param {string} reference - Booking reference
   * @returns {Promise} Booking details
   */
  getBookingByReference: async (reference) => {
    const response = await api.get(`/bookings/${reference}`);
    return response.data;
  },

  /**
   * Check room availability
   * @param {string} roomId - Room ID
   * @param {string} checkIn - Check-in date ISO string
   * @param {string} checkOut - Check-out date ISO string
   * @returns {Promise} Availability data
   */
  checkAvailability: async (roomId, checkIn, checkOut) => {
    const response = await api.get(`/bookings/availability/${roomId}`, {
      params: { checkIn, checkOut },
    });
    return response.data;
  },

  /**
   * Send receipt PDF to guest email
   * @param {string} bookingReference - Booking reference
   * @param {string} pdfData - PDF as base64 string
   * @returns {Promise} Send result
   */
  sendReceipt: async (bookingReference, pdfData) => {
    const response = await api.post("/bookings/send-receipt", {
      bookingReference,
      pdfData,
    });
    return response.data;
  },
};

/**
 * Admin booking API service
 * Handles admin booking management
 */
export const adminBookingService = {
  /**
   * Get all bookings with filters
   * @param {Object} params - Filter and pagination params
   * @returns {Promise} Bookings list with pagination
   */
  getBookings: async (params = {}) => {
    const response = await api.get("/admin/bookings", { params });
    return response.data;
  },

  /**
   * Get booking statistics
   * @returns {Promise} Booking stats
   */
  getStats: async () => {
    const response = await api.get("/admin/bookings/stats");
    return response.data;
  },

  /**
   * Update booking status
   * @param {string} id - Booking ID
   * @param {Object} data - Status update data
   * @returns {Promise} Updated booking
   */
  updateStatus: async (id, data) => {
    const response = await api.patch(`/admin/bookings/${id}/status`, data);
    return response.data;
  },

  /**
   * Get dashboard stats
   * @returns {Promise} Dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },
};

export default bookingService;
