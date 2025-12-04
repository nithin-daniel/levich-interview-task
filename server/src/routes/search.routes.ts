import { Router } from 'express';
import { searchController } from '../controllers/search.controller';

const router = Router();

// GET /api/search?title=searchTerm
router.get('/', searchController.searchByTitle);

export default router;