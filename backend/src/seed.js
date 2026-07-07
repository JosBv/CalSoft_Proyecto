// Siembra datos iniciales:
//   1. El usuario administrador (clave hasheada con bcrypt).
//   2. Datos demo (inventario, reservas, pedidos) SOLO si las tablas
//      están vacías, para que los módulos no se vean vacíos al inicio.
// Ejecutar con:  npm run seed
import bcrypt from 'bcrypt';
import { pool, query } from './db.js';

async function sembrarAdmin() {
  const hash = await bcrypt.hash('1234', 10);
  await query(
    `INSERT INTO usuarios (usuario, clave, rol)
     VALUES ($1, $2, $3)
     ON CONFLICT (usuario)
     DO UPDATE SET clave = EXCLUDED.clave, rol = EXCLUDED.rol`,
    ['admin', hash, 'Administrador']
  );
  console.log("✓ Usuario 'admin' listo (clave de desarrollo: 1234)");
}

async function tablaVacia(tabla) {
  const { rows } = await query(`SELECT COUNT(*)::int AS n FROM ${tabla}`);
  return rows[0].n === 0;
}

async function sembrarUsuariosDemo() {
  if (!(await tablaVacia('usuarios'))) return; // ya hay (al menos el admin) → no tocar
  // (no llega aquí porque admin siempre existe; se deja por claridad)
}

async function sembrarInventarioDemo() {
  if (!(await tablaVacia('inventario'))) return;
  const items = [
    ['Pollo entero', 'Carnes', 40, 'unidad', 10, 18.0],
    ['Papas', 'Verduras', 120, 'kg', 30, 2.5],
    ['Rocoto', 'Verduras', 25, 'kg', 10, 6.0],
    ['Arroz', 'Abarrotes', 80, 'kg', 20, 3.2],
    ['Inca Kola 1.5L', 'Bebidas', 8, 'unidad', 12, 7.5], // bajo stock a propósito
    ['Cerveza', 'Bebidas', 60, 'unidad', 24, 6.0],
  ];
  for (const [producto, categoria, stock, unidad, min, precio] of items) {
    await query(
      `INSERT INTO inventario (producto, categoria, stock, unidad, stock_minimo, precio)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [producto, categoria, stock, unidad, min, precio]
    );
  }
  console.log('✓ Inventario demo sembrado (6 productos)');
}

async function sembrarReservasDemo() {
  if (!(await tablaVacia('reservas'))) return;
  const reservas = [
    ['Familia Quispe', '987654321', '2026-05-25', '13:30', 6, 4, 'Confirmada'],
    ['Pedro Ramos', '999111222', '2026-05-25', '20:00', 2, 7, 'Pendiente'],
    ['Empresa XYZ', '988777666', '2026-05-26', '14:00', 12, 1, 'Pendiente'],
  ];
  for (const [cliente, tel, fecha, hora, personas, mesa, estado] of reservas) {
    await query(
      `INSERT INTO reservas (cliente, telefono, fecha, hora, personas, mesa, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [cliente, tel, fecha, hora, personas, mesa, estado]
    );
  }
  console.log('✓ Reservas demo sembradas (3)');
}

async function sembrarPedidosDemo() {
  if (!(await tablaVacia('pedidos'))) return;
  const pedidos = [
    ['Ana', 'Carlos', 'Pollo a la brasa', 2, 4, 'Pendiente'],
    ['Luis', 'Marta', 'Anticuchos', 1, 7, 'En cocina'],
    ['Sofía', 'Carlos', 'Rocoto relleno', 3, 2, 'Entregado'],
  ];
  for (const [cliente, mesero, producto, cantidad, mesa, estado] of pedidos) {
    await query(
      `INSERT INTO pedidos (cliente, mesero, producto, cantidad, mesa, estado)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [cliente, mesero, producto, cantidad, mesa, estado]
    );
  }
  console.log('✓ Pedidos demo sembrados (3)');
}

async function seed() {
  try {
    await sembrarAdmin();
    await sembrarUsuariosDemo();
    await sembrarInventarioDemo();
    await sembrarReservasDemo();
    await sembrarPedidosDemo();
    console.log('\n✓ Seed completo');
  } catch (err) {
    console.error('Error al sembrar:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
