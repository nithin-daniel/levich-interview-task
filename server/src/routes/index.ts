import { Router } from 'express';
import vendorRoutes from './vendorMovement.routes';
import authRoutes from './auth.routes';
import searchRoutes from './search.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/search', searchRoutes);

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
      search: '/api/search?title=searchTerm',
      health: '/health'
    }
  });
});

export default router;