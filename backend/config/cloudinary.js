import { v2 as cloudinary } from "cloudinary";

// 🔹 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Upload Image/Video Function (supports base64 data URIs)
export const uploadImage = async (file, folder = "connect_platform") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",   // handles images AND videos
      chunk_size: 6000000,      // 6MB chunks for large files
      timeout: 120000,          // 2 min timeout for slow connections
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message || error);
    throw new Error(`Image upload failed: ${error.message || "Unknown error"}`);
  }
};

export default cloudinary;