const PDFDocument = require('pdfkit-table');
const prisma = require('../config/database');

/**
 * Generate a PDF Invoice buffer for a specific Payment ID
 */
const generateInvoicePDF = async (paymentId) => {
  // 1. Fetch detailed payment, appointment, patient, and doctor records
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      appointment: {
        include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } }
        }
      }
    }
  });

  if (!payment) throw Object.assign(new Error('Payment not found'), { statusCode: 404 });
  if (!['COMPLETED', 'CAPTURED'].includes(payment.status)) {
    throw Object.assign(new Error('Invoice can only be generated for completed payments'), { statusCode: 400 });
  }

  const { appointment } = payment;
  const doctorName = appointment.doctor?.name || 'Doctor';
  const patientName = appointment.patient?.name || 'Patient';
  const patientEmail = appointment.patient?.user?.email || 'N/A';
  const patientPhone = appointment.patient?.user?.phone || 'N/A';

  // 2. Initialize PDF Document
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- HEADER ---
      doc.fillColor('#4f46e5')
         .fontSize(24)
         .text('Doctor On Call Healthcare', { align: 'center' });
      doc.fillColor('#475569')
         .fontSize(10)
         .text('123 Health Avenue, Medical District, Pune, IN', { align: 'center' })
         .text('GSTIN: 27AAAAA1234A1Z5 | Phone: +91 99999 88888', { align: 'center' })
         .moveDown(2);

      // --- INVOICE TITLE & META ---
      doc.fillColor('#1e293b').fontSize(16).text('TAX INVOICE', { underline: true });
      doc.moveDown();

      const invoiceDate = new Date(payment.createdAt).toLocaleDateString();
      
      // Top Info block (Left: Patient Info, Right: Invoice Meta)
      doc.fontSize(10).fillColor('#334155');
      const startY = doc.y;
      
      // Patient Info
      doc.text(`Patient Name: ${patientName}`);
      doc.text(`Email: ${patientEmail}`);
      doc.text(`Phone: ${patientPhone}`);
      
      // Invoice Meta (right aligned)
      doc.text(`Invoice No: INV-${payment.id}`, 350, startY);
      doc.text(`Date: ${invoiceDate}`, 350, startY + 15);
      doc.text(`Consultation ID: APT-${appointment.id}`, 350, startY + 30);
      doc.text(`Doctor: Dr. ${doctorName}`, 350, startY + 45);
      doc.text(`Service Type: ${(appointment.serviceType || 'NORMAL').replace('_', ' ')}`, 350, startY + 60);
      
      doc.moveDown(3);

      // --- TABLE: LINE ITEMS ---
      // Reconstruct math: Gross Amount, Tax (18%), Total
      const gross = parseFloat(payment.grossAmount || 0);
      const tax = parseFloat(payment.taxAmount || 0);
      const total = gross + tax;

      const table = {
        headers: ['Description', 'Amount (INR)'],
        rows: [
          [`Medical Consultation with Dr. ${doctorName}`, `Rs. ${gross.toFixed(2)}`],
          ['GST (18% on platform services included)', `Rs. ${tax.toFixed(2)}`],
        ]
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: () => doc.font('Helvetica').fontSize(10),
        padding: 10,
        x: 50,
        width: 495
      });

      doc.moveDown(1);
      
      // --- TOTALS ---
      doc.font('Helvetica-Bold').fontSize(12)
         .text(`Grand Total Paid: Rs. ${total.toFixed(2)}`, { align: 'right' });
      
      doc.font('Helvetica').fontSize(10).fillColor('#64748b')
         .text(`Payment Gateway Ref: ${payment.gatewayPaymentId || payment.gatewayOrderId || 'N/A'}`, { align: 'right' })
         .text(`Status: PAID (${payment.status})`, { align: 'right' });

      doc.moveDown(4);

      // --- FOOTER ---
      doc.fontSize(9).fillColor('#94a3b8')
         .text('This is a computer-generated document. No signature is required.', { align: 'center', bottom: 50 });

      // Finalize PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateInvoicePDF
};
