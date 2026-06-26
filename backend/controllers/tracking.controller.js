import Bus from '../models/Bus.model.js';
import Route from '../models/Route.model.js';
import { io } from '../server.js';

// @desc    Get bus location
// @route   GET /api/tracking/:busId
// @access  Public
export const getBusLocation = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId).populate('route');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.json({
      success: true,
      bus: {
        id: bus._id,
        busNumber: bus.busNumber,
        busName: bus.busName,
        route: bus.route,
        currentLocation: bus.currentLocation,
        gpsStatus: bus.gpsStatus,
        status: bus.status
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

// @desc    Update bus location
// @route   PUT /api/tracking/:busId
// @access  Private
export const updateBusLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const bus = await Bus.findById(req.params.busId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Check authorization (driver or admin)
    if (req.user.role !== 'admin' && req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update bus location'
      });
    }

    bus.currentLocation = {
      latitude,
      longitude,
      address,
      lastUpdated: new Date()
    };
    bus.gpsStatus = 'online';
    bus.status = 'on-route';

    await bus.save();

    // Emit real-time update via Socket.IO
    io.emit(`bus-${bus._id}-location`, {
      busId: bus._id,
      busNumber: bus.busNumber,
      location: bus.currentLocation,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Bus location updated',
      bus: {
        id: bus._id,
        busNumber: bus.busNumber,
        currentLocation: bus.currentLocation
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

// @desc    Get route stops
// @route   GET /api/tracking/route/:routeId/stops
// @access  Public
export const getRouteStops = async (req, res) => {
  try {
    const route = await Route.findById(req.params.routeId);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      route: {
        id: route._id,
        routeNumber: route.routeNumber,
        routeName: route.routeName,
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        stops: route.stops.sort((a, b) => a.sequence - b.sequence)
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

