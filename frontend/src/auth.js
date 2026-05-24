// Manejo de la sesión del usuario en el navegador (localStorage).
const TOKEN_KEY = 'token';
const USER_KEY = 'usuario';
const ROL_KEY = 'rol';

export function guardarSesion({ token, usuario, rol }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, usuario);
  localStorage.setItem(ROL_KEY, rol);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario() {
  return localStorage.getItem(USER_KEY);
}

export function getRol() {
  return localStorage.getItem(ROL_KEY);
}

export function estaAutenticado() {
  return Boolean(getToken());
}

export function cerrarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROL_KEY);
}
