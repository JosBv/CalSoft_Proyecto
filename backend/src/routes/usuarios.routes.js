import { Router } from 'express';
import {
  listar,
  crear,
  actualizar,
  eliminar,
} from '../controllers/usuarios.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', listar);
router.post('/', crear);
router.patch('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;
