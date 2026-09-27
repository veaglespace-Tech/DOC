// src/middlewares/audit.middleware.js
const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Log an audit event
 * @param {object} params
 */
const createAuditLog = async ({ userId, userRole, action, entity, entityId, prevValue, newValue, ipAddress }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userRole: userRole || null,
        action,
        entity,
        entityId: entityId || null,
        prevValue: prevValue ? JSON.stringify(prevValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    logger.error('AuditLog: Failed to write audit log', err.message);
  }
};

module.exports = { createAuditLog };
