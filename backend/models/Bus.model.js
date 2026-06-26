import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true,
    uppercase: true
  },
  busName: {
    type: String,
    required: [true, 'Bus name is required']
  },
  operator: {
    type: String,
    required: [true, 'Operator name is required']
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  type: {
    type: String,
    enum: ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater'],
    required: true
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 40
  },
  amenities: [{
    type: String,
    enum: ['AC', 'WiFi', 'Sleeper', 'Seater', 'Charging', 'TV']
  }],
  driver: {
    name: String,
    phone: String,
    licenseNumber: String
  },
  conductor: {
    name: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['active', 'offline', 'maintenance', 'on-route'],
    default: 'offline'
  },
  gpsStatus: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    lastUpdated: Date
  },
  price: {
    type: Number,
    required: true
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    departureTime: String,
    arrivalTime: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Bus', busSchema);

