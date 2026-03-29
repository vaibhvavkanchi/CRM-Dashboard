import Joi from "joi";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import { LEAD_SOURCE, LEAD_STATUS } from "../constants/lead.constants.js";

/**
 * Validates MongoDB ObjectId strings inside Joi schemas.
 * @param {string} value
 * @param {import("joi").CustomHelpers} helpers
 * @returns {string}
 */
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }

  return value;
};

const phoneRegex = /^[0-9]{10,15}$/;

const baseLeadSchema = {
  name: Joi.string().trim().min(2).max(100),
  phone: Joi.string().trim().pattern(phoneRegex),
  email: Joi.string().trim().email(),
  source: Joi.string().valid(...LEAD_SOURCE),
  status: Joi.string().valid(...LEAD_STATUS),
  notes: Joi.string().allow("").max(1000),
  assignedTo: Joi.string().custom(objectIdValidator, "ObjectId validation"),
};

const createLeadSchema = Joi.object({
  name: baseLeadSchema.name.required(),
  phone: baseLeadSchema.phone.required(),
  email: baseLeadSchema.email,
  source: baseLeadSchema.source,
  status: baseLeadSchema.status,
  notes: baseLeadSchema.notes,
  assignedTo: baseLeadSchema.assignedTo,
}).required();

const updateLeadSchema = Joi.object(baseLeadSchema).min(1).required();

/**
 * Maps Joi validation details to concise field-level messages.
 * @param {import("joi").ValidationErrorItem} detail
 * @returns {string}
 */
const formatJoiMessage = (detail) => {
  switch (detail.context?.key) {
    case "name":
      return "name must be between 2 and 100 characters";
    case "phone":
      return "phone must contain 10 to 15 digits";
    case "email":
      return "email must be a valid email address";
    case "status":
      return `status must be one of: ${LEAD_STATUS.join(", ")}`;
    case "source":
      return `source must be one of: ${LEAD_SOURCE.join(", ")}`;
    case "assignedTo":
      return "assignedTo must be a valid MongoDB ObjectId";
    default:
      return detail.message.replace(/"/g, "");
  }
};

/**
 * Builds a field-keyed validation error map for API responses.
 * @param {import("joi").ValidationErrorItem[]} details
 * @returns {Record<string, string>}
 */
const formatJoiErrors = (details) =>
  details.reduce((acc, detail) => {
    const key = detail.context?.key || "general";
    if (!acc[key]) {
      acc[key] = formatJoiMessage(detail);
    }
    return acc;
  }, {});

/**
 * Creates request middleware for validating lead payloads.
 * @param {import("joi").ObjectSchema} schema
 * @returns {import("express").RequestHandler}
 */
const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      new AppError("Validation failed", 400, {
        errors: formatJoiErrors(error.details),
      }),
    );
  }

  req.validatedBody = value;
  next();
};

/** @type {import("express").RequestHandler} */
export const validateCreateLead = validate(createLeadSchema);
/** @type {import("express").RequestHandler} */
export const validateUpdateLead = validate(updateLeadSchema);
