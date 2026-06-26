export const initializeSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join bus tracking room
    socket.on('join-bus-tracking', (busId) => {
      socket.join(`bus-${busId}`);
      console.log(`Client ${socket.id} joined bus-${busId} tracking`);
    });

    // Leave bus tracking room
    socket.on('leave-bus-tracking', (busId) => {
      socket.leave(`bus-${busId}`);
      console.log(`Client ${socket.id} left bus-${busId} tracking`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

