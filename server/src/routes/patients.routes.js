// src/modules/patients/patients.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/patients.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { uploadDocument } = require('../middlewares/upload.middleware');
const {
  updateProfileSchema,
  addFamilyMemberSchema,
  updateFamilyMemberSchema,
  uploadMedicalRecordSchema
} = require('../validators/patients.validator');

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient Profile & Medical History
 */

// All routes here require authentication and PATIENT role
router.use(authenticate);
router.use(authorize('PATIENT'));

/**
 * @swagger
 * /patients/dashboard:
 *   get:
 *     summary: Get patient dashboard statistics
 *     tags: [Patients]
 *     responses:
 *       200: { description: Dashboard stats fetched }
 */
router.get('/dashboard', controller.getDashboardStats);

/**
 * @swagger
 * /patients/profile:
 *   get:
 *     summary: Get current patient profile
 *     tags: [Patients]
 *     responses:
 *       200: { description: Patient profile fetched }
 */
router.get('/profile', controller.getProfile);

/**
 * @swagger
 * /patients/profile:
 *   put:
 *     summary: Update patient profile
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:             { type: string }
 *               dateOfBirth:      { type: string, format: date, example: "1990-01-01" }
 *               gender:           { type: string, enum: [MALE, FEMALE, OTHER] }
 *               bloodGroup:       { type: string, example: "O+" }
 *               address:          { type: string }
 *               city:             { type: string }
 *               latitude:         { type: number }
 *               longitude:        { type: number }
 *               emergencyContact: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 */
router.put('/profile', validate(updateProfileSchema), controller.updateProfile);

/**
 * @swagger
 * /patients/family:
 *   post:
 *     summary: Add a family member
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, relation]
 *             properties:
 *               name:        { type: string }
 *               relation:    { type: string, example: "Father" }
 *               dateOfBirth: { type: string, format: date }
 *               bloodGroup:  { type: string }
 *     responses:
 *       201: { description: Family member added }
 */
router.post('/family', validate(addFamilyMemberSchema), controller.addFamilyMember);

/**
 * @swagger
 * /patients/family/{id}:
 *   put:
 *     summary: Update a family member
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:        { type: string }
 *               relation:    { type: string }
 *               dateOfBirth: { type: string, format: date }
 *               bloodGroup:  { type: string }
 *     responses:
 *       200: { description: Family member updated }
 */
router.put('/family/:id', validate(updateFamilyMemberSchema), controller.updateFamilyMember);

/**
 * @swagger
 * /patients/family/{id}:
 *   delete:
 *     summary: Delete a family member
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Family member deleted }
 */
router.delete('/family/:id', controller.deleteFamilyMember);

/**
 * @swagger
 * /patients/medical-records:
 *   get:
 *     summary: Get all medical records
 *     tags: [Patients]
 *     responses:
 *       200: { description: Medical records fetched }
 */
router.get('/medical-records', controller.getMedicalRecords);

/**
 * @swagger
 * /patients/medical-records:
 *   post:
 *     summary: Upload a medical record
 *     tags: [Patients]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, recordType, recordedAt, file]
 *             properties:
 *               title:      { type: string }
 *               recordType: { type: string, enum: [BLOOD_TEST, XRAY, ECG, REPORT, SCAN, OTHER] }
 *               notes:      { type: string }
 *               recordedAt: { type: string, format: date }
 *               file:       { type: string, format: binary, description: 'PDF or Image up to 10MB' }
 *     responses:
 *       201: { description: Medical record uploaded }
 */
// NOTE: validate() middleware doesn't easily work on multipart/form-data req.body before multer
// So we use multer first, then validate the body
router.post(
  '/medical-records',
  uploadDocument.single('file'),
  validate(uploadMedicalRecordSchema),
  controller.addMedicalRecord
);

module.exports = router;
