const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Platform Settings (Ideally fetched from DB config)
const PLATFORM_FEE_PERCENTAGE = 0.10; // 10%
const GST_PERCENTAGE = 0.18; // 18% GST on platform fee

exports.initiatePayment = async (req, res, next) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true, patient: true }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patient.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to pay for this appointment' });
    }

    // Check if payment already exists
    let payment = await prisma.payment.findUnique({
      where: { appointmentId }
    });

    // Calculate amounts
    const doctorFee = parseFloat(appointment.doctor.consultationFee || 500);
    const platformFee = doctorFee * PLATFORM_FEE_PERCENTAGE;
    const taxAmount = platformFee * GST_PERCENTAGE;
    const grossAmount = doctorFee + platformFee + taxAmount;
    const doctorPayable = doctorFee;

    // Razorpay Integration or Mock
    const isMock = !process.env.RAZORPAY_KEY_ID;
    let orderId = `MOCK_ORDER_${Math.floor(Date.now() / 1000)}`;
    
    // Create or update payment record
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          grossAmount,
          platformFee,
          taxAmount,
          doctorPayable,
          gatewayOrderId: orderId,
          status: 'INITIATED'
        }
      });
    } else {
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: { gatewayOrderId: orderId, status: 'INITIATED' }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment.id,
        orderId,
        amount: grossAmount,
        currency: 'INR',
        isMock
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { appointmentId }
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const isMock = !process.env.RAZORPAY_KEY_ID;
    let isSignatureValid = false;

    if (isMock) {
      // Always valid in mock mode
      isSignatureValid = true;
    } else {
      // Actual Razorpay verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
      isSignatureValid = expectedSignature === razorpay_signature;
    }

    if (isSignatureValid) {
      // Mark payment as Captured
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          gatewayPaymentId: razorpay_payment_id,
          gatewaySignature: razorpay_signature,
          status: 'CAPTURED',
          capturedAt: new Date()
        }
      });

      // Update appointment status to PAID
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'PAID' }
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

  } catch (error) {
    next(error);
  }
};
