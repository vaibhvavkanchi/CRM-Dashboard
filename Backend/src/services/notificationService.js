import Notification from "../models/Notification.js";
import { getIO } from "./socketRegistry.js";

/**
 * Creates persistent notifications and emits them to recipient-specific socket rooms.
 * @param {{ userIds: Array<string|import("mongoose").Types.ObjectId|undefined>, message: string, meta?: Record<string, unknown> }} params
 * @returns {Promise<import("../models/Notification.js").default[]>}
 */
export const createNotifications = async ({ userIds, message, meta = {} }) => {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean).map(String))];
  if (!uniqueUserIds.length) return [];

  const notifications = await Notification.insertMany(
    uniqueUserIds.map((userId) => ({ userId, message })),
  );

  const io = getIO();
  if (io) {
    notifications.forEach((notification) => {
      io.to(String(notification.userId)).emit("notification:new", {
        ...notification.toObject(),
        meta,
      });
    });
  }

  return notifications;
};
