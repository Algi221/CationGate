import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let rawConnStr = process.env.DATABASE_URL || '';

// Auto-fix IPv6-only db.<ref>.supabase.co hostnames to IPv4 pooler if encountered
if (rawConnStr && rawConnStr.includes('db.') && rawConnStr.includes('.supabase.co')) {
  const match = rawConnStr.match(/db\.([a-z0-9]+)\.supabase\.co/);
  if (match) {
    const projectRef = match[1];
    rawConnStr = rawConnStr
      .replace(`@db.${projectRef}.supabase.co:5432`, `@aws-0-ap-southeast-1.pooler.supabase.com:5432`)
      .replace(`@db.${projectRef}.supabase.co`, `@aws-0-ap-southeast-1.pooler.supabase.com:5432`);
    if (!rawConnStr.includes(`.${projectRef}:`)) {
      rawConnStr = rawConnStr.replace(/:\/\/(.*?):/, `://$1.${projectRef}:`);
    }
  }
}

const connectionString = rawConnStr;

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
      `);

      // Expand all column sizes in calon_siswa and student_applicants
      const colsToExpand = [
        'kewarganegaraan', 'kewarganegaraan_ayah', 'kewarganegaraan_ibu', 'kewarganegaraan_wali',
        'golongan_darah', 'rt_rw', 'rtrw_ayah', 'rtrw_ibu', 'rtrw_wali',
        'agama', 'agama_ayah', 'agama_ibu', 'agama_wali',
        'kode_pos', 'kode_pos_ayah', 'kode_pos_ibu', 'kode_pos_wali',
        'punya_kps', 'no_kps', 'punya_kip', 'no_kip',
        'perkelahian', 'narkoba', 'pelanggaran_lain',
        'diterima_kelas', 'jurusan_1', 'periode', 'gelombang',
        'whatsapp', 'telepon_ortu', 'jarak_sekolah', 'tinggal_dengan', 'transportasi',
        'sekolah_asal', 'penyakit_diderita', 'status_ayah', 'status_ibu', 'status_wali',
        'pendidikan_ayah', 'pendidikan_ibu', 'pendidikan_wali',
        'pekerjaan_ayah', 'pekerjaan_ibu', 'pekerjaan_wali',
        'penghasilan_ayah', 'penghasilan_ibu', 'penghasilan_wali',
        'kelurahan', 'kelurahan_ayah', 'kelurahan_ibu', 'kelurahan_wali',
        'kecamatan', 'kecamatan_ayah', 'kecamatan_ibu', 'kecamatan_wali',
        'no_ijazah', 'no_skhun', 'no_peserta_un', 'pindahan_dari', 'alasan_pindah',
        'hobi', 'cita_cita', 'cita_cita_setelah_lulus', 'pelajaran_disenangi',
        'alasan_disenangi', 'kesulitan_belajar', 'ket_perkelahian', 'ket_narkoba', 'ket_pelanggaran_lain'
      ];

      for (const tbl of ['student_applicants', 'calon_siswa']) {
        for (const col of colsToExpand) {
          try {
            await client.query(`ALTER TABLE ${tbl} ALTER COLUMN ${col} TYPE VARCHAR(255)`);
          } catch (_colErr) {}
        }
        const numColsToExpand = ['jarak_km', 'nilai_us_teori', 'nilai_us_praktik', 'nilai_muatan_lokal'];
        for (const col of numColsToExpand) {
          try {
            await client.query(`ALTER TABLE ${tbl} ALTER COLUMN ${col} TYPE NUMERIC`);
          } catch (_colErr) {}
        }
      }

      await client.query(`
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

        CREATE TABLE IF NOT EXISTS active_students (
          id SERIAL PRIMARY KEY,
          school_id TEXT,
          calon_siswa_id INTEGER,
          nama VARCHAR(255) NOT NULL,
          nisn VARCHAR(50),
          nik VARCHAR(50),
          tempat_lahir VARCHAR(100),
          tgl_lahir VARCHAR(50),
          jenis_kelamin VARCHAR(10),
          agama VARCHAR(50),
          kewarganegaraan VARCHAR(100),
          alamat TEXT,
          rt_rw VARCHAR(50),
          kelurahan VARCHAR(100),
          kecamatan VARCHAR(100),
          kode_pos VARCHAR(20),
          whatsapp VARCHAR(50),
          email VARCHAR(100),
          tinggal_dengan VARCHAR(100),
          transportasi VARCHAR(100),
          tinggi_badan NUMERIC DEFAULT 0,
          berat_badan NUMERIC DEFAULT 0,
          jarak_sekolah VARCHAR(100),
          jarak_km NUMERIC DEFAULT 0,
          waktu_jam NUMERIC DEFAULT 0,
          waktu_menit NUMERIC DEFAULT 0,
          jumlah_saudara INTEGER DEFAULT 0,
          golongan_darah VARCHAR(10),
          penyakit_diderita TEXT,
          kebutuhan_khusus TEXT,
          punya_kps VARCHAR(10),
          no_kps VARCHAR(50),
          punya_kip VARCHAR(10),
          no_kip VARCHAR(50),
          jenis_prestasi VARCHAR(100),
          tingkat_prestasi VARCHAR(100),
          uraian_prestasi TEXT,
          tahun_prestasi VARCHAR(20),
          penyelenggara VARCHAR(150),
          jenis_beasiswa VARCHAR(100),
          uraian_beasiswa TEXT,
          tahun_mulai_beasiswa VARCHAR(20),
          tahun_selesai_beasiswa VARCHAR(20),
          nama_ayah VARCHAR(150),
          tempat_lahir_ayah VARCHAR(100),
          tgl_lahir_ayah VARCHAR(50),
          agama_ayah VARCHAR(50),
          kewarganegaraan_ayah VARCHAR(100),
          pendidikan_ayah VARCHAR(100),
          pekerjaan_ayah VARCHAR(100),
          penghasilan_ayah VARCHAR(100),
          alamat_ayah TEXT,
          rtrw_ayah VARCHAR(50),
          kelurahan_ayah VARCHAR(100),
          kecamatan_ayah VARCHAR(100),
          kode_pos_ayah VARCHAR(20),
          status_ayah VARCHAR(50),
          nama_ibu VARCHAR(150),
          tempat_lahir_ibu VARCHAR(100),
          tgl_lahir_ibu VARCHAR(50),
          agama_ibu VARCHAR(50),
          kewarganegaraan_ibu VARCHAR(100),
          pendidikan_ibu VARCHAR(100),
          pekerjaan_ibu VARCHAR(100),
          penghasilan_ibu VARCHAR(100),
          alamat_ibu TEXT,
          rtrw_ibu VARCHAR(50),
          kelurahan_ibu VARCHAR(100),
          kecamatan_ibu VARCHAR(100),
          kode_pos_ibu VARCHAR(20),
          status_ibu VARCHAR(50),
          nama_wali VARCHAR(150),
          tempat_lahir_wali VARCHAR(100),
          tgl_lahir_wali VARCHAR(50),
          agama_wali VARCHAR(50),
          kewarganegaraan_wali VARCHAR(100),
          pendidikan_wali VARCHAR(100),
          pekerjaan_wali VARCHAR(100),
          penghasilan_wali VARCHAR(100),
          alamat_wali TEXT,
          rtrw_wali VARCHAR(50),
          kelurahan_wali VARCHAR(100),
          kecamatan_wali VARCHAR(100),
          kode_pos_wali VARCHAR(20),
          status_wali VARCHAR(50),
          telepon_ortu VARCHAR(50),
          sekolah_asal VARCHAR(150),
          tgl_lulus VARCHAR(50),
          no_ijazah VARCHAR(100),
          no_skhun VARCHAR(100),
          no_peserta_un VARCHAR(100),
          lama_belajar VARCHAR(50),
          pindahan_dari VARCHAR(150),
          alasan_pindah TEXT,
          diterima_kelas VARCHAR(100),
          diterima_tanggal VARCHAR(50),
          jurusan VARCHAR(150),
          alasan_memilih TEXT,
          cita_cita VARCHAR(100),
          hobi VARCHAR(100),
          nilai_us_teori NUMERIC,
          nilai_us_praktik NUMERIC,
          nilai_muatan_lokal NUMERIC,
          kesulitan_belajar TEXT,
          pelajaran_disenangi VARCHAR(100),
          cita_cita_setelah_lulus VARCHAR(150),
          periode VARCHAR(50),
          gelombang VARCHAR(50),
          nipd VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
