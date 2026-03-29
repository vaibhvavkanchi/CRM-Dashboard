import Lead from "../models/Lead.js";
import User from "../models/User.js";
import { ROLES } from "../config/rbac.js";
import { LEAD_STATUS } from "../constants/lead.constants.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { buildPagination } from "../utils/pagination.js";
import { validateLeadQuery, validateObjectId } from "../utils/validators.js";
import {
  buildLeadAccessFilter,
  buildLeadListQuery,
  buildLeadSort,
  ensureLeadAccess,
} from "../services/leadService.js";
import { createNotifications } from "../services/notificationService.js";

const leadPopulate = [
  { path: "createdBy", select: "name email role" },
  { path: "assignedTo", select: "name email role" },
];

/**
 * Creates new lead using validated, allowlisted payload fields.
 * Applies sales assignment restrictions and server-controlled ownership.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const createLead = catchAsync(async (req, res) => {
  const { name, phone, email, source, status, notes, assignedTo } =
    req.validatedBody;

  if (
    req.user.role === ROLES.SALES &&
    assignedTo &&
    String(assignedTo) !== String(req.user._id)
  ) {
    throw new AppError("Sales users can only assign leads to themselves", 403);
  }

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      throw new AppError("Assigned user not found", 400);
    }
  }

  const payload = {
    name,
    phone,
    email,
    source,
    status,
    notes,
    assignedTo,
    createdBy: req.user._id,
  };

  const lead = await Lead.create(payload);
  const populatedLead = await Lead.findById(lead._id).populate(leadPopulate);

  await createNotifications({
    userIds: [payload.assignedTo, req.user._id],
    message: `Lead ${lead.name} was created by ${req.user.name}`,
    meta: { type: "lead_created", leadId: lead.id },
  });

  res
    .status(201)
    .json({ message: "Lead created successfully", data: populatedLead });
});

/**
 * Returns single lead when it is accessible to current user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getLead = catchAsync(async (req, res) => {
  validateObjectId(req.params.id, "lead id");
  const lead = await Lead.findById(req.params.id).populate(leadPopulate);
  ensureLeadAccess(lead, req.user);

  res.json({ data: lead });
});

/**
 * Returns paginated list of leads respecting filters, sorting, and role scope.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const listLeads = catchAsync(async (req, res) => {
  const { page, limit } = validateLeadQuery(req.query);
  const filter = buildLeadListQuery(req.query, req.user);
  const sort = buildLeadSort(req.query.sort);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Lead.find(filter).populate(leadPopulate).sort(sort).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.json({
    data,
    pagination: buildPagination({ page, limit, total }),
  });
});

/**
 * Updates an existing lead with validated, allowlisted fields.
 * Assignment restrictions mirror create behavior for sales users.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const updateLead = catchAsync(async (req, res) => {
  validateObjectId(req.params.id, "lead id");

  const existingLead = await Lead.findById(req.params.id);
  ensureLeadAccess(existingLead, req.user);

  const { name, phone, email, source, status, notes, assignedTo } =
    req.validatedBody;

  if (
    req.user.role === ROLES.SALES &&
    assignedTo &&
    String(assignedTo) !== String(req.user._id)
  ) {
    throw new AppError("Sales users cannot reassign leads", 403);
  }

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      throw new AppError("Assigned user not found", 400);
    }
  }

  const previousAssignedTo = existingLead.assignedTo;
  const updates = {
    ...(name !== undefined ? { name } : {}),
    ...(phone !== undefined ? { phone } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(source !== undefined ? { source } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(notes !== undefined ? { notes } : {}),
    ...(assignedTo !== undefined ? { assignedTo } : {}),
  };

  Object.assign(existingLead, updates);
  await existingLead.save();

  const updatedLead = await Lead.findById(existingLead._id).populate(
    leadPopulate,
  );

  const notificationRecipients = [
    req.user._id,
    updatedLead.createdBy?._id,
    updatedLead.assignedTo?._id,
  ];
  await createNotifications({
    userIds: notificationRecipients,
    message: `Lead ${updatedLead.name} was updated by ${req.user.name}`,
    meta: { type: "lead_updated", leadId: updatedLead.id },
  });

  if (assignedTo && String(previousAssignedTo || "") !== String(assignedTo)) {
    await createNotifications({
      userIds: [assignedTo],
      message: `Lead ${updatedLead.name} was assigned to you by ${req.user.name}`,
      meta: { type: "lead_assigned", leadId: updatedLead.id },
    });
  }

  res.json({ message: "Lead updated successfully", data: updatedLead });
});

/**
 * Deletes accessible lead and emits deletion notifications.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const deleteLead = catchAsync(async (req, res) => {
  validateObjectId(req.params.id, "lead id");
  const lead = await Lead.findById(req.params.id);
  ensureLeadAccess(lead, req.user);

  const recipients = [lead.createdBy, lead.assignedTo, req.user._id];
  await Lead.findByIdAndDelete(req.params.id);
  await createNotifications({
    userIds: recipients,
    message: `Lead ${lead.name} was deleted by ${req.user.name}`,
    meta: { type: "lead_deleted", leadId: lead.id },
  });

  res.json({ message: "Lead deleted successfully" });
});

/**
 * Returns dashboard summary analytics scoped by current user's lead access.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getLeadSummary = catchAsync(async (req, res) => {
  /** Aggregate analytics are scoped using same access filter as lead listing. */
  const accessFilter = buildLeadAccessFilter(req.user);
  const [summary] = await Lead.aggregate([
    { $match: accessFilter },
    {
      $facet: {
        totals: [{ $count: "totalLeads" }],
        byStatus: [
          {
            $group: {
              _id: { $ifNull: ["$status", "unknown"] },
              count: { $sum: 1 },
            },
          },
          { $project: { _id: 0, key: "$_id", count: 1 } },
        ],
        bySource: [
          {
            $group: {
              _id: { $ifNull: ["$source", "unknown"] },
              count: { $sum: 1 },
            },
          },
          { $project: { _id: 0, key: "$_id", count: 1 } },
        ],
      },
    },
  ]);

  const normalize = (items, defaults = {}) =>
    items.reduce(
      (acc, item) => {
        acc[item.key] = item.count || 0;
        return acc;
      },
      { ...defaults },
    );

  const statusDefaults = LEAD_STATUS.reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    { unknown: 0 },
  );

  res.json({
    data: {
      totalLeads: summary?.totals?.[0]?.totalLeads || 0,
      byStatus: normalize(summary?.byStatus || [], statusDefaults),
      bySource: normalize(summary?.bySource || [], { unknown: 0 }),
    },
  });
});
