import { Router } from 'express';
import { resumen } from '../controllers/reportes.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', resumen);

export default router;
