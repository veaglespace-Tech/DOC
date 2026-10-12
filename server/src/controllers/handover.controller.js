const prisma = require('../config/database');
const { getIO } = require('../config/socket');
const { logAudit } = require('../services/audit.service');

/**
 * Doctor initiates a handover request
 */
exports.createHandoverRequest = async (req, res, next) => {
  try {
    const { appointmentId, toDoctorId, reason } = req.body;

    const fromDoctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!fromDoctor) {
      return res.status(403).json({ success: false, message: 'Unauthorized. Doctor profile required.' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: { patient: { include: { user: true } } }
    });

    if (!appointment || appointment.doctorId !== fromDoctor.id) {
      return res.status(404).json({ success: false, message: 'Appointment not found or not assigned to you' });
    }

    const handover = await prisma.handoverRequest.create({
      data: {
        appointmentId: appointment.id,
        fromDoctorId: fromDoctor.id,
        toDoctorId: toDoctorId ? parseInt(toDoctorId) : null,
        reason: reason || 'Schedule conflict / Emergency',
        status: 'PENDING',
        patientNotified: true
      },
      include: {
        fromDoctor: { select: { name: true } },
        toDoctor: { select: { name: true } }
      }
    });

    // Notify target doctor if specified
    if (toDoctorId) {
      const targetDoc = await prisma.doctor.findUnique({ where: { id: parseInt(toDoctorId) } });
      if (targetDoc) {
        try {
          const io = getIO();
          io.to(`user:${targetDoc.userId}`).emit('handover:incoming', {
            handoverId: handover.id,
            appointmentId: appointment.id,
            fromDoctorName: fromDoctor.name,
            reason: handover.reason,
            patientName: appointment.patient.name,
            scheduledAt: appointment.scheduledAt
          });
        } catch (err) {}
      }
    }

    // Notify patient about handover initiation
    try {
      const io = getIO();
      io.to(`user:${appointment.patient.userId}`).emit('handover:status', {
        appointmentId: appointment.id,
        status: 'HANDOVER_INITIATED',
        message: `Dr. ${fromDoctor.name} has requested a handover for your appointment due to: ${handover.reason}`
      });
    } catch (err) {}

    await logAudit({
      userId: req.user.id,
      userRole: 'DOCTOR',
      action: 'HANDOVER_INITIATED',
      entity: 'HandoverRequest',
      entityId: handover.id,
      newValue: { appointmentId: appointment.id, reason: handover.reason, toDoctorId }
    });

    res.status(201).json({
      success: true,
      message: 'Handover request created and sent for acceptance',
      data: handover
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Target doctor responds to Handover request (ACCEPT or REJECT)
 */
exports.respondHandover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'ACCEPT' or 'REJECT'

    const respondingDoctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!respondingDoctor) {
      return res.status(403).json({ success: false, message: 'Doctor profile required.' });
    }

    const handover = await prisma.handoverRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        appointment: { include: { patient: { include: { user: true } } } },
        fromDoctor: true
      }
    });

    if (!handover || handover.status !== 'PENDING') {
      return res.status(404).json({ success: false, message: 'Handover request not found or already processed' });
    }

    if (action === 'REJECT') {
      await prisma.handoverRequest.update({
        where: { id: handover.id },
        data: { status: 'REJECTED' }
      });
      return res.status(200).json({ success: true, message: 'Handover rejected' });
    }

    if (action === 'ACCEPT') {
      // Transfer assignment while preserving handover audit record
      await prisma.$transaction([
        prisma.handoverRequest.update({
          where: { id: handover.id },
          data: {
            status: 'ACCEPTED',
            toDoctorId: respondingDoctor.id
          }
        }),
        prisma.appointment.update({
          where: { id: handover.appointmentId },
          data: {
            doctorId: respondingDoctor.id
          }
        })
      ]);

      // Notify patient of new assigned doctor
      try {
        const io = getIO();
        io.to(`user:${handover.appointment.patient.userId}`).emit('handover:completed', {
          appointmentId: handover.appointmentId,
          newDoctor: {
            id: respondingDoctor.id,
            name: respondingDoctor.name,
            phone: respondingDoctor.phone
          },
          message: `Your appointment has been successfully transferred to Dr. ${respondingDoctor.name}`
        });
      } catch (err) {}

      await logAudit({
        userId: req.user.id,
        userRole: 'DOCTOR',
        action: 'HANDOVER_ACCEPTED',
        entity: 'HandoverRequest',
        entityId: handover.id,
        newValue: { appointmentId: handover.appointmentId, transferredTo: respondingDoctor.id }
      });

      return res.status(200).json({
        success: true,
        message: `Handover accepted! You are now assigned to Appointment #${handover.appointmentId}`,
        data: { appointmentId: handover.appointmentId, newDoctorId: respondingDoctor.id }
      });
    }

    res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor's handover requests (incoming and outgoing)
 */
exports.getMyHandovers = async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(403).json({ success: false, message: 'Doctor profile required' });
    }

    const outgoing = await prisma.handoverRequest.findMany({
      where: { fromDoctorId: doctor.id },
      include: {
        toDoctor: { select: { id: true, name: true } },
        appointment: { select: { id: true, scheduledAt: true, tokenNumber: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const incoming = await prisma.handoverRequest.findMany({
      where: {
        OR: [
          { toDoctorId: doctor.id },
          { toDoctorId: null, status: 'PENDING' }
        ]
      },
      include: {
        fromDoctor: { select: { id: true, name: true, phone: true } },
        appointment: {
          select: {
            id: true,
            scheduledAt: true,
            tokenNumber: true,
            serviceType: true,
            patient: { select: { name: true, phone: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: { outgoing, incoming }
    });
  } catch (error) {
    next(error);
  }
};
