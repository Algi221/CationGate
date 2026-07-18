# Product Requirements Document (PRD): CationGate - SPMB SaaS untuk SMK

## 1. Ringkasan Eksekutif (Executive Summary)
CationGate adalah platform SaaS (Software as a Service) yang menyediakan layanan Sistem Penerimaan Mahasiswa/Siswa Baru (SPMB) khusus untuk Sekolah Menengah Kejuruan (SMK). Platform ini memungkinkan SMK di seluruh Indonesia untuk mengelola proses penerimaan siswa baru mereka secara digital. Model bisnis yang digunakan adalah berlangganan (subscription) tahunan dengan menawarkan 1 bulan *free trial* pada awal pendaftaran.

## 2. Tujuan Bisnis (Business Goals)
- Menyediakan solusi pengelolaan SPMB yang modern, efisien, dan terpusat untuk SMK.
- Menghasilkan pendapatan melalui model *subscription* (langganan) tahunan.
- Menjadi platform utama dan terpercaya pilihan SMK untuk digitalisasi pendaftaran siswa baru.

## 3. Pengguna & Peran (User Roles)
Terdapat 3 jenis pengguna utama (multi-role) dalam platform ini yang akan dikelola sistem autentikasinya:
1. **Superadmin (Founder / Pengelola CationGate)**
   - Mengelola keseluruhan operasional platform SaaS CationGate.
   - Memiliki *dashboard* khusus untuk melihat data analitik seperti: jumlah langganan sekolah, pendapatan/uang masuk, dan status sekolah.
2. **Pihak SMK (Admin Sekolah - Klien)**
   - Menggunakan layanan CationGate untuk mengelola SPMB di sekolah mereka masing-masing.
   - Mengatur jurusan, persyaratan, melihat dan memverifikasi data pendaftar.
   - Melakukan proses pembayaran/langganan setelah masa *free trial* berakhir.
   - bisa juga langsuung langganan.
3. **Calon Siswa (Pendaftar)**
   - Mendaftar ke SMK yang menggunakan layanan CationGate melalui *Landing Page* sekolah yang bersangkutan.
   - Mengisi formulir, mengunggah dokumen, dan melihat status penerimaan mereka.

## 4. Arsitektur & Teknologi (Tech Stack)
Proyek ini akan dikembangkan sebagai aplikasi **Monolith**.
- **Frontend & Backend Framework:** Next.js (Fullstack)
- **Database & Authentication:** Supabase (PostgreSQL)
- **Payment Gateway:** (Misal: Midtrans / Xendit / Stripe) untuk memproses pembayaran langganan tahunan secara otomatis.

## 5. Fitur Utama (Key Features)

### A. Landing Page Utama (Baru - Promosi CationGate)
Halaman ini adalah "wajah" dari SaaS CationGate yang ditujukan untuk menarik pihak SMK agar berlangganan.
- **Deskripsi:** Penjelasan singkat, jelas, dan menarik tentang CationGate sebagai solusi SPMB untuk SMK.
- **Kelebihan Layanan:** Nilai jual utama (USPs) seperti efisiensi, keamanan data, dan kemudahan manajemen.
- **Fitur:** Daftar fitur unggulan yang akan didapatkan oleh SMK.
- **Harga & Langganan (Pricing):** Informasi biaya langganan tahunan dengan penawaran *1 Bulan Free Trial*.
- **Demo Live Dashboard:** Fitur interaktif yang memungkinkan calon klien untuk mensimulasikan dan mencoba UI/UX *dashboard management* (hanya desain/interaksi *mockup*) tanpa perlu mendaftar terlebih dahulu.
- **Footer:** Tautan kontak, sosial media, syarat & ketentuan, serta kebijakan privasi.

### B. Landing Page dan form Pendaftaran Sekolah (Eksisting)
- Halaman portal tempat calon siswa akan masuk dan mendaftar. Halaman ini akan disesuaikan untuk masing-masing SMK yang telah berlangganan (menampilkan logo dan informasi spesifik SMK tersebut).

### C. Sistem Otentikasi (Authentication & Authorization)
- Login dan Register yang aman menggunakan Supabase Auth.
- Sistem *Routing* dan proteksi halaman berdasarkan 3 *role* pengguna (Superadmin(founder), SMK, Calon Siswa).

### D. Manajemen Langganan (Subscription & Billing)
- Sistem akan memberikan akses *Full Feature* otomatis selama 1 bulan pertama (*Free Trial*) saat SMK mendaftar.
- Sistem *reminder* sebelum masa *trial* atau langganan habis.
- Integrasi *Payment Gateway* untuk pembayaran biaya langganan per tahun.
- Pemblokiran / pembatasan akses (*read-only*) jika masa berlangganan telah habis dan belum diperpanjang.

### E. Dashboard Superadmin (Founder)
- Ringkasan total pendapatan (Revenue / Uang Masuk).
- Daftar SMK yang terdaftar (Aktif, Trial, Expired).
- Manajemen akun klien (Pihak SMK).

### F. Dashboard Pihak SMK
- Pengaturan profil sekolah dan program keahlian (jurusan).
- Pengaturan gelombang dan jadwal pendaftaran.
- Manajemen data pendaftar (verifikasi, kelulusan, ekspor data).
- kurang lebih dashboard Pihak SMK adalah dashboard sekarang yang udah ada paling dipoles aja.

### G. Landing Page dan form Pendaftaran Calon Siswa
- Pengisian data diri, nilai rapor, dan pemilihan jurusan.
- Unggah dokumen persyaratan (Ijazah, KK, dll).
- Cek pengumuman status kelulusan.

## 6. Rencana Implementasi (Next Steps)
1. **Fase 1: Setup & Konfigurasi** - Setup Next.js, integrasi Supabase (Database, Auth, Row Level Security untuk arsitektur *multi-tenant*).
2. **Fase 2: UI/UX & Landing Page** - Pengembangan *Landing Page* utama CationGate, termasuk komponen simulasi *Live Demo Dashboard*.
3. **Fase 3: Autentikasi & Multi-Role** - Implementasi Supabase Auth untuk Superadmin, Pihak SMK, dan Calon Siswa.
4. **Fase 4: Core Features (SPMB)** - Pembuatan *Landing Page dan form Pendaftaran Calon Siswa* dan *Dashboard* Pihak SMK beserta alur pendaftarannya.
5. **Fase 5: Monetisasi & Payment Gateway** - Integrasi *Payment Gateway*, manajemen *free trial* 1 bulan, dan sistem berlangganan.
6. **Fase 6: Dashboard Superadmin & Finishing** - Pembuatan analitik pendapatan dan perilisan aplikasi (Publish).
