import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS classes
 * Used by shadcn/ui components
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: PHP for Philippine Peso)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format short date
 * @param {Date|string} date - Date to format
 * @returns {string} Short formatted date
 */
export function formatShortDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Calculate number of nights between dates
 * @param {Date|string} checkIn - Check-in date
 * @param {Date|string} checkOut - Check-out date
 * @returns {number} Number of nights
 */
export function calculateNights(checkIn, checkOut) {
  const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
