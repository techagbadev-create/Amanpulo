import mongoose from "mongoose";

/**
 * Room Schema for Amanpulo Reservation System
 * Represents a luxury resort room/villa
 */
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      maxlength: [100, "Room name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Room description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    // Base price per night
    basePrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    // Legacy field - maps to basePrice for backward compatibility
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    // Currency for pricing
    currency: {
      type: String,
      default: "PHP",
      enum: ["PHP", "USD"],
    },
    // Number of guests included in base price
    includedGuests: {
      type: Number,
      default: 2,
      min: [1, "Must include at least 1 guest"],
    },
    // Extra charge per additional guest
    extraGuestPrice: {
      type: Number,
      default: 0,
      min: [0, "Extra guest price cannot be negative"],
    },
    seasonalDiscount: {
      isActive: {
        type: Boolean,
        default: false,
      },
      percentage: {
        type: Number,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
        default: 0,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    // Featured image for room cards (first image in gallery)
    featuredImage: {
      type: String,
    },
    // Array of image URLs (supports unlimited images)
    images: {
      type: [String],
      default: [],
    },
    totalRooms: {
      type: Number,
      required: [true, "Total rooms count is required"],
      min: [1, "Must have at least 1 room"],
    },
    maxGuests: {
      type: Number,
      required: [true, "Maximum guests is required"],
      min: [1, "Must accommodate at least 1 guest"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ["villa", "casita", "pavilion", "suite"],
      default: "villa",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Pre-save middleware to manage featuredImage and backward compatibility
 */
roomSchema.pre("save", function (next) {
  // Set featuredImage to first image if not set
  if (this.images && this.images.length > 0 && !this.featuredImage) {
    this.featuredImage = this.images[0];
  }

  // Backward compatibility: sync price with basePrice
  if (this.basePrice && !this.price) {
    this.price = this.basePrice;
  }
  if (this.price && !this.basePrice) {
    this.basePrice = this.price;
  }

  next();
});

/**
 * Virtual: Calculate effective price considering seasonal discount
 */
roomSchema.virtual("effectivePrice").get(function () {
  const priceValue = this.basePrice || this.price;

  if (
    this.seasonalDiscount?.isActive &&
    this.seasonalDiscount?.percentage > 0
  ) {
    const now = new Date();
    const startDate = this.seasonalDiscount.startDate;
    const endDate = this.seasonalDiscount.endDate;

    // Check if current date is within discount period
    if (startDate && endDate && now >= startDate && now <= endDate) {
      const discountAmount =
        priceValue * (this.seasonalDiscount.percentage / 100);
      return Math.round(priceValue - discountAmount);
    }
  }
  return priceValue;
});

/**
 * Virtual: Check if discount is currently active
 */
roomSchema.virtual("hasActiveDiscount").get(function () {
  if (!this.seasonalDiscount?.isActive || !this.seasonalDiscount?.percentage) {
    return false;
  }

  const now = new Date();
  const startDate = this.seasonalDiscount.startDate;
  const endDate = this.seasonalDiscount.endDate;

  return startDate && endDate && now >= startDate && now <= endDate;
});

// Indexes for efficient querying
roomSchema.index({ name: "text", description: "text" });
roomSchema.index({ basePrice: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ isActive: 1 });
roomSchema.index({ category: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
