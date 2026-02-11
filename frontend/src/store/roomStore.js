import { create } from "zustand";

/**
 * Room state management using Zustand
 * Handles room listing and filtering
 */
export const useRoomStore = create((set, get) => ({
  // Rooms data
  rooms: [],
  selectedRoom: null,

  // Filters
  filters: {
    category: "all",
    minPrice: "",
    maxPrice: "",
    guests: "all",
  },

  // Loading and error states
  isLoading: false,
  error: null,

  // Actions
  setRooms: (rooms) => set({ rooms }),

  setSelectedRoom: (room) => set({ selectedRoom: room }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () =>
    set({
      filters: { category: "all", minPrice: "", maxPrice: "", guests: "all" },
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Get filtered rooms
  getFilteredRooms: () => {
    const { rooms, filters } = get();
    return rooms.filter((room) => {
      if (
        filters.category &&
        filters.category !== "all" &&
        room.category !== filters.category
      )
        return false;
      if (filters.minPrice && room.price < parseFloat(filters.minPrice))
        return false;
      if (filters.maxPrice && room.price > parseFloat(filters.maxPrice))
        return false;
      if (
        filters.guests &&
        filters.guests !== "all" &&
        room.maxGuests < parseInt(filters.guests)
      )
        return false;
      return true;
    });
  },

  // Get room by ID
  getRoomById: (id) => {
    const { rooms } = get();
    return rooms.find((room) => room._id === id);
  },
}));

export default useRoomStore;
