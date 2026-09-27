// src/middlewares/rbac.middleware.js
const { sendError } = require('../utils/response.util');

/**
 * Role-based access control middleware
 * @param {...string} roles - allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const userRoles = req.user.roles || [];
    const hasRole = roles.some((r) => userRoles.includes(r));

    if (!hasRole) {
      return sendError(res, 'Forbidden: Insufficient permissions', 403);
    }
    next();
  };
};

/**
 * Permission-based access control middleware
 * @param {...string} permissions - required permissions
 */
const hasPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const userPermissions = req.user.permissions || [];
    const hasAll = permissions.every((p) => userPermissions.includes(p));

    if (!hasAll) {
      return sendError(res, 'Forbidden: Missing required permissions', 403);
    }
    next();
  };
};

module.exports = { authorize, hasPermission };
