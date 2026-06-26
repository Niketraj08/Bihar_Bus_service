import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import busRoutes from './routes/bus.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import trackingRoutes from './routes/tracking.routes.js';
import adminRoutes from './routes/admin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initializeSocketIO } from './socket/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5000", "http://localhost:5001"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO
initializeSocketIO(io);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bihar Bus Service API',
    version: '1.0.0',
    status: 'running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5003;

httpServer.listen(PORT, () => {
  console.log(`🚌 Bihar Bus Service API running on port ${PORT}`);
  console.log(`📡 Socket.IO server initialized`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { io };

