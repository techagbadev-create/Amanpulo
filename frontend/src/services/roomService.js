import api from "./api";

/**
 * Room API service
 * Handles all room-related API calls
 */
export const roomService = {
  /**
   * Get all rooms with optional filters
   * @param {Object} params - Filter parameters
   * @returns {Promise} Room list
   */
  getRooms: async (params = {}) => {
    const response = await api.get("/rooms", { params });
    return response.data;
  },

  /**
   * Get single room by ID
   * @param {string} id - Room ID
   * @returns {Promise} Room details
   */
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  /**
   * Check room availability for dates
   * @param {string} roomId - Room ID
   * @param {Date} checkIn - Check-in date
   * @param {Date} checkOut - Check-out date
   * @returns {Promise} Availability status
   */
  checkAvailability: async (roomId, checkIn, checkOut) => {
    const response = await api.get(`/bookings/availability/${roomId}`, {
      params: {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      },
    });
    return response.data;
  },
};

/**
 * Admin room API service
 * Handles admin room management
 */
export const adminRoomService = {
  /**
   * Get all rooms (including inactive)
   * @returns {Promise} Room list
   */
  getRooms: async () => {
    const response = await api.get("/admin/rooms");
    return response.data;
  },

  /**
   * Create new room
   * @param {Object} roomData - Room data
   * @returns {Promise} Created room
   */
  createRoom: async (roomData) => {
    const response = await api.post("/admin/rooms", roomData);
    return response.data;
  },

  /**
   * Update room
   * @param {string} id - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise} Updated room
   */
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/admin/rooms/${id}`, roomData);
    return response.data;
  },

  /**
   * Delete room
   * @param {string} id - Room ID
   * @returns {Promise} Deletion result
   */
  deleteRoom: async (id) => {
    const response = await api.delete(`/admin/rooms/${id}`);
    return response.data;
  },

  /**
   * Toggle seasonal discount
   * @param {string} id - Room ID
   * @param {Object} discountData - Discount settings
   * @returns {Promise} Updated room
   */
  toggleDiscount: async (id, discountData) => {
    const response = await api.patch(
      `/admin/rooms/${id}/discount`,
      discountData,
    );
    return response.data;
  },
};

export default roomService;
