import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workout.js';
import profileRoutes from './routes/profile.js';
import goalRoutes from './routes/goal.js';
import aiRoutes from './routes/ai.js';
import logger from './middleware/logger.js';

// Load environment variables for local development
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ---- Socket.IO Chat ----
const chatHistory = []; // In-memory chat (for demo; use DB for production)

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Send last 20 messages to newly connected user
  socket.emit('chat:history', chatHistory.slice(-20));

  // Listen for incoming messages
  socket.on('chat:message', (data) => {
    const message = {
      id: Date.now(),
      user: data.user || 'Anonymous',
      text: data.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    chatHistory.push(message);
    // Broadcast to everyone
    io.emit('chat:message', message);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// ---- Database Connection and Server Start ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is not defined in environment variables.');
  console.error('Please check your Render environment settings or local .env file.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then((conn) => {
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    server.listen(PORT, () => {
      console.log(`🚀 FitLife server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  });
