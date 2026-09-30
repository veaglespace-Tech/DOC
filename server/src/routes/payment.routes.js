const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { initiatePaymentSchema, verifyPaymentSchema } = require('../validators/payment.validator');

// All payment routes require authentication
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

module.exports = router;
