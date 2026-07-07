import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Estilos globales: Tailwind + tema del proyecto
import './index.css';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Pedidos from './pages/Pedidos.jsx';
import Reservas from './pages/Reservas.jsx';
import Inventario from './pages/Inventario.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Cocina from './pages/Cocina.jsx';
import Reportes from './pages/Reportes.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Rutas privadas: ruta -> componente
const RUTAS_PRIVADAS = [
  ['/dashboard', Dashboard],
  ['/pedidos', Pedidos],
  ['/reservas', Reservas],
  ['/inventario', Inventario],
  ['/usuarios', Usuarios],
  ['/cocina', Cocina],
  ['/reportes', Reportes],
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {RUTAS_PRIVADAS.map(([ruta, Componente]) => (
          <Route
            key={ruta}
            path={ruta}
            element={
              <ProtectedRoute>
                <Componente />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
