import mongoose from "mongoose";
import { LEAD_SOURCE, LEAD_STATUS } from "../constants/lead.constants.js";

/**
 * Lead schema representing a CRM lead and its ownership/assignment metadata.
 * @property {string} name Lead or company name.
 * @property {string} phone Primary contact number.
 * @property {string=} email Optional contact email.
 * @property {string} source Acquisition source.
 * @property {string} status Current pipeline status.
 * @property {string} notes Free-form notes, limited to 1000 characters.
 * @property {import("mongoose").Types.ObjectId} createdBy User who created the lead.
 * @property {import("mongoose").Types.ObjectId=} assignedTo User currently responsible for the lead.
 */
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    source: {
      type: String,
      trim: true,
      enum: LEAD_SOURCE,
      default: "website",
      index: true,
    },
    status: {
      type: String,
      enum: LEAD_STATUS,
      default: "new",
      index: true,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, source: 1, assignedTo: 1, createdAt: -1 });
leadSchema.index({ createdBy: 1, assignedTo: 1, createdAt: -1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
