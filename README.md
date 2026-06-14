# Panduan Sistem PPDB SMK Taruna Bhakti Depok

Aplikasi Penerimaan Peserta Didik Baru (PPDB) SMK Taruna Bhakti Depok adalah platform berbasis web modern yang dirancang untuk mempermudah pendaftaran siswa baru secara online, pengelolaan administrasi oleh panitia (dashboard pendaftar dan siswa aktif), integrasi pembayaran digital, serta forum informasi pengumuman.

Sistem ini terbagi menjadi dua bagian utama:
1. Frontend: Aplikasi antarmuka pengguna berbasis React dengan Next.js.
2. Backend: Server REST API berbasis Hono.js dengan PostgreSQL sebagai database utama dan Bun sebagai runtime engine.

---

## Spesifikasi Teknologi (Tech Stack)

### Frontend
- Core Framework: Next.js (App Router)
- Language: TypeScript
- CSS Styling: Vanilla CSS / Tailwind CSS
- Animation Library: Framer Motion
- Iconography: Lucide React
- Package Manager: Bun

### Backend
- Core Framework: Hono.js
- Runtime Environment: Bun / Node.js
- Database ORM: Prisma Client v6
- Database Engine: PostgreSQL
- Authentication: JSON Web Token (JWT) & bcryptjs
- Communications: WebSocket Server (ws)
- Package Manager: Bun

---

## Struktur Direktori

```text
PPDB_SMK_TarunaBhakti/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Skema pemodelan database Prisma
│   │   └── seed.js             # Skrip pengisian data simulasi awal (seeding)
│   ├── src/
│   │   ├── db/
│   │   │   ├── prisma.ts       # Inisialisasi client Prisma
│   │   │   └── schema.sql      # Cadangan skema SQL mentah
│   │   ├── middleware/
│   │   │   └── auth.ts         # Middleware otentikasi JWT admin & superadmin
│   │   ├── routes/
│   │   │   ├── admin-users.ts  # Endpoint manajemen admin & integrasi YSBMO
│   │   │   ├── applicants.ts   # Endpoint pendaftar calon siswa
│   │   │   ├── auth.ts         # Endpoint autentikasi admin lokal & YSBMO
│   │   │   ├── config.ts       # Endpoint konfigurasi landing page
│   │   │   ├── informasi.ts    # Endpoint artikel pengumuman
│   │   │   └── payment.ts      # Endpoint pembayaran gerbang Midtrans
│   │   ├── ws/
│   │   │   └── handler.ts      # Pengendali komunikasi WebSocket real-time
│   │   └── index.ts            # Entrypoint utama server backend
│   └── tsconfig.json
└── frontend/
    ├── public/
    └── src/
        ├── app/
        │   ├── daftar/
        │   ├── dashboard/
        │   │   ├── admin/      # Halaman manajemen admin lokal & YSBMO
        │   │   ├── pendaftar/
        │   │   └── siswa-aktif/# Halaman pemantauan pendaftar aktif
        │   ├── login/
        │   └── page.tsx
        ├── components/
        └── context/
            └── PPDBContext.tsx # Context global pengelolaan state dan auth
```

---

## Skema Database (Database Schema)

Sistem database PPDB menggunakan PostgreSQL dengan rancangan tabel berikut:

### Tabel: admin_users
Menyimpan kredensial admin sistem PPDB lokal dan token autentikasi integrasi YSBMO.

| Nama Kolom | Tipe Data | Deskripsi / Kendala |
|---|---|---|
| id | SERIAL | Primary Key, Auto-increment |
| username | VARCHAR(50) | Unique, Not Null |
| password_hash | VARCHAR(255) | Hashed password, Not Null |
| password_plain| VARCHAR(255) | Plaintext password (untuk Superadmin, Nullable) |
| nama_lengkap | VARCHAR(100) | Not Null |
| role | VARCHAR(20) | Default: 'admin', Nullable |
| ysbmo_token | TEXT | Token akses YSBMO hasil login (Nullable) |
| created_at | TIMESTAMP | Default: NOW(), Nullable |

### Tabel: calon_siswa
Menyimpan seluruh data formulir pendaftaran calon peserta didik baru.

| Nama Kolom | Tipe Data | Deskripsi / Kendala |
|---|---|---|
| id | SERIAL | Primary Key, Auto-increment |
| nama | VARCHAR(150) | Not Null |
| nisn | VARCHAR(10) | Unique, Not Null |
| nik | VARCHAR(16) | Unique, Not Null |
| tempat_lahir | VARCHAR(100) | Not Null |
| tgl_lahir | DATE | Not Null |
| jenis_kelamin | CHAR(1) | Not Null |
| agama | VARCHAR(20) | Not Null |
| kewarganegaraan| VARCHAR(3) | Default: 'WNI', Nullable |
| alamat | TEXT | Not Null |
| rt_rw | VARCHAR(10) | Not Null |
| kelurahan | VARCHAR(50) | Not Null |
| kecamatan | VARCHAR(50) | Not Null |
| kode_pos | VARCHAR(5) | Not Null |
| whatsapp | VARCHAR(15) | Not Null |
| email | VARCHAR(100) | Not Null |
| tinggal_dengan| VARCHAR(30) | Not Null |
| transportasi | VARCHAR(30) | Not Null |
| tinggi_badan | INTEGER | Not Null |
| berat_badan | INTEGER | Not Null |
| jarak_sekolah | VARCHAR(30) | Not Null |
| jarak_km | DECIMAL(5,2) | Not Null |
| waktu_jam | INTEGER | Not Null |
| waktu_menit | INTEGER | Not Null |
| jumlah_saudara| INTEGER | Not Null |
| golongan_darah| VARCHAR(5) | Not Null |
| penyakit_diderita| VARCHAR(150) | Nullable |
| kebutuhan_khusus| JSONB | Nullable |
| punya_kps | VARCHAR(5) | Default: 'Tidak', Nullable |
| no_kps | VARCHAR(30) | Nullable |
| punya_kip | VARCHAR(5) | Default: 'Tidak', Nullable |
| no_kip | VARCHAR(30) | Nullable |
| jenis_prestasi| JSONB | Nullable |
| tingkat_prestasi| JSONB | Nullable |
| uraian_prestasi| TEXT | Nullable |
| tahun_prestasi| VARCHAR(10) | Nullable |
| penyelenggara | VARCHAR(100) | Nullable |
| jenis_beasiswa| JSONB | Nullable |
| uraian_beasiswa| TEXT | Nullable |
| tahun_mulai_beasiswa| VARCHAR(10)| Nullable |
| tahun_selesai_beasiswa| VARCHAR(10)| Nullable |
| nama_ayah | VARCHAR(150) | Nullable |
| status_ayah | VARCHAR(30) | Default: 'Masih Hidup', Nullable |
| nama_ibu | VARCHAR(150) | Nullable |
| status_ibu | VARCHAR(30) | Default: 'Masih Hidup', Nullable |
| nama_wali | VARCHAR(150) | Nullable |
| status_wali | VARCHAR(30) | Default: 'Masih Hidup', Nullable |
| telepon_ortu | VARCHAR(15) | Not Null |
| sekolah_asal | VARCHAR(150) | Not Null |
| tgl_lulus | DATE | Not Null |
| no_ijazah | VARCHAR(50) | Nullable |
| no_skhun | VARCHAR(50) | Nullable |
| no_peserta_un | VARCHAR(50) | Nullable |
| lama_belajar | INTEGER | Nullable |
| pindahan_dari | VARCHAR(150) | Nullable |
| alasan_pindah | TEXT | Nullable |
| diterima_kelas| VARCHAR(20) | Nullable |
| diterima_tanggal| DATE | Nullable |
| jurusan_1 | VARCHAR(50) | Not Null |
| jurusan_2 | VARCHAR(50) | Not Null |
| alasan_memilih| TEXT | Nullable |
| hobi | JSONB | Nullable |
| cita_cita | VARCHAR(100) | Nullable |
| nilai_us_teori| DECIMAL(5,2) | Nullable |
| nilai_us_praktik| DECIMAL(5,2)| Nullable |
| nilai_muatan_lokal| DECIMAL(5,2)| Nullable |
| cita_cita_setelah_lulus| VARCHAR(100)| Nullable |
| pelajaran_disenangi| VARCHAR(100)| Nullable |
| alasan_disenangi| TEXT | Nullable |
| kesulitan_belajar| TEXT | Nullable |
| perkelahian | VARCHAR(5) | Default: 'Tidak', Nullable |
| ket_perkelahian| TEXT | Nullable |
| narkoba | VARCHAR(5) | Default: 'Tidak', Nullable |
| ket_narkoba | TEXT | Nullable |
| pelanggaran_lain| VARCHAR(5) | Default: 'Tidak', Nullable |
| ket_pelanggaran_lain| TEXT | Nullable |
| janji_taat | BOOLEAN | Default: FALSE, Nullable |
| janji_sanksi | BOOLEAN | Default: FALSE, Nullable |
| janji_akrab | BOOLEAN | Default: FALSE, Nullable |
| janji_belajar | BOOLEAN | Default: FALSE, Nullable |
| janji_nama_baik| BOOLEAN | Default: FALSE, Nullable |
| periode | VARCHAR(20) | Default: '2026-2027', Nullable |
| gelombang | VARCHAR(20) | Default: 'Gelombang 1', Nullable |
| berkas_foto | TEXT | Nullable |
| bukti_bayar | TEXT | Nullable |
| metode_pembayaran| VARCHAR(50) | Default: 'Payment Gateway', Nullable |
| status | VARCHAR(20) | Default: 'Pending', Nullable |
| payment_status| VARCHAR(20) | Default: 'Unpaid', Nullable |
| tgl_daftar | TIMESTAMP | Default: NOW(), Nullable |

### Tabel: siswa_aktif
Menyimpan data siswa yang sudah diverifikasi (Approved) dan aktif bersekolah di SMK Taruna Bhakti.

| Nama Kolom | Tipe Data | Deskripsi / Kendala |
|---|---|---|
| id | SERIAL | Primary Key, Auto-increment |
| calon_siswa_id | INTEGER | Link/Foreign Key ke `calon_siswa`, Unique, Nullable |
| nama | VARCHAR(150) | Not Null |
| nisn | VARCHAR(10) | Unique, Not Null |
| nik | VARCHAR(16) | Unique, Not Null |
| tempat_lahir | VARCHAR(100) | Not Null |
| tgl_lahir | DATE | Not Null |
| jenis_kelamin | CHAR(1) | Not Null |
| agama | VARCHAR(20) | Not Null |
| kewarganegaraan| VARCHAR(3) | Default: 'WNI', Nullable |
| alamat | TEXT | Not Null |
| rt_rw | VARCHAR(10) | Not Null |
| kelurahan | VARCHAR(50) | Not Null |
| kecamatan | VARCHAR(50) | Not Null |
| kode_pos | VARCHAR(5) | Not Null |
| whatsapp | VARCHAR(15) | Not Null |
| email | VARCHAR(100) | Not Null |
| tinggal_dengan| VARCHAR(30) | Not Null |
| transportasi | VARCHAR(30) | Not Null |
| tinggi_badan | INTEGER | Not Null |
| berat_badan | INTEGER | Not Null |
| jarak_sekolah | VARCHAR(30) | Not Null |
| jarak_km | DECIMAL(5,2) | Not Null |
| waktu_jam | INTEGER | Not Null |
| waktu_menit | INTEGER | Not Null |
| jumlah_saudara| INTEGER | Not Null |
| golongan_darah| VARCHAR(5) | Not Null |
| penyakit_diderita| VARCHAR(150) | Nullable |
| kebutuhan_khusus| JSONB | Nullable |
| punya_kps | VARCHAR(5) | Default: 'Tidak', Nullable |
| no_kps | VARCHAR(30) | Nullable |
| punya_kip | VARCHAR(5) | Default: 'Tidak', Nullable |
| no_kip | VARCHAR(30) | Nullable |
| jenis_prestasi| JSONB | Nullable |
| tingkat_prestasi| JSONB | Nullable |
| uraian_prestasi| TEXT | Nullable |
| tahun_prestasi| VARCHAR(10) | Nullable |
| penyelenggara | VARCHAR(100) | Nullable |
| jenis_beasiswa| JSONB | Nullable |
| uraian_beasiswa| TEXT | Nullable |
| tahun_mulai_beasiswa| VARCHAR(10)| Nullable |
| tahun_selesai_beasiswa| VARCHAR(10)| Nullable |
| nama_ayah | VARCHAR(150) | Nullable |
| status_ayah | VARCHAR(30) | Default: 'Masih Hidup', Nullable |
| nama_ibu | VARCHAR(150) | Nullable |
| status_ibu | VARCHAR(30) | Default: 'Masih Hidup', Nullable |
| nama_wali | VARCHAR(150) | Nullable |
| status_wali | VARCHAR(30) | Default: 'Masih Hidup', Nullable |
| telepon_ortu | VARCHAR(15) | Not Null |
| sekolah_asal | VARCHAR(150) | Not Null |
| tgl_lulus | DATE | Not Null |
| no_ijazah | VARCHAR(50) | Nullable |
| no_skhun | VARCHAR(50) | Nullable |
| no_peserta_un | VARCHAR(50) | Nullable |
| lama_belajar | INTEGER | Nullable |
| pindahan_dari | VARCHAR(150) | Nullable |
| alasan_pindah | TEXT | Nullable |
| diterima_kelas| VARCHAR(20) | Nullable |
| diterima_tanggal| DATE | Nullable |
| jurusan | VARCHAR(50) | Jurusan Utama Kompetensi Keahlian, Not Null |
| alasan_memilih| TEXT | Nullable |
| hobi | JSONB | Nullable |
| cita_cita | VARCHAR(100) | Nullable |
| nilai_us_teori| DECIMAL(5,2) | Nullable |
| nilai_us_praktik| DECIMAL(5,2)| Nullable |
| nilai_muatan_lokal| DECIMAL(5,2)| Nullable |
| cita_cita_setelah_lulus| VARCHAR(100)| Nullable |
| pelajaran_disenangi| VARCHAR(100)| Nullable |
| alasan_disenangi| TEXT | Nullable |
| kesulitan_belajar| TEXT | Nullable |
| perkelahian | VARCHAR(5) | Default: 'Tidak', Nullable |
| ket_perkelahian| TEXT | Nullable |
| narkoba | VARCHAR(5) | Default: 'Tidak', Nullable |
| ket_narkoba | TEXT | Nullable |
| pelanggaran_lain| VARCHAR(5) | Default: 'Tidak', Nullable |
| ket_pelanggaran_lain| TEXT | Nullable |
| janji_taat | BOOLEAN | Default: FALSE, Nullable |
| janji_sanksi | BOOLEAN | Default: FALSE, Nullable |
| janji_akrab | BOOLEAN | Default: FALSE, Nullable |
| janji_belajar | BOOLEAN | Default: FALSE, Nullable |
| janji_nama_baik| BOOLEAN | Default: FALSE, Nullable |
| periode | VARCHAR(20) | Default: '2026-2027', Nullable |
| gelombang | VARCHAR(20) | Default: 'Gelombang 1', Nullable |
| berkas_foto | TEXT | Nullable |
| created_at | TIMESTAMP | Default: NOW(), Nullable |

### Tabel: informasi
Menyimpan data artikel berita atau pengumuman terkait PPDB.

| Nama Kolom | Tipe Data | Deskripsi / Kendala |
|---|---|---|
| id | SERIAL | Primary Key, Auto-increment |
| judul | VARCHAR(255) | Not Null |
| konten | TEXT | Not Null |
| tanggal | DATE | Not Null |
| foto_url | TEXT | Nullable |
| created_at | TIMESTAMP | Default: NOW(), Nullable |

### Tabel: landing_page_config
Menyimpan konfigurasi berformat JSON untuk dinamisasi komponen halaman depan landing page.

| Nama Kolom | Tipe Data | Deskripsi / Kendala |
|---|---|---|
| config_key | VARCHAR(50) | Primary Key |
| config_value | JSONB | Data konfigurasi komponen, Not Null |
| updated_at | TIMESTAMP | Default: NOW(), Auto-update |

### Tabel: ui_revisions
Menyimpan riwayat revisi dan perubahan konfigurasi landing page.

| Nama Kolom | Tipe Data | Deskripsi / Kendala |
|---|---|---|
| id | SERIAL | Primary Key, Auto-increment |
| config_values | JSONB | Backup konfigurasi saat diubah, Not Null |
| changed_by | VARCHAR(100) | Default: 'admin', Nullable |
| description | TEXT | Nullable |
| created_at | TIMESTAMP | Default: NOW(), Nullable |

---

## Alur Kerja Integrasi YSBMO

Sistem ini terintegrasi secara mulus dengan API Yayasan Setya Bhakti (YSBMO) untuk memfasilitasi integrasi login satu pintu dan pendaftaran admin secara dinamis:

### Autentikasi Pengguna
1. Ketika pengguna memasukkan ID/NIP dan Kata Sandi pada form login utama, sistem backend PPDB memproyeksikan data login ke API Autentikasi YSBMO (`/Auth/signIn-ysbmo`).
2. Jika valid, API YSBMO mengembalikan kode status 200 beserta payload identitas pengguna dan token otentikasi YSBMO.
3. Backend PPDB akan menangkap token tersebut dan menyimpannya ke database `admin_users` kolom `ysbmo_token`.
4. Pengguna disinkronisasikan ke tabel lokal dan diberikan JWT token PPDB untuk mengakses area manajemen.

### Penarikan Daftar Guru & Staff (list-staff)
1. Super Admin mengakses tab **Data Staff & Guru YSBMO** di dashboard admin.
2. Frontend meminta data ke API backend PPDB pada rute `GET /api/admin/users/ysbmo/staff`.
3. Backend akan memeriksa ketersediaan token YSBMO yang tersimpan di database (atau menerima input manual dari header `X-YSBMO-Token` jika token kedaluwarsa).
4. Backend menghasilkan header dinamis `x-api-key` berdasarkan tahun dan bulan saat ini dengan format: `SARPRAS-STARBHAK{tahun}{bulan}` (misal: `SARPRAS-STARBHAK202606` untuk bulan Juni 2026).
5. Backend melakukan fetch data ke API eksternal YSBMO `/masterdata/list-staff` menggunakan header `Authorization: Basic {token}` dan `x-api-key`.
6. Jika pemanggilan sukses, daftar staff dikembalikan dan ditampilkan ke dalam tabel admin.

### Pendaftaran Instan (Instant Admin Promotion)
1. Guru yang terdaftar di YSBMO dapat langsung masuk ke sistem PPDB sebagai admin baru tanpa perlu input pendaftaran manual.
2. Dari tabel YSBMO, Super Admin mengklik tombol **Jadikan Admin**.
3. Frontend akan mengirimkan request pembuatan admin lokal baru menggunakan data guru tersebut (Username diisi dengan `id` YSBMO, Nama Lengkap menggunakan properti `text` YSBMO) dengan kata sandi bypass sementara yang digenerate acak (memenuhi kepatuhan uji statis Snyk).
4. Ketika guru tersebut pertama kali melakukan login menggunakan ID YSBMO dan kata sandi asli mereka, sistem secara otomatis memvalidasinya ke API YSBMO dan menyinkronkan kata sandi hash lokal PPDB dengan kredensial tersebut secara dinamis.

---

## Panduan Instalasi dan Setup Proyek

Ikuti langkah-langkah berikut untuk memulai dan menjalankan proyek ini di lingkungan pengembangan lokal Anda.

### Prasyarat
- Pasang Bun runtime engine di komputer Anda.
- Siapkan database PostgreSQL lokal atau cloud.

### Langkah 1: Setup Backend

1. Buka Terminal dan arahkan ke direktori backend:
   ```bash
   cd backend
   ```

2. Instal dependensi menggunakan Bun:
   ```bash
   bun install
   ```

3. Duplikat berkas konfigurasi env:
   - Pada Windows PowerShell:
     ```powershell
     cp .env.example .env
     ```
   - Pada Linux/macOS:
     ```bash
     cp .env.example .env
     ```

4. Buka berkas `.env` dan sesuaikan parameter koneksi PostgreSQL Anda:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://nama_user:password_anda@localhost:5432/ppdb_tarunabhakti
   JWT_SECRET=GantiDenganSecretKeyPilihanAnda
   SUPER_ADMIN_USERNAME=KingAlgi
   SUPER_ADMIN_PASSWORD=RPLSTRONG
   ADMIN_USERNAME=admin_tb
   ADMIN_PASSWORD=AdminTarunaBhakti2026
   YSBO_API_URL=https://be-skol.yayasansetyabhakti.org:5203/api/v1/Auth/signIn-ysbmo
   ```

5. Sinkronisasikan skema Prisma ke database:
   ```bash
   npx prisma db push
   ```

6. Jalankan pengisian database (seeding) untuk data simulasi default:
   ```bash
   bun run seed
   ```

7. Jalankan server backend:
   ```bash
   bun run dev
   ```
   Server backend akan aktif pada alamat `http://localhost:5000`.

---

### Langkah 2: Setup Frontend

1. Buka Terminal baru dan arahkan ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Instal dependensi menggunakan Bun:
   ```bash
   bun install
   ```

3. Duplikat berkas konfigurasi env:
   - Pada Windows PowerShell:
     ```powershell
     cp .env.example .env.local
     ```
   - Pada Linux/macOS:
     ```bash
     cp .env.example .env.local
     ```

4. Jalankan aplikasi frontend Next.js:
   ```bash
   bun run dev
   ```
   Aplikasi frontend akan aktif pada alamat `http://localhost:3000`.
