import 'dotenv/config';
import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes('localhost') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});


export async function initDb(): Promise<void> {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL successfully.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      // Pra-migrasi: Pastikan kolom role di admin_users sudah ada sebelum SQL skema dijalankan
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_users (id SERIAL PRIMARY KEY);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS nama_lengkap VARCHAR(100);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin';
      `);

      const sql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(sql);

      // Migrasi otomatis: Pastikan kolom pembayaran, periode, dan dokumen ada di tabel yang sudah ada
      await client.query(`
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'Unpaid';
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS periode VARCHAR(20) DEFAULT '2026-2027';
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS gelombang VARCHAR(20) DEFAULT 'Gelombang 1';
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS berkas_foto TEXT;
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS bukti_bayar TEXT;
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS metode_pembayaran VARCHAR(50) DEFAULT 'Payment Gateway';
      `);

      // Pastikan tabel ui_revisions sudah ada
      await client.query(`
        CREATE TABLE IF NOT EXISTS ui_revisions (
            id SERIAL PRIMARY KEY,
            config_values JSONB NOT NULL,
            changed_by VARCHAR(100) DEFAULT 'admin',
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('PostgreSQL Database tables verified/initialized successfully.');
    } else {
      console.warn('Database schema.sql file not found at', schemaPath);
    }
  } catch (error: any) {
    console.error('Failed to connect or initialize PostgreSQL database:', error.message);
    console.warn('Berjalan dalam mode fallback mock-db. Kueri database mungkin gagal sebelum konfigurasi diperbarui.');
  } finally {
    if (client) client.release();
  }
}
