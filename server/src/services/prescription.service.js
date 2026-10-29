const PDFDocument = require('pdfkit-table');
const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Create or update prescription for an appointment
 */
const createOrUpdatePrescription = async (appointmentId, doctorUserId, data) => {
  const { diagnosis, medicines, notes } = data;

  const doctor = await prisma.doctor.findUnique({
    where: { userId: doctorUserId },
    include: { specializations: true }
  });

  if (!doctor) {
    throw Object.assign(new Error('Doctor profile not found'), { statusCode: 403 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(appointmentId) },
    include: { patient: { include: { user: true } }, visit: true }
  });

  if (!appointment) {
    throw Object.assign(new Error('Appointment not found'), { statusCode: 404 });
  }

  if (appointment.doctorId !== doctor.id) {
    throw Object.assign(new Error('Unauthorized: You are not the assigned doctor for this appointment'), { statusCode: 403 });
  }

  // Ensure a Visit record exists
  let visit = appointment.visit;
  if (!visit) {
    visit = await prisma.visit.create({
      data: {
        appointmentId: appointment.id,
        startedAt: new Date(),
        doctorNotes: diagnosis || notes || 'Consultation conducted'
      }
    });
  } else if (diagnosis || notes) {
    visit = await prisma.visit.update({
      where: { id: visit.id },
      data: { doctorNotes: diagnosis || notes }
    });
  }

  const doctorName = doctor.name ? (doctor.name.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`) : 'Doctor';
  const signatureText = `Digitally Signed by ${doctorName} | Reg: ${doctor.medicalRegNumber || 'MCI-DOCTOR-ON-CALL'}`;

  // Find existing prescription or create new
  let prescription = await prisma.prescription.findFirst({
    where: { visitId: visit.id }
  });

  if (prescription) {
    prescription = await prisma.prescription.update({
      where: { id: prescription.id },
      data: {
        medicines,
        notes: notes || diagnosis,
        signature: signatureText
      }
    });
  } else {
    prescription = await prisma.prescription.create({
      data: {
        visitId: visit.id,
        doctorId: doctor.id,
        medicines,
        notes: notes || diagnosis,
        signature: signatureText
      }
    });
  }

  // Sync to Patient Medical Records
  try {
    const medSummary = Array.isArray(medicines) 
      ? medicines.map(m => `${m.drug?.name || m.name || 'Medicine'} (${m.dosage || ''}) - ${m.frequency || ''}`).join(', ')
      : 'Prescribed Medications';

    await prisma.medicalRecord.create({
      data: {
        patientId: appointment.patientId,
        title: `Prescription: ${diagnosis || 'General Consultation'} (Dr. ${doctor.name})`,
        recordType: 'PRESCRIPTION',
        notes: `Diagnosis: ${diagnosis || 'N/A'}\nMedications: ${medSummary}\nAdvice: ${notes || 'Follow prescription as advised.'}`,
        recordedAt: new Date()
      }
    });
  } catch (ehrErr) {
    logger.warn('Could not sync prescription to patient medical records:', ehrErr.message);
  }

  return {
    prescription,
    visit,
    patient: appointment.patient,
    doctor
  };
};

/**
 * Get prescription by Appointment ID
 */
const getPrescriptionByAppointment = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(appointmentId) },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { specializations: true } },
      visit: {
        include: {
          prescriptions: true
        }
      }
    }
  });

  if (!appointment) {
    throw Object.assign(new Error('Appointment not found'), { statusCode: 404 });
  }

  const prescription = appointment.visit?.prescriptions?.[0] || null;

  return {
    appointmentId: appointment.id,
    tokenNumber: appointment.tokenNumber,
    scheduledAt: appointment.scheduledAt,
    serviceType: appointment.serviceType,
    patient: appointment.patient,
    doctor: appointment.doctor,
    visit: appointment.visit,
    prescription
  };
};

/**
 * Get all prescriptions for a Patient
 */
const getPatientPrescriptions = async (patientUserId) => {
  const patient = await prisma.patient.findUnique({
    where: { userId: patientUserId }
  });

  if (!patient) {
    throw Object.assign(new Error('Patient profile not found'), { statusCode: 403 });
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      visit: {
        prescriptions: { some: {} }
      }
    },
    include: {
      doctor: { select: { id: true, name: true, profileImage: true, specializations: true } },
      visit: {
        include: {
          prescriptions: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    },
    orderBy: { scheduledAt: 'desc' }
  });

  const prescriptions = [];
  appointments.forEach(apt => {
    if (apt.visit && apt.visit.prescriptions.length > 0) {
      apt.visit.prescriptions.forEach(p => {
        prescriptions.push({
          id: p.id,
          appointmentId: apt.id,
          tokenNumber: apt.tokenNumber,
          date: p.createdAt,
          doctorName: apt.doctor.name,
          doctorSpecialty: apt.doctor.specializations?.[0]?.specialization || 'General Physician',
          medicines: p.medicines,
          notes: p.notes,
          signature: p.signature
        });
      });
    }
  });

  return prescriptions;
};

/**
 * Generate PDF Prescription Document
 */
const generatePrescriptionPDF = async (appointmentId) => {
  const data = await getPrescriptionByAppointment(appointmentId);
  const { prescription, doctor, patient, appointmentId: appId, tokenNumber } = data;

  if (!prescription) {
    throw Object.assign(new Error('No prescription found for this appointment'), { statusCode: 404 });
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- HEADER & CLINICAL BANNER ---
      doc.fillColor('#0d9488')
         .fontSize(22)
         .text('Doctor On Call Healthcare', { align: 'left' });
      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Official Digital Medical Consultation & e-Prescription')
         .moveDown(0.5);

      doc.strokeColor('#0d9488').lineWidth(2).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(1);

      // Doctor Information (Left) & Appointment Details (Right)
      const topY = doc.y;
      
      doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold');
      doc.text(`Dr. ${doctor.name}`, 40, topY);
      doc.fontSize(9).font('Helvetica').fillColor('#475569');
      const specialty = doctor.specializations?.[0]?.specialization || 'General Physician';
      doc.text(`${specialty} • ${doctor.bio && doctor.bio.includes('\n') ? doctor.bio.split('\n')[0] : 'MBBS, MD'}`);
      doc.text(`Reg No: ${doctor.medicalRegNumber || 'MCI-2024-CC'}`);

      // Right box: Date & Token
      doc.fontSize(9).fillColor('#475569');
      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 380, topY, { align: 'right' });
      doc.text(`Token: ${tokenNumber || `T-${appId}`}`, 380, topY + 14, { align: 'right' });
      doc.text(`Appt ID: CC-${appId}`, 380, topY + 28, { align: 'right' });

      doc.y = Math.max(doc.y, topY + 50);
      doc.moveDown(1);

      // Patient Details Box
      doc.rect(40, doc.y, 515, 45).fillAndStroke('#f8fafc', '#e2e8f0');
      const patBoxY = doc.y + 10;
      doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold');
      doc.text(`Patient Name: ${patient.name}`, 55, patBoxY);
      doc.font('Helvetica').fillColor('#64748b');
      doc.text(`Gender: ${patient.gender || 'Not specified'}  |  Blood Group: ${patient.bloodGroup || 'N/A'}  |  Phone: ${patient.user?.phone || 'N/A'}`, 55, patBoxY + 16);

      doc.y = patBoxY + 45;
      doc.moveDown(1);

      // Clinical Diagnosis / Notes
      if (prescription.notes) {
        doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('Clinical Diagnosis & Observations:');
        doc.fontSize(10).font('Helvetica').fillColor('#334155').text(prescription.notes);
        doc.moveDown(1);
      }

      // Rx Symbol
      doc.fillColor('#0d9488').fontSize(20).font('Helvetica-Bold').text('Rx', 40, doc.y);
      doc.moveDown(0.5);

      // Medicines Table
      const medicines = Array.isArray(prescription.medicines) ? prescription.medicines : [];
      const tableRows = medicines.map((m, idx) => [
        String(idx + 1),
        m.drug?.name || m.name || 'Medicine',
        m.dosage || 'As directed',
        m.frequency || '1-0-1',
        m.duration || '5 Days',
        m.instructions || 'After Food'
      ]);

      if (tableRows.length > 0) {
        const table = {
          title: 'Prescribed Medications',
          headers: ['#', 'Medication', 'Dosage', 'Frequency', 'Duration', 'Instructions'],
          rows: tableRows
        };
        doc.table(table, {
          prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a'),
          prepareRow: (row, indexColumn, isEven) => doc.font('Helvetica').fontSize(9).fillColor('#334155')
        });
      } else {
        doc.fontSize(10).fillColor('#64748b').text('No oral medications recorded.');
      }

      doc.moveDown(2);

      // Digital Signature & Footnote
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(1);

      doc.fillColor('#047857').fontSize(10).font('Helvetica-Bold').text(`✓ ${prescription.signature || `Digitally Signed by Dr. ${doctor.name}`}`);
      doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text(`Signed on ${new Date(prescription.createdAt).toLocaleString()} via Doctor On Call E-Health System.`);
      doc.moveDown(0.5);
      doc.fontSize(8).fillColor('#94a3b8').text('This is a computer-generated medical prescription valid under the Indian Telemedicine Practice Guidelines 2020.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createOrUpdatePrescription,
  getPrescriptionByAppointment,
  getPatientPrescriptions,
  generatePrescriptionPDF
};
