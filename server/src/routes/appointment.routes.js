const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  createAppointmentSchema, 
  updateAppointmentStatusSchema, 
  startVisitSchema, 
  completeVisitSchema 
} = require('../validators/appointment.validator');

// All appointment routes require authentication
router.use(authenticate);

// Book an appointment (usually Patient)
router.post(
  '/', 
  validate(createAppointmentSchema), 
  appointmentController.createAppointment
);

// Get all my appointments (works for both Doctor & Patient)
router.get(
  '/my', 
  appointmentController.getMyAppointments
);

// Update status (e.g. Doctor accepts or rejects)
router.patch(
  '/:id/status', 
  validate(updateAppointmentStatusSchema), 
  appointmentController.updateStatus
);

// Start a visit (Doctor only)
router.post(
  '/:id/start-visit', 
  validate(startVisitSchema), 
  appointmentController.startVisit
);

// Complete a visit (Doctor only)
router.post(
  '/:id/complete-visit', 
  validate(completeVisitSchema), 
  appointmentController.completeVisit
);

module.exports = router;
