import Room from "../models/Room.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

/**
 * Room Controller
 * Handles all room-related operations
 */

/**
 * @desc    Get all rooms
 * @route   GET /api/rooms
 * @access  Public
 */
export const getRooms = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, guests, search } = req.query;

  // Build query object
  const query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (guests) {
    query.maxGuests = { $gte: parseInt(guests) };
  }

  if (search) {
    query.$text = { $search: search };
  }

  const rooms = await Room.find(query).sort({ price: 1 });

  res.json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/**
 * @desc    Get single room by ID
 * @route   GET /api/rooms/:id
 * @access  Public
 */
export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.json({
    success: true,
    data: room,
  });
});

/**
 * @desc    Create new room
 * @route   POST /api/rooms
 * @access  Admin
 */
export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

/**
 * @desc    Update room
 * @route   PUT /api/rooms/:id
 * @access  Admin
 */
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

/**
 * @desc    Delete room (soft delete by setting isActive to false)
 * @route   DELETE /api/rooms/:id
 * @access  Admin
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.json({
    success: true,
    message: "Room deleted successfully",
  });
});

/**
 * @desc    Toggle seasonal discount
 * @route   PATCH /api/rooms/:id/discount
 * @access  Admin
 */
export const toggleDiscount = asyncHandler(async (req, res) => {
  const { isActive, percentage, startDate, endDate } = req.body;

  const room = await Room.findByIdAndUpdate(
    req.params.id,
    {
      "seasonalDiscount.isActive": isActive,
      "seasonalDiscount.percentage": percentage,
      "seasonalDiscount.startDate": startDate,
      "seasonalDiscount.endDate": endDate,
    },
    { new: true, runValidators: true },
  );

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.json({
    success: true,
    message: "Seasonal discount updated",
    data: room,
  });
});

export default {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  toggleDiscount,
};
