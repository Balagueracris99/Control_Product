# API Control de Inventarios (NestJS + PostgreSQL)

## Requisitos

- Node.js 18+
- PostgreSQL instalado y en ejecución

## Conexión a PostgreSQL

1. **Crear la base de datos** en PostgreSQL:
   ```sql
   CREATE DATABASE control_product;
   ```

2. **Crear el archivo `.env`** en la carpeta `backend` (copia desde `env.example`):
   ```bash
   cd backend
   copy env.example .env
   ```
   Edita `.env` y configura:
   - `DB_HOST` = localhost (o la IP de tu servidor PostgreSQL)
   - `DB_PORT` = 5432
   - `DB_USER` = postgres (o tu usuario)
   - `DB_PASSWORD` = tu contraseña de PostgreSQL
   - `DB_NAME` = control_product

3. **Instalar dependencias e iniciar:**
   ```bash
   npm install
   npm run start:dev
   ```

La API estará en `http://localhost:3000/api`. Las tablas `users` y `products` se crean automáticamente al iniciar (solo en desarrollo).

**Guía detallada:** Ver [docs/CONEXION-POSTGRESQL.md](../docs/CONEXION-POSTGRESQL.md) para instalación de PostgreSQL, Docker y solución de problemas.

## Endpoints

### Auth (públicos)
- `POST /api/auth/login` — Body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/register` — Body: `{ "email": "...", "password": "...", "name": "..." }` (opcional)

### Products (requieren JWT en header `Authorization: Bearer <token>`)
- `GET /api/products` — Listar productos
- `GET /api/products/:id` — Obtener producto
- `POST /api/products` — Crear producto
- `PATCH /api/products/:id` — Actualizar producto
- `DELETE /api/products/:id` — Eliminar producto
