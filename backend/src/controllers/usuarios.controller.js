// CRUD de usuarios del sistema.
// IMPORTANTE: nunca se devuelve la columna "clave" al cliente.
import bcrypt from 'bcrypt';
import { query } from '../db.js';

const ROLES_VALIDOS = ['Administrador', 'Mesero', 'Cocina', 'Empleado'];

// GET /api/usuarios
export async function listar(req, res) {
  try {
    const { rows } = await query(
      'SELECT id, usuario, rol, creado_en FROM usuarios ORDER BY usuario ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('ERROR LISTAR USUARIOS:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// POST /api/usuarios
export async function crear(req, res) {
  const usuario = req.body?.usuario?.trim();
  const clave = req.body?.clave?.trim();
  const rol = req.body?.rol || 'Empleado';

  if (!usuario || !clave) {
    return res.status(400).json({ error: 'Usuario y clave son obligatorios' });
  }
  if (clave.length < 4) {
    return res.status(400).json({ error: 'La clave debe tener al menos 4 caracteres' });
  }
  if (!ROLES_VALIDOS.includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    const hash = await bcrypt.hash(clave, 10);
    const { rows } = await query(
      `INSERT INTO usuarios (usuario, clave, rol)
       VALUES ($1, $2, $3)
       RETURNING id, usuario, rol, creado_en`,
      [usuario, hash, rol]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      // violación de UNIQUE en "usuario"
      return res.status(409).json({ error: 'Ese nombre de usuario ya existe' });
    }
    console.error('ERROR CREAR USUARIO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// PATCH /api/usuarios/:id  → cambia rol y/o resetea la clave
export async function actualizar(req, res) {
  const { id } = req.params;
  const { rol, clave } = req.body || {};

  if (rol !== undefined && !ROLES_VALIDOS.includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }
  if (clave !== undefined && clave.trim().length < 4) {
    return res.status(400).json({ error: 'La clave debe tener al menos 4 caracteres' });
  }
  if (rol === undefined && clave === undefined) {
    return res.status(400).json({ error: 'Nada que actualizar' });
  }

  // Construimos el UPDATE dinámicamente según lo que llegue.
  const sets = [];
  const params = [];
  let i = 1;
  if (rol !== undefined) {
    sets.push(`rol = $${i++}`);
    params.push(rol);
  }
  if (clave !== undefined) {
    sets.push(`clave = $${i++}`);
    params.push(await bcrypt.hash(clave.trim(), 10));
  }
  params.push(id);

  try {
    const { rows } = await query(
      `UPDATE usuarios SET ${sets.join(', ')} WHERE id = $${i}
       RETURNING id, usuario, rol, creado_en`,
      params
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('ERROR ACTUALIZAR USUARIO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// DELETE /api/usuarios/:id
export async function eliminar(req, res) {
  const { id } = req.params;

  // Evita que un usuario borre su propia cuenta (se quedaría sin acceso).
  if (Number(id) === req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
  }

  try {
    const { rowCount } = await query('DELETE FROM usuarios WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('ERROR ELIMINAR USUARIO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
