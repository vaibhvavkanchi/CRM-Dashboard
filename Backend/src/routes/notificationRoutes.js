import { Router } from "express";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import { PERMISSIONS } from "../config/rbac.js";

/** Router for authenticated notification read operations. */
const router = Router();

router.use(verifyToken, authorize(PERMISSIONS.NOTIFICATION_READ));
router.get("/", getNotifications);
router.patch(
  "/read-all",
  authorize(PERMISSIONS.NOTIFICATION_WRITE),
  markAllNotificationsRead,
);
router.patch(
  "/:id/read",
  authorize(PERMISSIONS.NOTIFICATION_WRITE),
  markNotificationRead,
);

export default router;
