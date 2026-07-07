// Reportes: consultas de agregación sobre las tablas del sistema.
import { query } from '../db.js';

// GET /api/reportes
export async function resumen(req, res) {
  try {
    const [pedidos, reservas, inventario, usuarios, topProductos] = await Promise.all([
      // Pedidos por estado + total
      query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE estado = 'Pendiente')::int AS pendientes,
          COUNT(*) FILTER (WHERE estado = 'En cocina')::int AS en_cocina,
          COUNT(*) FILTER (WHERE estado = 'Entregado')::int AS entregados
        FROM pedidos
      `),
      // Reservas por estado + total
      query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE estado = 'Pendiente')::int AS pendientes,
          COUNT(*) FILTER (WHERE estado = 'Confirmada')::int AS confirmadas,
          COUNT(*) FILTER (WHERE estado = 'Cancelada')::int AS canceladas
        FROM reservas
      `),
      // Inventario: total de productos, bajo stock y valor total
      query(`
        SELECT
          COUNT(*)::int AS total_productos,
          COUNT(*) FILTER (WHERE stock <= stock_minimo)::int AS bajo_stock,
          COALESCE(SUM(stock * precio), 0)::float AS valor_total
        FROM inventario
      `),
      // Usuarios por rol
      query(`
        SELECT rol, COUNT(*)::int AS cantidad
        FROM usuarios
        GROUP BY rol
        ORDER BY cantidad DESC
      `),
      // Top 5 productos más pedidos (por cantidad acumulada)
      query(`
        SELECT producto, SUM(cantidad)::int AS total_pedido
        FROM pedidos
        GROUP BY producto
        ORDER BY total_pedido DESC
        LIMIT 5
      `),
    ]);

    res.json({
      pedidos: pedidos.rows[0],
      reservas: reservas.rows[0],
      inventario: inventario.rows[0],
      usuariosPorRol: usuarios.rows,
      topProductos: topProductos.rows,
    });
  } catch (err) {
    console.error('ERROR REPORTES:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
}
