import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import { ROLES } from "../config/rbac.js";
import AppError from "../utils/appError.js";

/**
 * Builds a MongoDB filter restricting leads to those visible by the current role.
 * @param {{ _id: string, role: string }} user
 * @returns {Record<string, unknown>}
 */
export const buildLeadAccessFilter = (user) => {
  if ([ROLES.ADMIN, ROLES.MANAGER].includes(user.role)) {
    return {};
  }

  return {
    $or: [{ createdBy: user._id }, { assignedTo: user._id }],
  };
};

/**
 * Verifies that a user can access a resolved lead document.
 * @param {import("../models/Lead.js").default | null} lead
 * @param {{ _id: string, role: string }} user
 * @returns {void}
 */
export const ensureLeadAccess = (lead, user) => {
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if ([ROLES.ADMIN, ROLES.MANAGER].includes(user.role)) return;

  const canAccess = [lead.createdBy, lead.assignedTo]
    .filter(Boolean)
    .some((value) => String(value) === String(user._id));

  if (!canAccess) {
    throw new AppError("You are not authorized to access this lead", 403);
  }
};

/**
 * Builds the filtered lead list query from request params and role scope.
 * @param {Record<string, string>} query
 * @param {{ _id: string, role: string }} user
 * @returns {Record<string, unknown>}
 */
export const buildLeadListQuery = (query, user) => {
  const filter = { ...buildLeadAccessFilter(user) };

  if (query.q) {
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { name: { $regex: query.q, $options: "i" } },
        { email: { $regex: query.q, $options: "i" } },
        { phone: { $regex: query.q, $options: "i" } },
      ],
    });
  }

  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.assignedTo)
    filter.assignedTo = new mongoose.Types.ObjectId(query.assignedTo);

  if (query.createdFrom || query.createdTo) {
    filter.createdAt = {};
    if (query.createdFrom) filter.createdAt.$gte = new Date(query.createdFrom);
    if (query.createdTo) filter.createdAt.$lte = new Date(query.createdTo);
  }

  return filter;
};

/**
 * Produces a stable sort object for lead list queries.
 * @param {string | undefined} sortQuery
 * @returns {Record<string, 1|-1>}
 */
export const buildLeadSort = (sortQuery) => {
  if (!sortQuery) {
    return { createdAt: -1, _id: -1 };
  }

  const [field, direction] = sortQuery.split(":");
  const dir = direction === "asc" ? 1 : -1;
  return { [field]: dir, _id: dir };
};
