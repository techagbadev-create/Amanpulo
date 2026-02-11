import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth state management using Zustand
 * Handles admin authentication state with JWT tokens
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      user: null,
      token: null,

      // Loading state
      isLoading: false,

      // Actions
      login: (user, token) => {
        // Store token in localStorage for API interceptor
        if (token) {
          localStorage.setItem("amanpulo-token", token);
        }
        set({ isAuthenticated: true, user, token });
      },

      logout: () => {
        localStorage.removeItem("amanpulo-token");
        set({ isAuthenticated: false, user: null, token: null });
      },

      setLoading: (isLoading) => set({ isLoading }),

      // Check if user is admin/owner
      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin" || user?.role === "owner";
      },
    }),
    {
      name: "amanpulo-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

export default useAuthStore;
