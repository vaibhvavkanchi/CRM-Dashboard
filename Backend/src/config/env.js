import dotenv from "dotenv";

dotenv.config();

/**
 * Normalized environment configuration used across backend.
 * @type {{
 * nodeEnv: string,
 * port: number,
 * mongoUri: string,
 * jwtSecret: string,
 * jwtExpiresIn: string,
 * clientOrigin: string,
 * defaultAdminName: string,
 * defaultAdminEmail: string,
 * defaultAdminPassword: string
 * }}
 */
const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lead_crm",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
  defaultAdminName: process.env.DEFAULT_ADMIN_NAME || "System Admin",
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || "admin@crm.com",
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123",
};

export default env;
