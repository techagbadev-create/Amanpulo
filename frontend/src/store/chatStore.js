import { create } from "zustand";

/**
 * Chat state management using Zustand
 * Tracks Smartsupp chat state across the application
 */
export const useChatStore = create((set) => ({
  // Whether the chat script has loaded
  isLoaded: false,

  // Whether the chat window is currently open
  isOpen: false,

  // Whether chat has been auto-opened (to prevent multiple auto-opens)
  hasAutoOpened: false,

  // Actions
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setOpen: (open) => set({ isOpen: open }),
  setAutoOpened: (opened) => set({ hasAutoOpened: opened }),

  // Reset auto-opened state (useful when navigating away from checkout)
  resetAutoOpened: () => set({ hasAutoOpened: false }),
}));

export default useChatStore;
