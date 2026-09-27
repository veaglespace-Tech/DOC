// src/middlewares/error.middleware.js
const logger = require('../config/logger');
const { sendError } = require('../utils/response.util');

// Sentry — lazy import to avoid issues if not initialized
let Sentry;
try {
  Sentry = require('@sentry/node');
} catch (_) {
  Sentry = null;
}

/**
 * Global error handler — must be the LAST middleware in app.js
 * Captures all errors, reports to Sentry, returns standard JSON response
 */
const errorHandler = (err, req, res, next) => {
  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Log the error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} → ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`[${req.method}] ${req.path} → ${statusCode}: ${err.message}`);
  }

  // Report 5xx errors to Sentry
  if (statusCode >= 500 && Sentry) {
    Sentry.withScope((scope) => {
      scope.setTag('method', req.method);
      scope.setTag('path', req.path);
      scope.setUser(req.user ? { id: req.user.id, email: req.user.email } : null);
      scope.setContext('request', {
        method: req.method,
        url:    req.originalUrl,
        body:   req.body,
        query:  req.query,
        params: req.params,
      });
      Sentry.captureException(err);
    });
  }

  // ---- Handle specific error types ----

  // Prisma errors
  if (err.code === 'P2002') {
    return sendError(res, 'A record with this value already exists.', 409);
  }
  if (err.code === 'P2025') {
    return sendError(res, 'Record not found.', 404);
  }
  if (err.code === 'P2003') {
    return sendError(res, 'Related record not found.', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token', 401);
  if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401);

  // Multer (file upload) errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 'File too large. Maximum size is 10MB.', 413);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, 'Unexpected file field.', 400);
  }

  // Zod validation errors (if thrown manually)
  if (err.name === 'ZodError') {
    const errors = (err.issues || err.errors || []).map((e) => ({ field: e.path.join('.'), message: e.message }));
    return sendError(res, 'Validation failed', 422, errors);
  }

  // SyntaxError (malformed JSON body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Invalid JSON in request body', 400);
  }

  // Default — mask internal errors in production
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res) => {
  return sendError(res, `Route [${req.method}] ${req.path} not found`, 404);
};

module.exports = { errorHandler, notFound };
