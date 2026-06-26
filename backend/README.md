# Bihar Bus Service - Backend API

Complete backend implementation for Bihar Bus Service using Node.js, Express, MongoDB, and Socket.io.

## 🚀 Features

- ✅ Express.js REST API
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Razorpay Payment Integration
- ✅ Socket.io Real-time Tracking
- ✅ OTP Verification (Twilio)
- ✅ Admin Dashboard APIs
- ✅ Bus & Route Management
- ✅ Booking System

## 📦 Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on `mongodb://localhost:27017`
   - Or use MongoDB Atlas connection string

5. **Run the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file with the following:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bihar-bus-service
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
GOOGLE_MAPS_API_KEY=your-google-maps-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
FRONTEND_URL=http://localhost:5000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/google` - Google Sign In
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Buses
- `GET /api/buses/search` - Search buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get bus by ID
- `GET /api/buses/:id/seats` - Get seat availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment
- `POST /api/payments/wallet` - Wallet payment

### Tracking
- `GET /api/tracking/:busId` - Get bus location
- `PUT /api/tracking/:busId` - Update bus location
- `GET /api/tracking/route/:routeId/stops` - Get route stops

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/buses` - Get all buses
- `POST /api/admin/buses` - Create bus
- `PUT /api/admin/buses/:id` - Update bus
- `DELETE /api/admin/buses/:id` - Delete bus
- `GET /api/admin/routes` - Get all routes
- `POST /api/admin/routes` - Create route
- `PUT /api/admin/routes/:id` - Update route
- `DELETE /api/admin/routes/:id` - Delete route
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/users` - Get all users

## 🔌 Socket.IO Events

### Client → Server
- `join-bus-tracking` - Join bus tracking room
- `leave-bus-tracking` - Leave bus tracking room

### Server → Client
- `bus-{busId}-location` - Real-time bus location updates

## 📊 Database Models

- **User** - User accounts and authentication
- **Bus** - Bus information and status
- **Route** - Bus routes and stops
- **Booking** - Ticket bookings

## 🔐 Authentication

All protected routes require a JWT token in the header:
```
Authorization: Bearer <token>
```

## 💳 Payment Integration

### Razorpay
1. Create order: `POST /api/payments/razorpay/create-order`
2. Process payment on frontend
3. Verify payment: `POST /api/payments/razorpay/verify`

### Wallet
- Direct wallet payment: `POST /api/payments/wallet`

## 📱 Real-time Tracking

Socket.IO is used for real-time bus location updates. Connect to the server and join bus tracking rooms to receive live updates.

## 🧪 Testing

Use Postman or similar tools to test the API endpoints. Make sure to:
1. Register/Login first to get JWT token
2. Include token in Authorization header for protected routes
3. Use admin credentials for admin routes

## 📝 Notes

- In development mode, OTP is logged to console
- Make sure MongoDB is running before starting the server
- Socket.IO CORS is configured for frontend URL
- All timestamps are in UTC

---

**Backend API for Bihar Bus Service** 🚌

