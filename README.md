# Control de Productos

Sistema de control de inventario que permite gestionar productos, categorías, stock y usuarios. Incluye autenticación y roles (Administrador / Usuario).

---

## Descripción del proyecto

**Control de Productos** es una aplicación web full-stack para administrar un inventario: registrar productos con categoría, precio y niveles de stock (actual y mínimo), gestionar categorías, y administrar usuarios del sistema. La interfaz está protegida por login; solo usuarios autenticados pueden acceder al panel principal.

---

## Funcionalidad

- **Autenticación**
  - Inicio de sesión (email y contraseña).
  - Registro de nuevos usuarios.
  - Protección de rutas con guard; redirección a login si no hay sesión.

- **Inventario de productos**
  - Listado de productos con nombre, SKU, categoría, stock actual, precio y estado.
  - Crear producto: nombre, SKU, categoría, precio, stock actual, stock mínimo y estado activo/inactivo.
  - Editar producto: modificar todos los datos anteriores.
  - Eliminar producto (con confirmación).

- **Categorías**
  - Listado y gestión de categorías para clasificar productos.

- **Usuarios** (panel de administración)
  - Listado de usuarios con nombre, correo, rol, estado y fecha de registro.
  - Crear usuario: nombre, correo, contraseña y rol (Usuario / Administrador).
  - Editar usuario: modificar nombre, correo, rol, estado y opcionalmente contraseña.
  - Eliminar usuario (con confirmación).

- **API REST (backend)**
  - Endpoints para productos, categorías, inventario, movimientos de inventario y usuarios.
  - Validación de datos con DTOs y persistencia en base de datos PostgreSQL.

---

## Stack tecnológico

| Área        | Tecnología |
|------------|------------|
| **Frontend** | Angular 21, Angular Material, Angular CDK, RxJS, TypeScript 5.9 |
| **Backend**  | NestJS 10, TypeORM, class-validator, class-transformer |
| **Autenticación** | JWT (Passport), bcrypt |
| **Base de datos** | PostgreSQL |
| **Herramientas** | Angular CLI, Vitest (tests) |

### Frontend
- **Angular** – SPA con componentes standalone, reactive forms y router.
- **Angular Material** – Componentes UI (tablas, formularios, botones, chips, etc.).
- **RxJS** – Flujos asíncronos y peticiones HTTP.

### Backend
- **NestJS** – API REST modular (módulos Auth, Products, Categories, Inventory, Users).
- **TypeORM** – ORM y conexión a PostgreSQL.
- **Passport + JWT** – Estrategia de autenticación por token.
- **bcrypt** – Hash de contraseñas.
- **class-validator** – Validación de DTOs en peticiones.

---

## Requisitos previos

- **Node.js** (v18 o superior recomendado)
- **PostgreSQL** (para el backend)
- **npm** (incluido con Node.js)

---

## Cómo ejecutar el proyecto

### 1. Base de datos

Crear una base de datos en PostgreSQL (por ejemplo `control_product`) y, si quieres, configurar variables de entorno en `backend/` (o usar los valores por defecto en `database.config.ts`).

### 2. Backend (API)

```bash
cd backend
npm install
npm run start:dev
```

La API quedará disponible en `http://localhost:3000/api`.

### 3. Frontend (Angular)

Desde la raíz del proyecto:

```bash
npm install
ng serve
```

Abre el navegador en `http://localhost:4200/`.

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Servidor de desarrollo del frontend (puerto 4200) |
| `ng build` | Compilar el frontend para producción |
| `ng test` | Ejecutar tests unitarios (Vitest) |
| `cd backend && npm run start:dev` | Backend en modo desarrollo con recarga |

---

## Estructura del repositorio

```
Control_Product/
├── src/                    # Frontend (Angular)
│   ├── app/
│   │   ├── core/           # Servicios, guards, interceptors
│   │   ├── modules/        # auth, inventory, users
│   │   └── shared/         # layout, componentes comunes
│   └── environments/
├── backend/                # API (NestJS)
│   ├── src/
│   │   ├── auth/           # Login, JWT, usuarios
│   │   ├── products/       # Productos
│   │   ├── categories/     # Categorías
│   │   ├── inventory/      # Inventario y movimientos
│   │   └── users/          # Entidad User
│   └── scripts/
└── README.md
```

---

## Recursos adicionales

- [Angular CLI](https://angular.dev/tools/cli)
- [NestJS](https://nestjs.com/)
- [Angular Material](https://material.angular.io/)
