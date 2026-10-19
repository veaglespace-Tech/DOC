const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('--- 1. Clearing existing operational database records ---');

  try {
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.review.deleteMany();
    await prisma.medicalDocument.deleteMany();
    await prisma.medicalRecord.deleteMany();
    await prisma.prescription.deleteMany();
    await prisma.visit.deleteMany();
    await prisma.handoverRequest.deleteMany();
    await prisma.emergencyAssignment.deleteMany();
    await prisma.emergencyRequest.deleteMany();
    await prisma.walletTransaction.deleteMany();
    await prisma.settlement.deleteMany();
    await prisma.withdrawal.deleteMany();
    await prisma.doctorWallet.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.doctorDocument.deleteMany();
    await prisma.doctorAvailability.deleteMany();
    await prisma.vacationBlock.deleteMany();
    await prisma.doctorSpecialization.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.familyMember.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.otpRecord.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    console.log('All previous database records cleared successfully!');
  } catch (err) {
    console.warn('Clear records error:', err.message);
  }

  console.log('--- 2. Setting up standard platform roles ---');
  const rolesList = ['SUPERADMIN', 'ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'PATIENT'];
  const roleMap = {};

  for (const r of rolesList) {
    const roleRecord = await prisma.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r }
    });
    roleMap[r] = roleRecord.id;
  }

  console.log('--- 3. Creating SaaS Subscription Plan & Organization ---');
  const plan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Clinic Professional Tier',
      doctorLimit: 15,
      patientLimit: 5000,
      priceMonthly: 4999.00,
      isActive: true,
      features: {
        teleconsultation: true,
        emergencySOSNode: true,
        gstBilling: true,
        opdTokenQueue: true,
        customSubdomain: true
      }
    }
  });

  const organization = await prisma.organization.create({
    data: {
      name: 'Apollo Healthcare Clinic',
      subdomain: 'apollo',
      planId: plan.id,
      isActive: true
    }
  });

  console.log('--- 4. Creating 4 Standard Demo Users (Password: Veagle@123) ---');
  const sharedPassword = 'Veagle@123';
  const passwordHash = await bcrypt.hash(sharedPassword, 10);

  // 4.1 Super Admin User
  const adminUser = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      email: 'admin@careconnect.com',
      passwordHash,
      isActive: true,
      isVerified: true,
      userRoles: {
        create: [
          { roleId: roleMap['SUPERADMIN'] },
          { roleId: roleMap['ADMIN'] }
        ]
      }
    }
  });

  // 4.2 Doctor User (Dr. Ritesh Pote)
  const doctorUser = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      email: 'doctor@careconnect.com',
      phone: '+91 98230 11111',
      passwordHash,
      isActive: true,
      isVerified: true,
      userRoles: {
        create: [{ roleId: roleMap['DOCTOR'] }]
      }
    }
  });

  const doctorProfile = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      name: 'Dr. Ritesh Pote',
      phone: '+91 98230 11111',
      gender: 'Male',
      bio: 'Consultant Interventional Cardiologist & General Physician with 10+ years of acute clinical and emergency care experience.',
      medicalRegNumber: 'MCI-2016-88942',
      verificationStatus: 'APPROVED',
      isOnline: true,
      isAvailable: true,
      isEmergencyAvailable: true,
      serviceRadiusKm: 15.00,
      currentLatitude: 18.5204,
      currentLongitude: 73.8567,
      consultationFee: 600.00,
      homeVisitFee: 1200.00,
      emergencyFee: 1500.00,
      experienceYears: 10,
      rating: 4.95,
      totalReviews: 38,
      organizationId: organization.id,
      bankAccountName: 'Dr. Ritesh Pote',
      bankAccountNumber: '9876543210123',
      bankIfsc: 'HDFC0001234',
      specializations: {
        create: [
          { specialization: 'Cardiology' },
          { specialization: 'General Physician' }
        ]
      },
      wallet: {
        create: {
          totalEarnings: 480.00,
          pendingBalance: 0,
          availableBalance: 480.00,
          withdrawnAmount: 0
        }
      }
    }
  });

  // Add a sample KYC Document for doctor awaiting review
  await prisma.doctorDocument.create({
    data: {
      doctorId: doctorProfile.id,
      type: 'LICENSE',
      fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      status: 'PENDING'
    }
  });

  // 4.3 Patient User (Rahul Deshmukh)
  const patientUser = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      email: 'patient@careconnect.com',
      phone: '+91 98220 22222',
      passwordHash,
      isActive: true,
      isVerified: true,
      userRoles: {
        create: [{ roleId: roleMap['PATIENT'] }]
      }
    }
  });

  const patientProfile = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      name: 'Rahul Deshmukh',
      gender: 'Male',
      bloodGroup: 'O+',
      address: 'FC Road, Shivajinagar, Pune, Maharashtra 411005',
      city: 'Pune',
      latitude: 18.5204,
      longitude: 73.8567,
      emergencyContact: '+91 98220 12345'
    }
  });

  // 4.4 Clinic Admin User (Apollo Clinic HQ)
  const clinicUser = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      email: 'clinic@careconnect.com',
      phone: '+91 98220 33333',
      passwordHash,
      isActive: true,
      isVerified: true,
      userRoles: {
        create: [
          { roleId: roleMap['CLINIC_ADMIN'] },
          { roleId: roleMap['ADMIN'] }
        ]
      }
    }
  });

  console.log('--- 5. Seeding Realistic Interactive Healthcare Scenarios ---');

  // Scenario 1: Active Emergency SOS Visit
  const emergencyApt = await prisma.appointment.create({
    data: {
      patientId: patientProfile.id,
      doctorId: doctorProfile.id,
      serviceType: 'EMERGENCY',
      scheduledAt: new Date(),
      status: 'DOCTOR_ASSIGNED',
      notes: 'Urgent: Acute chest tightness and breathlessness.',
      tokenNumber: 'EMG-1024'
    }
  });

  await prisma.visit.create({
    data: {
      appointmentId: emergencyApt.id,
      doctorLatitude: 18.5204,
      doctorLongitude: 73.8567,
      startedAt: new Date()
    }
  });

  // Scenario 2: Active Scheduled Teleconsultation Today
  const upcomingDate = new Date();
  upcomingDate.setHours(upcomingDate.getHours() + 1);
  upcomingDate.setMinutes(30);

  const virtualApt = await prisma.appointment.create({
    data: {
      patientId: patientProfile.id,
      doctorId: doctorProfile.id,
      serviceType: 'VIRTUAL',
      scheduledAt: upcomingDate,
      status: 'PAID',
      notes: 'Follow-up consultation for blood pressure regulation and diet review.',
      tokenNumber: 'TEL-4412'
    }
  });

  // Scenario 3: Completed Past Visit with Full Digital Prescription & 18% GST Payment Invoice
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 3);

  const completedApt = await prisma.appointment.create({
    data: {
      patientId: patientProfile.id,
      doctorId: doctorProfile.id,
      serviceType: 'NORMAL',
      scheduledAt: pastDate,
      status: 'COMPLETED',
      notes: 'Seasonal cough, mild fever, and throat irritation.',
      tokenNumber: 'OPD-8821',
      createdAt: pastDate
    }
  });

  const completedVisit = await prisma.visit.create({
    data: {
      appointmentId: completedApt.id,
      startedAt: pastDate,
      completedAt: pastDate,
      doctorNotes: 'Diagnosed with acute seasonal bronchitis. Throat congestion observed. Vitals stable: BP 122/80, SpO2 99%, Pulse 74 bpm.',
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  // Digital Prescription
  await prisma.prescription.create({
    data: {
      visitId: completedVisit.id,
      doctorId: doctorProfile.id,
      medicines: [
        { id: 1, name: 'Paracetamol', dosage: '650mg', frequency: '1-0-1', duration: '3 Days', instructions: 'After Food' },
        { id: 2, name: 'Amoxicillin + Clavulanic Acid (Augmentin)', dosage: '625mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' },
        { id: 3, name: 'Cetirizine', dosage: '10mg', frequency: '0-0-1', duration: '5 Days', instructions: 'Before Sleep' }
      ],
      notes: 'Drink warm fluids, steam inhalation twice daily. Avoid cold drinks. Review after 5 days if cough persists.',
      signature: 'Dr. Ritesh Pote (Reg: MCI-2016-88942) - Digitally Signed'
    }
  });

  // Payment Record with 18% GST (9% CGST + 9% SGST)
  await prisma.payment.create({
    data: {
      appointmentId: completedApt.id,
      patientId: patientProfile.id,
      grossAmount: 600.00,
      platformFee: 120.00, // 20%
      taxAmount: 108.00,    // 18% GST
      doctorPayable: 480.00,
      gatewayOrderId: 'order_CC_seed_001',
      gatewayPaymentId: 'pay_CC_seed_001',
      gatewaySignature: 'sig_verified_mock',
      status: 'CAPTURED',
      capturedAt: pastDate,
      createdAt: pastDate
    }
  });

  // Patient Medical Record
  await prisma.medicalRecord.create({
    data: {
      patientId: patientProfile.id,
      title: 'Routine Health Checkup & Blood Count',
      recordType: 'LAB_REPORT',
      recordedAt: pastDate,
      notes: 'Complete Blood Count (CBC) and Lipid Profile normal.'
    }
  });

  // Scenario 4: Super Admin Pending Withdrawal
  const doctorWallet = await prisma.doctorWallet.findUnique({ where: { doctorId: doctorProfile.id } });
  if (doctorWallet) {
    await prisma.withdrawal.create({
      data: {
        walletId: doctorWallet.id,
        amount: 480.00,
        bankAccount: '9876543210123',
        ifscCode: 'HDFC0001234',
        status: 'REQUESTED'
      }
    });
  }

  // Scenario 5: Patient Complaint Ticket
  await prisma.complaint.create({
    data: {
      patientId: patientProfile.id,
      category: 'Visit issue',
      description: 'Requesting confirmation on medicine dosage timing for evening schedule.',
      status: 'OPEN'
    }
  });

  console.log('--- ALL SCENARIOS SEEDED SUCCESSFULLY! ---');
  console.log('Users Ready:');
  console.log('1. Super Admin: admin@careconnect.com / Veagle@123');
  console.log('2. Doctor:      doctor@careconnect.com / Veagle@123 (Dr. Ritesh Pote)');
  console.log('3. Patient:     patient@careconnect.com / Veagle@123 (Rahul Deshmukh)');
  console.log('4. Clinic HQ:   clinic@careconnect.com / Veagle@123 (Apollo Healthcare Clinic)');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
