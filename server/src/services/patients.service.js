// src/modules/patients/patients.service.js
const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Get Patient Profile
 */
const getProfile = async (patientId) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      user: {
        select: { email: true, phone: true, isVerified: true }
      },
      familyMembers: true
    }
  });

  if (!patient) {
    throw Object.assign(new Error('Patient not found'), { statusCode: 404 });
  }

  return patient;
};

/**
 * Update Patient Profile
 */
const updateProfile = async (patientId, data) => {
  // Check if patient exists
  const existing = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!existing) {
    throw Object.assign(new Error('Patient not found'), { statusCode: 404 });
  }

  // Handle dateOfBirth conversion if provided
  let formattedData = { ...data };
  if (data.dateOfBirth) {
    formattedData.dateOfBirth = new Date(data.dateOfBirth);
  }

  const updated = await prisma.patient.update({
    where: { id: patientId },
    data: formattedData
  });

  logger.info(`Patient Service: Updated profile for patientId=${patientId}`);
  return updated;
};

/**
 * Add Family Member
 */
const addFamilyMember = async (patientId, data) => {
  let formattedData = { ...data, patientId };
  if (data.dateOfBirth) {
    formattedData.dateOfBirth = new Date(data.dateOfBirth);
  }

  const member = await prisma.familyMember.create({
    data: formattedData
  });

  logger.info(`Patient Service: Added family member to patientId=${patientId}`);
  return member;
};

/**
 * Update Family Member
 */
const updateFamilyMember = async (patientId, memberId, data) => {
  const existing = await prisma.familyMember.findFirst({
    where: { id: memberId, patientId }
  });

  if (!existing) {
    throw Object.assign(new Error('Family member not found'), { statusCode: 404 });
  }

  let formattedData = { ...data };
  if (data.dateOfBirth) {
    formattedData.dateOfBirth = new Date(data.dateOfBirth);
  }

  const updated = await prisma.familyMember.update({
    where: { id: memberId },
    data: formattedData
  });

  return updated;
};

/**
 * Delete Family Member
 */
const deleteFamilyMember = async (patientId, memberId) => {
  const existing = await prisma.familyMember.findFirst({
    where: { id: memberId, patientId }
  });

  if (!existing) {
    throw Object.assign(new Error('Family member not found'), { statusCode: 404 });
  }

  await prisma.familyMember.delete({
    where: { id: memberId }
  });

  logger.info(`Patient Service: Deleted family member ${memberId} for patientId=${patientId}`);
};

/**
 * Get Medical Records
 */
const getMedicalRecords = async (patientId) => {
  return await prisma.medicalRecord.findMany({
    where: { patientId },
    orderBy: { recordedAt: 'desc' }
  });
};

/**
 * Upload Medical Record
 */
const addMedicalRecord = async (patientId, data, fileUrl) => {
  const record = await prisma.medicalRecord.create({
    data: {
      patientId,
      title: data.title,
      recordType: data.recordType,
      notes: data.notes,
      recordedAt: new Date(data.recordedAt),
      fileUrl
    }
  });

  logger.info(`Patient Service: Added medical record for patientId=${patientId}`);
  return record;
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
