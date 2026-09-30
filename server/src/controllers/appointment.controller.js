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
            doctor: { select: { name: true, specialization: true } },
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

    // Mark Visit as completed
    const visit = await prisma.visit.update({
      where: { appointmentId: parseInt(id) },
      data: {
        completedAt: new Date(),
        doctorNotes,
        followUpDate: followUpDate ? new Date(followUpDate) : null
      }
    });

    // Mark Appointment as completed
    await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: "COMPLETED" }
    });

    res.status(200).json({
      success: true,
      message: "Visit completed successfully",
      data: visit
    });
  } catch (error) {
    next(error);
  }
};
