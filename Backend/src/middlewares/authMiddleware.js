import User from "../models/User.js";
import BlacklistedToken from "../models/BlacklistedToken.js";
import env from "../config/env.js";
import AppError from "../utils/appError.js";
import { verifyJwt } from "../utils/jwt.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * Authenticates request using a Bearer token and attaches the user context.
 * Rejects missing, invalid, expired, or blacklisted tokens.
 * @type {import("express").RequestHandler}
 */
export const verifyToken = catchAsync(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return next(new AppError("Authentication token missing", 401));
  }

  const decoded = verifyJwt(token, env.jwtSecret);
  const blacklistedToken = await BlacklistedToken.findOne({ token });

  if (blacklistedToken) {
    return next(new AppError("Token has been logged out", 401));
  }

  const user = await User.findById(decoded.sub);

  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  req.user = user;
  req.auth = decoded;
  req.token = token;
  next();
});
