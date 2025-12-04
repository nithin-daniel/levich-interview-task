import { Router } from 'express';
import * as vendorController from '../controllers/vendorMovement.controller';

const router = Router();

router.get('/', vendorController.getAllVendors);
router.post('/', vendorController.createVendor);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', vendorController.updateVendor);
router.patch('/:id/toggle-monitoring', vendorController.toggleMonitoring);
router.delete('/:id', vendorController.deleteVendor);

export default router;