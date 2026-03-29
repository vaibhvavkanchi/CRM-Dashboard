/**
 * Supported application roles used by authentication and authorization.
 * @readonly
 * @enum {string}
 */
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  SALES: "sales",
};

/**
 * Permission keys used by RBAC middleware and frontend guards.
 * @readonly
 * @enum {string}
 */
export const PERMISSIONS = {
  LEAD_READ: "lead:read",
  LEAD_WRITE: "lead:write",
  DASHBOARD_READ: "dashboard:read",
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_WRITE: "notification:write",
};

/**
 * Maps each role to the permissions granted within the CRM.
 * Admin uses a wildcard to bypass granular checks.
 * @type {Record<string, string[]>}
 */
export const rolePermissions = {
  [ROLES.ADMIN]: ["*"],
  [ROLES.MANAGER]: [
    PERMISSIONS.LEAD_READ,
    PERMISSIONS.LEAD_WRITE,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.NOTIFICATION_WRITE,
  ],
  [ROLES.SALES]: [
    PERMISSIONS.LEAD_READ,
    PERMISSIONS.LEAD_WRITE,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.NOTIFICATION_WRITE,
  ],
};
