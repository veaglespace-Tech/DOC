// src/jobs/index.js
/**
 * BullMQ Jobs Bootstrapper
 * NOTE: BullMQ requires Redis. Currently disabled — using direct email dispatch instead.
 * When Redis is available, set REDIS_ENABLED=true to activate queued workers.
 */
const logger = require('../config/logger');
const otpService = require('../services/otp.service');

const REDIS_ENABLED = process.env.REDIS_ENABLED === 'true';

const startWorkers = () => {
  if (!REDIS_ENABLED) {
    logger.warn('[Jobs] BullMQ disabled — REDIS_ENABLED not set. Notifications sent directly via email.');
    return;
  }

  // Only start BullMQ workers when Redis is available
  require('./workers/notification.worker');
  logger.info('[Jobs] All BullMQ workers started');
};

/**
 * Queue or directly send a notification.
 * Falls back to direct email/SMS when Redis is not available.
 */
const queueNotification = async (name, data, opts = {}) => {
  if (!REDIS_ENABLED) {
    // Direct dispatch fallback — no queue
    try {
      if (name === 'send-otp') {
        await otpService.generateAndSendOtp(data);
      } else if (name === 'appointment-confirmation') {
        await otpService.sendAppointmentConfirmation(data);
      } else if (name === 'appointment-reminder') {
        await otpService.sendAppointmentReminder(data);
      } else if (name === 'payment-success') {
        await otpService.sendPaymentSuccess(data);
      } else if (name === 'emergency-notification') {
        await otpService.sendEmergencyNotification(data);
      }
    } catch (err) {
      logger.error(`[Jobs] Direct notification failed for "${name}": ${err.message}`);
    }
    return;
  }

  // BullMQ queue (when Redis enabled)
  try {
    const { notificationQueue } = require('../config/bullmq');
    await notificationQueue.add(name, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      ...opts,
    });
  } catch (err) {
    logger.error(`[Jobs] Failed to queue notification "${name}": ${err.message}`);
  }
};

/**
 * Schedule a reminder. Falls back to setTimeout when Redis is not available.
 */
const scheduleReminder = async (name, data, runAt) => {
  const delay = runAt.getTime() - Date.now();
  if (delay <= 0) return;

  if (!REDIS_ENABLED) {
    // In-memory setTimeout fallback (lost on restart — acceptable for dev)
    setTimeout(() => queueNotification(name, data), delay);
    logger.warn(`[Jobs] Reminder "${name}" scheduled via setTimeout (not persistent)`);
    return;
  }

  try {
    const { reminderQueue } = require('../config/bullmq');
    await reminderQueue.add(name, data, {
      delay,
      attempts: 2,
      backoff: { type: 'fixed', delay: 5000 },
    });
  } catch (err) {
    logger.error(`[Jobs] Failed to schedule reminder "${name}": ${err.message}`);
  }
};

module.exports = { startWorkers, queueNotification, scheduleReminder };
