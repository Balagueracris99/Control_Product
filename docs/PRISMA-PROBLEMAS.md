# Problemas detectados con Prisma

## 1. **DATABASE_URL apunta a un servidor distinto**

En la raíz del proyecto, `.env` tiene:

```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
```

Eso conecta con **Prisma Postgres** en el puerto **51213**, no con el PostgreSQL que usa el backend (puerto **5432**).

- El **backend (NestJS)** usa PostgreSQL en `localhost:5432` (configuración en `backend/.env`: DB_HOST, DB_PORT, DB_USER, DB_NAME).
- Si no tienes el servidor "Prisma Postgres" corriendo en el puerto 51213, cualquier comando de Prisma (`prisma generate`, `prisma migrate`, etc.) fallará al conectar.

**Solución:** Usar la misma base que el backend. En la raíz, en tu `.env`, define por ejemplo:

```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/control_product"
```

(Sustituye `TU_PASSWORD` por el valor de `DB_PASSWORD` de `backend/.env`.)

---

## 2. **Prisma en el proyecto Angular (frontend)**

En el `package.json` de la **raíz** (proyecto Angular) tienes:

- `@prisma/client` (dependencies)
- `prisma` (devDependencies)

**Problema:** Prisma y Prisma Client están pensados para **Node.js**. En el navegador (Angular) no se ejecutan. Tu backend ya usa **TypeORM** para hablar con PostgreSQL.

Tener Prisma en el frontend implica:

- No podrás usar el cliente de Prisma en el código Angular que corre en el navegador.
- Duplicidad de herramientas de acceso a datos (TypeORM en backend, Prisma en raíz).

**Recomendación:**

- Si **no** vas a usar Prisma en ningún sitio: quita `prisma` y `@prisma/client` del `package.json` de la raíz y borra `prisma/`, `prisma.config.ts` y la referencia a `src/generated/prisma` si existe.
- Si **sí** quieres usar Prisma: úsalo solo en el **backend** (por ejemplo en otra carpeta o módulo Node/NestJS), no en el proyecto Angular. En ese caso, instala Prisma en `backend/` y deja el frontend solo con llamadas HTTP a la API.

---

## 3. **schema.prisma sin modelos**

En `prisma/schema.prisma` solo está definido el `datasource` y el `generator`. No hay ningún `model`.

Sin modelos, `prisma generate` no generará nada útil y no podrás hacer migraciones con tablas.

Si quieres usar Prisma contra la misma base que TypeORM, tendrías que definir modelos que reflejen las tablas actuales (users, products, categories, inventory, etc.) y entonces tendrías dos capas de acceso a la misma base (TypeORM y Prisma), lo que suele ser confuso.

---

## Resumen

| Problema | Causa | Acción recomendada |
|----------|--------|----------------------|
| Prisma no conecta / errores al usar Prisma | DATABASE_URL apunta a Prisma Postgres (51213) en vez de a tu PostgreSQL (5432) | Poner en `.env` de la raíz `DATABASE_URL="postgresql://..."` con host, puerto, usuario y base del backend. |
| Prisma en el frontend | Prisma está en el package.json del proyecto Angular | Quitar Prisma del frontend o moverlo al backend y usar solo la API desde Angular. |
| Dos formas de acceder a la BD | Backend con TypeORM + Prisma en la raíz | Decidir: o solo TypeORM (como ahora) o solo Prisma; evitar mezclar ambos en el mismo flujo. |

Si indicas si quieres **dejar de usar Prisma** o **usarlo solo en el backend**, se pueden dar los pasos concretos (qué borrar, qué instalar y cómo dejar un solo `DATABASE_URL` coherente con el backend).
