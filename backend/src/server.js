const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const blockchainRoutes = require('./routes/blockchain');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: 'OpenAI-v1' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('user_joined', (data) => {
    socket.broadcast.emit('user_joined', data);
    console.log(`User ${data.walletAddress} joined channel ${data.channel}`);
  });

  socket.on('message', (data) => {
    console.log('SERVER: Received message from client:', data);
    // Broadcast to ALL clients
    io.emit('message', data);
    console.log('SERVER: Broadcasted message to all clients');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`CONSILIENCE Backend running on port ${PORT}`);
});