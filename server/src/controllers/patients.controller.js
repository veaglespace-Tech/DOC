// src/controllers/patients.controller.js
const patientService = require('../services/patients.service');
const { sendSuccess } = require('../utils/response.util');
const asyncHandler = require('../utils/asyncHandler.util');

const getProfile = asyncHandler(async (req, res) => {
  const result = await patientService.getProfile(req.user.patientId);
  return sendSuccess(res, result, 'Patient profile fetched');
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = await patientService.updateProfile(req.user.patientId, req.body);
  return sendSuccess(res, result, 'Profile updated');
});

const addFamilyMember = asyncHandler(async (req, res) => {
  const result = await patientService.addFamilyMember(req.user.patientId, req.body);
  return sendSuccess(res, result, 'Family member added', 201);
});

const updateFamilyMember = asyncHandler(async (req, res) => {
  const memberId = parseInt(req.params.id);
  const result = await patientService.updateFamilyMember(req.user.patientId, memberId, req.body);
  return sendSuccess(res, result, 'Family member updated');
});

const deleteFamilyMember = asyncHandler(async (req, res) => {
  const memberId = parseInt(req.params.id);
  await patientService.deleteFamilyMember(req.user.patientId, memberId);
  return sendSuccess(res, null, 'Family member deleted');
});

const getMedicalRecords = asyncHandler(async (req, res) => {
  const result = await patientService.getMedicalRecords(req.user.patientId);
  return sendSuccess(res, result, 'Medical records fetched');
});

const addMedicalRecord = asyncHandler(async (req, res) => {
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const result = await patientService.addMedicalRecord(req.user.patientId, req.body, fileUrl);
  return sendSuccess(res, result, 'Medical record uploaded', 201);
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const patientId = req.user.patientId;
  const prisma = require('../config/database');
  
  const now = new Date();

  const [upcomingVisits, totalConsultations, newReports, upcomingAppointments, recentMedicalRecords] = await Promise.all([
    prisma.appointment.count({
      where: {
        patientId,
        scheduledAt: { gte: now },
        status: { in: ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS'] }
      }
    }),
    prisma.appointment.count({
      where: {
        patientId,
        status: 'COMPLETED'
      }
    }),
    prisma.medicalRecord.count({
      where: { patientId }
    }),
    prisma.appointment.findMany({
      where: {
        patientId,
        scheduledAt: { gte: now },
        status: { in: ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS'] }
      },
      include: {
        doctor: { select: { name: true, specializations: { select: { specialization: true }, take: 1 } } }
      },
      orderBy: { scheduledAt: 'asc' },
      take: 3
    }),
    prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
      take: 2,
      include: {
        doctor: { select: { name: true, specializations: { select: { specialization: true }, take: 1 } } }
      }
    })
  ]);

  return sendSuccess(res, {
    upcomingVisits,
    totalConsultations,
    newReports,
    upcomingAppointments: upcomingAppointments.map(apt => ({
      id: apt.id,
      doctorName: apt.doctor.name,
      specialty: apt.doctor.specializations?.[0]?.specialization || 'General Physician',
      time: new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(apt.scheduledAt),
      location: apt.serviceType === 'VIRTUAL' ? 'Online' : 'City Heart Hospital',
      status: apt.status === 'CONFIRMED' ? 'Confirmed' : apt.status === 'REQUESTED' ? 'Pending' : 'In Progress'
    })),
    recentMedicalRecords: recentMedicalRecords.map(record => ({
      id: record.id,
      doctorName: record.doctor?.name || 'Uploaded File',
      specialty: record.doctor?.specializations?.[0]?.specialization || 'Clinical Document',
      date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(record.recordedAt),
      diagnosis: record.title || record.notes || 'Medical Record'
    }))
  }, 'Dashboard stats fetched');
});

module.exports = {
  getProfile,
  updateProfile,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getMedicalRecords,
  addMedicalRecord,
  getDashboardStats,
};
