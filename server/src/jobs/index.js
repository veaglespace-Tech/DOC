// src/jobs/index.js
/**
 * BullMQ Jobs Bootstrapper
 * Start all workers and register recurring jobs
 */
const logger = require('../config/logger');
const { notificationQueue, reminderQueue } = require('../config/bullmq');

const startWorkers = () => {
  // Start notification worker
  require('./workers/notification.worker');

  logger.info('[Jobs] All BullMQ workers started');
};

/**
 * Helper — Add a notification job to the queue
 * Use this from any service instead of requiring BullMQ directly
 */
const queueNotification = async (name, data, opts = {}) => {
  try {
    await notificationQueue.add(name, data, {
      attempts:   3,
      backoff:    { type: 'exponential', delay: 2000 },
      ...opts,
    });
  } catch (err) {
    logger.error(`[Jobs] Failed to queue notification job "${name}": ${err.message}`);
  }
};

/**
 * Schedule a reminder job at a specific time
 */
const scheduleReminder = async (name, data, runAt) => {
  try {
    const delay = runAt.getTime() - Date.now();
    if (delay <= 0) return;

    await reminderQueue.add(name, data, {
      delay,
      attempts: 2,
      backoff:  { type: 'fixed', delay: 5000 },
    });
  } catch (err) {
    logger.error(`[Jobs] Failed to schedule reminder "${name}": ${err.message}`);
  }
};

module.exports = { startWorkers, queueNotification, scheduleReminder };
