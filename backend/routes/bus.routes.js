import express from 'express';
import {
  searchBuses,
  getBusById,
  getBusSeats,
  getAvailableBuses
} from '../controllers/bus.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/buses/search
// @desc    Search buses
// @access  Public
router.get('/search', searchBuses);

// @route   GET /api/buses
// @desc    Get all available buses
// @access  Public
router.get('/', getAvailableBuses);

// @route   GET /api/buses/:id
// @desc    Get bus by ID
// @access  Public
router.get('/:id', getBusById);

// @route   GET /api/buses/:id/seats
// @desc    Get bus seat availability
// @access  Public
router.get('/:id/seats', getBusSeats);

export default router;

