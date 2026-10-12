const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/dispatch', authenticate, emergencyController.triggerEmergency);
router.post('/respond', authenticate, emergencyController.respondEmergency);
router.get('/alerts', authenticate, emergencyController.getActiveDoctorAlerts);
router.get('/:id/status', emergencyController.getEmergencyStatus);
router.post('/location', authenticate, emergencyController.updateDoctorLocation);

module.exports = router;
