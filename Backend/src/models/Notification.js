import mongoose from "mongoose";

/**
 * Notification schema used for persistent in-app notifications.
 * @property {import("mongoose").Types.ObjectId} userId Recipient user id.
 * @property {string} message Notification message.
 * @property {boolean} isRead Read state.
 * @property {Date} createdAt Creation timestamp.
 */
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
