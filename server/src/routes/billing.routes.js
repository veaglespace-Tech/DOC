const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Routes accessible to any authenticated user (download invoice handles specific access checks inside)
router.get('/invoice/:paymentId/download', authenticate, billingController.downloadInvoice);

// Routes for Patient
router.get('/patient/history', authenticate, authorize('PATIENT'), billingController.getPatientBillingHistory);

// Routes for Admin
router.get('/admin/reports', authenticate, authorize('SUPERADMIN', 'ADMIN'), billingController.getAdminBillingReports);

module.exports = router;
