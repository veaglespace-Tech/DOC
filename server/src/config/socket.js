// src/config/socket.js
const { Server } = require('socket.io');
const logger = require('./logger');

let io;

/**
 * Initialize Socket.IO server
 * @param {import('http').Server} httpServer
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join user-specific room for targeted events
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`Socket ${socket.id} joined room user:${userId}`);
    });

    // Doctor live location update
    socket.on('doctor:location', (data) => {
      // data: { appointmentId, latitude, longitude }
      io.to(`appointment:${data.appointmentId}`).emit('doctor:location:update', data);
    });

    // Join appointment room for real-time tracking
    socket.on('join:appointment', (appointmentId) => {
      socket.join(`appointment:${appointmentId}`);
    });

    // In-app chat message
    socket.on('chat:message', (data) => {
      io.to(`appointment:${data.appointmentId}`).emit('chat:message:new', data);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO: Initialized');
  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };
