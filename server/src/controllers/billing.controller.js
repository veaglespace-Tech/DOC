const { sendSuccess, sendError } = require('../utils/response.util');
const { generateInvoicePDF } = require('../services/invoice.service');
const prisma = require('../config/database');

// ============================================================
// GET /api/v1/billing/invoice/:paymentId/download
// ============================================================
const downloadInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Authorization check
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId, 10) },
      include: {
        appointment: {
          include: { patient: true, doctor: true }
        }
      }
    });

    if (!payment) {
      return sendError(res, 'Payment not found', 404);
    }

    // Ensure the requester is the patient, doctor, or an admin
    const isPatient = payment.appointment.patient.userId === req.user.id;
    const isDoctor = payment.appointment.doctor.userId === req.user.id;
    const isAdmin = req.user.roles && (req.user.roles.includes('SUPERADMIN') || req.user.roles.includes('ADMIN'));

    if (!isPatient && !isDoctor && !isAdmin) {
      return sendError(res, 'Unauthorized to view this invoice', 403);
    }

    const pdfBuffer = await generateInvoicePDF(payment.id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${payment.id}.pdf`,
      'Content-Length': pdfBuffer.length
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error('Invoice Generation Error:', error);
    sendError(res, error.message || 'Failed to generate invoice', error.statusCode || 500);
  }
};

// ============================================================
// GET /api/v1/billing/admin/reports
// ============================================================
const getAdminBillingReports = async (req, res) => {
  try {
    // Basic aggregation for the dashboard
    const metrics = await prisma.payment.aggregate({
      _sum: {
        amount: true,
        grossAmount: true,
        platformFee: true,
        taxAmount: true
      },
      _count: {
        id: true
      },
      where: {
        status: 'COMPLETED'
      }
    });

    // Recent Payments
    const recentPayments = await prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          include: {
            patient: { include: { user: { select: { name: true, email: true } } } },
            doctor: { include: { user: { select: { name: true } } } }
          }
        }
      }
    });

    sendSuccess(res, { metrics, recentPayments }, 'Billing reports fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch billing reports', 500);
  }
};

// ============================================================
// GET /api/v1/billing/patient/history
// ============================================================
const getPatientBillingHistory = async (req, res) => {
  try {
    const patientId = req.user.patientId;
    if (!patientId) {
      return sendError(res, 'User is not a patient', 400);
    }

    const history = await prisma.payment.findMany({
      where: {
        appointment: {
          patientId: patientId
        },
        status: 'COMPLETED'
      },
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: { select: { name: true } } } }
          }
        }
      }
    });

    sendSuccess(res, history, 'Patient billing history fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch billing history', 500);
  }
};


module.exports = {
  downloadInvoice,
  getAdminBillingReports,
  getPatientBillingHistory
};
