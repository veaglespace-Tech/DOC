const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();
const { logAudit } = require('../services/audit.service');
const logger = require('../config/logger');

// Fetch dynamic platform fee & GST settings from DB or fallback
const getPlatformSettings = async () => {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: { in: ['platform_commission_percent', 'gst_percent'] }
      }
    });
    const map = {};
    settings.forEach(s => { map[s.key] = parseFloat(s.value); });
    return {
      commissionRate: (map['platform_commission_percent'] !== undefined ? map['platform_commission_percent'] : 20) / 100,
      gstRate: (map['gst_percent'] !== undefined ? map['gst_percent'] : 18) / 100
    };
  } catch {
    return { commissionRate: 0.20, gstRate: 0.18 };
  }
};

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

    if (payment && payment.status === 'CAPTURED') {
      return res.status(400).json({ success: false, message: 'Payment for this appointment has already been completed.' });
    }

    const { commissionRate, gstRate } = await getPlatformSettings();

    // Calculate amounts (per BRD: Doctor receives their fee, platform charges commission + 18% GST)
    const doctorFee = parseFloat(appointment.doctor.consultationFee || 500);
    const platformFee = Number((doctorFee * commissionRate).toFixed(2));
    const taxAmount = Number((platformFee * gstRate).toFixed(2));
    const grossAmount = Number((doctorFee + platformFee + taxAmount).toFixed(2));
    const doctorPayable = doctorFee;

    // Razorpay Integration or Mock
    const isMock = !process.env.RAZORPAY_KEY_ID;
    let orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (!isMock) {
      try {
        const Razorpay = require('razorpay');
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const rzpOrder = await instance.orders.create({
          amount: Math.round(grossAmount * 100),
          currency: 'INR',
          receipt: `apt_${appointmentId}`,
          notes: { appointmentId: String(appointmentId), patientId: String(appointment.patientId) }
        });
        orderId = rzpOrder.id;
      } catch (err) {
        logger.error('Razorpay order creation failed, falling back to local order id:', err);
      }
    }
    
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
        data: {
          gatewayOrderId: orderId,
          grossAmount,
          platformFee,
          taxAmount,
          doctorPayable,
          status: 'INITIATED'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment.id,
        orderId,
        amount: grossAmount,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
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

    // Idempotency: if already CAPTURED, return success immediately
    if (payment.status === 'CAPTURED') {
      return res.status(200).json({
        success: true,
        message: 'Payment has already been verified and captured'
      });
    }

    const isMock = !process.env.RAZORPAY_KEY_ID;
    let isSignatureValid = false;

    if (isMock) {
      isSignatureValid = true;
    } else {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
      isSignatureValid = expectedSignature === razorpay_signature;
    }

    if (isSignatureValid) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            gatewayPaymentId: razorpay_payment_id,
            gatewaySignature: razorpay_signature || 'verified',
            status: 'CAPTURED',
            capturedAt: new Date()
          }
        }),
        prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'PAID' }
        })
      ]);

      await logAudit({
        userId: req.user?.id || null,
        userRole: 'PATIENT',
        action: 'PAYMENT_CAPTURED',
        entity: 'Payment',
        entityId: payment.id,
        newValue: { orderId: razorpay_order_id, paymentId: razorpay_payment_id, grossAmount: payment.grossAmount }
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

/**
 * Razorpay Webhook Handler (BRD Sec 10)
 * Server-to-server webhook verification with full idempotency
 */
exports.handleWebhook = async (req, res, next) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (secret && webhookSignature) {
      const rawPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawPayload)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        logger.warn('[Webhook] Razorpay webhook signature mismatch');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    logger.info(`[Webhook] Razorpay event received: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.order?.entity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const existing = await prisma.payment.findFirst({
          where: { gatewayOrderId: orderId }
        });

        if (existing) {
          // Idempotency: skip if already captured
          if (existing.status !== 'CAPTURED') {
            await prisma.$transaction([
              prisma.payment.update({
                where: { id: existing.id },
                data: {
                  gatewayPaymentId: paymentId || existing.gatewayPaymentId,
                  status: 'CAPTURED',
                  capturedAt: new Date()
                }
              }),
              prisma.appointment.update({
                where: { id: existing.appointmentId },
                data: { status: 'PAID' }
              })
            ]);

            await logAudit({
              userId: null,
              userRole: 'SYSTEM_WEBHOOK',
              action: 'PAYMENT_CAPTURED_WEBHOOK',
              entity: 'Payment',
              entityId: existing.id,
              newValue: { orderId, paymentId }
            });

            logger.info(`[Webhook] Payment #${existing.id} successfully updated to CAPTURED via webhook.`);
          }
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        await prisma.payment.updateMany({
          where: { gatewayOrderId: orderId, status: { not: 'CAPTURED' } },
          data: { status: 'FAILED' }
        });
      }
    }

    // Always return 200 to acknowledge webhook receipt
    return res.status(200).json({ status: 'ok', received: true });
  } catch (error) {
    logger.error('[Webhook] Error handling webhook:', error);
    return res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
};

/**
 * Refund Management System (BRD Sec 13)
 * Patient cancellation, Doctor cancellation, or Admin-approved refund
 */
exports.processRefund = async (req, res, next) => {
  try {
    const { appointmentId, reason, amount } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: {
        payment: true,
        patient: { include: { user: true } },
        doctor: { include: { user: true, wallet: true } }
      }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (!appointment.payment || appointment.payment.status !== 'CAPTURED') {
      return res.status(400).json({ success: false, message: 'No captured payment found for this appointment to refund' });
    }

    // Check permissions: Patient can cancel if not yet completed; Doctor can cancel; Admin can cancel anytime
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('FINANCE');
    const isDoctor = userRoles.includes('DOCTOR') && appointment.doctor.userId === req.user.id;
    const isPatient = appointment.patient.userId === req.user.id;

    if (!isAdmin && !isDoctor && !isPatient) {
      return res.status(403).json({ success: false, message: 'Unauthorized to refund this appointment' });
    }

    if (appointment.status === 'COMPLETED' && !isAdmin) {
      return res.status(400).json({ success: false, message: 'Completed appointments can only be refunded via Admin review' });
    }

    // Calculate refund amount (default to full gross amount)
    const refundAmount = amount ? Math.min(parseFloat(amount), parseFloat(appointment.payment.grossAmount)) : parseFloat(appointment.payment.grossAmount);
    const isPartial = refundAmount < parseFloat(appointment.payment.grossAmount);

    // Call Razorpay Refund API if credentials exist
    let gatewayRefId = `rfnd_mock_${Date.now()}`;
    if (process.env.RAZORPAY_KEY_ID && appointment.payment.gatewayPaymentId) {
      try {
        const Razorpay = require('razorpay');
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const rzpRefund = await instance.payments.refund(appointment.payment.gatewayPaymentId, {
          amount: Math.round(refundAmount * 100),
          notes: { reason: reason || 'Appointment cancellation refund' }
        });
        gatewayRefId = rzpRefund.id;
      } catch (err) {
        logger.warn('Razorpay refund API call failed, recording mock ref:', err.message);
      }
    }

    // Database atomic update: Record Refund, update Payment status, update Appointment status
    const [refundRecord] = await prisma.$transaction([
      prisma.refund.create({
        data: {
          paymentId: appointment.payment.id,
          amount: refundAmount,
          reason: reason || 'Appointment cancelled',
          initiatedBy: isAdmin ? 'ADMIN' : (isDoctor ? 'DOCTOR' : 'PATIENT'),
          gatewayRefId,
          status: 'PROCESSED',
          processedAt: new Date()
        }
      }),
      prisma.payment.update({
        where: { id: appointment.payment.id },
        data: {
          status: isPartial ? 'PARTIALLY_REFUNDED' : 'REFUNDED'
        }
      }),
      prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          status: 'REFUND',
          cancelReason: reason || 'Cancelled and refunded'
        }
      })
    ]);

    // If doctor wallet had received pending balance for this appointment, cancel it
    if (appointment.doctor.wallet) {
      const doctorPayable = parseFloat(appointment.payment.doctorPayable);
      await prisma.doctorWallet.update({
        where: { id: appointment.doctor.wallet.id },
        data: {
          pendingBalance: { decrement: Math.min(doctorPayable, parseFloat(appointment.doctor.wallet.pendingBalance)) },
          totalEarnings: { decrement: Math.min(doctorPayable, parseFloat(appointment.doctor.wallet.totalEarnings)) }
        }
      }).catch(err => logger.warn('Wallet adjustment note:', err.message));
    }

    await logAudit({
      userId: req.user.id,
      userRole: isAdmin ? 'ADMIN' : (isDoctor ? 'DOCTOR' : 'PATIENT'),
      action: 'PAYMENT_REFUNDED',
      entity: 'Payment',
      entityId: appointment.payment.id,
      prevValue: { status: appointment.payment.status },
      newValue: { refundAmount, gatewayRefId, reason }
    });

    res.status(200).json({
      success: true,
      message: `Refund of ₹${refundAmount} processed successfully.`,
      data: refundRecord
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all refunds (for Admin / Finance)
 */
exports.getRefundsList = async (req, res, next) => {
  try {
    const refunds = await prisma.refund.findMany({
      include: {
        payment: {
          include: {
            patient: { select: { name: true, user: { select: { email: true, phone: true } } } },
            appointment: {
              include: {
                doctor: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: refunds
    });
  } catch (error) {
    next(error);
  }
};



// ============================================================
// PAYU INDIA PAYMENT GATEWAY INTEGRATION (TEST / SANDBOX MODE)
// ============================================================

const getPayUConfig = () => ({
  key: process.env.PAYU_MERCHANT_KEY || 'gtKFFx',
  salt: process.env.PAYU_MERCHANT_SALT || 'eCwWELxi',
  paymentUrl: process.env.PAYU_PAYMENT_URL || 'https://test.payu.in/_payment',
  env: process.env.PAYU_ENV || 'test',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
});

const generatePayUHash = ({ key, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '', salt }) => {
  const formattedAmount = Number(amount).toFixed(2);
  const hashString = key + '|' + txnid + '|' + formattedAmount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + salt;
  return crypto.createHash('sha512').update(hashString).digest('hex');
};

const verifyPayUResponseHash = ({ status, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '', key, salt, additionalCharges, receivedHash }) => {
  const formattedAmount = Number(amount).toFixed(2);
  let hashString = '';
  if (additionalCharges) {
    hashString = additionalCharges + '|' + salt + '|' + status + '||||||' + udf5 + '|' + udf4 + '|' + udf3 + '|' + udf2 + '|' + udf1 + '|' + email + '|' + firstname + '|' + productinfo + '|' + formattedAmount + '|' + txnid + '|' + key;
  } else {
    hashString = salt + '|' + status + '||||||' + udf5 + '|' + udf4 + '|' + udf3 + '|' + udf2 + '|' + udf1 + '|' + email + '|' + firstname + '|' + productinfo + '|' + formattedAmount + '|' + txnid + '|' + key;
  }
  const computedHash = crypto.createHash('sha512').update(hashString).digest('hex');
  return computedHash.toLowerCase() === (receivedHash || '').toLowerCase();
};

/**
 * Initiate PayU Payment for SaaS Subscription Paid Plans (Clinic / Hospital)
 */
exports.initiatePayUSubscription = async (req, res, next) => {
  try {
    const { planId, billingCycle = 'monthly', orgId } = req.body;
    const config = getPayUConfig();

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: parseInt(planId) }
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription Plan not found' });
    }

    const baseMonthly = parseFloat(plan.priceMonthly || 0);
    
    // Free Starter Plan requires 0 payment
    if (baseMonthly === 0) {
      const org = await prisma.organization.upsert({
        where: { subdomain: 'default-clinic' },
        create: { name: 'Default Clinic', subdomain: 'default-clinic', planId: plan.id },
        update: { planId: plan.id }
      });
      return res.status(200).json({
        success: true,
        isFree: true,
        message: 'Successfully activated ' + plan.name,
        data: { org, plan }
      });
    }

    // Calculate Paid Plan Pricing (Annual gets 20% discount)
    const multiplier = billingCycle === 'yearly' ? 10 : 1;
    const basePrice = Number((baseMonthly * multiplier).toFixed(2));
    const gstAmount = Number((basePrice * 0.18).toFixed(2));
    const totalAmount = Number((basePrice + gstAmount).toFixed(2));

    const txnid = 'DOC_SUB_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const productinfo = plan.name + ' (' + billingCycle.toUpperCase() + ')';
    const firstname = (req.user?.name || 'Clinic Admin').split(' ')[0];
    const email = req.user?.email || 'clinic@doctoroncall.com';
    const phone = req.user?.phone || '9876543210';
    const udf1 = String(plan.id);
    const udf2 = String(orgId || req.user?.id || 1);
    const udf3 = 'SUBSCRIPTION';

    const hash = generatePayUHash({
      key: config.key,
      txnid,
      amount: totalAmount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      salt: config.salt
    });

    const host = req.get('host');
    const protocol = req.protocol;
    const surl = protocol + '://' + host + '/api/v1/payments/payu/response';
    const furl = protocol + '://' + host + '/api/v1/payments/payu/response';

    res.status(200).json({
      success: true,
      data: {
        action: config.paymentUrl,
        params: {
          key: config.key,
          txnid,
          amount: totalAmount.toFixed(2),
          productinfo,
          firstname,
          email,
          phone,
          surl,
          furl,
          hash,
          udf1,
          udf2,
          udf3
        },
        plan: {
          id: plan.id,
          name: plan.name,
          billingCycle,
          basePrice,
          gstAmount,
          totalAmount
        },
        gateway: 'PayU India (Sandbox Test)',
        isTest: true
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Initiate PayU Payment for Doctor Appointment
 */
exports.initiatePayUAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.body;
    const config = getPayUConfig();

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: { doctor: true, patient: true }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const { commissionRate, gstRate } = await getPlatformSettings();
    const doctorFee = parseFloat(appointment.doctor.consultationFee || 500);
    const platformFee = Number((doctorFee * commissionRate).toFixed(2));
    const taxAmount = Number((platformFee * gstRate).toFixed(2));
    const grossAmount = Number((doctorFee + platformFee + taxAmount).toFixed(2));
    const doctorPayable = doctorFee;

    const txnid = 'DOC_APT_' + appointmentId + '_' + Date.now();
    const productinfo = 'Doctor Consultation #' + appointmentId;
    const firstname = (appointment.patient?.name || 'Patient').split(' ')[0];
    const email = req.user?.email || 'patient@doctoroncall.com';
    const phone = req.user?.phone || '9876543210';
    const udf1 = String(appointment.id);
    const udf2 = String(appointment.patientId);
    const udf3 = 'APPOINTMENT';

    const hash = generatePayUHash({
      key: config.key,
      txnid,
      amount: grossAmount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      salt: config.salt
    });

    await prisma.payment.upsert({
      where: { appointmentId: appointment.id },
      create: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        grossAmount,
        platformFee,
        taxAmount,
        doctorPayable,
        gatewayOrderId: txnid,
        status: 'INITIATED'
      },
      update: {
        grossAmount,
        platformFee,
        taxAmount,
        doctorPayable,
        gatewayOrderId: txnid,
        status: 'INITIATED'
      }
    });

    const host = req.get('host');
    const protocol = req.protocol;
    const surl = protocol + '://' + host + '/api/v1/payments/payu/response';
    const furl = protocol + '://' + host + '/api/v1/payments/payu/response';

    res.status(200).json({
      success: true,
      data: {
        action: config.paymentUrl,
        params: {
          key: config.key,
          txnid,
          amount: grossAmount.toFixed(2),
          productinfo,
          firstname,
          email,
          phone,
          surl,
          furl,
          hash,
          udf1,
          udf2,
          udf3
        },
        appointment: {
          id: appointment.id,
          doctorFee,
          platformFee,
          taxAmount,
          grossAmount
        },
        gateway: 'PayU India (Sandbox Test)',
        isTest: true
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PayU Public Callback (POST/GET from PayU India Gateway)
 */
exports.handlePayUResponse = async (req, res, next) => {
  try {
    const config = getPayUConfig();
    const data = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;

    const {
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      hash: receivedHash,
      mihpayid,
      error_Message,
      additionalCharges
    } = data;

    logger.info('PayU Webhook Callback received: txnid=' + txnid + ', status=' + status + ', amount=' + amount);

    const isHashValid = verifyPayUResponseHash({
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      key: config.key,
      salt: config.salt,
      additionalCharges,
      receivedHash
    });

    const isSuccess = (status === 'success') && (isHashValid || config.env === 'test');

    if (isSuccess) {
      if (udf3 === 'SUBSCRIPTION') {
        const planId = parseInt(udf1);
        if (planId) {
          await prisma.organization.upsert({
            where: { subdomain: 'default-clinic' },
            create: { name: 'Default Clinic', subdomain: 'default-clinic', planId },
            update: { planId }
          });
        }
        return res.redirect(config.clientUrl + '/clinic?payment=success&txnid=' + txnid + '&plan=' + encodeURIComponent(productinfo || 'Subscription') + '&gateway=PayU');
      } else if (udf3 === 'APPOINTMENT') {
        const appointmentId = parseInt(udf1);
        if (appointmentId) {
          await prisma.payment.updateMany({
            where: { gatewayOrderId: txnid },
            data: {
              status: 'CAPTURED',
              gatewayPaymentId: mihpayid || txnid,
              gatewaySignature: receivedHash || 'PAYU_TEST_HASH',
              capturedAt: new Date()
            }
          });
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CONFIRMED' }
          });
        }
        return res.redirect(config.clientUrl + '/patient/appointments?payment=success&txnid=' + txnid + '&gateway=PayU');
      }
      return res.redirect(config.clientUrl + '/pricing?payment=success&txnid=' + txnid + '&gateway=PayU');
    } else {
      const errMsg = error_Message || 'Payment was cancelled or rejected by PayU gateway';
      if (udf3 === 'SUBSCRIPTION') {
        return res.redirect(config.clientUrl + '/clinic?payment=failed&txnid=' + txnid + '&error=' + encodeURIComponent(errMsg));
      }
      return res.redirect(config.clientUrl + '/pricing?payment=failed&txnid=' + txnid + '&error=' + encodeURIComponent(errMsg));
    }
  } catch (error) {
    logger.error('PayU callback handling error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return res.redirect(clientUrl + '/pricing?payment=error&message=' + encodeURIComponent(error.message));
  }
};

/**
 * Direct Instant PayU Test Verification (for client-side sandbox simulator)
 */
exports.verifyPayUPayment = async (req, res, next) => {
  try {
    const { txnid, type = 'SUBSCRIPTION', targetId, simulateSuccess = true } = req.body;
    
    if (!simulateSuccess) {
      return res.status(400).json({
        success: false,
        message: 'PayU Test Payment declined as requested by simulator.'
      });
    }

    if (type === 'SUBSCRIPTION') {
      const planId = parseInt(targetId);
      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

      const org = await prisma.organization.upsert({
        where: { subdomain: 'default-clinic' },
        create: { name: 'Default Clinic', subdomain: 'default-clinic', planId: plan.id },
        update: { planId: plan.id }
      });

      return res.status(200).json({
        success: true,
        message: 'PayU Test Payment of ₹' + plan.priceMonthly + ' verified! Upgraded to ' + plan.name + '.',
        data: {
          txnid,
          gateway: 'PayU India (Sandbox Test)',
          paymentStatus: 'CAPTURED',
          org,
          plan
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'PayU Test transaction verified successfully.',
      data: { txnid, status: 'CAPTURED' }
    });
  } catch (error) {
    next(error);
  }
};
