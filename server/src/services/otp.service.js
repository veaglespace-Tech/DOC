// src/modules/otp/otp.service.js
/**
 * OTP & Notification Microservice
 * TASK-007: Phone OTP & Email Verification
 *
 * Handles:
 * - Email OTP via SMTP (Nodemailer)
 * - SMS OTP via Twilio
 * - WhatsApp OTP via Twilio WhatsApp
 * - Delivery tracking & fallback logic
 */
const prisma    = require('../config/database');
const logger    = require('../config/logger');
const { getTransporter }  = require('../config/mailer');
const { getTwilioClient } = require('../config/twilio');
const { generateOTP, getOTPExpiry } = require('../utils/otp.util');
const {
  emailVerifyTemplate,
  phoneVerifyTemplate,
  loginOtpTemplate,
  passwordResetTemplate,
} = require('../templates/email.templates');
const { SMS, WHATSAPP } = require('../templates/sms.templates');

const FROM_EMAIL    = process.env.EMAIL_FROM        || 'noreply@careconnect.in';
const TWILIO_FROM   = process.env.TWILIO_PHONE_NUMBER;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

// ============================================================
// INTERNAL — Send Email
// ============================================================
const sendEmail = async ({ to, subject, html }) => {
  const mailer = getTransporter();

  if (!process.env.SMTP_USER) {
    logger.warn(`[Email] SMTP not configured — would send to ${to}: ${subject}`);
    return { channel: 'email', status: 'skipped', reason: 'SMTP not configured' };
  }

  try {
    const info = await mailer.sendMail({
      from:    `"CareConnect 🏥" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    logger.info(`[Email] Sent to ${to} | msgId: ${info.messageId}`);
    return { channel: 'email', status: 'sent', messageId: info.messageId };
  } catch (err) {
    logger.error(`[Email] Failed to send to ${to}: ${err.message}`);
    return { channel: 'email', status: 'failed', error: err.message };
  }
};

// ============================================================
// INTERNAL — Send SMS
// ============================================================
const sendSms = async ({ to, body }) => {
  const twilio = getTwilioClient();

  if (!twilio) {
    logger.warn(`[SMS] Twilio not configured — would send to ${to}: ${body}`);
    return { channel: 'sms', status: 'skipped', reason: 'Twilio not configured' };
  }

  try {
    const msg = await twilio.messages.create({ from: TWILIO_FROM, to, body });
    logger.info(`[SMS] Sent to ${to} | sid: ${msg.sid}`);
    return { channel: 'sms', status: 'sent', sid: msg.sid };
  } catch (err) {
    logger.error(`[SMS] Failed to send to ${to}: ${err.message}`);
    return { channel: 'sms', status: 'failed', error: err.message };
  }
};

// ============================================================
// INTERNAL — Send WhatsApp
// ============================================================
const sendWhatsApp = async ({ to, body }) => {
  const twilio = getTwilioClient();

  if (!twilio) {
    logger.warn(`[WhatsApp] Twilio not configured — would send to ${to}`);
    return { channel: 'whatsapp', status: 'skipped', reason: 'Twilio not configured' };
  }

  const waTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  try {
    const msg = await twilio.messages.create({ from: WHATSAPP_FROM, to: waTo, body });
    logger.info(`[WhatsApp] Sent to ${to} | sid: ${msg.sid}`);
    return { channel: 'whatsapp', status: 'sent', sid: msg.sid };
  } catch (err) {
    logger.error(`[WhatsApp] Failed to send to ${to}: ${err.message}`);
    return { channel: 'whatsapp', status: 'failed', error: err.message };
  }
};

// ============================================================
// PUBLIC — Generate & Send OTP
// ============================================================

/**
 * Generate OTP, persist to DB, send via appropriate channel
 * @param {{ userId, identifier, type, userName? }} params
 * @returns {{ otp (dev only), expiresIn, deliveryResults }}
 */
const generateAndSendOtp = async ({ userId, identifier, type, userName = 'User' }) => {
  // 1. Invalidate all existing OTPs of this type for user
  await prisma.otpRecord.updateMany({
    where: { userId, type, isUsed: false },
    data:  { isUsed: true },
  });

  // 2. Generate new OTP
  const otp       = generateOTP(6);
  const expiresAt = getOTPExpiry(10); // 10 minutes

  // 3. Persist to DB
  await prisma.otpRecord.create({
    data: { userId, type, otp, expiresAt },
  });

  // 4. Determine channel and send
  const isEmail = identifier.includes('@');
  const deliveryResults = [];

  if (isEmail) {
    // ---- EMAIL channel ----
    let template;
    switch (type) {
      case 'EMAIL_VERIFY':    template = emailVerifyTemplate(userName, otp);    break;
      case 'LOGIN':           template = loginOtpTemplate(userName, otp);       break;
      case 'PASSWORD_RESET':  template = passwordResetTemplate(userName, otp);  break;
      default:                template = emailVerifyTemplate(userName, otp);
    }
    const result = await sendEmail({ to: identifier, ...template });
    deliveryResults.push(result);

  } else {
    // ---- SMS channel (primary) ----
    let smsBody;
    switch (type) {
      case 'PHONE_VERIFY':    smsBody = SMS.PHONE_VERIFY(otp);    break;
      case 'LOGIN':           smsBody = SMS.LOGIN(otp);            break;
      case 'PASSWORD_RESET':  smsBody = SMS.PASSWORD_RESET(otp);  break;
      default:                smsBody = SMS.PHONE_VERIFY(otp);
    }
    const smsResult = await sendSms({ to: identifier, body: smsBody });
    deliveryResults.push(smsResult);

    // ---- WhatsApp channel (fallback / additional) ----
    const waBody = WHATSAPP.OTP(userName, otp, type.replace('_', ' '));
    const waResult = await sendWhatsApp({ to: identifier, body: waBody });
    deliveryResults.push(waResult);
  }

  logger.info(`[OTP] Generated for userId=${userId} type=${type} channel=${isEmail ? 'email' : 'sms+whatsapp'}`);

  return {
    // In production, NEVER return OTP — only in dev for testing
    ...(process.env.NODE_ENV === 'development' ? { otp } : {}),
    expiresIn: '10 minutes',
    deliveryResults,
  };
};

// ============================================================
// PUBLIC — Verify OTP
// ============================================================

/**
 * Verify OTP from DB
 * @param {{ userId, otp, type }} params
 * @returns {{ verified: true, userId }}
 */
const verifyOtp = async ({ userId, otp, type }) => {
  const record = await prisma.otpRecord.findFirst({
    where: {
      userId,
      type,
      otp,
      isUsed:    false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { id: 'desc' },
  });

  if (!record) {
    throw Object.assign(new Error('Invalid or expired OTP'), { statusCode: 400 });
  }

  // Mark as used
  await prisma.otpRecord.update({
    where: { id: record.id },
    data:  { isUsed: true },
  });

  // Auto-verify user if this is a verification OTP
  if (type === 'EMAIL_VERIFY' || type === 'PHONE_VERIFY') {
    await prisma.user.update({
      where: { id: userId },
      data:  { isVerified: true },
    });
    logger.info(`[OTP] User id=${userId} marked as verified`);
  }

  return { verified: true, userId };
};

// ============================================================
// PUBLIC — Send Transactional Emails (non-OTP)
// ============================================================

/**
 * Send appointment confirmation email + SMS
 */
const sendAppointmentConfirmation = async ({ patientEmail, patientPhone, patientName, doctorName, scheduledAt, appointmentId }) => {
  const results = [];

  if (patientEmail) {
    const { appointmentConfirmTemplate } = require('../templates/email.templates');
    const template = appointmentConfirmTemplate({ patientName, doctorName, scheduledAt, appointmentId });
    results.push(await sendEmail({ to: patientEmail, ...template }));
  }

  if (patientPhone) {
    results.push(await sendSms({
      to:   patientPhone,
      body: SMS.APPOINTMENT_CONFIRMED(doctorName, scheduledAt),
    }));
    results.push(await sendWhatsApp({
      to:   patientPhone,
      body: WHATSAPP.APPOINTMENT_CONFIRMED(patientName, doctorName, scheduledAt),
    }));
  }

  return results;
};

/**
 * Send emergency assignment notification
 */
const sendEmergencyNotification = async ({ patientPhone, doctorName, eta, distance }) => {
  const results = [];

  if (patientPhone) {
    results.push(await sendSms({
      to:   patientPhone,
      body: SMS.EMERGENCY_ASSIGNED(doctorName, eta),
    }));
    results.push(await sendWhatsApp({
      to:   patientPhone,
      body: WHATSAPP.EMERGENCY_ASSIGNED(doctorName, eta, distance),
    }));
  }

  return results;
};

/**
 * Send appointment reminder (called by BullMQ job)
 */
const sendAppointmentReminder = async ({ patientPhone, patientEmail, patientName, doctorName, time }) => {
  const results = [];

  if (patientPhone) {
    results.push(await sendSms({
      to:   patientPhone,
      body: SMS.APPOINTMENT_REMINDER(doctorName, time),
    }));
  }

  if (patientEmail) {
    results.push(await sendEmail({
      to:      patientEmail,
      subject: `⏰ Reminder: Appointment with Dr. ${doctorName} | CareConnect`,
      html:    `<p>Hi ${patientName}, your appointment with Dr. ${doctorName} is at ${time}. Be ready!</p>`,
    }));
  }

  return results;
};

/**
 * Send payment success notification
 */
const sendPaymentSuccess = async ({ phone, email, amount, doctorName, appointmentId }) => {
  const results = [];

  if (phone) {
    results.push(await sendSms({ to: phone, body: SMS.PAYMENT_SUCCESS(amount, appointmentId) }));
    results.push(await sendWhatsApp({ to: phone, body: WHATSAPP.PAYMENT_SUCCESS(amount, doctorName) }));
  }

  return results;
};

module.exports = {
  generateAndSendOtp,
  verifyOtp,
  sendAppointmentConfirmation,
  sendEmergencyNotification,
  sendAppointmentReminder,
  sendPaymentSuccess,
  // Internal helpers (for direct use in other services)
  sendEmail,
  sendSms,
  sendWhatsApp,
};
