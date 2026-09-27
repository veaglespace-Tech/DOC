// src/services/doctors.service.js
const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Get Doctor Profile with nested relations
 */
const getProfile = async (doctorId) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      user: {
        select: { email: true, phone: true, isVerified: true, isActive: true }
      },
      doctorSpecializations: {
        include: { specialization: true }
      },
      doctorAvailabilities: true,
      doctorDocuments: true,
      doctorWallet: true,
    }
  });

  if (!doctor) {
    throw Object.assign(new Error('Doctor not found'), { statusCode: 404 });
  }

  // Format specializations to a simple array
  const formattedDoctor = {
    ...doctor,
    specializations: doctor.doctorSpecializations.map(ds => ds.specialization.name)
  };
  delete formattedDoctor.doctorSpecializations;

  return formattedDoctor;
};

/**
 * Update Doctor Profile
 */
const updateProfile = async (doctorId, data) => {
  const existing = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!existing) {
    throw Object.assign(new Error('Doctor not found'), { statusCode: 404 });
  }

  const updated = await prisma.doctor.update({
    where: { id: doctorId },
    data
  });

  logger.info(`Doctor Service: Updated profile for doctorId=${doctorId}`);
  return updated;
};

/**
 * Add Specialization to Doctor
 */
const addSpecialization = async (doctorId, specializationName) => {
  // Find or create specialization
  let spec = await prisma.specialization.findUnique({
    where: { name: specializationName }
  });

  if (!spec) {
    spec = await prisma.specialization.create({
      data: { name: specializationName, description: '' }
    });
  }

  // Link to doctor (ignore if already linked)
  const existingLink = await prisma.doctorSpecialization.findUnique({
    where: {
      doctorId_specializationId: {
        doctorId,
        specializationId: spec.id
      }
    }
  });

  if (existingLink) {
    throw Object.assign(new Error('Specialization already added'), { statusCode: 400 });
  }

  await prisma.doctorSpecialization.create({
    data: {
      doctorId,
      specializationId: spec.id
    }
  });

  logger.info(`Doctor Service: Added specialization ${specializationName} to doctorId=${doctorId}`);
  return spec;
};

/**
 * Remove Specialization from Doctor
 */
const removeSpecialization = async (doctorId, specializationId) => {
  const existing = await prisma.doctorSpecialization.findUnique({
    where: {
      doctorId_specializationId: { doctorId, specializationId }
    }
  });

  if (!existing) {
    throw Object.assign(new Error('Specialization link not found'), { statusCode: 404 });
  }

  await prisma.doctorSpecialization.delete({
    where: {
      doctorId_specializationId: { doctorId, specializationId }
    }
  });

  logger.info(`Doctor Service: Removed specializationId=${specializationId} from doctorId=${doctorId}`);
};

/**
 * Set Availability Schedule
 */
const setAvailability = async (doctorId, data) => {
  // Check if overlapping slot exists for the same day
  // (Simplified for now - can be expanded for complex overlap logic)
  const existing = await prisma.doctorAvailability.findFirst({
    where: {
      doctorId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime
    }
  });

  if (existing) {
    throw Object.assign(new Error('Availability slot already exists'), { statusCode: 400 });
  }

  const availability = await prisma.doctorAvailability.create({
    data: {
      doctorId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      isOnline: data.isOnline
    }
  });

  return availability;
};

/**
 * Delete Availability Slot
 */
const deleteAvailability = async (doctorId, availabilityId) => {
  const slot = await prisma.doctorAvailability.findFirst({
    where: { id: availabilityId, doctorId }
  });

  if (!slot) {
    throw Object.assign(new Error('Availability slot not found'), { statusCode: 404 });
  }

  await prisma.doctorAvailability.delete({
    where: { id: availabilityId }
  });
};

/**
 * Upload KYC Document
 */
const uploadDocument = async (doctorId, type, fileUrl) => {
  const document = await prisma.doctorDocument.create({
    data: {
      doctorId,
      type,
      fileUrl,
      status: 'PENDING'
    }
  });

  logger.info(`Doctor Service: Uploaded KYC doc (${type}) for doctorId=${doctorId}`);
  return document;
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
