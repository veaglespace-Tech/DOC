const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { initiatePaymentSchema, verifyPaymentSchema } = require('../validators/payment.validator');

// Razorpay server-to-server webhook (Public, signature-verified in controller)
router.post('/webhook', paymentController.handleWebhook);

// PayU payment callback / response webhook (Public - called by PayU redirect/POST)
router.post('/payu/response', paymentController.handlePayUResponse);
router.get('/payu/response', paymentController.handlePayUResponse);

// Public / Pre-auth Coupon validation
router.post('/coupon/apply', paymentController.applyCoupon);

// Download SaaS GST Tax Invoice PDF
router.get('/saas/invoice/:txnid', paymentController.downloadSaaSInvoice);

// Protected payment routes
router.use(authenticate);

// PayU Test Integration Routes
router.post('/payu/subscribe', paymentController.initiatePayUSubscription);
router.post('/payu/initiate', paymentController.initiatePayUAppointment);
router.post('/payu/verify', paymentController.verifyPayUPayment);

// Razorpay Initiate payment (create order)
router.post(
  '/initiate',
  validate(initiatePaymentSchema),
  paymentController.initiatePayment
);

// Razorpay Verify payment signature
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
