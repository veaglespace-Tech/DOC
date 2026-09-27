// src/routes/doctors.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctors.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { uploadDocument } = require('../middlewares/upload.middleware');
const {
  updateDoctorProfileSchema,
  addSpecializationSchema,
  setAvailabilitySchema,
  uploadDocumentSchema,
} = require('../validators/doctors.validator');

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor Profile, KYC & Availability
 */

// All routes require DOCTOR role
router.use(authenticate);
router.use(authorize('DOCTOR'));

/**
 * @swagger
 * /doctors/profile:
 *   get:
 *     summary: Get current doctor profile
 *     tags: [Doctors]
 *     responses:
 *       200: { description: Doctor profile fetched }
 */
router.get('/profile', controller.getProfile);

/**
 * @swagger
 * /doctors/profile:
 *   put:
 *     summary: Update doctor profile
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:                 { type: string }
 *               bio:                  { type: string }
 *               experienceYears:      { type: integer }
 *               consultationFee:      { type: number }
 *               isEmergencyAvailable: { type: boolean }
 *               latitude:             { type: number }
 *               longitude:            { type: number }
 *     responses:
 *       200: { description: Profile updated }
 */
router.put('/profile', validate(updateDoctorProfileSchema), controller.updateProfile);

/**
 * @swagger
 * /doctors/specializations:
 *   post:
 *     summary: Add specialization
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [specialization]
 *             properties:
 *               specialization: { type: string, example: "Cardiologist" }
 *     responses:
 *       201: { description: Specialization added }
 */
router.post('/specializations', validate(addSpecializationSchema), controller.addSpecialization);

/**
 * @swagger
 * /doctors/specializations/{id}:
 *   delete:
 *     summary: Remove specialization
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Specialization removed }
 */
router.delete('/specializations/:id', controller.removeSpecialization);

/**
 * @swagger
 * /doctors/availability:
 *   post:
 *     summary: Set availability schedule
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dayOfWeek, startTime, endTime]
 *             properties:
 *               dayOfWeek: { type: integer, description: "0=Sun, 6=Sat" }
 *               startTime: { type: string, example: "09:00" }
 *               endTime:   { type: string, example: "13:00" }
 *               isOnline:  { type: boolean, default: false }
 *     responses:
 *       201: { description: Availability set }
 */
router.post('/availability', validate(setAvailabilitySchema), controller.setAvailability);

/**
 * @swagger
 * /doctors/availability/{id}:
 *   delete:
 *     summary: Delete availability slot
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Availability slot removed }
 */
router.delete('/availability/:id', controller.deleteAvailability);

/**
 * @swagger
 * /doctors/kyc:
 *   post:
 *     summary: Upload KYC Document
 *     tags: [Doctors]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [type, file]
 *             properties:
 *               type: { type: string, enum: [MEDICAL_LICENSE, DEGREE_CERTIFICATE, ID_PROOF, CLINIC_REGISTRATION] }
 *               file: { type: string, format: binary }
 *     responses:
 *       201: { description: Document uploaded }
 */
router.post(
  '/kyc',
  uploadDocument.single('file'),
  validate(uploadDocumentSchema),
  controller.uploadDocument
);

module.exports = router;
