import { rolePermissions } from "../config/rbac.js";
import AppError from "../utils/appError.js";

/**
 * Creates RBAC middleware for required permission.
 * Requests fail with 403 when authenticated role lacks permission.
 * @param {string} permission
 * @returns {import("express").RequestHandler}
 */
export const authorize = (permission) => (req, _res, next) => {
  const permissions = rolePermissions[req.user.role] || [];
  if (permissions.includes("*") || permissions.includes(permission)) {
    return next();
  }

  return next(new AppError("Forbidden", 403));
};
