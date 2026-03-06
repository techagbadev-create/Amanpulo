import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Room from "../models/Room.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Room data to seed
 */
const roomsData = [
  {
    name: "Superior Room",
    category: "suite",
    basePrice: 4150,
    currency: "PHP",
    includedGuests: 4,
    maxGuests: 4,
    extraGuestPrice: 1200,
    totalRooms: 10,
    description:
      "Comfortable resort room suitable for small groups and families.",
    amenities: [
      "Air Conditioning",
      "Free WiFi",
      "TV",
      "Mini Fridge",
      "Private Bathroom",
      "Daily Housekeeping",
    ],
  },
  {
    name: "Deluxe Swim-up Room",
    category: "suite",
    basePrice: 5150,
    currency: "PHP",
    includedGuests: 4,
    maxGuests: 4,
    extraGuestPrice: 1200,
    totalRooms: 8,
    description: "Premium swim-up room with direct access to the resort pool.",
    amenities: [
      "Pool Access",
      "Air Conditioning",
      "Free WiFi",
      "TV",
      "Mini Bar",
      "Private Bathroom",
      "Balcony",
    ],
  },
  {
    name: "Ocean View Room",
    category: "suite",
    basePrice: 4850,
    currency: "PHP",
    includedGuests: 2,
    maxGuests: 3,
    extraGuestPrice: 1200,
    totalRooms: 12,
    description:
      "Elegant ocean-facing room featuring a private balcony and relaxing coastal views, ideal for couples or small groups.",
    amenities: [
      "Ocean View",
      "Private Balcony",
      "Air Conditioning",
      "Free WiFi",
      "TV",
      "Mini Bar",
      "Coffee Maker",
    ],
  },
  {
    name: "Premier Family Room",
    category: "villa",
    basePrice: 6950,
    currency: "PHP",
    includedGuests: 6,
    maxGuests: 8,
    extraGuestPrice: 1200,
    totalRooms: 6,
    description: "Large family room ideal for medium-sized groups.",
    amenities: [
      "Multiple Beds",
      "Living Area",
      "Air Conditioning",
      "Free WiFi",
      "TV",
      "Mini Kitchen",
      "Private Bathroom",
    ],
  },
  {
    name: "Standard Poolside Room",
    category: "villa",
    basePrice: 8150,
    currency: "PHP",
    includedGuests: 10,
    maxGuests: 10,
    extraGuestPrice: 1200,
    totalRooms: 5,
    description: "Spacious poolside room perfect for group stays.",
    amenities: [
      "Poolside Location",
      "Large Space",
      "Air Conditioning",
      "Free WiFi",
      "TV",
      "Mini Kitchen",
      "Multiple Bathrooms",
    ],
  },
  {
    name: "Honeymoon Suite",
    category: "pavilion",
    basePrice: 12500,
    currency: "PHP",
    includedGuests: 2,
    maxGuests: 2,
    extraGuestPrice: 1200,
    totalRooms: 4,
    description:
      "Romantic luxury suite designed for couples, featuring a king bed, private lounge area, and premium resort amenities.",
    amenities: [
      "King Bed",
      "Private Lounge",
      "Jacuzzi",
      "Ocean View",
      "Champagne Service",
      "Private Balcony",
      "Premium Toiletries",
    ],
  },
  {
    name: "Luxury Pool Villa 3BR",
    category: "villa",
    basePrice: 17750,
    currency: "PHP",
    includedGuests: 12,
    maxGuests: 15,
    extraGuestPrice: 1200,
    totalRooms: 3,
    description:
      "Three-bedroom luxury villa with private pool and premium resort amenities.",
    amenities: [
      "Private Pool",
      "3 Bedrooms",
      "Full Kitchen",
      "Living Room",
      "Dining Area",
      "BBQ Area",
      "Garden",
      "Butler Service",
    ],
  },
  {
    name: "Presidential Suite",
    category: "pavilion",
    basePrice: 25000,
    currency: "PHP",
    includedGuests: 20,
    maxGuests: 35,
    extraGuestPrice: 1200,
    totalRooms: 2,
    description:
      "Ultra-premium presidential suite designed for very large groups and events.",
    amenities: [
      "Multiple Bedrooms",
      "Conference Room",
      "Private Pool",
      "Full Kitchen",
      "Personal Chef Available",
      "Butler Service",
      "Helipad Access",
      "Private Beach Access",
    ],
  },
];

/**
 * Get images for a room from the images folder
 */
const getImagesForRoom = (roomName, imagesDir) => {
  const files = fs.readdirSync(imagesDir);
  const roomImages = files.filter((file) => {
    const baseName = file.replace(/\s+\d+\.(jpeg|jpg|png|gif|webp)$/i, "");
    return baseName.toLowerCase() === roomName.toLowerCase();
  });
  return roomImages.sort(); // Sort to ensure consistent order (1, 2, 3...)
};

/**
 * Upload image to Cloudinary
 */
const uploadImage = async (imagePath, roomName) => {
  try {
    const fileBuffer = fs.readFileSync(imagePath);
    const result = await uploadToCloudinary(fileBuffer, {
      folder: "amanpulo/rooms",
      public_id: `${roomName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
    console.log(`  ✅ Uploaded: ${path.basename(imagePath)}`);
    return result.secure_url;
  } catch (error) {
    console.error(
      `  ❌ Failed to upload ${path.basename(imagePath)}:`,
      error.message,
    );
    return null;
  }
};

/**
 * Seed rooms with images
 */
const seedRoomsWithImages = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Path to images folder
    const imagesDir = path.resolve(
      __dirname,
      "../../frontend/src/assets/images",
    );

    if (!fs.existsSync(imagesDir)) {
      console.error("❌ Images directory not found:", imagesDir);
      process.exit(1);
    }

    console.log("📁 Images directory:", imagesDir);
    console.log("📸 Found images:", fs.readdirSync(imagesDir).length, "\n");

    // Clear existing rooms
    console.log("🗑️  Clearing existing rooms...");
    await Room.deleteMany({});
    console.log("✅ Cleared existing rooms\n");

    // Process each room
    for (const roomData of roomsData) {
      console.log(`\n📦 Processing: ${roomData.name}`);

      // Get images for this room
      const imageFiles = getImagesForRoom(roomData.name, imagesDir);
      console.log(`  Found ${imageFiles.length} images`);

      // Upload images to Cloudinary
      const imageUrls = [];
      for (const imageFile of imageFiles) {
        const imagePath = path.join(imagesDir, imageFile);
        const url = await uploadImage(imagePath, roomData.name);
        if (url) {
          imageUrls.push(url);
        }
      }

      // Create room with uploaded images
      const room = await Room.create({
        ...roomData,
        price: roomData.basePrice, // For backward compatibility
        images: imageUrls,
        featuredImage: imageUrls[0] || null,
        isActive: true,
      });

      console.log(
        `  ✅ Created room: ${room.name} with ${imageUrls.length} images`,
      );
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    const rooms = await Room.find();
    rooms.forEach((room) => {
      console.log(
        `  - ${room.name}: ₱${room.basePrice}/night (${room.images.length} images)`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedRoomsWithImages();
