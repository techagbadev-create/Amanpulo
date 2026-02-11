import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "owner@example.com" });

    if (existingAdmin) {
      console.log("⚠️  Admin already exists. Updating password...");
      existingAdmin.password = "Passw0rd!";
      await existingAdmin.save();
      console.log("✅ Admin password updated successfully!");
    } else {
      // Create admin user
      const admin = await Admin.create({
        email: "owner@example.com",
        password: "Passw0rd!",
        name: "Amanpulo Owner",
        role: "owner",
        isActive: true,
      });

      console.log("✅ Admin created successfully!");
      console.log("📧 Email:", admin.email);
      console.log("👤 Name:", admin.name);
      console.log("🔐 Role:", admin.role);
    }

    console.log("\n🔑 Login Credentials:");
    console.log("   Email: owner@example.com");
    console.log("   Password: Passw0rd!");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\n✅ Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
