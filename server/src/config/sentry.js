// src/config/sentry.js
/**
 * Sentry Error Monitoring & Performance Tracking
 * BRD Tech Stack: Sentry (Monitoring)
 *
 * Initialise BEFORE any other require() in server.js
 */
const Sentry = require('@sentry/node');
const logger = require('./logger');

const initSentry = () => {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn || dsn === 'your_sentry_dsn_here') {
    logger.warn('Sentry: DSN not configured — skipping Sentry init (set SENTRY_DSN in .env)');
    return;
  }

  Sentry.init({
    dsn,
    environment:  process.env.NODE_ENV || 'development',
    release:      process.env.npm_package_version || '1.0.0',

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

    // Extra integrations
    integrations: [
      // Automatically instruments HTTP calls
      Sentry.httpIntegration({ tracing: true }),
    ],

    // Ignore common non-critical errors
    ignoreErrors: [
      'TokenExpiredError',
      'JsonWebTokenError',
      'ValidationError',
    ],

    // Scrub sensitive data before sending to Sentry
    beforeSend(event) {
      // Remove password/token fields from request body
      if (event.request && event.request.data) {
        const sensitive = ['password', 'passwordHash', 'token', 'refreshToken', 'otp'];
        sensitive.forEach((key) => {
          if (event.request.data[key]) event.request.data[key] = '[REDACTED]';
        });
      }
      return event;
    },
  });

  logger.info(`Sentry: Initialized (env=${process.env.NODE_ENV})`);
};

module.exports = { Sentry, initSentry };
