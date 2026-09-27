// src/modules/otp/templates/sms.templates.js
/**
 * SMS & WhatsApp Message Templates
 * BRD: SMS (Twilio) + WhatsApp notifications
 */

const SMS = {
  EMAIL_VERIFY: (otp) =>
    `[CareConnect] Your email verification OTP is: ${otp}. Valid for 10 minutes. Do NOT share this with anyone.`,

  PHONE_VERIFY: (otp) =>
    `[CareConnect] Your phone verification OTP is: ${otp}. Valid for 10 minutes. Do NOT share this with anyone.`,

  LOGIN: (otp) =>
    `[CareConnect] Your login OTP is: ${otp}. Valid for 10 minutes. If you did not request this, ignore.`,

  PASSWORD_RESET: (otp) =>
    `[CareConnect] Your password reset OTP is: ${otp}. Valid for 10 minutes. Do NOT share.`,

  APPOINTMENT_CONFIRMED: (doctorName, scheduledAt) =>
    `[CareConnect] ✅ Appointment confirmed with ${doctorName} on ${scheduledAt}. Track via the app.`,

  EMERGENCY_ASSIGNED: (doctorName, eta) =>
    `[CareConnect] 🚨 Emergency: Dr. ${doctorName} is on the way. ETA: ${eta} minutes. Stay calm.`,

  DOCTOR_ON_THE_WAY: (doctorName) =>
    `[CareConnect] 🏥 Dr. ${doctorName} is on the way to your location. Track in the app.`,

  APPOINTMENT_REMINDER: (doctorName, time) =>
    `[CareConnect] ⏰ Reminder: Your appointment with Dr. ${doctorName} is at ${time}. Be ready!`,

  PAYMENT_SUCCESS: (amount, appointmentId) =>
    `[CareConnect] ✅ Payment of ₹${amount} received for booking #${appointmentId}. Thank you!`,

  WITHDRAWAL_PROCESSED: (amount) =>
    `[CareConnect] 💰 Your withdrawal of ₹${amount} has been processed. It will reflect in 1-2 business days.`,
};

const WHATSAPP = {
  OTP: (name, otp, type) =>
    `👋 Hello *${name}*!\n\nYour CareConnect OTP for *${type}* is:\n\n*${otp}*\n\n⏰ Valid for 10 minutes.\n🔒 Never share this with anyone.\n\n— CareConnect Team 🏥`,

  APPOINTMENT_CONFIRMED: (patientName, doctorName, scheduledAt) =>
    `✅ *Appointment Confirmed!*\n\nHi *${patientName}*,\n\nYour appointment with *Dr. ${doctorName}* is confirmed.\n📅 *Date & Time:* ${scheduledAt}\n\nTrack your doctor live on the CareConnect app.\n\n— CareConnect 🏥`,

  EMERGENCY_ASSIGNED: (doctorName, eta, distance) =>
    `🚨 *Emergency Update*\n\n*Dr. ${doctorName}* has been assigned to your emergency.\n📍 Distance: ${distance} km\n⏱️ ETA: ${eta} minutes\n\nStay calm. Help is on the way! 🏥`,

  PAYMENT_SUCCESS: (amount, doctorName) =>
    `💳 *Payment Successful*\n\nYour payment of *₹${amount}* for consultation with *Dr. ${doctorName}* has been received.\n\nThank you for choosing CareConnect! 🏥`,
};

module.exports = { SMS, WHATSAPP };
