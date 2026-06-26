import Booking from '../models/Booking.model.js';
import Bus from '../models/Bus.model.js';
import User from '../models/User.model.js';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { busId, routeId, travelDate, seats } = req.body;

    if (!busId || !routeId || !travelDate || !seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get bus details
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Check seat availability
    const date = new Date(travelDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const existingBookings = await Booking.find({
      bus: busId,
      travelDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: { $in: ['confirmed', 'pending'] }
    });

    const bookedSeats = existingBookings.flatMap(booking => 
      booking.seats.map(s => s.seatNumber)
    );

    const requestedSeats = seats.map(s => s.seatNumber);
    const unavailableSeats = requestedSeats.filter(seat => bookedSeats.includes(seat));

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${unavailableSeats.join(', ')} are already booked`
      });
    }

    // Calculate fare
    const baseFare = bus.price * seats.length;
    const gst = baseFare * 0.18;
    const total = baseFare + gst;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      bus: busId,
      route: routeId,
      travelDate: new Date(travelDate),
      seats,
      fare: {
        baseFare,
        gst,
        total
      },
      status: 'pending'
    });

    await booking.populate('bus route user');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
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

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('bus route')
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

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('bus route user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
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

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'Cancelled by user';

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
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

