const prisma = require('../config/database');
const { logAudit } = require('../services/audit.service');

/**
 * Super Admin Overview Analytics & Stats (BRD Sec 15)
 */
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      activeDoctors,
      pendingDoctors,
      totalAppointments,
      todayAppointments,
      emergencyRequests,
      paymentMetrics,
      pendingWithdrawals,
      openComplaints
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.doctor.count({ where: { verificationStatus: 'APPROVED' } }),
      prisma.doctor.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.emergencyRequest.count(),
      prisma.payment.aggregate({
        where: { status: 'CAPTURED' },
        _sum: {
          grossAmount: true,
          platformFee: true,
          taxAmount: true,
          doctorPayable: true
        }
      }),
      prisma.withdrawal.count({ where: { status: 'REQUESTED' } }),
      prisma.complaint.count({ where: { status: 'OPEN' } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        activeDoctors,
        pendingDoctors,
        totalAppointments,
        todayAppointments,
        emergencyRequests,
        financials: {
          grossRevenue: paymentMetrics._sum.grossAmount || 0,
          platformCommission: paymentMetrics._sum.platformFee || 0,
          taxCollected: paymentMetrics._sum.taxAmount || 0,
          doctorPayouts: paymentMetrics._sum.doctorPayable || 0,
        },
        pendingWithdrawals,
        openComplaints
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all doctors with documents and verification status
 */
exports.getDoctorsList = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const whereClause = {};
    if (status) whereClause.verificationStatus = status;
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { user: { email: { contains: search } } }
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      include: {
        user: { select: { email: true, phone: true, isActive: true } },
        specializations: true,
        documents: true,
        wallet: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify or Reject a doctor KYC
 */
exports.verifyDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewNote } = req.body; // 'APPROVED' or 'REJECTED'
    const doctorId = parseInt(id);

    const prevDoctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!prevDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        verificationStatus: status,
        isAvailable: status === 'APPROVED',
        isEmergencyAvailable: status === 'APPROVED',
        kycApprovedAt: status === 'APPROVED' ? new Date() : null
      }
    });

    // Update documents review status
    await prisma.doctorDocument.updateMany({
      where: { doctorId },
      data: {
        status,
        reviewNote: reviewNote || null,
        reviewedAt: new Date(),
        reviewedBy: req.user.id
      }
    });

    await logAudit({
      userId: req.user.id,
      userRole: 'ADMIN',
      action: status === 'APPROVED' ? 'DOCTOR_KYC_APPROVED' : 'DOCTOR_KYC_REJECTED',
      entity: 'Doctor',
      entityId: doctorId,
      prevValue: { verificationStatus: prevDoctor.verificationStatus },
      newValue: { verificationStatus: status, reviewNote }
    });

    res.status(200).json({
      success: true,
      message: `Doctor status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all withdrawal requests
 */
exports.getWithdrawalsList = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const withdrawals = await prisma.withdrawal.findMany({
      where,
      include: {
        wallet: {
          include: {
            doctor: {
              include: { user: { select: { email: true, phone: true } } }
            }
          }
        }
      },
      orderBy: { requestedAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve or Reject a Withdrawal
 */
exports.updateWithdrawalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, utrNumber, rejectReason } = req.body; // 'COMPLETED' or 'REJECTED'
    const withdrawalId = parseInt(id);

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { wallet: true }
    });

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
    }

    if (status === 'COMPLETED') {
      const updated = await prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'COMPLETED',
          utrNumber: utrNumber || `UTR-${Date.now()}`,
          processedAt: new Date()
        }
      });

      await logAudit({
        userId: req.user.id,
        userRole: 'ADMIN',
        action: 'WITHDRAWAL_APPROVED',
        entity: 'Withdrawal',
        entityId: withdrawalId,
        newValue: { utrNumber }
      });

      return res.status(200).json({ success: true, message: 'Withdrawal marked as completed', data: updated });
    }

    if (status === 'REJECTED') {
      // Revert amount back to availableBalance
      const refundAmount = parseFloat(withdrawal.amount);

      await prisma.$transaction([
        prisma.doctorWallet.update({
          where: { id: withdrawal.walletId },
          data: {
            availableBalance: { increment: refundAmount },
            withdrawnAmount: { decrement: refundAmount }
          }
        }),
        prisma.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: 'REJECTED',
            rejectReason: rejectReason || 'Rejected by Admin',
            processedAt: new Date()
          }
        }),
        prisma.walletTransaction.create({
          data: {
            walletId: withdrawal.walletId,
            type: 'CREDIT',
            amount: refundAmount,
            description: `Reversal for rejected withdrawal #${withdrawalId}`,
            referenceId: `REV-${withdrawalId}`
          }
        })
      ]);

      await logAudit({
        userId: req.user.id,
        userRole: 'ADMIN',
        action: 'WITHDRAWAL_REJECTED',
        entity: 'Withdrawal',
        entityId: withdrawalId,
        newValue: { rejectReason }
      });

      return res.status(200).json({ success: true, message: 'Withdrawal rejected and funds refunded to doctor wallet' });
    }

    res.status(400).json({ success: false, message: 'Invalid status' });
  } catch (error) {
    next(error);
  }
};

/**
 * List complaints
 */
exports.getComplaintsList = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        patient: { select: { name: true, user: { select: { email: true, phone: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint status
 */
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'IN_PROGRESS', 'RESOLVED', 'CLOSED'

    const updated = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : null,
        assignedTo: req.user.id
      }
    });

    res.status(200).json({ success: true, message: `Complaint status updated to ${status}`, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * View audit logs trail (BRD Sec 21)
 */
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
