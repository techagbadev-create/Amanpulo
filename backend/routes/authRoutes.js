import express from "express";
import {
  login,
  getMe,
  updatePassword,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Auth Routes
 * Authentication endpoints for admin/owner
 */

// Public routes
router.post("/login", login);

// Protected routes (require authentication)
router.get("/me", protect, getMe);
router.put("/password", protect, updatePassword);
router.post("/logout", protect, logout);

export default router;
