// Middleware que protege rutas exigiendo un token JWT válido.
// Se usa así:  router.get('/algo', requireAuth, handler)
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
