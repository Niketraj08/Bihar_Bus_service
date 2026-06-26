import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  // Phone field removed - no longer used for authentication
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    sparse: true
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'driver'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true
});

// Hash password before saving (reduced cost for faster registration)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8); // Reduced from 12 to 8 for faster processing
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Note: Email uniqueness is handled by the schema unique constraint

export default mongoose.model('User', userSchema);

