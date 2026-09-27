// src/validators/doctors.validator.js
const { z } = require('zod');

const updateDoctorProfileSchema = z.object({
  name:                z.string().min(2).max(100).optional(),
  bio:                 z.string().max(500).optional(),
  experienceYears:     z.number().int().min(0).max(70).optional(),
  consultationFee:     z.number().min(0).optional(),
  isEmergencyAvailable: z.boolean().optional(),
  latitude:            z.number().min(-90).max(90).optional(),
  longitude:           z.number().min(-180).max(180).optional(),
});

const addSpecializationSchema = z.object({
  specialization: z.string().min(2).max(100),
});

const setAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6), // 0 = Sunday, 6 = Saturday
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  endTime:   z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  isOnline:  z.boolean().default(false),
});

const uploadDocumentSchema = z.object({
  type: z.enum(['MEDICAL_LICENSE', 'DEGREE_CERTIFICATE', 'ID_PROOF', 'CLINIC_REGISTRATION']),
});

module.exports = {
  updateDoctorProfileSchema,
  addSpecializationSchema,
  setAvailabilitySchema,
  uploadDocumentSchema,
};
