const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Protect all admin routes with authentication and role check
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE', 'SUPPORT'));

// Overview Stats & Analytics
router.get('/stats', adminController.getStats);

// Doctor Verification (Admin only)
router.get('/doctors', authorize('ADMIN', 'SUPER_ADMIN'), adminController.getDoctorsList);
router.patch('/doctors/:id/verify', authorize('ADMIN', 'SUPER_ADMIN'), adminController.verifyDoctor);

// Financial Withdrawals (Admin, Finance)
router.get('/withdrawals', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), adminController.getWithdrawalsList);
router.patch('/withdrawals/:id', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), adminController.updateWithdrawalStatus);

// Complaints & Grievances (Admin, Support)
router.get('/complaints', authorize('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), adminController.getComplaintsList);
router.patch('/complaints/:id', authorize('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), adminController.updateComplaintStatus);

// Emergency Dispatches Monitoring (Admin, Support)
router.get('/emergency', authorize('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), adminController.getEmergencyDispatches);

// Audit Logs (Admin)
router.get('/audit-logs', authorize('ADMIN', 'SUPER_ADMIN'), adminController.getAuditLogs);

// System Settings (Admin, Finance)
router.get('/settings', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), adminController.getSettings);
router.patch('/settings', authorize('ADMIN', 'SUPER_ADMIN'), adminController.updateSettings);

// Reports & Analytics (Admin, Finance)
router.get('/reports/financials', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), adminController.getFinancialReport);
router.get('/reports/export', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), adminController.exportReportCsv);
router.get('/reports/csv', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), adminController.exportReportCsv);

// Full Directory Endpoints: Patients, Clinics, and Transactions (BRD Sec 15, 16, 17)
router.get('/patients', authorize('ADMIN', 'SUPER_ADMIN', 'SUPPORT'), adminController.getPatientsList);
router.get('/clinics', authorize('ADMIN', 'SUPER_ADMIN'), adminController.getClinicsList);
router.get('/transactions', authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE'), adminController.getTransactionsList);

module.exports = router;

