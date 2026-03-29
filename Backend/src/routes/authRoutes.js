import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { loginRateLimiter } from "../middlewares/rateLimiter.js";

/** Router for public authentication and authenticated session lifecycle endpoints. */
const router = Router();

router.post("/register", register);
router.post("/login", loginRateLimiter, login);
router.post("/logout", verifyToken, logout);

export default router;
