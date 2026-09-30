const { z } = require('zod');

const initiatePaymentSchema = z.object({
  appointmentId: z.number().int().positive("Valid Appointment ID is required")
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
  appointmentId: z.number().int().positive("Valid Appointment ID is required")
});

module.exports = {
  initiatePaymentSchema,
  verifyPaymentSchema
};
