import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
};

/**
 * @desc    Login admin/owner
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find admin by email and include password
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if account is active
  if (!admin.isActive) {
    res.status(401);
    throw new Error("Account is deactivated. Please contact support.");
  }

  // Check password
  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Update last login
  await admin.updateLastLogin();

  // Generate token
  const token = generateToken(admin._id);

  res.json({
    success: true,
    data: {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      token,
    },
  });
});

/**
 * @desc    Get current logged in admin
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  res.json({
    success: true,
    data: {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: admin.lastLogin,
    },
  });
});

/**
 * @desc    Update admin password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide current and new password");
  }

  const admin = await Admin.findById(req.admin.id).select("+password");

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  // Check current password
  const isMatch = await admin.comparePassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // Update password
  admin.password = newPassword;
  await admin.save();

  // Generate new token
  const token = generateToken(admin._id);

  res.json({
    success: true,
    message: "Password updated successfully",
    token,
  });
});

/**
 * @desc    Logout (client-side - just for logging)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // This endpoint can be used for logging purposes
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
