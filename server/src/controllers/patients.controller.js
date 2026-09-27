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

module.exports = {
  getProfile,
  updateProfile,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getMedicalRecords,
  addMedicalRecord,
};
