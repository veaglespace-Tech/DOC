const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getIO } = require('../config/socket');
const { logAudit } = require('../services/audit.service');
const logger = require('../config/logger');

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

    try {
      const io = getIO();
      io.to(`user:${doctor.userId}`).emit('appointment:new_booking', {
        appointmentId: appointment.id,
        patientName: patient.name,
        serviceType,
        scheduledAt,
        tokenNumber
      });
    } catch {}

    await logAudit({
      userId: req.user.id,
      userRole: 'PATIENT',
      action: 'APPOINTMENT_CREATED',
      entity: 'Appointment',
      entityId: appointment.id,
      newValue: { doctorId, serviceType, scheduledAt, tokenNumber }
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
    
    // Determine if user is doctor
    const isDoctor = req.user.roles && req.user.roles.includes('DOCTOR');
    
    if (isDoctor) {
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
      if (doctor) {
        appointments = await prisma.appointment.findMany({
          where: { doctorId: doctor.id },
          include: {
            patient: { 
              select: { 
                id: true,
                name: true, 
                address: true,
                city: true,
                latitude: true,
                longitude: true,
                emergencyContact: true,
                bloodGroup: true,
                gender: true,
                user: { select: { phone: true, email: true } }
              } 
            },
            visit: true,
            payment: true
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
            doctor: { 
              select: { 
                id: true,
                name: true, 
                phone: true,
                profileImage: true,
                consultationFee: true,
                specializations: { select: { specialization: true } } 
              } 
            },
            visit: true,
            payment: true
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
    const { status, cancelReason, doctorLatitude, doctorLongitude } = req.body;
    const appointmentId = parseInt(id);

    const prev = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        visit: true
      }
    });

    if (!prev) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        cancelReason: cancelReason || prev.cancelReason
      }
    });

    // Handle Visit milestone timestamps per BRD Sec 8 (ON_THE_WAY, ARRIVED)
    if (status === 'ARRIVED') {
      if (prev.visit) {
        await prisma.visit.update({
          where: { appointmentId },
          data: { arrivedAt: new Date() }
        });
      } else {
        await prisma.visit.create({
          data: {
            appointmentId,
            arrivedAt: new Date(),
            doctorLatitude: doctorLatitude ? parseFloat(doctorLatitude) : prev.doctor.currentLatitude,
            doctorLongitude: doctorLongitude ? parseFloat(doctorLongitude) : prev.doctor.currentLongitude
          }
        });
      }
    } else if (status === 'ON_THE_WAY') {
      if (!prev.visit) {
        await prisma.visit.create({
          data: {
            appointmentId,
            doctorLatitude: doctorLatitude ? parseFloat(doctorLatitude) : prev.doctor.currentLatitude,
            doctorLongitude: doctorLongitude ? parseFloat(doctorLongitude) : prev.doctor.currentLongitude
          }
        });
      }
    }

    // Broadcast real-time Socket event to patient and appointment room
    try {
      const io = getIO();
      const payload = {
        appointmentId,
        status,
        cancelReason,
        tokenNumber: appointment.tokenNumber,
        timestamp: new Date().toISOString()
      };
      if (prev.patient?.user?.id) {
        io.to(`user:${prev.patient.user.id}`).emit('appointment:status:update', payload);
      }
      if (prev.doctor?.user?.id) {
        io.to(`user:${prev.doctor.user.id}`).emit('appointment:status:update', payload);
      }
      io.to(`appointment:${appointmentId}`).emit('appointment:status:update', payload);
    } catch (sockErr) {
      logger.warn('Socket notification error on appointment update:', sockErr.message);
    }

    await logAudit({
      userId: req.user.id,
      userRole: (req.user.roles && req.user.roles[0]) || 'USER',
      action: 'APPOINTMENT_STATUS_UPDATE',
      entity: 'Appointment',
      entityId: appointmentId,
      prevValue: { status: prev.status },
      newValue: { status, cancelReason }
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
    const appointmentId = parseInt(id);

    // Check if doctor owns this appointment
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    if (!doctor) return res.status(403).json({ success: false, message: "Unauthorized" });

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: { include: { user: true } }, visit: true }
    });

    if (!appointment || appointment.doctorId !== doctor.id) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update appointment status to IN_PROGRESS
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "IN_PROGRESS" }
    });

    // Create or update Visit record
    let visit;
    if (appointment.visit) {
      visit = await prisma.visit.update({
        where: { appointmentId },
        data: {
          startedAt: new Date(),
          doctorLatitude: doctorLatitude !== undefined ? parseFloat(doctorLatitude) : appointment.visit.doctorLatitude,
          doctorLongitude: doctorLongitude !== undefined ? parseFloat(doctorLongitude) : appointment.visit.doctorLongitude
        }
      });
    } else {
      visit = await prisma.visit.create({
        data: {
          appointmentId,
          startedAt: new Date(),
          doctorLatitude: doctorLatitude !== undefined ? parseFloat(doctorLatitude) : doctor.currentLatitude,
          doctorLongitude: doctorLongitude !== undefined ? parseFloat(doctorLongitude) : doctor.currentLongitude
        }
      });
    }

    try {
      const io = getIO();
      const payload = { appointmentId, status: 'IN_PROGRESS', startedAt: visit.startedAt };
      if (appointment.patient?.user?.id) {
        io.to(`user:${appointment.patient.user.id}`).emit('appointment:status:update', payload);
      }
      io.to(`appointment:${appointmentId}`).emit('appointment:status:update', payload);
    } catch {}

    await logAudit({
      userId: req.user.id,
      userRole: 'DOCTOR',
      action: 'VISIT_STARTED',
      entity: 'Appointment',
      entityId: appointmentId,
      newValue: { startedAt: visit.startedAt }
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
    const visit = await prisma.visit.upsert({
      where: { appointmentId },
      update: {
        completedAt: new Date(),
        doctorNotes,
        followUpDate: followUpDate ? new Date(followUpDate) : null
      },
      create: {
        appointmentId,
        startedAt: new Date(),
        completedAt: new Date(),
        doctorNotes,
        followUpDate: followUpDate ? new Date(followUpDate) : null
      }
    });

    // 2. Mark Appointment as completed
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
      include: { doctor: true, payment: true, patient: { include: { user: true } } }
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

    // Dynamic settlement hold from DB setting or default 24h
    let holdHours = 24;
    try {
      const holdSetting = await prisma.systemSetting.findUnique({ where: { key: 'settlement_hold_hours' } });
      if (holdSetting) holdHours = parseFloat(holdSetting.value) || 24;
    } catch {}

    const holdUntil = new Date(Date.now() + holdHours * 60 * 60 * 1000);

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
          description: `Consultation fee for Appointment #${appointment.id} (Token: ${appointment.tokenNumber || 'N/A'}) - ${holdHours}h settlement hold applied`,
          referenceId: `APP-${appointment.id}`
        }
      })
    ]);

    try {
      const io = getIO();
      const payload = { appointmentId, status: 'COMPLETED', completedAt: visit.completedAt };
      if (appointment.patient?.user?.id) {
        io.to(`user:${appointment.patient.user.id}`).emit('appointment:status:update', payload);
      }
      io.to(`appointment:${appointmentId}`).emit('appointment:status:update', payload);
    } catch {}

    await logAudit({
      userId: req.user.id,
      userRole: 'DOCTOR',
      action: 'VISIT_COMPLETED',
      entity: 'Appointment',
      entityId: appointmentId,
      newValue: { completedAt: visit.completedAt, creditedAmount: doctorFee, holdUntil }
    });

    res.status(200).json({
      success: true,
      message: `Visit completed successfully. Doctor earnings credited to wallet under ${holdHours}h settlement hold.`,
      data: { visit, appointment, creditedAmount: doctorFee, holdUntil }
    });
  } catch (error) {
    next(error);
  }
};

