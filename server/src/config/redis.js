// src/config/redis.js
const { Redis } = require('ioredis');
const logger = require('./logger');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 5) {
      logger.error('Redis: Max reconnect attempts reached.');
      return null;
    }
    return Math.min(times * 500, 2000);
  },
});

redis.on('connect', () => logger.info('Redis: Connected'));
redis.on('error', (err) => logger.error('Redis Error:', err.message));

module.exports = redis;
