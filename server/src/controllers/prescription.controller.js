const prescriptionService = require('../services/prescription.service');
const { sendSuccess } = require('../utils/response.util');
const asyncHandler = require('../utils/asyncHandler.util');

/**
 * Doctor creates or signs prescription for appointment
 */
const createPrescription = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const result = await prescriptionService.createOrUpdatePrescription(appointmentId, req.user.id, req.body);
  return sendSuccess(res, result, 'Prescription saved and digitally signed successfully', 201);
});

/**
 * Get prescription details for a specific appointment
 */
const getPrescription = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const result = await prescriptionService.getPrescriptionByAppointment(appointmentId);
  return sendSuccess(res, result, 'Prescription details fetched');
});

/**
 * Patient gets all their historical prescriptions
 */
const getMyPrescriptions = asyncHandler(async (req, res) => {
  const result = await prescriptionService.getPatientPrescriptions(req.user.id);
  return sendSuccess(res, result, 'Patient prescriptions fetched');
});

/**
 * Download formal prescription PDF
 */
const downloadPrescriptionPDF = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const pdfBuffer = await prescriptionService.generatePrescriptionPDF(appointmentId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=prescription-${appointmentId}.pdf`);
  res.setHeader('Content-Length', pdfBuffer.length);
  return res.end(pdfBuffer);
});

module.exports = {
  createPrescription,
  getPrescription,
  getMyPrescriptions,
  downloadPrescriptionPDF
};
