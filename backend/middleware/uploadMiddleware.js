import multer from "multer";
import { uploadToCloudinary } from "../config/cloudinary.js";

/**
 * Multer configuration for memory storage
 * Files are stored in memory as Buffer objects
 */
const storage = multer.memoryStorage();

/**
 * File filter to only allow images
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
      ),
      false,
    );
  }
};

/**
 * Multer upload configuration
 * - Max 10 images per upload
 * - Max 5MB per file
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
});

/**
 * Middleware to upload multiple images to Cloudinary
 * Processes uploaded files and converts them to URLs
 */
export const uploadImagesToCloudinary = async (req, res, next) => {
  try {
    const imageUrls = [];

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, {
          folder: "amanpulo/rooms",
        });
        return result.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      imageUrls.push(...uploadedUrls);
    }

    // Handle image URLs from body (pasted URLs)
    if (req.body.imageUrls) {
      let urls = req.body.imageUrls;

      // Parse if it's a JSON string
      if (typeof urls === "string") {
        try {
          urls = JSON.parse(urls);
        } catch {
          // If not JSON, split by comma
          urls = urls
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean);
        }
      }

      // Validate URLs
      const validUrls = urls.filter((url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      });

      imageUrls.push(...validUrls);
    }

    // Store processed image URLs in request
    req.processedImageUrls = imageUrls;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to handle single image upload
 */
export const uploadSingleImage = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "amanpulo/rooms",
      });
      req.uploadedImageUrl = result.secure_url;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default upload;
