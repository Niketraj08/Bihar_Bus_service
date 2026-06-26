import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: [true, 'Route number is required'],
    unique: true,
    uppercase: true
  },
  routeName: {
    type: String,
    required: [true, 'Route name is required']
  },
  startPoint: {
    name: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  endPoint: {
    name: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  stops: [{
    name: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String,
    sequence: Number,
    estimatedTime: Number // minutes from start
  }],
  distance: {
    type: Number, // in kilometers
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  buses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Route', routeSchema);

