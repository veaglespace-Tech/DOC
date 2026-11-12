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

/**
 * Generate a GST Tax Invoice PDF for Clinic SaaS Subscriptions (PayU / Institutional)
 */
const generateSaaSInvoicePDF = async ({
  planName = 'Clinic Professional',
  priceMonthly = 2999,
  billingCycle = 'monthly',
  clinicName = 'Doctor On Call Partner Clinic',
  clinicEmail = 'clinic@doctoroncall.com',
  txnid = `PAYU_SAAS_${Date.now()}`,
  gateway = 'PayU India (Sandbox Test)'
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Brand Header
      doc.fillColor('#0f766e')
         .fontSize(22)
         .text('VEAGLE SPACE TECHNOLOGY PVT. LTD.', { align: 'center' });
      doc.fillColor('#0d9488')
         .fontSize(13)
         .text('Doctor On Call — Healthcare Cloud SaaS Infrastructure', { align: 'center' })
         .moveDown(0.5);

      doc.fillColor('#475569')
         .fontSize(9)
         .text('Registered Office: Sector 48, IT Park, Pune, Maharashtra 411014, India', { align: 'center' })
         .text('GSTIN: 27AABCV1234F1Z8 | SAC Code: 998311 (Healthcare Cloud SaaS)', { align: 'center' })
         .text('Email: billing@doctoroncall.health | Web: https://doctoroncall.health', { align: 'center' })
         .moveDown(1.5);

      // Divider
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      // Title & Meta
      doc.fillColor('#0f172a').fontSize(15).text('B2B GST TAX INVOICE', { underline: true });
      doc.moveDown(0.5);

      const invoiceDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      doc.fontSize(9).fillColor('#334155');
      const startY = doc.y;

      // Left Column: Bill To
      doc.font('Helvetica-Bold').text('BILLED TO (FACILITY):');
      doc.font('Helvetica').text(`Clinic / Hospital: ${clinicName}`);
      doc.text(`Account Email: ${clinicEmail}`);
      doc.text(`Place of Supply: 27 - Maharashtra`);
      doc.text(`Tax Category: Non-Reverse Charge (Normal)`);

      // Right Column: Invoice Details
      doc.font('Helvetica-Bold').text(`Invoice No: DOC-SAAS-${Date.now().toString().slice(-6)}`, 320, startY);
      doc.font('Helvetica').text(`Invoice Date: ${invoiceDate}`, 320, startY + 14);
      doc.text(`Payment Gateway: ${gateway}`, 320, startY + 28);
      doc.text(`Transaction Ref (TxnId): ${txnid}`, 320, startY + 42);
      doc.text(`Billing Term: ${billingCycle.toUpperCase()}`, 320, startY + 56);

      doc.moveDown(3);

      // Math Calculation
      const baseFee = parseFloat(priceMonthly || 0);
      const isAnnual = billingCycle.toLowerCase() === 'yearly';
      const effectiveBase = isAnnual ? Math.round(baseFee * 0.8 * 12) : baseFee;
      const cgst = Number((effectiveBase * 0.09).toFixed(2));
      const sgst = Number((effectiveBase * 0.09).toFixed(2));
      const totalTax = Number((cgst + sgst).toFixed(2));
      const grandTotal = Number((effectiveBase + totalTax).toFixed(2));

      // Table line items
      const table = {
        headers: ['Service Description', 'SAC Code', 'Term', 'Base (INR)', 'GST (18%)', 'Total (INR)'],
        rows: [
          [
            `${planName} SaaS Cloud License\n(Doctor & Patient OPD Management Suite)`,
            '998311',
            isAnnual ? '12 Months' : '1 Month',
            `Rs. ${effectiveBase.toLocaleString('en-IN')}`,
            `Rs. ${totalTax.toLocaleString('en-IN')}`,
            `Rs. ${grandTotal.toLocaleString('en-IN')}`
          ]
        ]
      };

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
        prepareRow: () => doc.font('Helvetica').fontSize(9),
        padding: 8,
        x: 50,
        width: 495
      });

      doc.moveDown(1);

      // Total Breakdown block
      const rightX = 350;
      doc.font('Helvetica').fontSize(9).fillColor('#334155');
      doc.text(`Taxable Value: Rs. ${effectiveBase.toLocaleString('en-IN')}`, rightX);
      doc.text(`Central GST (CGST 9%): Rs. ${cgst.toLocaleString('en-IN')}`, rightX);
      doc.text(`State GST (SGST 9%): Rs. ${sgst.toLocaleString('en-IN')}`, rightX);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f766e');
      doc.text(`Total Amount Paid: Rs. ${grandTotal.toLocaleString('en-IN')}`, rightX);

      doc.moveDown(2);

      // Digital Verification Badge
      doc.fillColor('#15803d')
         .fontSize(9)
         .text('Status: PAID & CAPTURED [PayU SHA-512 Cryptographically Verified]', { align: 'left' });
      doc.fillColor('#64748b')
         .fontSize(8)
         .text('This is an authorized digital tax invoice. Eligible for GST Input Tax Credit (ITC).', { align: 'left' });

      doc.moveDown(2);
      doc.fillColor('#94a3b8')
         .fontSize(8)
         .text('Thank you for choosing Veagle Space Doctor On Call Network.', { align: 'center', bottom: 30 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateInvoicePDF,
  generateSaaSInvoicePDF
};
