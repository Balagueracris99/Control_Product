-- Añade los campos de stock a la tabla products (si ya existe sin ellos)
-- Ejecutar con: psql -U postgres -d control_product -f scripts/add-stock-to-products.sql

-- Añadir current_stock si no existe
ALTER TABLE products ADD COLUMN IF NOT EXISTS current_stock INTEGER NOT NULL DEFAULT 0;

-- Añadir min_stock si no existe
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock INTEGER NOT NULL DEFAULT 0;

-- Comentario
COMMENT ON COLUMN products.current_stock IS 'Cantidad actual en inventario';
COMMENT ON COLUMN products.min_stock IS 'Stock mínimo para alertas';
