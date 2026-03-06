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
 * @route   POST /api/admin/rooms
 * @access  Admin
 */
export const createRoom = asyncHandler(async (req, res) => {
  const roomData = { ...req.body };

  // Handle images from upload middleware
  if (req.processedImageUrls && req.processedImageUrls.length > 0) {
    roomData.images = req.processedImageUrls;
    roomData.featuredImage = req.processedImageUrls[0];
  }

  // Parse numeric fields from FormData (they come as strings)
  if (roomData.basePrice) roomData.basePrice = parseFloat(roomData.basePrice);
  if (roomData.price) roomData.price = parseFloat(roomData.price);
  if (roomData.totalRooms)
    roomData.totalRooms = parseInt(roomData.totalRooms, 10);
  if (roomData.maxGuests) roomData.maxGuests = parseInt(roomData.maxGuests, 10);
  if (roomData.includedGuests)
    roomData.includedGuests = parseInt(roomData.includedGuests, 10);
  if (roomData.extraGuestPrice)
    roomData.extraGuestPrice = parseFloat(roomData.extraGuestPrice);

  // Parse JSON fields if they come as strings (from FormData)
  if (typeof roomData.amenities === "string") {
    try {
      roomData.amenities = JSON.parse(roomData.amenities);
    } catch {
      roomData.amenities = roomData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }
  }

  // Handle basePrice / price conversion
  if (roomData.basePrice && !roomData.price) {
    roomData.price = roomData.basePrice;
  } else if (roomData.price && !roomData.basePrice) {
    roomData.basePrice = roomData.price;
  }

  // Ensure images is an array
  if (!roomData.images) {
    roomData.images = [];
  }

  const room = await Room.create(roomData);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

/**
 * @desc    Update room
 * @route   PUT /api/admin/rooms/:id
 * @access  Admin
 */
export const updateRoom = asyncHandler(async (req, res) => {
  const roomData = { ...req.body };

  // Handle images from upload middleware
  if (req.processedImageUrls && req.processedImageUrls.length > 0) {
    // Get existing room to potentially merge images
    const existingRoom = await Room.findById(req.params.id);

    if (roomData.appendImages === "true" && existingRoom) {
      // Append new images to existing ones
      roomData.images = [
        ...(existingRoom.images || []),
        ...req.processedImageUrls,
      ];
    } else {
      // Replace all images
      roomData.images = req.processedImageUrls;
    }

    // Update featured image if specified or use first image
    if (!roomData.featuredImage && roomData.images.length > 0) {
      roomData.featuredImage = roomData.images[0];
    }
  }

  // Parse numeric fields from FormData (they come as strings)
  if (roomData.basePrice) roomData.basePrice = parseFloat(roomData.basePrice);
  if (roomData.price) roomData.price = parseFloat(roomData.price);
  if (roomData.totalRooms)
    roomData.totalRooms = parseInt(roomData.totalRooms, 10);
  if (roomData.maxGuests) roomData.maxGuests = parseInt(roomData.maxGuests, 10);
  if (roomData.includedGuests)
    roomData.includedGuests = parseInt(roomData.includedGuests, 10);
  if (roomData.extraGuestPrice)
    roomData.extraGuestPrice = parseFloat(roomData.extraGuestPrice);

  // Parse JSON fields if they come as strings (from FormData)
  if (typeof roomData.amenities === "string") {
    try {
      roomData.amenities = JSON.parse(roomData.amenities);
    } catch {
      roomData.amenities = roomData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }
  }

  // Handle basePrice / price conversion
  if (roomData.basePrice && !roomData.price) {
    roomData.price = roomData.basePrice;
  } else if (roomData.price && !roomData.basePrice) {
    roomData.basePrice = roomData.price;
  }

  // Clean up appendImages flag
  delete roomData.appendImages;

  const room = await Room.findByIdAndUpdate(req.params.id, roomData, {
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
