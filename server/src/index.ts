import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middlewares/cors';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import healthRoutes from './routes/health.routes';
import apiRoutes from './routes/index';

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

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
});

export default app;