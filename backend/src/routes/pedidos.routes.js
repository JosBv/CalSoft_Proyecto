import { Router } from 'express';
import {
  listar,
  crear,
  actualizarEstado,
  eliminar,
} from '../controllers/pedidos.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Todas las rutas de pedidos requieren estar autenticado.
router.use(requireAuth);

router.get('/', listar);
router.post('/', crear);
router.patch('/:id/estado', actualizarEstado);
router.delete('/:id', eliminar);

export default router;
