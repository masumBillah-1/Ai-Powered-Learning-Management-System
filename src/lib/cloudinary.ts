import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export default cloudinary;