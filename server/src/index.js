// src/index.js
/**
 * CareConnect — Application Entry Point
 */
const dotenv = require('dotenv');
dotenv.config();

const { initSentry } = require('./config/sentry');
initSentry(); // Initialize early for error tracking

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const swaggerUi = require('swagger-ui-express');

// Config & Utils
const swaggerSpec = require('./config/swagger');
const logger = require('./config/logger');
const prisma = require('./config/database');
const redis = require('./config/redis');
const { initSocket } = require('./config/socket');
const { startWorkers } = require('./jobs');

// Middlewares
const { apiLimiter } = require('./middlewares/rateLimit.middleware');
const { errorHandler, notFound } = require('./middlewares/error.middleware');
const { resolveTenant } = require('./middlewares/tenant.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Security & Basic Middlewares
// ============================================================
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev', { stream: { write: (msg) => logger.http(msg.trim()) } }));
}

// ============================================================
// Multi-Tenant & Rate Limiting
// ============================================================
app.use(resolveTenant);
app.use('/api', apiLimiter);

// ============================================================
// Swagger Setup
// ============================================================
const swaggerUiOptions = {
  customSiteTitle: 'CareConnect API Docs',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    syntaxHighlight: { activate: true, theme: 'monokai' },
    tryItOutEnabled: true,
  },
  customCss: `
    .swagger-ui .topbar { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 10px 0; }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper::before { content: '🏥 CareConnect API'; color: #fff; font-size: 22px; font-weight: 700; }
    .swagger-ui .info .title { color: #4f46e5; }
    .swagger-ui .btn.authorize { background: #4f46e5; border-color: #4f46e5; color: #fff; border-radius: 8px; }
  `,
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/api/docs/swagger.json', (req, res) => res.json(swaggerSpec));

// ============================================================
// Health Check
// ============================================================
app.get('/api/health', (req, res) => res.status(200).json({
  success: true,
  status: 'OK',
  message: 'CareConnect server is healthy 🏥',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  version: process.env.npm_package_version || '1.0.0',
  uptime: `${Math.floor(process.uptime())}s`,
}));

// ============================================================
// Routes
// ============================================================
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/patients', require('./routes/patients.routes'));
app.use('/api/v1/doctors', require('./routes/doctors.routes'));

// Upcoming routes:
// app.use('/api/v1/appointments',  require('./routes/appointments.routes'));
// Error Handling
// ============================================================
app.use(notFound);
app.use(errorHandler);

// ============================================================
// Server & Database Initialization
// ============================================================
const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database (MySQL): Connected via Prisma ✅');

    try {
      await redis.connect();
    } catch (redisErr) {
      logger.warn(`Redis: Could not connect — ${redisErr.message}. Continuing without Redis cache.`);
    }

    startWorkers();

    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info(`  CareConnect Server    : http://localhost:${PORT}`);
      logger.info(`  Swagger API Docs      : http://localhost:${PORT}/api/docs`);
      logger.info(`  Environment           : ${process.env.NODE_ENV || 'development'}`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully...`);
      httpServer.close(async () => {
        await prisma.$disconnect();
        redis.disconnect();
        logger.info('Server shut down cleanly. Goodbye.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
};

startServer();
