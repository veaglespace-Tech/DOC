const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, serviceType, scheduledAt, notes } = req.body;
    
    // Check if the user is a patient
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(403).json({
        success: false,
        message: "Only registered patients can book appointments"
      });
    }

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Generate token number (e.g., T-1234)
    const tokenNumber = `T-${Math.floor(1000 + Math.random() * 9000)}`;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        serviceType,
        scheduledAt: new Date(scheduledAt),
        status: "REQUESTED",
        notes,
        tokenNumber
      }
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyAppointments = async (req, res, next) => {
  try {
    let appointments = [];
    
    // Determine if user is patient or doctor
    const isDoctor = req.user.roles.includes('DOCTOR');
    
    if (isDoctor) {
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
      if (doctor) {
        appointments = await prisma.appointment.findMany({
          where: { doctorId: doctor.id },
          include: {
            patient: { select: { name: true, phone: true } },
            visit: true
          },
          orderBy: { scheduledAt: 'desc' }
        });
      }
    } else {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
      if (patient) {
        appointments = await prisma.appointment.findMany({
          where: { patientId: patient.id },
          include: {
            doctor: { select: { name: true, specializations: { select: { specialization: true } } } },
            visit: true
          },
          orderBy: { scheduledAt: 'desc' }
        });
      }
    }

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        status,
        cancelReason
      }
    });

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.startVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { doctorLatitude, doctorLongitude } = req.body;

    // Check if doctor owns this appointment
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    if (!doctor) return res.status(403).json({ success: false, message: "Unauthorized" });

    const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });
    if (!appointment || appointment.doctorId !== doctor.id) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update appointment status to IN_PROGRESS
    await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: "IN_PROGRESS" }
    });

    // Create Visit record
    const visit = await prisma.visit.create({
      data: {
        appointmentId: parseInt(id),
        startedAt: new Date(),
        doctorLatitude,
        doctorLongitude
      }
    });

    res.status(200).json({
      success: true,
      message: "Visit started successfully",
      data: visit
    });
  } catch (error) {
    next(error);
  }
};

exports.completeVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { doctorNotes, followUpDate } = req.body;
    const appointmentId = parseInt(id);

    // 1. Mark Visit as completed
    const visit = await prisma.visit.update({
      where: { appointmentId },
      data: {
        completedAt: new Date(),
        doctorNotes,
        followUpDate: followUpDate ? new Date(followUpDate) : null
      }
    });

    // 2. Mark Appointment as completed
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
      include: { doctor: true, payment: true }
    });

    // 3. Credit Doctor Wallet with 24-hour Settlement Hold (BRD Sec 11 & 12)
    const doctorFee = appointment.payment?.doctorPayable 
      ? parseFloat(appointment.payment.doctorPayable) 
      : (parseFloat(appointment.doctor.consultationFee) || 500);

    // Ensure doctor wallet exists
    let wallet = await prisma.doctorWallet.findUnique({
      where: { doctorId: appointment.doctorId }
    });

    if (!wallet) {
      wallet = await prisma.doctorWallet.create({
        data: {
          doctorId: appointment.doctorId,
          totalEarnings: 0,
          pendingBalance: 0,
          availableBalance: 0,
          withdrawnAmount: 0
        }
      });
    }

    // 24-Hour Settlement Hold per BRD Sec 11
    const holdUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.doctorWallet.update({
        where: { id: wallet.id },
        data: {
          totalEarnings: { increment: doctorFee },
          pendingBalance: { increment: doctorFee }
        }
      }),
      prisma.settlement.create({
        data: {
          walletId: wallet.id,
          amount: doctorFee,
          holdUntil,
          status: 'HOLDING'
        }
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          paymentId: appointment.payment?.id || null,
          type: 'CREDIT',
          amount: doctorFee,
          description: `Consultation fee for Appointment #${appointment.id} (Token: ${appointment.tokenNumber || 'N/A'}) - 24h settlement hold applied`,
          referenceId: `APP-${appointment.id}`
        }
      })
    ]);

    res.status(200).json({
      success: true,
      message: "Visit completed successfully. Doctor earnings credited to wallet under 24h settlement hold.",
      data: { visit, appointment, creditedAmount: doctorFee, holdUntil }
    });
  } catch (error) {
    next(error);
  }
};
