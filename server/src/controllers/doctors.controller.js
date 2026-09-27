// src/controllers/doctors.controller.js
const doctorService = require('../services/doctors.service');
const { sendSuccess, sendError } = require('../utils/response.util');

const getProfile = async (req, res) => {
  if (!req.user.doctorId) {
    return sendError(res, 'Doctor profile not found for this user', 404);
  }
  const result = await doctorService.getProfile(req.user.doctorId);
  return sendSuccess(res, result, 'Doctor profile fetched');
};

const updateProfile = async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const result = await doctorService.updateProfile(req.user.doctorId, req.body);
  return sendSuccess(res, result, 'Doctor profile updated');
};

const addSpecialization = async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const result = await doctorService.addSpecialization(req.user.doctorId, req.body.specialization);
  return sendSuccess(res, result, 'Specialization added', 201);
};

const removeSpecialization = async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const specId = parseInt(req.params.id);
  await doctorService.removeSpecialization(req.user.doctorId, specId);
  return sendSuccess(res, null, 'Specialization removed');
};

const setAvailability = async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const result = await doctorService.setAvailability(req.user.doctorId, req.body);
  return sendSuccess(res, result, 'Availability set', 201);
};

const deleteAvailability = async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  const availabilityId = parseInt(req.params.id);
  await doctorService.deleteAvailability(req.user.doctorId, availabilityId);
  return sendSuccess(res, null, 'Availability removed');
};

const uploadDocument = async (req, res) => {
  if (!req.user.doctorId) return sendError(res, 'Doctor profile not found', 404);
  
  if (!req.file) {
    return sendError(res, 'Document file is required', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const result = await doctorService.uploadDocument(req.user.doctorId, req.body.type, fileUrl);
  return sendSuccess(res, result, 'KYC Document uploaded', 201);
};

module.exports = {
  getProfile,
  updateProfile,
  addSpecialization,
  removeSpecialization,
  setAvailability,
  deleteAvailability,
  uploadDocument
};
