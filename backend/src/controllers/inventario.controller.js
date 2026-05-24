// CRUD de inventario (productos y stock).
import { query } from '../db.js';

function validarCampos({ producto, stock, stock_minimo, precio }) {
  if (!producto?.trim()) return 'El producto es obligatorio';
  if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
    return 'El stock debe ser un entero >= 0';
  if (!Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0)
    return 'El stock mínimo debe ser un entero >= 0';
  if (Number(precio) < 0 || Number.isNaN(Number(precio)))
    return 'El precio debe ser un número >= 0';
  return null;
}

// GET /api/inventario
export async function listar(req, res) {
  try {
    const { rows } = await query('SELECT * FROM inventario ORDER BY producto ASC');
    res.json(rows);
  } catch (err) {
    console.error('ERROR LISTAR INVENTARIO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// POST /api/inventario
export async function crear(req, res) {
  const { producto, categoria, stock, unidad, stock_minimo, precio } = req.body || {};
  const error = validarCampos({ producto, stock, stock_minimo, precio });
  if (error) return res.status(400).json({ error });

  try {
    const { rows } = await query(
      `INSERT INTO inventario (producto, categoria, stock, unidad, stock_minimo, precio)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        producto.trim(),
        categoria?.trim() || 'General',
        Number(stock),
        unidad?.trim() || 'unidad',
        Number(stock_minimo),
        Number(precio) || 0,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('ERROR CREAR INVENTARIO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// PUT /api/inventario/:id  → actualiza el producto completo
export async function actualizar(req, res) {
  const { id } = req.params;
  const { producto, categoria, stock, unidad, stock_minimo, precio } = req.body || {};
  const error = validarCampos({ producto, stock, stock_minimo, precio });
  if (error) return res.status(400).json({ error });

  try {
    const { rows } = await query(
      `UPDATE inventario
       SET producto = $1, categoria = $2, stock = $3,
           unidad = $4, stock_minimo = $5, precio = $6
       WHERE id = $7
       RETURNING *`,
      [
        producto.trim(),
        categoria?.trim() || 'General',
        Number(stock),
        unidad?.trim() || 'unidad',
        Number(stock_minimo),
        Number(precio) || 0,
        id,
      ]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('ERROR ACTUALIZAR INVENTARIO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

// DELETE /api/inventario/:id
// TODO: AGREGAR UN SOFT DELETE
export async function eliminar(req, res) {
  const { id } = req.params;
  try {
    const { rowCount } = await query('DELETE FROM inventario WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('ERROR ELIMINAR INVENTARIO:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}