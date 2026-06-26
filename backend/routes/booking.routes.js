import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', createBooking);

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', getUserBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', getBookingById);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', cancelBooking);

export default router;

