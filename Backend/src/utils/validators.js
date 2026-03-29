import mongoose from "mongoose";
import { ROLES } from "../config/rbac.js";
import { LEAD_SOURCE, LEAD_STATUS } from "../constants/lead.constants.js";
import AppError from "./appError.js";

/**
 * Exported lead statuses reused by analytics defaults.
 * @type {string[]}
 */
export const leadStatuses = LEAD_STATUS;

/**
 * Ensures the provided payload contains all required keys.
 * @param {Record<string, unknown>} payload
 * @param {string[]} fields
 * @returns {void}
 */
export const assertRequiredFields = (payload, fields) => {
  const missing = fields.filter((field) => !payload[field]);
  if (missing.length) {
    throw new AppError(`Missing required fields: ${missing.join(", ")}`, 400);
  }
};

/**
 * Validates a MongoDB ObjectId string.
 * @param {string} value
 * @param {string} [fieldName="id"]
 * @returns {void}
 */
export const validateObjectId = (value, fieldName = "id") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
};

/**
 * Validates a role name against supported RBAC roles.
 * @param {string} role
 * @returns {void}
 */
export const validateRole = (role) => {
  if (!Object.values(ROLES).includes(role)) {
    throw new AppError("Invalid role", 400);
  }
};

/**
 * Validates list query params used by the lead listing endpoint.
 * @param {Record<string, string>} query
 * @returns {{ page: number, limit: number }}
 */
export const validateLeadQuery = (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("page must be a positive integer", 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("limit must be an integer between 1 and 100", 400);
  }

  if (
    query.createdFrom &&
    Number.isNaN(new Date(query.createdFrom).getTime())
  ) {
    throw new AppError("createdFrom must be a valid date", 400);
  }

  if (query.createdTo && Number.isNaN(new Date(query.createdTo).getTime())) {
    throw new AppError("createdTo must be a valid date", 400);
  }

  if (query.status && !LEAD_STATUS.includes(query.status)) {
    throw new AppError(`status must be one of: ${LEAD_STATUS.join(", ")}`, 400);
  }

  if (query.source && !LEAD_SOURCE.includes(query.source)) {
    throw new AppError(`source must be one of: ${LEAD_SOURCE.join(", ")}`, 400);
  }

  if (query.assignedTo) {
    validateObjectId(query.assignedTo, "assignedTo");
  }

  if (query.sort) {
    const [field, direction] = query.sort.split(":");
    const allowedFields = [
      "name",
      "email",
      "phone",
      "status",
      "source",
      "createdAt",
      "updatedAt",
    ];
    if (
      !field ||
      !direction ||
      !allowedFields.includes(field) ||
      !["asc", "desc"].includes(direction)
    ) {
      throw new AppError(
        "sort must be in the format field:asc|desc with an allowed field",
        400,
      );
    }
  }

  return { page, limit };
};

/**
 * Validates generic paginated list query params.
 * @param {Record<string, string>} query
 * @returns {{ page: number, limit: number }}
 */
export const validatePaginationQuery = (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("page must be a positive integer", 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("limit must be an integer between 1 and 100", 400);
  }

  return { page, limit };
};
