// src/jobs/workers/notification.worker.js
/**
 * BullMQ Worker — Notification Queue
 * Processes async notification jobs dispatched by other services
 *
 * Job types handled:
 * - otp              → Send OTP via email/SMS
 * - appointment_confirm → Appointment confirmation
 * - appointment_reminder → Pre-appointment reminder
 * - emergency_assigned  → Emergency assignment alert
 * - payment_success     → Payment confirmation
 * - doctor_on_the_way   → Doctor location update
 */
const { Worker } = require('bullmq');
const logger  = require('../../config/logger');
const otpSvc  = require('../../services/otp.service');
const { connection } = require('../../config/bullmq');

const notificationWorker = new Worker(
  'notifications',
  async (job) => {
    logger.info(`[NotificationWorker] Processing job: ${job.name} (id=${job.id})`);

    switch (job.name) {
      case 'otp': {
        const { userId, identifier, type, userName } = job.data;
        return await otpSvc.generateAndSendOtp({ userId, identifier, type, userName });
      }

      case 'appointment_confirm': {
        const { patientEmail, patientPhone, patientName, doctorName, scheduledAt, appointmentId } = job.data;
        return await otpSvc.sendAppointmentConfirmation({
          patientEmail, patientPhone, patientName, doctorName, scheduledAt, appointmentId,
        });
      }

      case 'appointment_reminder': {
        const { patientPhone, patientEmail, patientName, doctorName, time } = job.data;
        return await otpSvc.sendAppointmentReminder({
          patientPhone, patientEmail, patientName, doctorName, time,
        });
      }

      case 'emergency_assigned': {
        const { patientPhone, doctorName, eta, distance } = job.data;
        return await otpSvc.sendEmergencyNotification({ patientPhone, doctorName, eta, distance });
      }

      case 'payment_success': {
        const { phone, email, amount, doctorName, appointmentId } = job.data;
        return await otpSvc.sendPaymentSuccess({ phone, email, amount, doctorName, appointmentId });
      }

      default:
        logger.warn(`[NotificationWorker] Unknown job type: ${job.name}`);
        return null;
    }
  },
  {
    connection,
    concurrency:  5,
    removeOnComplete: { count: 100 },
    removeOnFail:     { count: 50  },
  }
);

notificationWorker.on('completed', (job) => {
  logger.info(`[NotificationWorker] ✅ Job completed: ${job.name} (id=${job.id})`);
});

notificationWorker.on('failed', (job, err) => {
  logger.error(`[NotificationWorker] ❌ Job failed: ${job?.name} (id=${job?.id}) — ${err.message}`);
});

notificationWorker.on('error', (err) => {
  logger.error(`[NotificationWorker] Worker error: ${err.message}`);
});

logger.info('[NotificationWorker] Started — listening on "notifications" queue');

module.exports = notificationWorker;
