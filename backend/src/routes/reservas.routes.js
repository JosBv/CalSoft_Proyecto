import { Router } from 'express';
import {
  listar,
  crear,
  actualizarEstado,
  eliminar,
} from '../controllers/reservas.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', listar);
router.post('/', crear);
router.patch('/:id/estado', actualizarEstado);
router.delete('/:id', eliminar);

export default router;
