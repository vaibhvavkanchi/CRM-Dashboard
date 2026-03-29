import mongoose from "mongoose";

/**
 * Stores invalidated access tokens until their JWT expiry for logout enforcement.
 * @property {string} token Serialized JWT.
 * @property {Date} expiresAt Expiration time used by TTL cleanup.
 */
const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema,
);

export default BlacklistedToken;
