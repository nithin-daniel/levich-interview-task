import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Public routes - no authentication required
router.post('/register', register);
router.post('/login', login);

// Protected routes - authentication required
router.get('/me', authMiddleware, getCurrentUser);

export default router;