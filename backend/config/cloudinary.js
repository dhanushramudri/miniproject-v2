import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  console.log(
    process.env.CLOUDINARY_SECRET_KEY,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_NAME
  );
  try {
    console.log("Connecting to Cloudinary... Please wait.");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  } catch (error) {
    console.error("Error connecting to Cloudinary:", error);
  }
};

export default connectCloudinary;
