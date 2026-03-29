import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { buildPagination } from "../utils/pagination.js";

/**
 * Returns a paginated list of CRM users for admin management screens.
 * @param {{ page: number, limit: number }} params
 * @returns {Promise<{ data: Array<Record<string, unknown>>, pagination: { page: number, limit: number, total: number, totalPages: number } }>}
 */
export const getUsersPaginated = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(),
  ]);

  return {
    data: users,
    pagination: buildPagination({ page, limit, total }),
  };
};

/**
 * Changes a target user's role while preventing self-demotion/self-promotion edits.
 * @param {{ targetUserId: string, role: string, currentUserId: string }} params
 * @returns {Promise<Record<string, unknown>>}
 */
export const changeUserRole = async ({ targetUserId, role, currentUserId }) => {
  if (String(targetUserId) === String(currentUserId)) {
    throw new AppError("You cannot change your own role", 400);
  }

  const user = await User.findByIdAndUpdate(
    targetUserId,
    { role },
    { new: true, runValidators: true },
  ).select("name email role createdAt");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
