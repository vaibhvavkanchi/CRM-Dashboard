import { Router } from "express";
import { getUsers, updateUserRole } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import { PERMISSIONS } from "../config/rbac.js";

/** Router for admin-only user management endpoints. */
const router = Router();

router.use(verifyToken, authorize(PERMISSIONS.USER_READ));
router.get("/", getUsers);
router.patch("/:id/role", authorize(PERMISSIONS.USER_WRITE), updateUserRole);

export default router;
