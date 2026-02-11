import axios from "axios";

/**
 * Axios instance with base configuration
 * Used for all API calls to the backend
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("amanpulo-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      // Unauthorized - redirect to login or handle token expiry
      if (status === 401) {
        localStorage.removeItem("amanpulo-token");
        // Could dispatch a logout action here
      }

      // Format error message
      const errorMessage = data?.message || "An error occurred";
      error.message = errorMessage;
    } else if (error.request) {
      error.message = "Network error. Please check your connection.";
    }

    return Promise.reject(error);
  },
);

export default api;
