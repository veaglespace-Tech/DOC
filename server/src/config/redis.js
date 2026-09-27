// src/config/redis.js
/**
 * Redis — DISABLED (no Redis server available)
 * Using in-memory fallback for rate limiting.
 * When Redis is available, set REDIS_ENABLED=true in .env
 */
const logger = require('./logger');

// Null object — all calls are no-ops
const nullRedis = {
  connect:    async () => {},
  disconnect: async () => {},
  get:        async () => null,
  set:        async () => 'OK',
  del:        async () => 0,
  exists:     async () => 0,
  expire:     async () => 1,
  on:         () => nullRedis,
};

logger.warn('Redis: Disabled — running without Redis cache (set REDIS_ENABLED=true when available)');

module.exports = nullRedis;
