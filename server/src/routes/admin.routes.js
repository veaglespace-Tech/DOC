const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Protect all admin routes with authentication and role check
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/doctors', adminController.getDoctorsList);
router.patch('/doctors/:id/verify', adminController.verifyDoctor);
router.get('/withdrawals', adminController.getWithdrawalsList);
router.patch('/withdrawals/:id', adminController.updateWithdrawalStatus);
router.get('/complaints', adminController.getComplaintsList);
router.patch('/complaints/:id', adminController.updateComplaintStatus);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
