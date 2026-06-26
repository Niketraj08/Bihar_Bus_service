import User from '../models/User.model.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log('🔄 Registration request received:', { name: req.body.name, email: req.body.email });

    const { name, email, password, role } = req.body;

    console.log('🔍 Checking if user exists...');
    // Check if user exists with this email
    const userExists = await User.findOne({ email });
    console.log('✅ User existence check completed');

    if (userExists) {
      console.log('❌ User already exists');
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    console.log('👤 Creating new user...');
    // Create user (only allow role specification for admin users)
    const userRole = role && ['user', 'admin', 'driver'].includes(role) ? role : 'user';
    const userData = {
      name,
      email,
      password,
      role: userRole
    };

    const user = await User.create(userData);
    console.log('✅ User created successfully:', user._id);

    console.log('🔑 Generating token...');
    const token = generateToken(user._id);
    console.log('✅ Token generated');

    console.log('📤 Sending response...');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    console.log('✅ Response sent successfully');
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance
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

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = await User.create({
        googleId,
        email,
        name,
        isVerified: true
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
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

// @desc    Test database connection
// @route   GET /api/auth/test-db
// @access  Public
export const testDatabase = async (req, res) => {
  try {
    console.log('🧪 Testing database connection...');

    // Simple database operation
    const userCount = await User.countDocuments();
    console.log('✅ Database test successful, user count:', userCount);

    res.json({
      success: true,
      message: 'Database connection working',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookings');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


