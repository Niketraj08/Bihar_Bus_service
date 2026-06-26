import express from 'express';
import {
  getDashboardStats,
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getAllBookings,
  getAllUsers
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard
// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', getDashboardStats);

// Bus Management
// @route   GET /api/admin/buses
// @desc    Get all buses
// @access  Private/Admin
router.get('/buses', getAllBuses);

// @route   POST /api/admin/buses
// @desc    Create new bus
// @access  Private/Admin
router.post('/buses', createBus);

// @route   PUT /api/admin/buses/:id
// @desc    Update bus
// @access  Private/Admin
router.put('/buses/:id', updateBus);

// @route   DELETE /api/admin/buses/:id
// @desc    Delete bus
// @access  Private/Admin
router.delete('/buses/:id', deleteBus);

// Route Management
// @route   GET /api/admin/routes
// @desc    Get all routes
// @access  Private/Admin
router.get('/routes', getAllRoutes);

// @route   POST /api/admin/routes
// @desc    Create new route
// @access  Private/Admin
router.post('/routes', createRoute);

// @route   PUT /api/admin/routes/:id
// @desc    Update route
// @access  Private/Admin
router.put('/routes/:id', updateRoute);

// @route   DELETE /api/admin/routes/:id
// @desc    Delete route
// @access  Private/Admin
router.delete('/routes/:id', deleteRoute);

// Bookings
// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Private/Admin
router.get('/bookings', getAllBookings);

// Users
// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', getAllUsers);

export default router;

