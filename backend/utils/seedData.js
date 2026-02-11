import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

dotenv.config();

/**
 * Seed Database with sample luxury resort data
 * Run: node utils/seedData.js
 */

const sampleRooms = [
  {
    name: "Hillside Casita",
    description:
      "Perched on a gentle hill with panoramic views of the Sulu Sea, our Hillside Casitas offer an elevated perspective of the island paradise. Floor-to-ceiling windows maximize the breathtaking vistas, while a private sun deck provides the perfect setting for sunrise meditation or sunset cocktails. The interior blends traditional Filipino design elements with contemporary luxury.",
    price: 1200,
    totalRooms: 8,
    maxGuests: 2,
    category: "casita",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    ],
    amenities: [
      "King-size bed",
      "Private sun deck",
      "Outdoor shower",
      "Mini bar",
      "Complimentary WiFi",
      "Daily housekeeping",
      "Bathrobes and slippers",
      "Coffee machine",
    ],
    seasonalDiscount: {
      isActive: true,
      percentage: 15,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-05-31"),
    },
  },
  {
    name: "Beach Casita",
    description:
      "Step directly onto powdery white sand from your private terrace. Our Beach Casitas offer uninterrupted access to the crystal-clear waters of the Sulu Sea. Wake to gentle waves and fall asleep to the soothing rhythm of the tide. Each casita features traditional Filipino craftsmanship with modern amenities for the ultimate beachfront escape.",
    price: 1500,
    totalRooms: 12,
    maxGuests: 3,
    category: "casita",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    amenities: [
      "Direct beach access",
      "King-size bed",
      "Private terrace",
      "Outdoor bathtub",
      "Snorkeling equipment",
      "Beach amenities",
      "Mini bar",
      "Complimentary WiFi",
      "24-hour room service",
    ],
  },
  {
    name: "Deluxe Pool Villa",
    description:
      "Our signature Pool Villas redefine private luxury. Each villa features a generous private infinity pool overlooking the sea, an expansive sun deck, and a dedicated outdoor dining pavilion. The interior showcases bespoke furniture, a spa-inspired bathroom, and living spaces designed for both relaxation and entertainment.",
    price: 2800,
    totalRooms: 6,
    maxGuests: 4,
    category: "villa",
    images: [
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
    ],
    amenities: [
      "Private infinity pool",
      "King-size bed",
      "Living room",
      "Outdoor dining pavilion",
      "Butler service",
      "Spa bathroom with rain shower",
      "Premium mini bar",
      "Complimentary WiFi",
      "Direct beach access",
      "In-villa dining",
    ],
    seasonalDiscount: {
      isActive: true,
      percentage: 10,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-04-30"),
    },
  },
  {
    name: "Two-Bedroom Pool Villa",
    description:
      "Perfect for families or groups traveling together, our Two-Bedroom Pool Villas offer generous space without compromising on luxury. Features include two master suites, a shared living area, a private pool, and dedicated staff quarters. Each suite offers its own bathroom and private balcony.",
    price: 4200,
    totalRooms: 4,
    maxGuests: 6,
    category: "villa",
    images: [
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    ],
    amenities: [
      "Two master bedrooms",
      "Private pool",
      "Living and dining area",
      "Full kitchen",
      "Butler service",
      "Private garden",
      "Outdoor shower",
      "Premium mini bar",
      "Direct beach access",
      "Private chef available",
    ],
  },
  {
    name: "Treetop Pavilion",
    description:
      "Suspended among the canopy, our Treetop Pavilions offer a unique perspective of island life. Glass walls provide 360-degree views of the lush tropical forest and distant sea. A private elevator grants access to your elevated sanctuary. Experience nature while surrounded by supreme comfort.",
    price: 1800,
    totalRooms: 4,
    maxGuests: 2,
    category: "pavilion",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    ],
    amenities: [
      "Private elevator",
      "360-degree views",
      "King-size bed",
      "Glass-walled bathroom",
      "Private deck",
      "Telescope",
      "Mini bar",
      "Complimentary WiFi",
      "Yoga mat and meditation corner",
    ],
  },
  {
    name: "Royal Suite",
    description:
      "The crown jewel of Amanpulo, our Royal Suite is an exclusive sanctuary spanning 800 square meters. Features include a private beach, infinity pool, spa treatment room, gourmet kitchen, and dedicated staff. Perfect for those seeking the ultimate in privacy, space, and personalized service.",
    price: 8500,
    totalRooms: 2,
    maxGuests: 8,
    category: "suite",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ],
    amenities: [
      "Private beach",
      "Infinity pool",
      "Four bedrooms",
      "Private spa room",
      "Gourmet kitchen",
      "Dedicated staff",
      "Private chef",
      "Helipad access",
      "Private boat",
      "Wine cellar",
      "Home theater",
      "Gym",
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Room.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Insert rooms
    const rooms = await Room.insertMany(sampleRooms);
    console.log(`✅ Inserted ${rooms.length} rooms`);

    // Create a sample confirmed booking
    const sampleBooking = {
      roomId: rooms[0]._id,
      guestName: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 555-123-4567",
      checkIn: new Date("2026-03-15"),
      checkOut: new Date("2026-03-20"),
      guests: { adults: 2, children: 0 },
      totalAmount: 5100,
      paymentStatus: "confirmed",
      confirmedAt: new Date(),
    };

    await Booking.create(sampleBooking);
    console.log("✅ Created sample booking");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nSample Rooms:");
    rooms.forEach((room) => {
      console.log(
        `  - ${room.name}: ₱${room.price}/night (${room.totalRooms} available)`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
