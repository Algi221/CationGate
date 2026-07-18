-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'admin',
    "ysbmo_token" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calon_siswa" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "nisn" VARCHAR(10) NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "tempat_lahir" VARCHAR(100) NOT NULL,
    "tgl_lahir" DATE NOT NULL,
    "jenis_kelamin" CHAR(1) NOT NULL,
    "agama" VARCHAR(20) NOT NULL,
    "kewarganegaraan" VARCHAR(3) DEFAULT 'WNI',
    "alamat" TEXT NOT NULL,
    "rt_rw" VARCHAR(10) NOT NULL,
    "kelurahan" VARCHAR(50) NOT NULL,
    "kecamatan" VARCHAR(50) NOT NULL,
    "kode_pos" VARCHAR(5) NOT NULL,
    "whatsapp" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "tinggal_dengan" VARCHAR(30) NOT NULL,
    "transportasi" VARCHAR(30) NOT NULL,
    "tinggi_badan" INTEGER NOT NULL,
    "berat_badan" INTEGER NOT NULL,
    "jarak_sekolah" VARCHAR(30) NOT NULL,
    "jarak_km" DECIMAL(5,2) NOT NULL,
    "waktu_jam" INTEGER NOT NULL,
    "waktu_menit" INTEGER NOT NULL,
    "jumlah_saudara" INTEGER NOT NULL,
    "golongan_darah" VARCHAR(5) NOT NULL,
    "penyakit_diderita" VARCHAR(150),
    "kebutuhan_khusus" JSONB,
    "punya_kps" VARCHAR(5) DEFAULT 'Tidak',
    "no_kps" VARCHAR(30),
    "punya_kip" VARCHAR(5) DEFAULT 'Tidak',
    "no_kip" VARCHAR(30),
    "jenis_prestasi" JSONB,
    "tingkat_prestasi" JSONB,
    "uraian_prestasi" TEXT,
    "tahun_prestasi" VARCHAR(10),
    "penyelenggara" VARCHAR(100),
    "jenis_beasiswa" JSONB,
    "uraian_beasiswa" TEXT,
    "tahun_mulai_beasiswa" VARCHAR(10),
    "tahun_selesai_beasiswa" VARCHAR(10),
    "nama_ayah" VARCHAR(150),
    "tempat_lahir_ayah" VARCHAR(100),
    "tgl_lahir_ayah" DATE,
    "agama_ayah" VARCHAR(20),
    "kewarganegaraan_ayah" VARCHAR(3) DEFAULT 'WNI',
    "pendidikan_ayah" VARCHAR(50),
    "pekerjaan_ayah" VARCHAR(100),
    "penghasilan_ayah" VARCHAR(50),
    "alamat_ayah" TEXT,
    "rtrw_ayah" VARCHAR(10),
    "kelurahan_ayah" VARCHAR(50),
    "kecamatan_ayah" VARCHAR(50),
    "kode_pos_ayah" VARCHAR(5),
    "status_ayah" VARCHAR(30) DEFAULT 'Masih Hidup',
    "nama_ibu" VARCHAR(150),
    "tempat_lahir_ibu" VARCHAR(100),
    "tgl_lahir_ibu" DATE,
    "agama_ibu" VARCHAR(20),
    "kewarganegaraan_ibu" VARCHAR(3) DEFAULT 'WNI',
    "pendidikan_ibu" VARCHAR(50),
    "pekerjaan_ibu" VARCHAR(100),
    "penghasilan_ibu" VARCHAR(50),
    "alamat_ibu" TEXT,
    "rtrw_ibu" VARCHAR(10),
    "kelurahan_ibu" VARCHAR(50),
    "kecamatan_ibu" VARCHAR(50),
    "kode_pos_ibu" VARCHAR(5),
    "status_ibu" VARCHAR(30) DEFAULT 'Masih Hidup',
    "nama_wali" VARCHAR(150),
    "tempat_lahir_wali" VARCHAR(100),
    "tgl_lahir_wali" DATE,
    "agama_wali" VARCHAR(20),
    "kewarganegaraan_wali" VARCHAR(3) DEFAULT 'WNI',
    "pendidikan_wali" VARCHAR(50),
    "pekerjaan_wali" VARCHAR(100),
    "penghasilan_wali" VARCHAR(50),
    "alamat_wali" TEXT,
    "rtrw_wali" VARCHAR(10),
    "kelurahan_wali" VARCHAR(50),
    "kecamatan_wali" VARCHAR(50),
    "kode_pos_wali" VARCHAR(5),
    "status_wali" VARCHAR(30) DEFAULT 'Masih Hidup',
    "telepon_ortu" VARCHAR(15) NOT NULL,
    "sekolah_asal" VARCHAR(150) NOT NULL,
    "tgl_lulus" DATE NOT NULL,
    "no_ijazah" VARCHAR(50),
    "no_skhun" VARCHAR(50),
    "no_peserta_un" VARCHAR(50),
    "lama_belajar" INTEGER,
    "pindahan_dari" VARCHAR(150),
    "alasan_pindah" TEXT,
    "diterima_kelas" VARCHAR(20),
    "diterima_tanggal" DATE,
    "jurusan_1" VARCHAR(50) NOT NULL,
    "jurusan_2" VARCHAR(50) NOT NULL,
    "alasan_memilih" TEXT,
    "hobi" JSONB,
    "cita_cita" VARCHAR(100),
    "nilai_us_teori" DECIMAL(5,2),
    "nilai_us_praktik" DECIMAL(5,2),
    "nilai_muatan_lokal" DECIMAL(5,2),
    "cita_cita_setelah_lulus" VARCHAR(100),
    "pelajaran_disenangi" VARCHAR(100),
    "alasan_disenangi" TEXT,
    "kesulitan_belajar" TEXT,
    "perkelahian" VARCHAR(5) DEFAULT 'Tidak',
    "ket_perkelahian" TEXT,
    "narkoba" VARCHAR(5) DEFAULT 'Tidak',
    "ket_narkoba" TEXT,
    "pelanggaran_lain" VARCHAR(5) DEFAULT 'Tidak',
    "ket_pelanggaran_lain" TEXT,
    "janji_taat" BOOLEAN DEFAULT false,
    "janji_sanksi" BOOLEAN DEFAULT false,
    "janji_akrab" BOOLEAN DEFAULT false,
    "janji_belajar" BOOLEAN DEFAULT false,
    "janji_nama_baik" BOOLEAN DEFAULT false,
    "periode" VARCHAR(20) DEFAULT '2026-2027',
    "gelombang" VARCHAR(20) DEFAULT 'Gelombang 1',
    "berkas_foto" TEXT,
    "bukti_bayar" TEXT,
    "metode_pembayaran" VARCHAR(50) DEFAULT 'Payment Gateway',
    "status" VARCHAR(20) DEFAULT 'Pending',
    "payment_status" VARCHAR(20) DEFAULT 'Unpaid',
    "tgl_daftar" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calon_siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa_aktif" (
    "id" SERIAL NOT NULL,
    "calon_siswa_id" INTEGER,
    "nama" VARCHAR(150) NOT NULL,
    "nisn" VARCHAR(10) NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "tempat_lahir" VARCHAR(100) NOT NULL,
    "tgl_lahir" DATE NOT NULL,
    "jenis_kelamin" CHAR(1) NOT NULL,
    "agama" VARCHAR(20) NOT NULL,
    "kewarganegaraan" VARCHAR(3) DEFAULT 'WNI',
    "alamat" TEXT NOT NULL,
    "rt_rw" VARCHAR(10) NOT NULL,
    "kelurahan" VARCHAR(50) NOT NULL,
    "kecamatan" VARCHAR(50) NOT NULL,
    "kode_pos" VARCHAR(5) NOT NULL,
    "whatsapp" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "tinggal_dengan" VARCHAR(30) NOT NULL,
    "transportasi" VARCHAR(30) NOT NULL,
    "tinggi_badan" INTEGER NOT NULL,
    "berat_badan" INTEGER NOT NULL,
    "jarak_sekolah" VARCHAR(30) NOT NULL,
    "jarak_km" DECIMAL(5,2) NOT NULL,
    "waktu_jam" INTEGER NOT NULL,
    "waktu_menit" INTEGER NOT NULL,
    "jumlah_saudara" INTEGER NOT NULL,
    "golongan_darah" VARCHAR(5) NOT NULL,
    "penyakit_diderita" VARCHAR(150),
    "kebutuhan_khusus" JSONB,
    "punya_kps" VARCHAR(5) DEFAULT 'Tidak',
    "no_kps" VARCHAR(30),
    "punya_kip" VARCHAR(5) DEFAULT 'Tidak',
    "no_kip" VARCHAR(30),
    "jenis_prestasi" JSONB,
    "tingkat_prestasi" JSONB,
    "uraian_prestasi" TEXT,
    "tahun_prestasi" VARCHAR(10),
    "penyelenggara" VARCHAR(100),
    "jenis_beasiswa" JSONB,
    "uraian_beasiswa" TEXT,
    "tahun_mulai_beasiswa" VARCHAR(10),
    "tahun_selesai_beasiswa" VARCHAR(10),
    "nama_ayah" VARCHAR(150),
    "tempat_lahir_ayah" VARCHAR(100),
    "tgl_lahir_ayah" DATE,
    "agama_ayah" VARCHAR(20),
    "kewarganegaraan_ayah" VARCHAR(3) DEFAULT 'WNI',
    "pendidikan_ayah" VARCHAR(50),
    "pekerjaan_ayah" VARCHAR(100),
    "penghasilan_ayah" VARCHAR(50),
    "alamat_ayah" TEXT,
    "rtrw_ayah" VARCHAR(10),
    "kelurahan_ayah" VARCHAR(50),
    "kecamatan_ayah" VARCHAR(50),
    "kode_pos_ayah" VARCHAR(5),
    "status_ayah" VARCHAR(30) DEFAULT 'Masih Hidup',
    "nama_ibu" VARCHAR(150),
    "tempat_lahir_ibu" VARCHAR(100),
    "tgl_lahir_ibu" DATE,
    "agama_ibu" VARCHAR(20),
    "kewarganegaraan_ibu" VARCHAR(3) DEFAULT 'WNI',
    "pendidikan_ibu" VARCHAR(50),
    "pekerjaan_ibu" VARCHAR(100),
    "penghasilan_ibu" VARCHAR(50),
    "alamat_ibu" TEXT,
    "rtrw_ibu" VARCHAR(10),
    "kelurahan_ibu" VARCHAR(50),
    "kecamatan_ibu" VARCHAR(50),
    "kode_pos_ibu" VARCHAR(5),
    "status_ibu" VARCHAR(30) DEFAULT 'Masih Hidup',
    "nama_wali" VARCHAR(150),
    "tempat_lahir_wali" VARCHAR(100),
    "tgl_lahir_wali" DATE,
    "agama_wali" VARCHAR(20),
    "kewarganegaraan_wali" VARCHAR(3) DEFAULT 'WNI',
    "pendidikan_wali" VARCHAR(50),
    "pekerjaan_wali" VARCHAR(100),
    "penghasilan_wali" VARCHAR(50),
    "alamat_wali" TEXT,
    "rtrw_wali" VARCHAR(10),
    "kelurahan_wali" VARCHAR(50),
    "kecamatan_wali" VARCHAR(50),
    "kode_pos_wali" VARCHAR(5),
    "status_wali" VARCHAR(30) DEFAULT 'Masih Hidup',
    "telepon_ortu" VARCHAR(15) NOT NULL,
    "sekolah_asal" VARCHAR(150) NOT NULL,
    "tgl_lulus" DATE NOT NULL,
    "no_ijazah" VARCHAR(50),
    "no_skhun" VARCHAR(50),
    "no_peserta_un" VARCHAR(50),
    "lama_belajar" INTEGER,
    "pindahan_dari" VARCHAR(150),
    "alasan_pindah" TEXT,
    "diterima_kelas" VARCHAR(20),
    "diterima_tanggal" DATE,
    "jurusan" VARCHAR(50) NOT NULL,
    "alasan_memilih" TEXT,
    "hobi" JSONB,
    "cita_cita" VARCHAR(100),
    "nilai_us_teori" DECIMAL(5,2),
    "nilai_us_praktik" DECIMAL(5,2),
    "nilai_muatan_lokal" DECIMAL(5,2),
    "cita_cita_setelah_lulus" VARCHAR(100),
    "pelajaran_disenangi" VARCHAR(100),
    "alasan_disenangi" TEXT,
    "kesulitan_belajar" TEXT,
    "perkelahian" VARCHAR(5) DEFAULT 'Tidak',
    "ket_perkelahian" TEXT,
    "narkoba" VARCHAR(5) DEFAULT 'Tidak',
    "ket_narkoba" TEXT,
    "pelanggaran_lain" VARCHAR(5) DEFAULT 'Tidak',
    "ket_pelanggaran_lain" TEXT,
    "janji_taat" BOOLEAN DEFAULT false,
    "janji_sanksi" BOOLEAN DEFAULT false,
    "janji_akrab" BOOLEAN DEFAULT false,
    "janji_belajar" BOOLEAN DEFAULT false,
    "janji_nama_baik" BOOLEAN DEFAULT false,
    "periode" VARCHAR(20) DEFAULT '2026-2027',
    "gelombang" VARCHAR(20) DEFAULT 'Gelombang 1',
    "berkas_foto" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "siswa_aktif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informasi" (
    "id" SERIAL NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "konten" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "foto_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "informasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_page_config" (
    "config_key" VARCHAR(50) NOT NULL,
    "config_value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landing_page_config_pkey" PRIMARY KEY ("config_key")
);

-- CreateTable
CREATE TABLE "ui_revisions" (
    "id" SERIAL NOT NULL,
    "config_values" JSONB NOT NULL,
    "changed_by" VARCHAR(100) DEFAULT 'admin',
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ui_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "calon_siswa_nisn_key" ON "calon_siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "calon_siswa_nik_key" ON "calon_siswa"("nik");

-- CreateIndex
CREATE INDEX "calon_siswa_nisn_idx" ON "calon_siswa"("nisn");

-- CreateIndex
CREATE INDEX "calon_siswa_nik_idx" ON "calon_siswa"("nik");

-- CreateIndex
CREATE INDEX "calon_siswa_status_idx" ON "calon_siswa"("status");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_aktif_calon_siswa_id_key" ON "siswa_aktif"("calon_siswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_aktif_nisn_key" ON "siswa_aktif"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_aktif_nik_key" ON "siswa_aktif"("nik");

-- CreateIndex
CREATE INDEX "siswa_aktif_nisn_idx" ON "siswa_aktif"("nisn");

-- CreateIndex
CREATE INDEX "siswa_aktif_nik_idx" ON "siswa_aktif"("nik");
