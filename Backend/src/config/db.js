import mongoose from "mongoose";

/**
 * Establishes the primary MongoDB connection for API.
 * @param {string} mongoUri
 * @returns {Promise<void>}
 */
export const connectDB = async (mongoUri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
};
