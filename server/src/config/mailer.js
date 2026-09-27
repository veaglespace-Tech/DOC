// src/config/mailer.js
/**
 * Nodemailer SMTP Transport
 * BRD Tech Stack: Email notifications
 */
const nodemailer = require('nodemailer');
const logger     = require('./logger');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true, // use connection pool
    maxConnections: 5,
    maxMessages: 100,
  });

  // Verify connection on startup (non-blocking)
  transporter.verify((err) => {
    if (err) {
      logger.warn(`Mailer: SMTP connection failed — ${err.message}`);
    } else {
      logger.info('Mailer: SMTP connection verified ✅');
    }
  });

  return transporter;
};

module.exports = { getTransporter };
