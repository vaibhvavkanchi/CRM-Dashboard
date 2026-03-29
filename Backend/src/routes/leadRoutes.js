import { Router } from "express";
import {
  createLead,
  deleteLead,
  getLead,
  getLeadSummary,
  listLeads,
  updateLead,
} from "../controllers/leadController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import {
  validateCreateLead,
  validateUpdateLead,
} from "../middlewares/leadValidationMiddleware.js";
import { PERMISSIONS } from "../config/rbac.js";

/** Router for lead CRUD operations and lead analytics endpoints. */
const router = Router();

router.use(verifyToken);
router.get(
  "/stats/summary",
  authorize(PERMISSIONS.DASHBOARD_READ),
  getLeadSummary,
);
router.get("/", authorize(PERMISSIONS.LEAD_READ), listLeads);
router.post(
  "/",
  authorize(PERMISSIONS.LEAD_WRITE),
  validateCreateLead,
  createLead,
);
router.get("/:id", authorize(PERMISSIONS.LEAD_READ), getLead);
router.patch(
  "/:id",
  authorize(PERMISSIONS.LEAD_WRITE),
  validateUpdateLead,
  updateLead,
);
router.delete("/:id", authorize(PERMISSIONS.LEAD_WRITE), deleteLead);

export default router;
