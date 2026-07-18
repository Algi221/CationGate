        -- Database Schema PPDB SMK Taruna Bhakti Depok
        -- Compatibility: PostgreSQL (pgAdmin ready)

        -- Table for Admin Users
        CREATE TABLE IF NOT EXISTS admin_users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            nama_lengkap VARCHAR(100) NOT NULL,
            role VARCHAR(20) DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Table for Student Applicants (Calon Siswa)
        CREATE TABLE IF NOT EXISTS calon_siswa (
            id SERIAL PRIMARY KEY,
            -- Core Identity
            nama VARCHAR(150) NOT NULL,
            nisn VARCHAR(10) UNIQUE NOT NULL,
            nik VARCHAR(16) UNIQUE NOT NULL,
            tempat_lahir VARCHAR(100) NOT NULL,
            tgl_lahir DATE NOT NULL,
            jenis_kelamin CHAR(1) NOT NULL, -- 'L' or 'P'
            agama VARCHAR(20) NOT NULL,
            kewarganegaraan VARCHAR(3) DEFAULT 'WNI', -- 'WNI' or 'WNA'
            
            -- Address & Contact
            alamat TEXT NOT NULL,
            rt_rw VARCHAR(10) NOT NULL,
            kelurahan VARCHAR(50) NOT NULL,
            kecamatan VARCHAR(50) NOT NULL,
            kode_pos VARCHAR(5) NOT NULL,
            whatsapp VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            tinggal_dengan VARCHAR(30) NOT NULL,
            transportasi VARCHAR(30) NOT NULL,
            
            -- Physical Metrics & Periodik
            tinggi_badan INTEGER NOT NULL,
            berat_badan INTEGER NOT NULL,
            jarak_sekolah VARCHAR(30) NOT NULL,
            jarak_km NUMERIC(5,2) NOT NULL,
            waktu_jam INTEGER NOT NULL,
            waktu_menit INTEGER NOT NULL,
            jumlah_saudara INTEGER NOT NULL,
            golongan_darah VARCHAR(5) NOT NULL,
            
            -- Health & Custom Aid
            penyakit_diderita VARCHAR(150),
            kebutuhan_khusus JSONB, -- Stored as dynamic array e.g. ["Autis", "Indigo"]
            punya_kps VARCHAR(5) DEFAULT 'Tidak',
            no_kps VARCHAR(30),
            punya_kip VARCHAR(5) DEFAULT 'Tidak',
            no_kip VARCHAR(30),
            
            -- Achievements & Scholarships (JSONB for dynamic array collections)
            jenis_prestasi JSONB,
            tingkat_prestasi JSONB,
            uraian_prestasi TEXT,
            tahun_prestasi VARCHAR(10),
            penyelenggara VARCHAR(100),
            
            jenis_beasiswa JSONB,
            uraian_beasiswa TEXT,
            tahun_mulai_beasiswa VARCHAR(10),
            tahun_selesai_beasiswa VARCHAR(10),
            
            -- Father Information
            nama_ayah VARCHAR(150),
            tempat_lahir_ayah VARCHAR(100),
            tgl_lahir_ayah DATE,
            agama_ayah VARCHAR(20),
            kewarganegaraan_ayah VARCHAR(3) DEFAULT 'WNI',
            pendidikan_ayah VARCHAR(50),
            pekerjaan_ayah VARCHAR(100),
            penghasilan_ayah VARCHAR(50),
            alamat_ayah TEXT,
            rtrw_ayah VARCHAR(10),
            kelurahan_ayah VARCHAR(50),
            kecamatan_ayah VARCHAR(50),
            kode_pos_ayah VARCHAR(5),
            status_ayah VARCHAR(30) DEFAULT 'Masih Hidup',
            
            -- Mother Information
            nama_ibu VARCHAR(150),
            tempat_lahir_ibu VARCHAR(100),
            tgl_lahir_ibu DATE,
            agama_ibu VARCHAR(20),
            kewarganegaraan_ibu VARCHAR(3) DEFAULT 'WNI',
            pendidikan_ibu VARCHAR(50),
            pekerjaan_ibu VARCHAR(100),
            penghasilan_ibu VARCHAR(50),
            alamat_ibu TEXT,
            rtrw_ibu VARCHAR(10),
            kelurahan_ibu VARCHAR(50),
            kecamatan_ibu VARCHAR(50),
            kode_pos_ibu VARCHAR(5),
            status_ibu VARCHAR(30) DEFAULT 'Masih Hidup',
            
            -- Guardian Information (Wali)
            nama_wali VARCHAR(150),
            tempat_lahir_wali VARCHAR(100),
            tgl_lahir_wali DATE,
            agama_wali VARCHAR(20),
            kewarganegaraan_wali VARCHAR(3) DEFAULT 'WNI',
            pendidikan_wali VARCHAR(50),
            pekerjaan_wali VARCHAR(100),
            penghasilan_wali VARCHAR(50),
            alamat_wali TEXT,
            rtrw_wali VARCHAR(10),
            kelurahan_wali VARCHAR(50),
            kecamatan_wali VARCHAR(50),
            kode_pos_wali VARCHAR(5),
            status_wali VARCHAR(30) DEFAULT 'Masih Hidup',
            
            telepon_ortu VARCHAR(15) NOT NULL,
            
            -- Previous Academic Info
            sekolah_asal VARCHAR(150) NOT NULL,
            tgl_lulus DATE NOT NULL,
            no_ijazah VARCHAR(50),
            no_skhun VARCHAR(50),
            no_peserta_un VARCHAR(50),
            lama_belajar INTEGER,
            pindahan_dari VARCHAR(150),
            alasan_pindah TEXT,
            diterima_kelas VARCHAR(20),
            diterima_tanggal DATE,
            
            -- Majors Choice
            jurusan_1 VARCHAR(50) NOT NULL,
            alasan_memilih TEXT,
            
            -- Habits & Grades
            hobi JSONB,
            cita_cita VARCHAR(100),
            nilai_us_teori NUMERIC(5,2),
            nilai_us_praktik NUMERIC(5,2),
            nilai_muatan_lokal NUMERIC(5,2),
            cita_cita_setelah_lulus VARCHAR(100),
            pelajaran_disenangi VARCHAR(100),
            alasan_disenangi TEXT,
            kesulitan_belajar TEXT,
            
            -- Pledges
            perkelahian VARCHAR(5) DEFAULT 'Tidak',
            ket_perkelahian TEXT,
            narkoba VARCHAR(5) DEFAULT 'Tidak',
            ket_narkoba TEXT,
            pelanggaran_lain VARCHAR(5) DEFAULT 'Tidak',
            ket_pelanggaran_lain TEXT,
            janji_taat BOOLEAN DEFAULT FALSE,
            janji_sanksi BOOLEAN DEFAULT FALSE,
            janji_akrab BOOLEAN DEFAULT FALSE,
            janji_belajar BOOLEAN DEFAULT FALSE,
            janji_nama_baik BOOLEAN DEFAULT FALSE,
            
            -- Period & Uploaded Documents
            periode VARCHAR(20) DEFAULT '2026-2027',
            gelombang VARCHAR(20) DEFAULT 'Gelombang 1',
            berkas_foto TEXT,
            bukti_bayar TEXT,
            metode_pembayaran VARCHAR(50) DEFAULT 'Payment Gateway',

            -- Administrative System Fields
            status VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
            payment_status VARCHAR(20) DEFAULT 'Unpaid', -- 'Unpaid', 'Paid'
            tgl_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Indexing for fast lookups
        CREATE INDEX IF NOT EXISTS idx_calon_siswa_nisn ON calon_siswa(nisn);
        CREATE INDEX IF NOT EXISTS idx_calon_siswa_nik ON calon_siswa(nik);
        CREATE INDEX IF NOT EXISTS idx_calon_siswa_status ON calon_siswa(status);

        -- Seed default admin user:
        -- Username: Kevin
        -- Password: RPLSTRONG (bcrypt hash: $2a$10$HJAdFhU530BR89CfkV3ssON1ttR9.BTr6G4O3NFjjgLqMR7lMeUlS)
        INSERT INTO admin_users (username, password_hash, nama_lengkap, role) 
        VALUES ('Kevin', '$2a$10$HJAdFhU530BR89CfkV3ssON1ttR9.BTr6G4O3NFjjgLqMR7lMeUlS', 'Administrator PPDB TB', 'superadmin')
        ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;

        -- Seed default admin user:
        -- Username: admin_tb
        -- Password: AdminTarunaBhakti2026 (bcrypt hash: $2a$10$9.8ZaoTOEEpOo89r7wawguTCJRzkhMuZ.D9i21lWsQ0eBxk0O9cyi)
        INSERT INTO admin_users (username, password_hash, nama_lengkap, role) 
        VALUES ('admin_tb', '$2a$10$9.8ZaoTOEEpOo89r7wawguTCJRzkhMuZ.D9i21lWsQ0eBxk0O9cyi', 'Panitia PPDB Biasa', 'admin')
        ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;

        -- Table for Information & Announcements
        CREATE TABLE IF NOT EXISTS informasi (
            id SERIAL PRIMARY KEY,
            judul VARCHAR(255) NOT NULL,
            konten TEXT NOT NULL,
            tanggal DATE NOT NULL,
            foto_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Table for Landing Page Configuration (Dynamic Key-Value Store)
        CREATE TABLE IF NOT EXISTS landing_page_config (
            config_key VARCHAR(50) PRIMARY KEY,
            config_value JSONB NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Table for User Interface Configuration Revisions/Change Log
        CREATE TABLE IF NOT EXISTS ui_revisions (
            id SERIAL PRIMARY KEY,
            config_values JSONB NOT NULL,
            changed_by VARCHAR(100) DEFAULT 'admin',
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
