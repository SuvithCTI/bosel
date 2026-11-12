import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import db from './config/db.js';
import s3 from './config/s3.js';
import { initializeDatabase } from './db/init.js';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import eventRoutes from './routes/events.js';
import franchiseRoutes from './routes/franchise.js';
import paymentRoutes from './routes/payments.js';
import schoolRoutes from './routes/schools.js';
import batchRoutes from './routes/batches.js';
import certificateRoutes from './routes/certificates.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development and production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static route to serve uploaded files in fallback mode
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'BSEL Academy API Server',
    database: {
      provider: 'Neon PostgreSQL',
      connected: db.isDbConnected()
    },
    storage: {
      provider: s3.isCloudStorageReady() ? 'Amazon S3' : 'Local Storage Fallback',
      ready: s3.isCloudStorageReady()
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('[Server Error]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server & Initialize Database
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 BSEL Backend Server listening on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️ Database:     Neon PostgreSQL`);
  console.log(`☁️ Cloud Store:  Amazon S3`);
  console.log(`======================================================\n`);

  // Attempt auto-initialization of DB schema
  await initializeDatabase();
});

export default app;
