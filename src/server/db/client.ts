import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes('localhost') ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err: Error) => {
  console.warn('PostgreSQL pool notice/idle error:', err.message || err);
});

export async function initDb(): Promise<void> {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL successfully.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {

      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_users (id SERIAL PRIMARY KEY);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email VARCHAR(100);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS nama_lengkap VARCHAR(100);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin';
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS activation_token VARCHAR(100);
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS activation_expires_at TIMESTAMP;
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;
        ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
      `);

      const sql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(sql);

      await client.query(`
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS registration_no VARCHAR(50);
        ALTER TABLE calon_siswa ADD COLUMN IF NOT EXISTS physical_doc_verified BOOLEAN DEFAULT FALSE;
        -- Fix production naming mismatch (Supabase uses student_applicants)
        ALTER TABLE student_applicants ADD COLUMN IF NOT EXISTS registration_no VARCHAR(50);
        ALTER TABLE student_applicants ADD COLUMN IF NOT EXISTS physical_docs_checklist JSONB;
        -- Status sekolah lama: VERIFIED → FULL_VERIFIED
        UPDATE schools SET status = 'FULL_VERIFIED' WHERE status = 'VERIFIED' OR status = 'verified';

        -- Relax FK constraints to support prospective/new school tenants
        ALTER TABLE landing_page_config DROP CONSTRAINT IF EXISTS landing_page_config_school_id_fkey;
        ALTER TABLE ui_revisions DROP CONSTRAINT IF EXISTS ui_revisions_school_id_fkey;
        ALTER TABLE informasi DROP CONSTRAINT IF EXISTS informasi_school_id_fkey;

        -- Expand column sizes in calon_siswa and student_applicants
        DO $$ BEGIN
          ALTER TABLE calon_siswa ALTER COLUMN kode_pos TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN golongan_darah TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN punya_kps TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN punya_kip TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN perkelahian TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN narkoba TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN pelanggaran_lain TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN kode_pos_ayah TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN kode_pos_ibu TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN kode_pos_wali TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN kewarganegaraan TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN kewarganegaraan_ayah TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN kewarganegaraan_ibu TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN kewarganegaraan_wali TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN diterima_kelas TYPE VARCHAR(100);
          ALTER TABLE calon_siswa ALTER COLUMN jurusan_1 TYPE VARCHAR(100);
          ALTER TABLE calon_siswa ALTER COLUMN periode TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN gelombang TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN whatsapp TYPE VARCHAR(50);
          ALTER TABLE calon_siswa ALTER COLUMN telepon_ortu TYPE VARCHAR(50);
        EXCEPTION WHEN OTHERS THEN NULL;
        END $$;

        DO $$ BEGIN
          ALTER TABLE student_applicants ALTER COLUMN kode_pos TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN golongan_darah TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN punya_kps TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN punya_kip TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN perkelahian TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN narkoba TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN pelanggaran_lain TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN kode_pos_ayah TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN kode_pos_ibu TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN kode_pos_wali TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN kewarganegaraan TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN kewarganegaraan_ayah TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN kewarganegaraan_ibu TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN kewarganegaraan_wali TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN diterima_kelas TYPE VARCHAR(100);
          ALTER TABLE student_applicants ALTER COLUMN jurusan_1 TYPE VARCHAR(100);
          ALTER TABLE student_applicants ALTER COLUMN periode TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN gelombang TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN whatsapp TYPE VARCHAR(50);
          ALTER TABLE student_applicants ALTER COLUMN telepon_ortu TYPE VARCHAR(50);
        EXCEPTION WHEN OTHERS THEN NULL;
        END $$;

        -- Convert school_id columns to TEXT to seamlessly support UUID, numeric, and slug tenants
        DO $$ BEGIN
          ALTER TABLE landing_page_config ALTER COLUMN school_id TYPE TEXT USING school_id::text;
        EXCEPTION WHEN OTHERS THEN NULL;
        END $$;

        DO $$ BEGIN
          ALTER TABLE ui_revisions ALTER COLUMN school_id TYPE TEXT USING school_id::text;
        EXCEPTION WHEN OTHERS THEN NULL;
        END $$;

        DO $$ BEGIN
          ALTER TABLE informasi ALTER COLUMN school_id TYPE TEXT USING school_id::text;
        EXCEPTION WHEN OTHERS THEN NULL;
        END $$;

        CREATE TABLE IF NOT EXISTS school_profiles (
          id SERIAL PRIMARY KEY,
          school_id TEXT UNIQUE NOT NULL,
          npsn VARCHAR(50),
          akreditasi VARCHAR(50),
          nama VARCHAR(255),
          status VARCHAR(50) DEFAULT 'Swasta',
          kurikulum VARCHAR(100) DEFAULT 'Kurikulum Merdeka',
          tahun_berdiri VARCHAR(10),
          nis VARCHAR(50),
          nss VARCHAR(50),
          alamat TEXT,
          telepon VARCHAR(50),
          email VARCHAR(255),
          logo_url TEXT,
          hero_image TEXT,
          video_profil_url TEXT,
          sejarah TEXT,
          ringkasan TEXT,
          visi TEXT,
          misi TEXT,
          tujuan TEXT,
          pimpinan JSONB DEFAULT '{"nama": "", "jabatan": "Kepala Sekolah", "sambutan": "", "foto": ""}'::jsonb,
          fasilitas JSONB DEFAULT '[]'::jsonb,
          sosial_media JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      console.log('PostgreSQL Database tables verified/initialized successfully.');
    } else {
      console.warn('Database schema.sql file not found at', schemaPath);
    }
  } catch (error: unknown) {
    console.error('Failed to connect or initialize PostgreSQL database:', error instanceof Error ? error.message : String(error));
    console.warn('Berjalan dalam mode fallback mock-db. Kueri database mungkin gagal sebelum konfigurasi diperbarui.');
  } finally {
    if (client) client.release();
  }
}
