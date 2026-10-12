const express = require('express');
const router = express.Router();
const handoverController = require('../controllers/handover.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/request', authenticate, handoverController.createHandoverRequest);
router.post('/:id/respond', authenticate, handoverController.respondHandover);
router.get('/my-handovers', authenticate, handoverController.getMyHandovers);

module.exports = router;
