# Conectar PostgreSQL con el proyecto Control de Inventarios

Este documento explica cómo instalar PostgreSQL, crear la base de datos y conectar el backend NestJS.

---

## 1. Instalar PostgreSQL

### Opción A: Instalador oficial (Windows)

1. Descarga el instalador desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador y sigue los pasos.
3. **Importante:** Anota la contraseña que definas para el usuario `postgres`.
4. Deja el puerto por defecto **5432** (o anota el que elijas).
5. Opcional: instala **pgAdmin** si quieres una interfaz gráfica para administrar la base de datos.

### Opción B: Docker (si tienes Docker instalado)

```bash
docker run --name postgres-control-product -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=control_product -p 5432:5432 -d postgres:16
```

- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `control_product` (se crea automáticamente)
- Puerto: `5432`

---

## 2. Crear la base de datos (si no usaste Docker)

Si instalaste PostgreSQL con el instalador, crea la base de datos manualmente:

### Con pgAdmin

1. Abre pgAdmin y conéctate al servidor (con la contraseña del usuario `postgres`).
2. Clic derecho en **Databases** → **Create** → **Database**.
3. Nombre: `control_product`.
4. Guardar.

### Con línea de comandos (psql)

1. Abre una terminal y entra a `psql` (o "SQL Shell" desde el menú de PostgreSQL):

```bash
psql -U postgres
```

2. Introduce la contraseña del usuario `postgres`.
3. Ejecuta:

```sql
CREATE DATABASE control_product;
\q
```

---

## 3. Configurar el backend (variables de entorno)

1. Entra a la carpeta del backend:

```bash
cd backend
```

2. Crea un archivo `.env` en la raíz de `backend` (junto a `package.json`).

3. Copia el contenido de `env.example` y ajusta los valores según tu instalación:

**Archivo: `backend/.env`**

```env
# Puerto del servidor API
PORT=3000

# PostgreSQL - Conexión a la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=control_product

# JWT - Secret para firmar tokens (cambiar en producción)
JWT_SECRET=control-product-secret-cambiar-en-produccion

# Entorno
NODE_ENV=development
```

Sustituye `tu_contraseña_postgres` por la contraseña real del usuario `postgres`.

### Resumen de variables

| Variable      | Descripción                    | Valor por defecto   |
|--------------|---------------------------------|---------------------|
| `DB_HOST`    | Servidor PostgreSQL            | `localhost`         |
| `DB_PORT`    | Puerto                          | `5432`              |
| `DB_USER`    | Usuario de la base de datos    | `postgres`          |
| `DB_PASSWORD`| Contraseña del usuario         | (la que configuraste) |
| `DB_NAME`    | Nombre de la base de datos     | `control_product`   |

---

## 4. Instalar dependencias y arrancar el backend

```bash
cd backend
npm install
npm run start:dev
```

Si la conexión es correcta, verás algo como:

```
API running at http://localhost:3000/api
```

Y TypeORM creará automáticamente las tablas `users` y `products` (porque `synchronize` está en `true` en desarrollo).

---

## 5. Probar la conexión

1. **Registrar un usuario** (desde Postman, Insomnia o el frontend):

   - `POST http://localhost:3000/api/auth/register`
   - Body (JSON):

   ```json
   {
     "email": "admin@ejemplo.com",
     "password": "123456",
     "name": "Admin"
   }
   ```

2. Si la respuesta incluye `access_token` y `user`, la API y la base de datos están funcionando.

3. En pgAdmin o `psql` puedes comprobar que existen las tablas:

```sql
\c control_product
\dt
```

Deberías ver `users` y `products`.

---

## 6. Solución de problemas

### Error: "connection refused" o "ECONNREFUSED"

- PostgreSQL no está en ejecución. Inicia el servicio (Windows: Servicios → PostgreSQL).
- Con Docker: `docker start postgres-control-product`.

### Error: "password authentication failed"

- La contraseña en `.env` (`DB_PASSWORD`) no coincide con la del usuario `postgres`. Corrígela en `.env`.

### Error: "database 'control_product' does not exist"

- La base de datos no está creada. Créala con `CREATE DATABASE control_product;` (paso 2).

### El backend arranca pero no crea tablas

- Revisa que no haya errores en la consola del backend.
- Comprueba que `DB_NAME`, `DB_USER` y `DB_PASSWORD` en `.env` sean correctos.
- En desarrollo, `synchronize: true` crea/actualiza las tablas al iniciar; en producción no uses `synchronize`, usa migraciones.

---

## 7. Producción

En producción:

1. No uses `synchronize: true` (riesgo de pérdida de datos). Usa migraciones de TypeORM.
2. Pon `NODE_ENV=production`.
3. Usa un `JWT_SECRET` fuerte y único.
4. Guarda las credenciales de la base de datos en variables de entorno del servidor o en un gestor de secretos, no en el código.
