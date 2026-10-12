const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Reviews
router.post('/review', authenticate, feedbackController.submitReview);
router.get('/reviews/:doctorId', feedbackController.getDoctorReviews);

// Complaints
router.post('/complaint', authenticate, feedbackController.submitComplaint);
router.get('/my-complaints', authenticate, feedbackController.getMyComplaints);

module.exports = router;
