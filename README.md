# CalSoft — Sistema POS

**CalSoft** es un sistema administrativo / punto de venta para restaurantes.
Proyecto del curso **Calidad de Software**.

Repositorio organizado como **workspace** con tres partes independientes:

```
CalSoft_Proyecto/
├── frontend/     → Interfaz web (Vite + React + Tailwind CSS 4)
├── backend/      → API REST (Node.js + Express + PostgreSQL)
└── database/     → Script SQL del esquema
```

---

## Stack

| Capa      | Tecnología                                              |
|-----------|---------------------------------------------------------|
| Frontend  | Vite, React 19, React Router, Tailwind CSS 4, lucide-react |
| Backend   | Node.js, Express 5, PostgreSQL (`pg`)                  |
| Seguridad | Contraseñas con **bcrypt**, sesión con **JWT**         |

El diseño usa un sistema de componentes propio (`src/components/ui` y
`src/components/layout`) con estética redondeada y amigable: tipografía Poppins,
acento coral, sidebar de navegación, formularios en modal y tablas responsive.

---

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- [PostgreSQL](https://www.postgresql.org/) 14 o superior

---

## Puesta en marcha

### 1. Base de datos

Crea la base y aplica el esquema:

```bash
createdb restaurante
psql -d restaurante -f database/schema.sql
```

> Crea las tablas `usuarios` y `pedidos`. El usuario admin se siembra en el paso 2
> (con la contraseña ya hasheada, por eso no va en el SQL).

### 2. Backend

```bash
cd backend
cp .env.example .env      # ajusta usuario/clave de PostgreSQL en .env
npm install
npm run seed              # crea el usuario admin (admin / 1234)
npm run dev               # arranca en http://localhost:3000
```

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev               # arranca en http://localhost:5173
```

Abre **http://localhost:5173** e inicia sesión:

| Usuario | Clave |
|---------|-------|
| `admin` | `1234` |

> El frontend habla con el backend a través del proxy `/api` configurado en
> `vite.config.js`, así que no hay problemas de CORS en desarrollo.

---

## Módulos

| Módulo       | Descripción                                                        |
|--------------|--------------------------------------------------------------------|
| Pedidos      | Registro de pedidos, cambio de estado y resumen.                   |
| Reservas     | Reservas con fecha/hora, personas y estado.                        |
| Inventario   | Productos, stock, precio y alerta de bajo stock.                   |
| Usuarios     | Alta de usuarios (clave hasheada), cambio de rol, reset de clave.  |
| Cocina       | Vista de cocina que reutiliza los pedidos activos.                 |
| Reportes     | Agregados de pedidos, reservas, inventario y usuarios.             |

## API

| Método | Ruta                          | Protegida | Descripción                   |
|--------|-------------------------------|-----------|-------------------------------|
| POST   | `/api/auth/login`             | No        | Login, devuelve token JWT     |
| GET/POST | `/api/pedidos`              | Sí        | Listar / crear pedidos        |
| PATCH  | `/api/pedidos/:id/estado`     | Sí        | Cambiar estado del pedido     |
| DELETE | `/api/pedidos/:id`            | Sí        | Eliminar pedido               |
| GET/POST | `/api/reservas`             | Sí        | Listar / crear reservas       |
| PATCH  | `/api/reservas/:id/estado`    | Sí        | Cambiar estado de la reserva  |
| DELETE | `/api/reservas/:id`           | Sí        | Eliminar reserva              |
| GET/POST | `/api/inventario`           | Sí        | Listar / crear productos      |
| PUT    | `/api/inventario/:id`         | Sí        | Actualizar producto           |
| DELETE | `/api/inventario/:id`         | Sí        | Eliminar producto             |
| GET/POST | `/api/usuarios`             | Sí        | Listar / crear usuarios       |
| PATCH  | `/api/usuarios/:id`           | Sí        | Cambiar rol / resetear clave  |
| DELETE | `/api/usuarios/:id`           | Sí        | Eliminar usuario              |
| GET    | `/api/reportes`               | Sí        | Estadísticas agregadas        |

Las rutas protegidas requieren el header `Authorization: Bearer <token>`.

> `npm run seed` además siembra datos demo (inventario, reservas y pedidos)
> la primera vez, para que los módulos no se vean vacíos.

---

## Qué se mejoró respecto a la versión inicial

- ✅ `node_modules` fuera de git + `.gitignore`
- ✅ Estructura clara en workspace (frontend / backend / database)
- ✅ Contraseñas hasheadas con **bcrypt** (antes texto plano)
- ✅ Autenticación real con **JWT** y rutas protegidas en el front (antes cualquiera
  abría el dashboard escribiendo la URL)
- ✅ Se eliminó el endpoint `/test-usuarios` que filtraba todas las credenciales
- ✅ Credenciales y secretos en **variables de entorno** (`.env`)
- ✅ **Pedidos persistidos en PostgreSQL** (antes se perdían al refrescar)
- ✅ Validación de datos en el backend

## Cómo agregar un módulo nuevo

Todos los módulos siguen el mismo patrón, por si quieres extender el sistema:

1. **BD**: agrega la tabla en `database/schema.sql`.
2. **Backend**: crea `backend/src/controllers/<modulo>.controller.js` y
   `backend/src/routes/<modulo>.routes.js`, y regístralo en `backend/src/server.js`.
3. **Frontend**: agrega los métodos en `frontend/src/api.js`, crea la página en
   `frontend/src/pages/<Modulo>.jsx`, regístrala en `frontend/src/main.jsx` y
   añade la tarjeta en `frontend/src/pages/Dashboard.jsx`.
