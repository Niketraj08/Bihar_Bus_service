import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  googleLogin,
  getProfile,
  updateProfile,
  testDatabase
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);


// @route   POST /api/auth/google
// @desc    Google Sign In
// @access  Public
router.post('/google', googleLogin);

// @route   GET /api/auth/test-db
// @desc    Test database connection
// @access  Public
router.get('/test-db', testDatabase);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

export default router;

