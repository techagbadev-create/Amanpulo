/**
 * Error handling middleware for Express
 */

/**
 * Not Found middleware - handles 404 errors
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error handler middleware - handles all errors
 */
export const errorHandler = (err, req, res, next) => {
  // Default to 500 if status code is 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

/**
 * Async handler wrapper - eliminates try-catch blocks in controllers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default { notFound, errorHandler, asyncHandler };
