// CRUD de pedidos. Todas las consultas son parametrizadas.
import { query } from '../db.js';

const ESTADOS_VALIDOS = ['Pendiente', 'En cocina', 'Entregado'];

// GET /api/pedidos  → lista todos los pedidos
export async function listar(req, res) {
  try {
    const { rows } = await query('SELECT * FROM pedidos ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('ERROR LISTAR PEDIDOS:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// POST /api/pedidos  → crea un pedido
export async function crear(req, res) {
  const { cliente, mesero, producto, cantidad, mesa, estado } = req.body || {};

  // Validación
  if (!cliente?.trim() || !mesero?.trim() || !producto?.trim()) {
    return res
      .status(400)
      .json({ error: 'Cliente, mesero y producto son obligatorios' });
  }
  const cant = Number(cantidad);
  const mesaNum = Number(mesa);
  if (!Number.isInteger(cant) || cant <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un entero positivo' });
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
      `INSERT INTO pedidos (cliente, mesero, producto, cantidad, mesa, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cliente.trim(), mesero.trim(), producto.trim(), cant, mesaNum, estadoFinal]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('ERROR CREAR PEDIDO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// PATCH /api/pedidos/:id/estado  → cambia el estado de un pedido
export async function actualizarEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body || {};

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const { rows } = await query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('ERROR ACTUALIZAR ESTADO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// DELETE /api/pedidos/:id  → elimina un pedido
export async function eliminar(req, res) {
  const { id } = req.params;

  try {
    const { rowCount } = await query('DELETE FROM pedidos WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('ERROR ELIMINAR PEDIDO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
