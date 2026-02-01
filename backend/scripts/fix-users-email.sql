-- TypeORM intenta ADD la columna "email" NOT NULL pero la tabla ya tiene filas,
-- por eso falla. Ejecuta UNA de las dos opciones en la base control_product.

-- =============================================================================
-- OPCIÓN A: No necesitas los datos actuales (más simple)
-- =============================================================================
-- Borra la tabla y deja que el backend la cree de nuevo al reiniciar.
DROP TABLE IF EXISTS users;

-- Luego reinicia el backend (npm run start:dev). La tabla se creará con la
-- estructura correcta (id, name, email, password, role, status, created_at).


-- =============================================================================
-- OPCIÓN B: Quieres conservar los datos (la tabla ya existe sin columna email)
-- =============================================================================
-- Descomenta y ejecuta estos comandos UNO POR UNO si la columna email no existe:

-- 1. Añadir la columna como nullable primero
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- 2. Rellenar email para todas las filas (ajusta si tu tabla tiene otra PK)
-- UPDATE users SET email = 'user_' || id || '@placeholder.local' WHERE email IS NULL;

-- 3. Hacer la columna obligatoria
-- ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- 4. Añadir restricción única (quita si da error porque ya existe)
-- ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
