import { catchAsync } from "../utils/catchAsync.js";
import {
  validateObjectId,
  validatePaginationQuery,
  validateRole,
} from "../utils/validators.js";
import { changeUserRole, getUsersPaginated } from "../services/userService.js";

/**
 * Returns an admin-only paginated list of users.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getUsers = catchAsync(async (req, res) => {
  const { page, limit } = validatePaginationQuery(req.query);
  const result = await getUsersPaginated({ page, limit });

  res.json(result);
});

/**
 * Updates target user's role from the admin management screen.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const updateUserRole = catchAsync(async (req, res) => {
  validateObjectId(req.params.id, "user id");
  validateRole(req.body.role);

  const user = await changeUserRole({
    targetUserId: req.params.id,
    role: req.body.role,
    currentUserId: req.user._id,
  });

  res.json({ message: "User role updated successfully", data: user });
});
