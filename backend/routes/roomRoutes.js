import express from "express";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  toggleDiscount,
} from "../controllers/roomController.js";
import { roomValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * Room Routes
 * Public routes for viewing rooms
 * Admin routes for managing rooms
 */

// Public routes
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Admin routes (should be protected with auth middleware in production)
router.post("/", roomValidation.create, createRoom);
router.put("/:id", roomValidation.update, updateRoom);
router.delete("/:id", deleteRoom);
router.patch("/:id/discount", toggleDiscount);

export default router;
