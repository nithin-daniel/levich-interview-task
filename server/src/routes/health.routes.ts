import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

router.get('/', healthController.getStatus);
router.get('/health', healthController.getHealth);

export default router;