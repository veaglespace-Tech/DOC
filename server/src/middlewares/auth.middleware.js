// src/middlewares/auth.middleware.js
const { verifyAccessToken } = require('../utils/jwt.util');
const { sendError } = require('../utils/response.util');

/**
 * Authenticate JWT — attaches req.user = { id, uuid, roles, permissions }
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized: No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Unauthorized: Token expired', 401);
    }
    return sendError(res, 'Unauthorized: Invalid token', 401);
  }
};

module.exports = { authenticate };
