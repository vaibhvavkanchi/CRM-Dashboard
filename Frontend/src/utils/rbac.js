/**
 * Supported frontend role identifiers.
 * @readonly
 * @enum {string}
 */
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  SALES: "sales",
};

/**
 * Permission keys mirrored from the backend for UI guarding.
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
 * Permission map used by route guards and conditional rendering.
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

/**
 * Determines whether a role grants a given permission.
 * @param {string | undefined} role
 * @param {string} permission
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  const permissions = rolePermissions[role] || [];
  return permissions.includes("*") || permissions.includes(permission);
};
