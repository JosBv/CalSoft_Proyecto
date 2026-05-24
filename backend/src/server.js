// Punto de entrada de la API.
import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import authRoutes from './routes/auth.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import inventarioRoutes from './routes/inventario.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import reportesRoutes from './routes/reportes.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => {
  res.json({ ok: true, servicio: 'CalSoft - API' });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/reportes', reportesRoutes);

// 404 para cualquier otra ruta
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
