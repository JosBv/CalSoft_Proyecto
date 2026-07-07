// Lógica de autenticación: valida credenciales contra la BD,
// compara el hash bcrypt y devuelve un token JWT.
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { JWT_SECRET, JWT_EXPIRES } from '../config.js';

export async function login(req, res) {
  const usuario = req.body?.usuario?.trim();
  const clave = req.body?.clave?.trim();

  if (!usuario || !clave) {
    return res
      .status(400)
      .json({ success: false, message: 'Usuario y clave son obligatorios' });
  }

  try {
    const { rows } = await query(
      'SELECT id, usuario, clave, rol FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    // Mismo mensaje si el usuario no existe o la clave no coincide,
    // para no revelar cuáles usuarios existen.
    const credencialesInvalidas = () =>
      res
        .status(401)
        .json({ success: false, message: 'Usuario o contraseña incorrectos' });

    if (rows.length === 0) return credencialesInvalidas();

    const user = rows[0];
    const claveCorrecta = await bcrypt.compare(clave, user.clave);
    if (!claveCorrecta) return credencialesInvalidas();

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      success: true,
      token,
      usuario: user.usuario,
      rol: user.rol,
    });
  } catch (err) {
    console.error('ERROR LOGIN:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}
