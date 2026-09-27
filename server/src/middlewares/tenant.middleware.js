// src/middlewares/tenant.middleware.js
/**
 * Multi-tenant middleware
 *
 * Resolves tenant (Organization) from:
 *   1. Subdomain: clinic1.careconnect.in → subdomain = 'clinic1'
 *   2. Header: X-Tenant-ID: clinic1
 *   3. JWT payload: req.user.organizationId (set after authenticate)
 *
 * Attaches req.tenantId to every request.
 * If no tenant is resolved, req.tenantId = null (platform-level access).
 */
const prisma = require('../config/database');
const logger = require('../config/logger');

const resolveTenant = async (req, res, next) => {
  try {
    let subdomain = null;

    // 1. Check subdomain
    const host = req.hostname || '';
    const parts = host.split('.');
    // e.g. clinic1.careconnect.in → parts = ['clinic1', 'careconnect', 'in']
    if (parts.length >= 3 && parts[0] !== 'www') {
      subdomain = parts[0];
    }

    // 2. Check X-Tenant-ID header (for API clients, mobile apps)
    const headerTenant = req.headers['x-tenant-id'];
    if (headerTenant) subdomain = headerTenant;

    if (subdomain) {
      const org = await prisma.organization.findUnique({
        where:  { subdomain },
        select: { id: true, isActive: true, name: true },
      });

      if (org && org.isActive) {
        req.tenantId   = org.id;
        req.tenantName = org.name;
        logger.debug(`Tenant resolved: ${org.name} (id=${org.id})`);
      } else {
        req.tenantId = null;
      }
    } else {
      req.tenantId = null;
    }

    next();
  } catch (err) {
    logger.error('Tenant middleware error:', err.message);
    next(); // Don't block request on tenant resolution failure
  }
};

/**
 * Enforce tenant isolation — use on routes that must have a tenant
 */
const requireTenant = (req, res, next) => {
  if (!req.tenantId) {
    return res.status(400).json({ success: false, message: 'Tenant context required' });
  }
  next();
};

module.exports = { resolveTenant, requireTenant };
