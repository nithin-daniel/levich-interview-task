import { Router } from 'express';
import vendorRoutes from './vendorMovement.routes';
import authRoutes from './auth.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);

// Default API route
router.get('/', (req, res) => {
  res.json({
    message: 'Levich Interview Task API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        me: '/api/auth/me'
      },
      vendors: '/api/vendors',
      health: '/health'
    }
  });
});

export default router;