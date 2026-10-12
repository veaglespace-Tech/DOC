const prisma = require('../config/database');
const { getIO } = require('../config/socket');
const logger = require('../config/logger');

// Haversine formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Patient triggers SOS Emergency Request
 */
exports.triggerEmergency = async (req, res, next) => {
  try {
    const { latitude, longitude, medicalNeeds } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });

    if (!patient) {
      return res.status(403).json({ success: false, message: 'Only registered patients can trigger emergency SOS' });
    }

    const patientLat = parseFloat(latitude) || 18.5204;
    const patientLng = parseFloat(longitude) || 73.8567;

    // 1. Create Emergency Request
    const emergencyRequest = await prisma.emergencyRequest.create({
      data: {
        patientId: patient.id,
        latitude: patientLat,
        longitude: patientLng,
        medicalNeeds: medicalNeeds || 'Urgent medical assistance requested',
        status: 'SEARCHING'
      }
    });

    // 2. Find eligible doctors
    const doctors = await prisma.doctor.findMany({
      where: {
        verificationStatus: 'APPROVED',
      },
      include: { user: true, specializations: true }
    });

    // Score and rank doctors by distance
    const eligibleDoctors = doctors.map(doc => {
      const docLat = doc.currentLatitude ? parseFloat(doc.currentLatitude) : (patientLat + (Math.random() - 0.5) * 0.05);
      const docLng = doc.currentLongitude ? parseFloat(doc.currentLongitude) : (patientLng + (Math.random() - 0.5) * 0.05);
      const distance = calculateDistance(patientLat, patientLng, docLat, docLng);
      return { ...doc, distance, effectiveLat: docLat, effectiveLng: docLng };
    }).sort((a, b) => a.distance - b.distance);

    // Target the closest doctors (up to 5)
    const targetDoctors = eligibleDoctors.slice(0, 5);

    const assignments = [];
    for (const doc of targetDoctors) {
      const timeoutDate = new Date(Date.now() + 90 * 1000); // 90 seconds timeout
      const assignment = await prisma.emergencyAssignment.create({
        data: {
          emergencyRequestId: emergencyRequest.id,
          doctorId: doc.id,
          status: 'NOTIFIED',
          timeoutAt: timeoutDate
        }
      });
      assignments.push({ ...assignment, doctor: doc });

      // Notify doctor via Socket.IO
      try {
        const io = getIO();
        io.to(`user:${doc.userId}`).emit('emergency:new_dispatch', {
          assignmentId: assignment.id,
          requestId: emergencyRequest.id,
          patientName: patient.name,
          patientPhone: patient.user?.phone || patient.emergencyContact || 'Not provided',
          medicalNeeds: emergencyRequest.medicalNeeds,
          latitude: patientLat,
          longitude: patientLng,
          distanceKm: doc.distance.toFixed(1),
          timeoutAt: timeoutDate
        });
      } catch (sockErr) {
        logger.warn(`Could not emit socket to doctor ${doc.id}: ${sockErr.message}`);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Emergency SOS dispatched to nearest available doctors',
      data: {
        emergencyRequest,
        dispatchedCount: assignments.length,
        nearestDoctorsCount: targetDoctors.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Doctor responds to Emergency Assignment (ACCEPT or REJECT)
 */
exports.respondEmergency = async (req, res, next) => {
  try {
    const { assignmentId, action } = req.body; // action: 'ACCEPT' or 'REJECT'

    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });

    if (!doctor) {
      return res.status(403).json({ success: false, message: 'Unauthorized. Doctor profile required.' });
    }

    const assignment = await prisma.emergencyAssignment.findUnique({
      where: { id: parseInt(assignmentId) },
      include: { request: { include: { patient: { include: { user: true } } } } }
    });

    if (!assignment || assignment.doctorId !== doctor.id) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (action === 'REJECT') {
      await prisma.emergencyAssignment.update({
        where: { id: assignment.id },
        data: { status: 'REJECTED', respondedAt: new Date() }
      });
      return res.status(200).json({ success: true, message: 'Emergency dispatch rejected' });
    }

    if (action === 'ACCEPT') {
      // Check if already assigned to someone else
      if (assignment.request.status === 'DOCTOR_ASSIGNED') {
        return res.status(400).json({ success: false, message: 'Another doctor has already accepted this request' });
      }

      // Mark assignment as accepted
      await prisma.emergencyAssignment.update({
        where: { id: assignment.id },
        data: { status: 'ACCEPTED', respondedAt: new Date() }
      });

      // Mark request as assigned
      const updatedRequest = await prisma.emergencyRequest.update({
        where: { id: assignment.emergencyRequestId },
        data: { status: 'DOCTOR_ASSIGNED' }
      });

      // Auto-create emergency appointment and visit
      const tokenNumber = `EMG-${Math.floor(1000 + Math.random() * 9000)}`;
      const appointment = await prisma.appointment.create({
        data: {
          patientId: assignment.request.patientId,
          doctorId: doctor.id,
          serviceType: 'EMERGENCY',
          scheduledAt: new Date(),
          status: 'DOCTOR_ASSIGNED',
          notes: `Emergency SOS: ${assignment.request.medicalNeeds}`,
          tokenNumber
        }
      });

      // Create initial visit record
      const visit = await prisma.visit.create({
        data: {
          appointmentId: appointment.id,
          doctorLatitude: doctor.currentLatitude || 18.5204,
          doctorLongitude: doctor.currentLongitude || 73.8567,
          startedAt: new Date()
        }
      });

      // Notify patient via Socket.IO
      try {
        const io = getIO();
        io.to(`user:${assignment.request.patient.userId}`).emit('emergency:doctor_assigned', {
          requestId: assignment.emergencyRequestId,
          appointmentId: appointment.id,
          doctor: {
            id: doctor.id,
            name: doctor.name,
            phone: doctor.phone || doctor.user?.phone,
            rating: doctor.rating,
            profileImage: doctor.profileImage,
            currentLatitude: doctor.currentLatitude || 18.5204,
            currentLongitude: doctor.currentLongitude || 73.8567,
          },
          status: 'DOCTOR_ASSIGNED',
          etaMinutes: Math.floor(8 + Math.random() * 10)
        });
      } catch (sockErr) {
        logger.warn(`Could not emit emergency assignment to patient: ${sockErr.message}`);
      }

      return res.status(200).json({
        success: true,
        message: 'Emergency accepted! You are now dispatched to the patient location.',
        data: {
          appointment,
          visit,
          patient: assignment.request.patient
        }
      });
    }

    res.status(400).json({ success: false, message: 'Invalid action. Must be ACCEPT or REJECT.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get status of an emergency request (for patient tracking)
 */
exports.getEmergencyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const emergencyRequest = await prisma.emergencyRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignments: {
          include: {
            doctor: {
              include: { specializations: true }
            }
          }
        },
        patient: { select: { name: true, emergencyContact: true } }
      }
    });

    if (!emergencyRequest) {
      return res.status(404).json({ success: false, message: 'Emergency request not found' });
    }

    const acceptedAssignment = emergencyRequest.assignments.find(a => a.status === 'ACCEPTED');

    res.status(200).json({
      success: true,
      data: {
        ...emergencyRequest,
        assignedDoctor: acceptedAssignment?.doctor || null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch pending emergency assignments for the currently logged-in doctor
 */
exports.getActiveDoctorAlerts = async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(200).json({ success: true, data: [] });
    }

    const alerts = await prisma.emergencyAssignment.findMany({
      where: {
        doctorId: doctor.id,
        status: 'NOTIFIED',
        timeoutAt: { gt: new Date() },
        request: { status: 'SEARCHING' }
      },
      include: {
        request: {
          include: {
            patient: { select: { name: true, phone: true, emergencyContact: true } }
          }
        }
      },
      orderBy: { notifiedAt: 'desc' }
    });

    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
};

/**
 * Live doctor location broadcast during visit / emergency
 */
exports.updateDoctorLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, appointmentId } = req.body;

    const doctor = await prisma.doctor.update({
      where: { userId: req.user.id },
      data: {
        currentLatitude: parseFloat(latitude),
        currentLongitude: parseFloat(longitude),
        isOnline: true
      }
    });

    // Update active visit coordinates if appointmentId provided
    if (appointmentId) {
      await prisma.visit.updateMany({
        where: { appointmentId: parseInt(appointmentId) },
        data: {
          doctorLatitude: parseFloat(latitude),
          doctorLongitude: parseFloat(longitude)
        }
      });

      try {
        const io = getIO();
        io.to(`appointment:${appointmentId}`).emit('doctor:location:update', {
          appointmentId,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        });
      } catch (err) {}
    }

    res.status(200).json({ success: true, message: 'Location updated', data: { latitude, longitude } });
  } catch (error) {
    next(error);
  }
};
