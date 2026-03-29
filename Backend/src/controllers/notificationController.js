import Notification from "../models/Notification.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { buildPagination } from "../utils/pagination.js";
import {
  validateObjectId,
  validatePaginationQuery,
} from "../utils/validators.js";

/**
 * Returns paginated notifications for the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getNotifications = catchAsync(async (req, res) => {
  const { page, limit } = validatePaginationQuery(req.query);
  const skip = (page - 1) * limit;

  const filter = { userId: req.user._id };

  const [data, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  res.json({ data, pagination: buildPagination({ page, limit, total }) });
});

/**
 * Marks single notification as read for the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const markNotificationRead = catchAsync(async (req, res) => {
  validateObjectId(req.params.id, "notification id");

  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true },
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  res.json({ message: "Notification marked as read", data: notification });
});

/**
 * Marks all unread notifications as read for authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const markAllNotificationsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true },
  );
  res.json({ message: "All notifications marked as read" });
});
