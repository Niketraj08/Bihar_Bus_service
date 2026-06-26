import express from 'express';
import {
  getBusLocation,
  updateBusLocation,
  getRouteStops
} from '../controllers/tracking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/tracking/:busId
// @desc    Get bus location
// @access  Public
router.get('/:busId', getBusLocation);

// @route   GET /api/tracking/route/:routeId/stops
// @desc    Get route stops
// @access  Public
router.get('/route/:routeId/stops', getRouteStops);

// @route   PUT /api/tracking/:busId
// @desc    Update bus location (for drivers/admin)
// @access  Private
router.put('/:busId', protect, updateBusLocation);

export default router;

