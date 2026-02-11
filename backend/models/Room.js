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
    price: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price cannot be negative"],
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
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one image is required",
      },
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
 * Virtual: Calculate effective price considering seasonal discount
 */
roomSchema.virtual("effectivePrice").get(function () {
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
        this.price * (this.seasonalDiscount.percentage / 100);
      return Math.round(this.price - discountAmount);
    }
  }
  return this.price;
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
roomSchema.index({ price: 1 });
roomSchema.index({ isActive: 1 });
roomSchema.index({ category: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
