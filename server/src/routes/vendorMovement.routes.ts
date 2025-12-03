import { Router } from 'express';
import { VendorController } from '../controllers/vendorMovement.controller';

const router = Router();
const vendorController = new VendorController();

router.get('/', vendorController.getAllVendors);
router.post('/', vendorController.createVendor);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

export default router;