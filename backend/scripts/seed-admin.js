/**
 * Script para crear el usuario admin en la base de datos.
 * Ejecutar desde la carpeta backend: node scripts/seed-admin.js
 * Requiere: npm install dotenv (o usar variables de entorno)
 */
const path = require('path');
const fs = require('fs');

// Cargar .env manualmente si existe (sin dependencia dotenv)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

const bcrypt = require('bcrypt');
const { Client } = require('pg');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'Control_Product',
};

const ADMIN_EMAIL = 'admin@control-product.com';
const ADMIN_PASSWORD = '123456';
const ADMIN_NAME = 'Admin';

async function seedAdmin() {
  const client = new Client(DB_CONFIG);
  try {
    await client.connect();
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await client.query(
      `INSERT INTO users (name, email, password, role, status, created_at)
       VALUES ($1, $2, $3, 'ADMIN', true, NOW())
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         status = EXCLUDED.status`,
      [ADMIN_NAME, ADMIN_EMAIL, hashedPassword]
    );

    console.log('Usuario admin creado/actualizado correctamente.');
    console.log('  Email:', ADMIN_EMAIL);
    console.log('  Contraseña:', ADMIN_PASSWORD);
  } catch (err) {
    console.error('Error al crear admin:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedAdmin();
