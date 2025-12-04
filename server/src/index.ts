import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middlewares/cors';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import healthRoutes from './routes/health.routes';
import apiRoutes from './routes/index';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', healthRoutes);
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);
app.use('*', notFoundHandler);

// Testing Purpose
const cors = require('cors');
app.use(cors({
  origin: 'https://levich-interview-task.vercel.app',  // Exact Vercel URL
  credentials: true,  // If using cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Explicit OPTIONS handler for preflights
app.options('*', cors());


// Start server
app.listen(PORT, () => {
  logger.info(`\n🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`⏰ Started at: ${new Date().toLocaleString()}\n`);
});

export default app;