import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import leadRoutes from "./leadRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

/** Root API router that mounts all versioned domain route groups. */
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leads", leadRoutes);
router.use("/notifications", notificationRoutes);

export default router;
