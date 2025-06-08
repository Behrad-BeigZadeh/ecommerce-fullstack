import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../lib/logger";

dotenv.config();

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);

    process.exit(1);
  }
};
