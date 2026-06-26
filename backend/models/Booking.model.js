import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  seats: [{
    seatNumber: {
      type: String,
      required: true
    },
    passengerName: {
      type: String,
      required: true
    },
    passengerAge: Number,
    passengerGender: String,
    passengerPhone: String
  }],
  fare: {
    baseFare: Number,
    gst: Number,
    total: Number
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'upi', 'wallet', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  qrCode: {
    type: String,
    unique: true
  },
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BBS-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
  }
  if (!this.qrCode) {
    this.qrCode = `QR-${this.bookingId}-${Date.now()}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);

