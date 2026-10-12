const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/:appointmentId', authenticate, chatController.getConversation);
router.post('/:appointmentId/send', authenticate, chatController.sendMessage);

module.exports = router;
