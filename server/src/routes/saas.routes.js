const express = require('express');
const router = express.Router();
const saasController = require('../controllers/saas.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/plans', saasController.getSubscriptionPlans);
router.get('/my-clinic', authenticate, saasController.getMyClinic);
router.post('/subscribe', authenticate, saasController.subscribePlan);

// Clinic Management Routes
router.get('/appointments', authenticate, saasController.getClinicAppointments);
router.get('/patients', authenticate, saasController.getClinicPatients);
router.get('/billing', authenticate, saasController.getClinicBilling);
router.put('/settings', authenticate, saasController.updateClinicSettings);

module.exports = router;
