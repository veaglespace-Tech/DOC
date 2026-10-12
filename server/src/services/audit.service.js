const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Log a critical system or business action
 */
async function logAudit({ userId, userRole, action, entity, entityId, prevValue = null, newValue = null, ipAddress = null }) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        userId: userId ? Number(userId) : null,
        userRole: userRole || null,
        action,
        entity,
        entityId: entityId ? Number(entityId) : null,
        prevValue: prevValue ? prevValue : undefined,
        newValue: newValue ? newValue : undefined,
        ipAddress: ipAddress || null,
      }
    });
    return log;
  } catch (error) {
    logger.error('Failed to write audit log:', error);
    return null;
  }
}

module.exports = { logAudit };
