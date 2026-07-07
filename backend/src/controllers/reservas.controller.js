// CRUD de reservas. Mismo patrón que pedidos.
import { query } from '../db.js';

const ESTADOS_VALIDOS = ['Pendiente', 'Confirmada', 'Cancelada'];

// GET /api/reservas
export async function listar(req, res) {
  try {
    const { rows } = await query(
      'SELECT * FROM reservas ORDER BY fecha ASC, hora ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('ERROR LISTAR RESERVAS:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// POST /api/reservas
export async function crear(req, res) {
  const { cliente, telefono, fecha, hora, personas, mesa, estado } = req.body || {};

  if (!cliente?.trim() || !fecha || !hora) {
    return res.status(400).json({ error: 'Cliente, fecha y hora son obligatorios' });
  }
  const pers = Number(personas);
  const mesaNum = Number(mesa);
  if (!Number.isInteger(pers) || pers <= 0) {
    return res.status(400).json({ error: 'Personas debe ser un entero positivo' });
  }
  if (!Number.isInteger(mesaNum) || mesaNum <= 0) {
    return res.status(400).json({ error: 'La mesa debe ser un entero positivo' });
  }
  const estadoFinal = estado || 'Pendiente';
  if (!ESTADOS_VALIDOS.includes(estadoFinal)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO reservas (cliente, telefono, fecha, hora, personas, mesa, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [cliente.trim(), telefono?.trim() || null, fecha, hora, pers, mesaNum, estadoFinal]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('ERROR CREAR RESERVA:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// PATCH /api/reservas/:id/estado
export async function actualizarEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body || {};

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const { rows } = await query(
      'UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('ERROR ACTUALIZAR RESERVA:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// DELETE /api/reservas/:id
export async function eliminar(req, res) {
  const { id } = req.params;
  try {
    const { rowCount } = await query('DELETE FROM reservas WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('ERROR ELIMINAR RESERVA:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
