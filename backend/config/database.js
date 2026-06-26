import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MongoDB URI from environment variables or fallback to local
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bihar-bus-service';
    console.log('🔍 Checking MongoDB URI...');
    console.log('Using URI:', mongoURI.includes('localhost') ? 'localhost' : 'Atlas');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

