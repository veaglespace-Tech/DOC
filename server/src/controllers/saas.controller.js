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
