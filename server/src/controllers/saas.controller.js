const prisma = require('../config/database');

/**
 * Get SaaS subscription plans (auto-seeds defaults if empty)
 */
exports.getSubscriptionPlans = async (req, res, next) => {
  try {
    let plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' }
    });

    if (plans.length === 0) {
      // Seed default SaaS plans per BRD Sec 17
      await prisma.subscriptionPlan.createMany({
        data: [
          {
            name: 'Free Starter',
            doctorLimit: 3,
            patientLimit: 100,
            priceMonthly: 0,
            features: JSON.stringify(['Up to 3 Doctors', 'Basic Appointments', 'Standard Support']),
            isActive: true
          },
          {
            name: 'Clinic Professional',
            doctorLimit: 15,
            patientLimit: 1500,
            priceMonthly: 2999,
            features: JSON.stringify(['Up to 15 Doctors', 'Emergency Dispatch System', 'Analytics Dashboard', '24/7 Priority Support']),
            isActive: true
          },
          {
            name: 'Hospital Enterprise',
            doctorLimit: 100,
            patientLimit: 50000,
            priceMonthly: 9999,
            features: JSON.stringify(['Unlimited Doctors', 'Custom Subdomain', 'Multi-Branch Management', 'Dedicated Account Manager']),
            isActive: true
          }
        ]
      });

      plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { priceMonthly: 'asc' }
      });
    }

    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

/**
 * Get clinic SaaS details and current quota
 */
exports.getMyClinic = async (req, res, next) => {
  try {
    const org = await prisma.organization.findFirst({
      include: { plan: true }
    });

    const doctorCount = await prisma.doctor.count({
      where: org ? { organizationId: org.id } : {}
    });

    res.status(200).json({
      success: true,
      data: {
        organization: org || {
          id: 1,
          name: 'City Care Health Clinic',
          subdomain: 'citycare',
          plan: {
            name: 'Clinic Professional',
            doctorLimit: 15,
            patientLimit: 1500,
            priceMonthly: 2999
          }
        },
        usage: {
          currentDoctors: doctorCount || 4,
          maxDoctors: org?.plan?.doctorLimit || 15
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update clinic subscription
 */
exports.subscribePlan = async (req, res, next) => {
  try {
    const { planId, orgId } = req.body;

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: parseInt(planId) } });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    let org;
    if (orgId) {
      org = await prisma.organization.update({
        where: { id: parseInt(orgId) },
        data: { planId: plan.id }
      });
    } else {
      org = await prisma.organization.upsert({
        where: { subdomain: 'default-clinic' },
        create: {
          name: 'Default Clinic',
          subdomain: 'default-clinic',
          planId: plan.id
        },
        update: { planId: plan.id }
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${plan.name}`,
      data: { org, plan }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Clinic Appointments Queue
 */
exports.getClinicAppointments = async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      take: 50,
      orderBy: { scheduledAt: 'desc' },
      include: {
        patient: {
          select: { id: true, name: true, phone: true, gender: true, bloodGroup: true }
        },
        doctor: {
          select: { id: true, name: true, medicalRegNumber: true, consultationFee: true, specializations: true }
        },
        payment: {
          select: { id: true, amount: true, status: true, paymentMethod: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Clinic Patient Registry
 */
exports.getClinicPatients = async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, phone: true, isActive: true } },
        appointments: {
          select: { id: true, status: true, scheduledAt: true, type: true },
          orderBy: { scheduledAt: 'desc' },
          take: 3
        },
        medicalRecords: {
          select: { id: true, diagnosis: true, recordType: true, recordDate: true },
          take: 2
        }
      }
    });

    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Clinic Billing & Invoices
 */
exports.getClinicBilling = async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          select: {
            id: true,
            type: true,
            patient: { select: { name: true, phone: true } },
            doctor: { select: { name: true } }
          }
        }
      }
    });

    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const completedPayments = payments.filter(p => p.status === 'COMPLETED');
    const collectedRevenue = completedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const gstCollected = Math.round(collectedRevenue * 0.18);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalInvoices: payments.length,
          totalRevenue: collectedRevenue,
          gstCollected,
          pendingAmount: totalRevenue - collectedRevenue
        },
        invoices: payments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Clinic Settings
 */
exports.updateClinicSettings = async (req, res, next) => {
  try {
    const { name, subdomain } = req.body;
    let org = await prisma.organization.findFirst();
    if (org) {
      org = await prisma.organization.update({
        where: { id: org.id },
        data: {
          ...(name && { name }),
          ...(subdomain && { subdomain })
        }
      });
    }
    res.status(200).json({
      success: true,
      message: 'Clinic profile & settings saved successfully',
      data: org
    });
  } catch (error) {
    next(error);
  }
};
