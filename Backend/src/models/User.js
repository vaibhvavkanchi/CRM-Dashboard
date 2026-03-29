import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../config/rbac.js";

/**
 * User schema for authenticated CRM users.
 * @property {string} name Display name.
 * @property {string} email Unique login email.
 * @property {string} password Hashed password stored with select:false.
 * @property {string} role RBAC role controlling access.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.SALES,
    },
  },
  { timestamps: true },
);

/**
 * Hashes a password before persistence when it has been modified.
 * @param {import("mongoose").CallbackWithoutResultAndOptionalError} next
 */
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Compares a plaintext password with the stored password hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
