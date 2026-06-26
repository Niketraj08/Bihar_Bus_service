import Bus from '../models/Bus.model.js';
import Route from '../models/Route.model.js';
import Booking from '../models/Booking.model.js';

// @desc    Search buses
// @route   GET /api/buses/search
// @access  Public
export const searchBuses = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide source, destination, and date'
      });
    }

    // Find routes matching source and destination
    const routes = await Route.find({
      $or: [
        { 'startPoint.name': { $regex: source, $options: 'i' } },
        { 'endPoint.name': { $regex: destination, $options: 'i' } },
        { 'stops.name': { $regex: source, $options: 'i' } },
        { 'stops.name': { $regex: destination, $options: 'i' } }
      ],
      status: 'active'
    });

    const routeIds = routes.map(route => route._id);

    // Find buses on these routes
    const buses = await Bus.find({
      route: { $in: routeIds },
      status: { $in: ['active', 'on-route'] }
    }).populate('route');

    // Get seat availability for each bus
    const travelDate = new Date(date);
    const busesWithAvailability = await Promise.all(
      buses.map(async (bus) => {
        const bookings = await Booking.find({
          bus: bus._id,
          travelDate: {
            $gte: new Date(travelDate.setHours(0, 0, 0, 0)),
            $lt: new Date(travelDate.setHours(23, 59, 59, 999))
          },
          status: { $in: ['confirmed', 'pending'] }
        });

        const bookedSeats = bookings.flatMap(booking => booking.seats.map(s => s.seatNumber));
        const availableSeats = bus.totalSeats - bookedSeats.length;

        return {
          ...bus.toObject(),
          seatsAvailable: availableSeats,
          bookedSeats
        };
      })
    );

    res.json({
      success: true,
      count: busesWithAvailability.length,
      buses: busesWithAvailability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all available buses
// @route   GET /api/buses
// @access  Public
export const getAvailableBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ status: { $in: ['active', 'on-route'] } })
      .populate('route')
      .sort({ createdAt: -1 });

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

// @desc    Get bus by ID
// @route   GET /api/buses/:id
// @access  Public
export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('route');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.json({
      success: true,
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

// @desc    Get bus seat availability
// @route   GET /api/buses/:id/seats
// @access  Public
export const getBusSeats = async (req, res) => {
  try {
    const { date } = req.query;
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    const travelDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(travelDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(travelDate.setHours(23, 59, 59, 999));

    const bookings = await Booking.find({
      bus: bus._id,
      travelDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: { $in: ['confirmed', 'pending'] }
    });

    const bookedSeats = bookings.flatMap(booking => 
      booking.seats.map(s => s.seatNumber)
    );

    res.json({
      success: true,
      totalSeats: bus.totalSeats,
      availableSeats: bus.totalSeats - bookedSeats.length,
      bookedSeats,
      bus: {
        id: bus._id,
        busNumber: bus.busNumber,
        busName: bus.busName,
        type: bus.type
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

