const prisma = require('../config/database');
const { logAudit } = require('../services/audit.service');

/**
 * Submit review for completed appointment (BRD Sec 19)
 */
exports.submitReview = async (req, res, next) => {
  try {
    const { appointmentId, rating, review } = req.body;
    const appId = parseInt(appointmentId);
    const starRating = parseInt(rating);

    if (!starRating || starRating < 1 || starRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5' });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(403).json({ success: false, message: 'Patient profile required' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appId }
    });

    if (!appointment || appointment.patientId !== patient.id) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Reviews can only be submitted for completed visits' });
    }

    // Upsert review
    const newReview = await prisma.review.upsert({
      where: { appointmentId: appId },
      create: {
        appointmentId: appId,
        patientId: patient.id,
        doctorId: appointment.doctorId,
        rating: starRating,
        review: review || '',
        isPublished: true
      },
      update: {
        rating: starRating,
        review: review || '',
      }
    });

    // Recalculate doctor rating and total reviews
    const allReviews = await prisma.review.findMany({
      where: { doctorId: appointment.doctorId, isPublished: true },
      select: { rating: true }
    });

    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : starRating;

    await prisma.doctor.update({
      where: { id: appointment.doctorId },
      data: {
        rating: parseFloat(avgRating.toFixed(2)),
        totalReviews
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reviews for a doctor
 */
exports.getDoctorReviews = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { doctorId: parseInt(doctorId), isPublished: true },
      include: {
        patient: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a customer support complaint (BRD Sec 19)
 */
exports.submitComplaint = async (req, res, next) => {
  try {
    const { category, description } = req.body;

    if (!category || !description) {
      return res.status(400).json({ success: false, message: 'Category and description are required' });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(403).json({ success: false, message: 'Patient profile required' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        patientId: patient.id,
        category, // Doctor issue, Payment issue, Visit issue, Refund issue, Technical issue, Other
        description,
        status: 'OPEN'
      }
    });

    await logAudit({
      userId: req.user.id,
      userRole: 'PATIENT',
      action: 'COMPLAINT_SUBMITTED',
      entity: 'Complaint',
      entityId: complaint.id,
      newValue: { category }
    });

    res.status(201).json({
      success: true,
      message: 'Complaint lodged successfully. Support team will investigate promptly.',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaints submitted by current patient
 */
exports.getMyComplaints = async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(200).json({ success: true, data: [] });
    }

    const complaints = await prisma.complaint.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};
