import { Router } from 'express';
import vendorRoutes from './vendorMovement.routes';

const router = Router();

// API Routes
router.use('/vendors', vendorRoutes);

// Default API route
router.get('/', (req, res) => {
  res.json({
    message: 'Levich Interview Task API',
    version: '1.0.0',
    endpoints: {
      vendors: '/api/vendors',
      health: '/health'
    }
  });
});

export default router;