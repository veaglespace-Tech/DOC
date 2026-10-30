// src/validators/doctors.validator.js
const { z } = require('zod');

const updateDoctorProfileSchema = z.object({
  name:                z.string().min(2).max(100).optional(),
  phone:               z.string().optional().nullable(),
  gender:              z.string().optional().nullable(),
  profileImage:        z.string().optional().nullable(),
  bio:                 z.string().max(2000).optional().nullable(),
  experienceYears:     z.number().int().min(0).max(70).optional().nullable(),
  consultationFee:     z.number().min(0).optional().nullable(),
  homeVisitFee:        z.number().min(0).optional().nullable(),
  emergencyFee:        z.number().min(0).optional().nullable(),
  serviceRadiusKm:     z.number().min(1).max(100).optional().nullable(),
  isEmergencyAvailable: z.boolean().optional(),
  bankAccountNumber:   z.string().optional().nullable(),
  bankIfsc:            z.string().optional().nullable(),
  bankAccountName:     z.string().optional().nullable(),
  latitude:            z.number().min(-90).max(90).optional().nullable(),
  longitude:           z.number().min(-180).max(180).optional().nullable(),
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
