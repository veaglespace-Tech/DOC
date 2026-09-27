// src/config/bullmq.js
const { Queue, Worker } = require('bullmq');
const redis = require('./redis');
const logger = require('./logger');

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Queue definitions
const notificationQueue  = new Queue('notifications',  { connection });
const settlementQueue    = new Queue('settlements',    { connection });
const reminderQueue      = new Queue('reminders',      { connection });
const emergencyQueue     = new Queue('emergency',      { connection });

logger.info('BullMQ: Queues initialized');

module.exports = {
  notificationQueue,
  settlementQueue,
  reminderQueue,
  emergencyQueue,
  connection,
};
