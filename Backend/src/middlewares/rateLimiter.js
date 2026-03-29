import rateLimit from "express-rate-limit";

/**
 * Rate limiter protecting repeated login attempts.
 * @type {import("express").RequestHandler}
 */
export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many login attempts. Please try again in a minute.",
  },
});
