// src/modules/patients/patients.controller.js
const patientService = require('../services/patients.service');
const { sendSuccess, sendError } = require('../utils/response.util');

const getProfile = async (req, res) => {
  // req.user.patientId is set by auth middleware / payload
  if (!req.user.patientId) {
    return sendError(res, 'Patient profile not found for this user', 404);
  }
  const result = await patientService.getProfile(req.user.patientId);
  return sendSuccess(res, result, 'Patient profile fetched');
};

const updateProfile = async (req, res) => {
  if (!req.user.patientId) {
    return sendError(res, 'Patient profile not found for this user', 404);
  }
  const result = await patientService.updateProfile(req.user.patientId, req.body);
  return sendSuccess(res, result, 'Patient profile updated');
};

const addFamilyMember = async (req, res) => {
  if (!req.user.patientId) {
    return sendError(res, 'Patient profile not found', 404);
  }
  const result = await patientService.addFamilyMember(req.user.patientId, req.body);
  return sendSuccess(res, result, 'Family member added', 201);
};

const updateFamilyMember = async (req, res) => {
  if (!req.user.patientId) return sendError(res, 'Patient profile not found', 404);
  const memberId = parseInt(req.params.id);
  const result = await patientService.updateFamilyMember(req.user.patientId, memberId, req.body);
  return sendSuccess(res, result, 'Family member updated');
};

const deleteFamilyMember = async (req, res) => {
  if (!req.user.patientId) return sendError(res, 'Patient profile not found', 404);
  const memberId = parseInt(req.params.id);
  await patientService.deleteFamilyMember(req.user.patientId, memberId);
  return sendSuccess(res, null, 'Family member deleted');
};

const getMedicalRecords = async (req, res) => {
  if (!req.user.patientId) return sendError(res, 'Patient profile not found', 404);
  const result = await patientService.getMedicalRecords(req.user.patientId);
  return sendSuccess(res, result, 'Medical records fetched');
};

const addMedicalRecord = async (req, res) => {
  if (!req.user.patientId) return sendError(res, 'Patient profile not found', 404);

  // Multer attaches the file to req.file
  if (!req.file) {
    return sendError(res, 'File is required', 400);
  }

  // Construct local URL or Cloudinary URL (if implemented later)
  // For local disk storage:
  const fileUrl = `/uploads/${req.file.filename}`;

  const result = await patientService.addMedicalRecord(req.user.patientId, req.body, fileUrl);
  return sendSuccess(res, result, 'Medical record added', 201);
};

module.exports = {
  getProfile,
  updateProfile,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getMedicalRecords,
  addMedicalRecord
};
