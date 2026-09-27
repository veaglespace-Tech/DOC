// src/config/twilio.js
/**
 * Twilio Client — SMS & WhatsApp
 * BRD Tech Stack: SMS + WhatsApp notifications
 */
const logger = require('./logger');

let client = null;

const getTwilioClient = () => {
  if (client) return client;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || accountSid === 'your_twilio_sid') {
    logger.warn('Twilio: Credentials not configured — SMS/WhatsApp disabled');
    return null;
  }

  try {
    const twilio = require('twilio');
    client = twilio(accountSid, authToken);
    logger.info('Twilio: Client initialized ✅');
  } catch (err) {
    logger.error(`Twilio: Init failed — ${err.message}`);
    return null;
  }

  return client;
};

module.exports = { getTwilioClient };
