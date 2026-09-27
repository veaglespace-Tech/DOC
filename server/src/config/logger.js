// src/config/logger.js
const { createLogger, format, transports } = require('winston');

// Custom log levels (includes 'http' between info and verbose)
const levels = {
  error:   0,
  warn:    1,
  info:    2,
  http:    3,
  debug:   4,
};

const colors = {
  error: 'red',
  warn:  'yellow',
  info:  'green',
  http:  'magenta',
  debug: 'blue',
};

require('winston').addColors(colors);

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

const logger = createLogger({
  level:  level(),
  levels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack }) =>
      stack
        ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.printf(({ level, message, timestamp }) =>
          `[${timestamp}] ${level}: ${message}`
        )
      ),
    }),
  ],
});

module.exports = logger;
