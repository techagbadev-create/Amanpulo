import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "../models/Room.js";

dotenv.config();

/**
 * Clear all rooms from the database
 * Run: node utils/clearRooms.js
 */

const clearRooms = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Count existing rooms
    const roomCount = await Room.countDocuments();
    console.log(`📊 Found ${roomCount} rooms in database`);

    // Delete all rooms
    const result = await Room.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} rooms`);

    console.log("\n✅ All rooms have been cleared from the database!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing rooms:", error);
    process.exit(1);
  }
};

clearRooms();
