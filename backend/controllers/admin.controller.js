import Bus from '../models/Bus.model.js';
import Route from '../models/Route.model.js';
import Booking from '../models/Booking.model.js';
import User from '../models/User.model.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments();
    const activeBuses = await Bus.countDocuments({ status: 'active' });
    const activeRoutes = await Route.countDocuments({ status: 'active' });
    const driversOnline = await Bus.countDocuments({ gpsStatus: 'online' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyBookings = await Booking.countDocuments({
      createdAt: { $gte: today },
      status: 'confirmed'
    });

    const dailyBookingsData = await Booking.find({
      createdAt: { $gte: today },
      status: 'confirmed'
    });
    const ticketSales = dailyBookingsData.reduce((sum, booking) => sum + booking.fare.total, 0);

    // Get bookings for last 7 days for graph
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const bookingsByDay = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$fare.total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get active alerts (buses with issues)
    const alerts = await Bus.find({
      $or: [
        { gpsStatus: 'offline' },
        { status: 'maintenance' }
      ]
    }).select('busNumber route status gpsStatus').limit(10);

    res.json({
      success: true,
      stats: {
        totalBuses,
        activeBuses,
        activeRoutes,
        driversOnline,
        dailyBookings,
        ticketSales
      },
      chartData: bookingsByDay,
      alerts: alerts.map(alert => ({
        bus: alert.busNumber,
        route: alert.route,
        issue: alert.gpsStatus === 'offline' ? 'GPS offline' : 'Maintenance required',
        severity: alert.gpsStatus === 'offline' ? 'high' : 'medium'
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all buses
// @route   GET /api/admin/buses
// @access  Private/Admin
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('route').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: buses.length,
      buses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create bus
// @route   POST /api/admin/buses
// @access  Private/Admin
export const createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    await bus.populate('route');

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update bus
// @route   PUT /api/admin/buses/:id
// @access  Private/Admin
export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('route');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.json({
      success: true,
      message: 'Bus updated successfully',
      bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete bus
// @route   DELETE /api/admin/buses/:id
// @access  Private/Admin
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    await bus.deleteOne();

    res.json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all routes
// @route   GET /api/admin/routes
// @access  Private/Admin
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create route
// @route   POST /api/admin/routes
// @access  Private/Admin
export const createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update route
// @route   PUT /api/admin/routes/:id
// @access  Private/Admin
export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route updated successfully',
      route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete route
// @route   DELETE /api/admin/routes/:id
// @access  Private/Admin
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    await route.deleteOne();

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user bus route')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

