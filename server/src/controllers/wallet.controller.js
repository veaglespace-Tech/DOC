const prisma = require('../config/database');
const { logAudit } = require('../services/audit.service');

/**
 * Get Doctor Wallet information, transactions, settlements and withdrawals
 */
exports.getDoctorWallet = async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(403).json({ success: false, message: 'Doctor profile not found' });
    }

    // Ensure wallet exists
    let wallet = await prisma.doctorWallet.findUnique({
      where: { doctorId: doctor.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        settlements: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        withdrawals: {
          orderBy: { requestedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.doctorWallet.create({
        data: {
          doctorId: doctor.id,
          totalEarnings: 0,
          pendingBalance: 0,
          availableBalance: 0,
          withdrawnAmount: 0
        },
        include: {
          transactions: true,
          settlements: true,
          withdrawals: true
        }
      });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Doctor requests withdrawal to bank account
 */
exports.requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, bankAccount, ifscCode } = req.body;
    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
      include: { wallet: true }
    });

    if (!doctor || !doctor.wallet) {
      return res.status(404).json({ success: false, message: 'Doctor wallet not found' });
    }

    const available = parseFloat(doctor.wallet.availableBalance);
    if (available < withdrawAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient available balance. You have ₹${available.toFixed(2)} available.`
      });
    }

    const targetAccount = bankAccount || doctor.bankAccountNumber;
    const targetIfsc = ifscCode || doctor.bankIfsc;

    if (!targetAccount || !targetIfsc) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid bank account number and IFSC code'
      });
    }

    // Process withdrawal in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct from available balance
      const updatedWallet = await tx.doctorWallet.update({
        where: { id: doctor.wallet.id },
        data: {
          availableBalance: { decrement: withdrawAmount },
          withdrawnAmount: { increment: withdrawAmount }
        }
      });

      // 2. Create withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          walletId: doctor.wallet.id,
          amount: withdrawAmount,
          bankAccount: targetAccount,
          ifscCode: targetIfsc,
          status: 'REQUESTED'
        }
      });

      // 3. Create wallet transaction
      const txn = await tx.walletTransaction.create({
        data: {
          walletId: doctor.wallet.id,
          type: 'WITHDRAWAL',
          amount: withdrawAmount,
          description: `Withdrawal request #${withdrawal.id} to Bank AC: ***${targetAccount.slice(-4)}`,
          referenceId: `WTH-${withdrawal.id}`
        }
      });

      return { updatedWallet, withdrawal, txn };
    });

    await logAudit({
      userId: req.user.id,
      userRole: 'DOCTOR',
      action: 'WITHDRAWAL_REQUESTED',
      entity: 'Withdrawal',
      entityId: result.withdrawal.id,
      newValue: { amount: withdrawAmount, bankAccount: targetAccount }
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Payout will be processed within 24-48 hours.',
      data: result.withdrawal
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Release all settlements whose 24-hour hold has expired
 */
exports.processMaturedSettlements = async (req, res, next) => {
  try {
    const now = new Date();
    const maturedSettlements = await prisma.settlement.findMany({
      where: {
        status: 'HOLDING',
        holdUntil: { lte: now }
      },
      include: { wallet: true }
    });

    let releasedCount = 0;
    for (const settlement of maturedSettlements) {
      const amount = parseFloat(settlement.amount);

      await prisma.$transaction(async (tx) => {
        // Move from pending to available
        await tx.doctorWallet.update({
          where: { id: settlement.walletId },
          data: {
            pendingBalance: { decrement: amount },
            availableBalance: { increment: amount }
          }
        });

        // Mark settlement released
        await tx.settlement.update({
          where: { id: settlement.id },
          data: {
            status: 'RELEASED',
            releasedAt: now
          }
        });

        // Record release transaction
        await tx.walletTransaction.create({
          data: {
            walletId: settlement.walletId,
            type: 'RELEASE',
            amount,
            description: `Settlement #${settlement.id} 24h hold released to available balance`,
            referenceId: `SET-${settlement.id}`
          }
        });
      });

      releasedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Processed ${releasedCount} matured settlements`,
      data: { releasedCount }
    });
  } catch (error) {
    next(error);
  }
};
