import env from "../config/env.js";
import { ROLES } from "../config/rbac.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { assertRequiredFields } from "../utils/validators.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/authService.js";

/**
 * Registers public user account as sales user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const register = catchAsync(async (req, res) => {
  assertRequiredFields(req.body, ["name", "email", "password"]);

  const result = await registerUser({ ...req.body, role: ROLES.SALES }, env);

  res.status(201).json({
    message: "User registered successfully",
    token: result.token,
    data: result.user,
  });
});

/**
 * Authenticates user and returns signed JWT.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const login = catchAsync(async (req, res) => {
  assertRequiredFields(req.body, ["email", "password"]);

  const result = await loginUser(req.body, env);

  res.json({
    message: "Login successful",
    token: result.token,
    data: result.user,
  });
});

/**
 * Invalidates current JWT session token.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const logout = catchAsync(async (req, res) => {
  if (!req.token || !req.auth?.exp) {
    throw new AppError("Authentication token missing", 401);
  }

  await logoutUser({ token: req.token, exp: req.auth.exp });

  res.json({
    message: "Logout successful",
  });
});
