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

    if (prevDoctor.userId) {
      await prisma.user.update({
        where: { id: prevDoctor.userId },
        data: { isVerified: status === 'APPROVED' }
      });
    }

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

/**
 * View live emergency SOS dispatches (BRD Sec 7)
 */
exports.getEmergencyDispatches = async (req, res, next) => {
  try {
    const dispatches = await prisma.emergencyRequest.findMany({
      include: {
        patient: { select: { name: true, emergencyContact: true, user: { select: { email: true, phone: true } } } },
        assignments: {
          include: {
            doctor: { select: { id: true, name: true, phone: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.status(200).json({ success: true, data: dispatches });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Platform Settings (BRD Sec 10, 11, 15)
 */
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.systemSetting.findMany();

    if (settings.length === 0) {
      // Auto-seed default platform settings
      const defaults = [
        { key: 'platform_commission_percent', value: '20', description: 'Platform commission percentage charged on consultations' },
        { key: 'gst_percent', value: '18', description: 'GST rate percentage on platform fee (9% CGST + 9% SGST)' },
        { key: 'settlement_hold_hours', value: '24', description: 'Holding period in hours before doctor earnings mature into available balance' },
        { key: 'emergency_timeout_seconds', value: '90', description: 'Timeout in seconds before doctor emergency dispatch auto-reassigns' },
        { key: 'emergency_search_radius_km', value: '5.0', description: 'Radius in km for broadcasting emergency doctor requests' }
      ];

      for (const item of defaults) {
        await prisma.systemSetting.upsert({
          where: { key: item.key },
          update: {},
          create: item
        });
      }

      settings = await prisma.systemSetting.findMany();
    }

    const configMap = {};
    settings.forEach(s => { configMap[s.key] = s.value; });

    res.status(200).json({ success: true, data: { settings, configMap } });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Platform Settings (BRD Sec 15 & 21)
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const { updates } = req.body; // e.g. { platform_commission_percent: "20", settlement_hold_hours: "24" }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid updates payload' });
    }

    const prevSettings = await prisma.systemSetting.findMany({
      where: { key: { in: Object.keys(updates) } }
    });

    for (const [key, val] of Object.entries(updates)) {
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(val) },
        create: { key, value: String(val), description: `Config ${key}` }
      });
    }

    await logAudit({
      userId: req.user.id,
      userRole: 'ADMIN',
      action: 'PLATFORM_SETTINGS_UPDATED',
      entity: 'SystemSetting',
      prevValue: prevSettings,
      newValue: updates
    });

    res.status(200).json({
      success: true,
      message: 'Platform settings updated successfully',
      data: updates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Comprehensive Financial & Operations Reports (BRD Sec 16)
 * Supports date range filtering, status aggregation, and doctor payouts
 */
exports.getFinancialReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    const paymentWhere = { status: 'CAPTURED' };
    if (startDate || endDate) paymentWhere.capturedAt = dateFilter;

    const appointmentWhere = {};
    if (startDate || endDate) appointmentWhere.createdAt = dateFilter;

    const [paymentSums, refundsSum, totalVisits, completedVisits, cancelledVisits, paymentsList] = await Promise.all([
      prisma.payment.aggregate({
        where: paymentWhere,
        _sum: { grossAmount: true, platformFee: true, taxAmount: true, doctorPayable: true },
        _count: { id: true }
      }),
      prisma.refund.aggregate({
        where: startDate || endDate ? { createdAt: dateFilter } : {},
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.appointment.count({ where: appointmentWhere }),
      prisma.appointment.count({ where: { ...appointmentWhere, status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { ...appointmentWhere, status: { in: ['CANCELLED', 'REFUND'] } } }),
      prisma.payment.findMany({
        where: paymentWhere,
        include: {
          patient: { select: { name: true } },
          appointment: { include: { doctor: { select: { name: true } } } }
        },
        orderBy: { capturedAt: 'desc' },
        take: 100
      })
    ]);

    const grossVolume = parseFloat(paymentSums._sum.grossAmount || 0);
    const platformCommission = parseFloat(paymentSums._sum.platformFee || 0);
    const taxCollected = parseFloat(paymentSums._sum.taxAmount || 0);
    const doctorPayables = parseFloat(paymentSums._sum.doctorPayable || 0);
    const totalRefunds = parseFloat(refundsSum._sum.amount || 0);
    const netPlatformRevenue = parseFloat((platformCommission - totalRefunds).toFixed(2));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          grossVolume,
          platformCommission,
          taxCollected,
          doctorPayables,
          totalRefunds,
          refundsCount: refundsSum._count.id || 0,
          netPlatformRevenue,
          totalPaymentsCount: paymentSums._count.id || 0,
          totalVisits,
          completedVisits,
          cancelledVisits
        },
        recentTransactions: paymentsList
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export Reports to CSV (BRD Sec 16)
 * Supports downloading CSV of Revenue, Appointments, or Doctor Settlements
 */
exports.exportReportCsv = async (req, res, next) => {
  try {
    const { type = 'revenue', startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    let csvRows = [];

    if (type === 'revenue' || type === 'gst' || type === 'financials' || type === 'transactions') {
      const paymentWhere = { status: { in: ['CAPTURED', 'COMPLETED'] } };
      if (startDate || endDate) paymentWhere.capturedAt = dateFilter;

      const payments = await prisma.payment.findMany({
        where: paymentWhere,
        include: {
          patient: { select: { name: true } },
          appointment: { include: { doctor: { select: { name: true } } } }
        },
        orderBy: { capturedAt: 'desc' }
      });

      csvRows.push([
        'Payment ID', 
        'Gateway Order ID', 
        'Patient Name', 
        'Doctor Name', 
        'Doctor Gross Amount (INR)', 
        'Platform Fee (20%)', 
        'Total GST (18%)', 
        'CGST (9%)', 
        'SGST (9%)', 
        'Total Charged (INR)', 
        'Doctor Payable (80%)', 
        'Payment Status', 
        'Transaction Date'
      ]);

      for (const p of payments) {
        const gross = parseFloat(p.grossAmount || 0);
        const fee = parseFloat(p.platformFee || 0);
        const tax = parseFloat(p.taxAmount || 0);
        const cgst = (tax / 2).toFixed(2);
        const sgst = (tax / 2).toFixed(2);
        const totalCharged = (gross + tax).toFixed(2);
        const doctorPay = parseFloat(p.doctorPayable || 0);

        csvRows.push([
          p.id,
          p.gatewayOrderId || 'N/A',
          `"${p.patient?.name || 'Unknown'}"`,
          `"${p.appointment?.doctor?.name || 'Unknown'}"`,
          gross.toFixed(2),
          fee.toFixed(2),
          tax.toFixed(2),
          cgst,
          sgst,
          totalCharged,
          doctorPay.toFixed(2),
          p.status,
          p.capturedAt ? new Date(p.capturedAt).toISOString() : new Date(p.createdAt).toISOString()
        ]);
      }
    } else if (type === 'appointments') {
      const aptWhere = {};
      if (startDate || endDate) aptWhere.createdAt = dateFilter;

      const appointments = await prisma.appointment.findMany({
        where: aptWhere,
        include: {
          patient: { select: { name: true } },
          doctor: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      csvRows.push(['Appointment ID', 'Token', 'Patient', 'Doctor', 'Service Type', 'Scheduled At', 'Status', 'Created At']);
      for (const a of appointments) {
        csvRows.push([
          a.id,
          a.tokenNumber || 'N/A',
          `"${a.patient?.name || 'Unknown'}"`,
          `"${a.doctor?.name || 'Unknown'}"`,
          a.serviceType,
          a.scheduledAt ? new Date(a.scheduledAt).toISOString() : '',
          a.status,
          new Date(a.createdAt).toISOString()
        ]);
      }
    } else if (type === 'settlements' || type === 'withdrawals') {
      const withdrawals = await prisma.withdrawal.findMany({
        include: {
          wallet: { include: { doctor: { select: { name: true } } } }
        },
        orderBy: { requestedAt: 'desc' }
      });

      csvRows.push(['Withdrawal ID', 'Doctor', 'Amount (INR)', 'Bank Account', 'IFSC', 'Status', 'UTR Number', 'Requested At', 'Processed At']);
      for (const w of withdrawals) {
        csvRows.push([
          w.id,
          `"${w.wallet?.doctor?.name || 'Unknown'}"`,
          w.amount,
          w.bankAccount || '',
          w.ifscCode || '',
          w.status,
          w.utrNumber || 'N/A',
          new Date(w.requestedAt).toISOString(),
          w.processedAt ? new Date(w.processedAt).toISOString() : 'Pending'
        ]);
      }
    } else if (type === 'doctors') {
      const doctors = await prisma.doctor.findMany({
        include: {
          user: { select: { email: true, phone: true } },
          specializations: true,
          wallet: true,
          _count: { select: { appointments: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      csvRows.push(['Doctor ID', 'Name', 'Email', 'Phone', 'Reg Number', 'Specializations', 'Status', 'Consult Fee', 'Total Appointments', 'Total Earnings', 'Available Balance', 'Joined At']);
      for (const d of doctors) {
        csvRows.push([
          d.id,
          `"${d.name || ''}"`,
          `"${d.user?.email || ''}"`,
          `"${d.phone || d.user?.phone || ''}"`,
          d.medicalRegNumber || 'N/A',
          `"${d.specializations?.map(s => s.specialization).join('; ') || 'General'}"`,
          d.verificationStatus,
          d.consultationFee || 0,
          d._count.appointments || 0,
          d.wallet?.totalEarnings || 0,
          d.wallet?.availableBalance || 0,
          new Date(d.createdAt).toISOString()
        ]);
      }
    } else if (type === 'patients') {
      const patients = await prisma.patient.findMany({
        include: {
          user: { select: { email: true, phone: true } },
          _count: { select: { appointments: true } },
          payments: { where: { status: 'CAPTURED' }, select: { grossAmount: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      csvRows.push(['Patient ID', 'Name', 'Email', 'Phone', 'Gender', 'Blood Group', 'City', 'Emergency Contact', 'Total Visits', 'Total Spent (INR)', 'Registered At']);
      for (const p of patients) {
        const spent = p.payments.reduce((acc, curr) => acc + parseFloat(curr.grossAmount || 0), 0);
        csvRows.push([
          p.id,
          `"${p.name || ''}"`,
          `"${p.user?.email || ''}"`,
          `"${p.user?.phone || ''}"`,
          p.gender || 'N/A',
          p.bloodGroup || 'N/A',
          `"${p.city || ''}"`,
          `"${p.emergencyContact || ''}"`,
          p._count.appointments || 0,
          spent.toFixed(2),
          new Date(p.createdAt).toISOString()
        ]);
      }
    } else if (type === 'clinics') {
      const orgs = await prisma.organization.findMany({
        include: { plan: true },
        orderBy: { createdAt: 'desc' }
      });

      csvRows.push(['Clinic ID', 'Name', 'Subdomain', 'SaaS Plan', 'Monthly Fee', 'Doctor Quota', 'Status', 'Created At']);
      for (const o of orgs) {
        csvRows.push([
          o.id,
          `"${o.name || ''}"`,
          `"${o.subdomain || ''}"`,
          `"${o.plan?.name || 'Standard'}"`,
          o.plan?.priceMonthly || 0,
          o.plan?.doctorLimit || 'Unlimited',
          o.isActive ? 'ACTIVE' : 'INACTIVE',
          new Date(o.createdAt).toISOString()
        ]);
      }
    }

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=careconnect-${type}-report.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin Patients Directory
 */
exports.getPatientsList = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { user: { email: { contains: search } } },
        { user: { phone: { contains: search } } },
        { city: { contains: search } }
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        user: { select: { email: true, phone: true, isActive: true } },
        _count: {
          select: {
            appointments: true,
            medicalRecords: true,
            familyMembers: true
          }
        },
        payments: {
          where: { status: 'CAPTURED' },
          select: { grossAmount: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = patients.map(p => {
      const totalSpent = p.payments.reduce((acc, curr) => acc + parseFloat(curr.grossAmount || 0), 0);
      return {
        id: p.id,
        name: p.name,
        email: p.user?.email || 'N/A',
        phone: p.user?.phone || 'N/A',
        gender: p.gender || 'Not specified',
        bloodGroup: p.bloodGroup || 'N/A',
        city: p.city || 'N/A',
        emergencyContact: p.emergencyContact || 'N/A',
        totalAppointments: p._count.appointments,
        totalRecords: p._count.medicalRecords,
        familyCount: p._count.familyMembers,
        totalSpent,
        createdAt: p.createdAt
      };
    });

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin Clinics Directory
 */
exports.getClinicsList = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { subdomain: { contains: search } }
      ];
    }

    const organizations = await prisma.organization.findMany({
      where,
      include: {
        plan: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = await Promise.all(organizations.map(async (org) => {
      const doctorCount = await prisma.doctor.count({
        where: { organizationId: org.id }
      });
      const appointmentCount = await prisma.appointment.count({
        where: { doctor: { organizationId: org.id } }
      });
      const paymentAgg = await prisma.payment.aggregate({
        where: {
          status: 'CAPTURED',
          appointment: { doctor: { organizationId: org.id } }
        },
        _sum: { grossAmount: true }
      });

      return {
        id: org.id,
        name: org.name,
        subdomain: org.subdomain,
        plan: org.plan ? {
          name: org.plan.name,
          doctorLimit: org.plan.doctorLimit,
          priceMonthly: parseFloat(org.plan.priceMonthly || 0)
        } : null,
        doctorCount,
        appointmentCount,
        grossRevenue: parseFloat(paymentAgg._sum.grossAmount || 0),
        isActive: org.isActive,
        createdAt: org.createdAt
      };
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin Comprehensive Financial Ledger & Transactions List
 */
exports.getTransactionsList = async (req, res, next) => {
  try {
    const { status, search, startDate, endDate } = req.query;
    const where = {};
    if (status && status !== 'ALL') where.status = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        { gatewayOrderId: { contains: search } },
        { gatewayPaymentId: { contains: search } },
        { patient: { name: { contains: search } } },
        { appointment: { doctor: { name: { contains: search } } } }
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        patient: { select: { id: true, name: true, user: { select: { email: true, phone: true } } } },
        appointment: {
          include: {
            doctor: { select: { id: true, name: true, medicalRegNumber: true } }
          }
        },
        refunds: true
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

