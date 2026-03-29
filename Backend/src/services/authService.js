import User from "../models/User.js";
import BlacklistedToken from "../models/BlacklistedToken.js";
import { ROLES } from "../config/rbac.js";
import AppError from "../utils/appError.js";
import { signToken } from "../utils/jwt.js";

/**
 * Ensures an initial admin user exists when the system is started with an empty database.
 * @param {{ defaultAdminName: string, defaultAdminEmail: string, defaultAdminPassword: string }} params
 * @returns {Promise<import("mongoose").Document|null>}
 */
export const ensureDefaultAdmin = async ({
  defaultAdminName,
  defaultAdminEmail,
  defaultAdminPassword,
}) => {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    return null;
  }

  return User.create({
    name: defaultAdminName,
    email: defaultAdminEmail,
    password: defaultAdminPassword,
    role: ROLES.ADMIN,
  });
};

/**
 * Registers a new user and returns an authenticated session token.
 * @param {{ name: string, email: string, password: string, role: string }} payload
 * @param {{ jwtSecret: string, jwtExpiresIn: string|number, defaultAdminName: string, defaultAdminEmail: string, defaultAdminPassword: string }} config
 * @returns {Promise<{ user: import("../models/User.js").default, token: string }>}
 */
export const registerUser = async (
  { name, email, password, role },
  {
    jwtSecret,
    jwtExpiresIn,
    defaultAdminName,
    defaultAdminEmail,
    defaultAdminPassword,
  },
) => {
  await ensureDefaultAdmin({
    defaultAdminName,
    defaultAdminEmail,
    defaultAdminPassword,
  });

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || ROLES.SALES,
  });
  const token = signToken({
    userId: user.id,
    role: user.role,
    secret: jwtSecret,
    expiresIn: jwtExpiresIn,
  });

  return { user, token };
};

/**
 * Authenticates a user with email and password credentials.
 * @param {{ email: string, password: string }} payload
 * @param {{ jwtSecret: string, jwtExpiresIn: string|number, defaultAdminName: string, defaultAdminEmail: string, defaultAdminPassword: string }} config
 * @returns {Promise<{ user: import("../models/User.js").default, token: string }>}
 */
export const loginUser = async (
  { email, password },
  {
    jwtSecret,
    jwtExpiresIn,
    defaultAdminName,
    defaultAdminEmail,
    defaultAdminPassword,
  },
) => {
  await ensureDefaultAdmin({
    defaultAdminName,
    defaultAdminEmail,
    defaultAdminPassword,
  });

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({
    userId: user.id,
    role: user.role,
    secret: jwtSecret,
    expiresIn: jwtExpiresIn,
  });
  user.password = undefined;

  return { user, token };
};

/**
 * Invalidates an access token by storing it in the blacklist until it expires.
 * @param {{ token: string, exp: number }} params
 * @returns {Promise<import("../models/BlacklistedToken.js").default | null>}
 */
export const logoutUser = async ({ token, exp }) => {
  const expiresAt = new Date(exp * 1000);

  if (expiresAt <= new Date()) {
    return null;
  }

  return BlacklistedToken.findOneAndUpdate(
    { token },
    { token, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
};
