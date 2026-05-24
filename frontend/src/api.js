// Cliente HTTP centralizado. Agrega el token JWT a cada request
// y maneja errores y expiración de sesión en un solo lugar.
import { getToken, cerrarSesion } from './auth.js';

// En dev se usa el proxy de Vite (/api -> backend). En producción
// se puede sobreescribir con la variable VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token vencido/ inválido en una ruta protegida -> cerrar sesión.
  if (res.status === 401 && !path.includes('/auth/login')) {
    cerrarSesion();
    window.location.href = '/login';
    return null;
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Error en la solicitud');
  }
  return data;
}

export const api = {
  login: (usuario, clave) =>
    request('/auth/login', { method: 'POST', body: { usuario, clave } }),

  // --- Pedidos (también usado por Cocina) ---
  listarPedidos: () => request('/pedidos'),
  crearPedido: (pedido) => request('/pedidos', { method: 'POST', body: pedido }),
  cambiarEstado: (id, estado) =>
    request(`/pedidos/${id}/estado`, { method: 'PATCH', body: { estado } }),
  eliminarPedido: (id) => request(`/pedidos/${id}`, { method: 'DELETE' }),

  // --- Reservas ---
  listarReservas: () => request('/reservas'),
  crearReserva: (reserva) => request('/reservas', { method: 'POST', body: reserva }),
  cambiarEstadoReserva: (id, estado) =>
    request(`/reservas/${id}/estado`, { method: 'PATCH', body: { estado } }),
  eliminarReserva: (id) => request(`/reservas/${id}`, { method: 'DELETE' }),

  // --- Inventario ---
  listarInventario: () => request('/inventario'),
  crearProducto: (p) => request('/inventario', { method: 'POST', body: p }),
  actualizarProducto: (id, p) =>
    request(`/inventario/${id}`, { method: 'PUT', body: p }),
  eliminarProducto: (id) => request(`/inventario/${id}`, { method: 'DELETE' }),

  // --- Usuarios ---
  listarUsuarios: () => request('/usuarios'),
  crearUsuario: (u) => request('/usuarios', { method: 'POST', body: u }),
  actualizarUsuario: (id, datos) =>
    request(`/usuarios/${id}`, { method: 'PATCH', body: datos }),
  eliminarUsuario: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),

  // --- Reportes ---
  obtenerReportes: () => request('/reportes'),
};
