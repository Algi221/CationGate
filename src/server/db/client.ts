import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

      // Migrasi otomatis: Tambah kolom baru sesuai skema terbaru
      await client.query(`
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS registration_no VARCHAR(50);
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS physical_doc_verified BOOLEAN DEFAULT FALSE;
        -- Fix production naming mismatch (Supabase uses student_applicants)
        ALTER TABLE student_applicants ADD COLUMN IF NOT EXISTS registration_no VARCHAR(50);
        ALTER TABLE student_applicants ADD COLUMN IF NOT EXISTS physical_docs_checklist JSONB;
        -- Status sekolah lama: VERIFIED → FULL_VERIFIED
        UPDATE schools SET status = 'FULL_VERIFIED' WHERE status = 'VERIFIED' OR status = 'verified';
      `);

      console.log('PostgreSQL Database tables verified/initialized successfully.');
    } else {
      console.warn('Database schema.sql file not found at', schemaPath);
    }
  } catch (error: unknown) {
    console.error('Failed to connect or initialize PostgreSQL database:', (error as any).message);
    console.warn('Berjalan dalam mode fallback mock-db. Kueri database mungkin gagal sebelum konfigurasi diperbarui.');
  } finally {
    if (client) client.release();
  }
}
