const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { initiatePaymentSchema, verifyPaymentSchema } = require('../validators/payment.validator');

// Razorpay server-to-server webhook (Public, signature-verified in controller)
router.post('/webhook', paymentController.handleWebhook);

// Protected payment routes
router.use(authenticate);

// Initiate payment (create order)
router.post(
  '/initiate',
  validate(initiatePaymentSchema),
  paymentController.initiatePayment
);

// Verify payment signature
router.post(
  '/verify',
  validate(verifyPaymentSchema),
  paymentController.verifyPayment
);

// Process refund (Patient, Doctor, or Admin)
router.post(
  '/refund',
  paymentController.processRefund
);

// List all refunds (Admin, Finance)
router.get(
  '/refunds',
  authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'),
  paymentController.getRefundsList
);

module.exports = router;

