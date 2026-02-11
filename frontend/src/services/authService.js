import api from "./api";

/**
 * Auth Service
 * Handles authentication API calls
 */
export const authService = {
  /**
   * Login with email and password
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise} - Auth response with token and user data
   */
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * Get current logged in admin
   * @returns {Promise} - Admin data
   */
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Update admin password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - Response with new token
   */
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/auth/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Logout (client-side cleanup)
   */
  logout: () => {
    localStorage.removeItem("amanpulo-token");
  },
};

export default authService;
