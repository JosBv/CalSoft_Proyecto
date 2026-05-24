import { Navigate } from 'react-router-dom';
import { estaAutenticado } from '../auth.js';

// Envuelve rutas privadas: si no hay sesión, redirige al login.
// Esto cierra el agujero de antes (entrar a /dashboard escribiendo la URL).
export default function ProtectedRoute({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
