// src/controllers/doctors.controller.js
const doctorService = require('../services/doctors.service');
const { sendSuccess, sendError } = require('../utils/response.util');
const asyncHandler = require('../utils/asyncHandler.util');

const getProfile = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found for this user', 404);
  const result = await doctorService.getProfile(req.user.doctorId);
  return sendSuccess(res, result, 'Doctor profile fetched');
});

const updateProfile = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const result = await doctorService.updateProfile(req.user.doctorId, req.body);
  return sendSuccess(res, result, 'Doctor profile updated');
});

const addSpecialization = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const result = await doctorService.addSpecialization(req.user.doctorId, req.body.specialization);
  return sendSuccess(res, result, 'Specialization added', 201);
});

const removeSpecialization = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const specId = parseInt(req.params.id);
  await doctorService.removeSpecialization(req.user.doctorId, specId);
  return sendSuccess(res, null, 'Specialization removed');
});

const setAvailability = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const result = await doctorService.setAvailability(req.user.doctorId, req.body);
  return sendSuccess(res, result, 'Availability set', 201);
});

const deleteAvailability = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const availabilityId = parseInt(req.params.id);
  await doctorService.deleteAvailability(req.user.doctorId, availabilityId);
  return sendSuccess(res, null, 'Availability removed');
});

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  if (!req.file) return sendError(res, 'Document file is required', 400);
  const fileUrl = `/uploads/${req.file.filename}`;
  const result = await doctorService.uploadDocument(req.user.doctorId, req.body.type, fileUrl);
  return sendSuccess(res, result, 'KYC Document uploaded', 201);
});

const getDashboardStats = asyncHandler(async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const doctorId = req.user.doctorId;
  const prisma = require('../config/database');

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [todaysAppointments, pendingRequests, emergencyAlerts, schedule, latestEmergency] = await Promise.all([
    prisma.appointment.count({
      where: {
        doctorId,
        scheduledAt: { gte: todayStart, lte: todayEnd },
        status: { notIn: ['CANCELLED', 'DECLINED'] }
      }
    }),
    prisma.appointment.count({
      where: {
        doctorId,
        status: 'REQUESTED'
      }
    }),
    prisma.emergencyRequest.count({
      where: {
        status: 'PENDING'
      }
    }),
    prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledAt: { gte: todayStart, lte: todayEnd },
        status: { notIn: ['CANCELLED', 'DECLINED'] }
      },
      include: {
        patient: { select: { name: true } }
      },
      orderBy: { scheduledAt: 'asc' }
    }),
    prisma.emergencyRequest.findFirst({
      where: {
        status: 'PENDING'
      },
      orderBy: { createdAt: 'desc' },
      include: {
        patient: { select: { name: true } }
      }
    })
  ]);

  // For earnings we check payments today (simplified)
  const payments = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      appointment: { doctorId },
      status: 'COMPLETED',
      createdAt: { gte: todayStart, lte: todayEnd }
    }
  });

  return sendSuccess(res, {
    todaysAppointments,
    pendingRequests,
    todaysEarnings: payments._sum.amount || 0,
    emergencyAlerts,
    latestEmergency,
    schedule: schedule.map(apt => ({
      id: apt.id,
      patientName: apt.patient.name,
      time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(apt.scheduledAt),
      type: apt.serviceType === 'VIRTUAL' ? 'Virtual Consult' : 'Clinic Visit',
      status: apt.status === 'COMPLETED' ? 'Completed' : apt.status === 'IN_PROGRESS' ? 'In Progress' : 'Upcoming'
    }))
  }, 'Dashboard stats fetched');
});

module.exports = {
  getProfile,
  updateProfile,
  addSpecialization,
  removeSpecialization,
  setAvailability,
  deleteAvailability,
  uploadDocument,
  getDashboardStats,
};
