const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/my-wallet', authenticate, walletController.getDoctorWallet);
router.post('/withdraw', authenticate, walletController.requestWithdrawal);
router.post('/process-settlements', walletController.processMaturedSettlements);

module.exports = router;
