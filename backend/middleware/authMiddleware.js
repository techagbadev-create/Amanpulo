import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { asyncHandler } from "./errorMiddleware.js";

/**
 * Protect routes - Verify JWT token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    res.status(401);
    throw new Error("Not authorized to access this route");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin from token
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      res.status(401);
      throw new Error("Admin not found");
    }

    if (!admin.isActive) {
      res.status(401);
      throw new Error("Account is deactivated");
    }

    // Add admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized to access this route");
  }
});

/**
 * Authorize specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.admin.role}' is not authorized to access this route`,
      );
    }
    next();
  };
};
