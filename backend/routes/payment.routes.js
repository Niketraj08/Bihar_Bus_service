import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  processWalletPayment,
  addMoneyToWallet,
  getWalletBalance
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/payments/razorpay/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/razorpay/create-order', createPaymentOrder);

// @route   POST /api/payments/razorpay/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/razorpay/verify', verifyPayment);

// @route   POST /api/payments/wallet
// @desc    Process wallet payment
// @access  Private
router.post('/wallet', processWalletPayment);

// @route   POST /api/payments/wallet/add-money
// @desc    Add money to wallet
// @access  Private
router.post('/wallet/add-money', addMoneyToWallet);

// @route   GET /api/payments/wallet/balance
// @desc    Get wallet balance
// @access  Private
router.get('/wallet/balance', getWalletBalance);

export default router;

