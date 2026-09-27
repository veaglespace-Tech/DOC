// src/modules/patients/patients.validator.js
const { z } = require('zod');

const updateProfileSchema = z.object({
  name:             z.string().min(2).max(100).optional(),
  dateOfBirth:      z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  gender:           z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodGroup:       z.string().max(5).optional(),
  address:          z.string().optional(),
  city:             z.string().optional(),
  latitude:         z.number().min(-90).max(90).optional(),
  longitude:        z.number().min(-180).max(180).optional(),
  emergencyContact: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number').optional(),
});

const addFamilyMemberSchema = z.object({
  name:        z.string().min(2).max(100),
  relation:    z.string().min(2).max(50),
  dateOfBirth: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  bloodGroup:  z.string().max(5).optional(),
});

const updateFamilyMemberSchema = z.object({
  name:        z.string().min(2).max(100).optional(),
  relation:    z.string().min(2).max(50).optional(),
  dateOfBirth: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  bloodGroup:  z.string().max(5).optional(),
});

const uploadMedicalRecordSchema = z.object({
  title:      z.string().min(2).max(255),
  recordType: z.enum(['BLOOD_TEST', 'XRAY', 'ECG', 'REPORT', 'SCAN', 'OTHER']),
  notes:      z.string().optional(),
  recordedAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

module.exports = {
  updateProfileSchema,
  addFamilyMemberSchema,
  updateFamilyMemberSchema,
  uploadMedicalRecordSchema
};
