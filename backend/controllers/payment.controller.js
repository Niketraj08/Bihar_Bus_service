import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.model.js';
import User from '../models/User.model.js';

// Function to get Razorpay instance
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === 'rzp_test_placeholder') {
    throw new Error('Razorpay credentials not properly configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const options = {
      amount: Math.round(booking.fare.total * 100), // Convert to paise
      currency: 'INR',
      receipt: booking.bookingId,
      notes: {
        bookingId: booking.bookingId,
        userId: req.user._id.toString()
      }
    };

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(options);

    // Update booking with order ID
    booking.payment.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update booking
    booking.payment.status = 'completed';
    booking.payment.method = 'razorpay';
    booking.payment.razorpayPaymentId = razorpay_payment_id;
    booking.payment.transactionId = razorpay_payment_id;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';

    await booking.save();

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Process wallet payment
// @route   POST /api/payments/wallet
// @access  Private
export const processWalletPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.walletBalance < booking.fare.total) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Deduct from wallet
    user.walletBalance -= booking.fare.total;
    await user.save();

    // Update booking
    booking.payment.status = 'completed';
    booking.payment.method = 'wallet';
    booking.payment.transactionId = `WALLET-${Date.now()}`;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';

    await booking.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      booking,
      remainingBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add money to wallet (Demo payment)
// @route   POST /api/payments/wallet/add-money
// @access  Private
export const addMoneyToWallet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // For demo purposes, we'll simulate a successful payment
    // In production, this would integrate with actual payment gateway
    const user = await User.findById(req.user._id);

    // Add amount to wallet
    user.walletBalance += parseFloat(amount);
    await user.save();

    res.json({
      success: true,
      message: 'Money added to wallet successfully',
      newBalance: user.walletBalance,
      transactionId: `DEMO-${Date.now()}`,
      amount: parseFloat(amount)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get wallet balance
// @route   GET /api/payments/wallet/balance
// @access  Private
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');

    res.json({
      success: true,
      balance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

