import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Booking state management using Zustand
 * Handles the entire booking flow state
 */
export const useBookingStore = create(
  persist(
    (set, get) => ({
      // Selected room
      selectedRoom: null,

      // Date selection
      checkIn: null,
      checkOut: null,

      // Guest information
      guests: {
        adults: 1,
        children: 0,
      },

      // Guest details for booking
      guestDetails: {
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
      },

      // Booking result
      bookingResult: null,

      // Loading and error states
      isLoading: false,
      error: null,

      // Actions
      setSelectedRoom: (room) => set({ selectedRoom: room }),

      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),

      setGuests: (guests) => set({ guests }),

      setGuestDetails: (details) =>
        set((state) => ({
          guestDetails: { ...state.guestDetails, ...details },
        })),

      setBookingResult: (result) => set({ bookingResult: result }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Calculate nights
      getNights: () => {
        const { checkIn, checkOut } = get();
        if (!checkIn || !checkOut) return 0;
        const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },

      // Calculate total
      getTotal: () => {
        const { selectedRoom } = get();
        const nights = get().getNights();
        if (!selectedRoom || nights === 0) return 0;
        const price = selectedRoom.effectivePrice || selectedRoom.price;
        return nights * price;
      },

      // Reset booking state
      resetBooking: () =>
        set({
          selectedRoom: null,
          checkIn: null,
          checkOut: null,
          guests: { adults: 1, children: 0 },
          guestDetails: { name: "", email: "", phone: "", specialRequests: "" },
          bookingResult: null,
          isLoading: false,
          error: null,
        }),

      // Clear dates only
      clearDates: () => set({ checkIn: null, checkOut: null }),
    }),
    {
      name: "amanpulo-booking",
      partialize: (state) => ({
        selectedRoom: state.selectedRoom,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
        // Don't persist guestDetails - clear after each booking
      }),
    },
  ),
);

export default useBookingStore;
