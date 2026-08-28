# 🎓 CationGate — Enterprise Multi-Tenant SPMB & School Management SaaS Platform

> **CationGate** adalah platform Software-as-a-Service (SaaS) Multi-Tenant modern untuk sistem Penerimaan Peserta Didik Baru (PPDB/SPMB) dan administrasi sekolah digital di Indonesia. Mendukung routing subdomain dinamis (`https://[school_slug].cationgate.site`), kustomisasi landing page sekolah secara mandiri, formulir pendaftaran 14 langkah, verifikasi berkas otomatis, pembagian rombongan belajar (rombel), hingga portal superadmin pusat (**Gatekeeper**).

---

## 🚀 Fitur Utama & Modul Sistem

### 1. 🌐 Multi-Tenant Subdomain & Dynamic Landing Page
* **Subdomain Otomatis**: Setiap sekolah memiliki landing page & portal independen (contoh: `smktarunabhakti.cationgate.site`, `aasx.cationgate.site`).
* **Kelola UI/Data**: Admin sekolah dapat mengubah judul, logo, hero banner, alur pendaftaran, program keahlian (jurusan), FAQ, rekening bank, dan profil pimpinan secara real-time.
* **Multi-Tenant Data Isolation**: Seluruh data siswa, pengumuman, dan konfigurasi terisolasi 100% menggunakan identitas UUID sekolah (`school_id`).

### 2. 📝 Formulir Pendaftaran Online 14 Langkah (PPDB Wizard)
* **14 Langkah Terpadu**:
  1. Data Pribadi Calon Siswa (NISN, NIK, Nama Lengkap)
  2. Data Tempat Tinggal & Koordinat Lokasi
  3. Data Periodik Siswa (Tinggi, Berat, Jarak ke Sekolah)
  4. Riwayat Kesehatan
  5. Prestasi Akademik & Non-Akademik
  6. Data Beasiswa (KIP, PKH, PIP)
  7. Riwayat Pendidikan Asal Sekolah (SMP/MTs)
  8. Data Ayah Kandung
  9. Data Ibu Kandung
  10. Data Wali Murid
  11. Minat & Bakat Kejuruan
  12. Penilaian Budi Pekerti
  13. Review & Konfirmasi Formulir
  14. Unggah Dokumen Berkas (Akta, KK, Rapor) & Pembayaran
* **Invoice & Payment Gateway**: Integrasi gateway pembayaran dan upload bukti transfer manual dengan status real-time.
* **Auto-Draft & Hydration**: Progres input siswa tersimpan otomatis di browser sehingga tidak hilang jika koneksi terputus.

### 3. 🏫 Dashboard Admin Sekolah
* **Manajemen Calon Siswa**: Verifikasi berkas, persetujuan (approve), penolakan (reject) dengan alasan, serta unduh rekap data Excel/PDF.
* **Kontrol Pendaftaran Publik**: Saklar Buka/Tutup (*Open/Closed*) gelombang pendaftaran secara instan.
* **Pembagian Kelas / Rombel**: Pengelompokan siswa baru ke dalam rombel secara otomatis atau manual.
* **Kelola Informasi & Forum**: Publikasi artikel, pengumuman berkas PDF/Video/Foto resmi sekolah.
* **Profil & Identitas Sekolah**: Manajemen sejarah, visi misi, legalitas NPSN, dan pimpinan sekolah.

### 4. 🛡️ Portal Pusat Superadmin: **Gatekeeper**
* **Verifikasi Legalitas Sekolah**: Menyetujui atau menolak pendaftaran sekolah baru berdasarkan SK Izin Operasional dan data pokok NPSN.
* **Manajemen Berlangganan (SaaS Subscription)**: Monitoring paket aktif (Starter, Pro, Enterprise), mutasi transaksi, dan invoice.
* **System Telemetry & Security**: Monitoring kesehatan database, status cache Redis, audit log per aksi, hingga saklar *Maintenance Mode* global.
* **Telegram Bot Notifier**: Notifikasi otomatis ke tim superadmin untuk setiap login gatekeeper, pendaftaran sekolah baru, dan pembayaran langganan.

---

## 🛠️ Tech Stack & Arsitektur Sistem

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Server Components, Server-Side Rendering (SSR), API route handlers |
| **UI Library** | **React 19 & TypeScript** | Strict type-safety dan komponen reaktif modern |
| **Styling & Icons** | **Tailwind CSS & Lucide Icons** | Desain B2B Enterprise clean (Stripe/Vercel style), dark/light mode |
| **Component Kit** | **shadcn/ui & Radix UI** | Komponen aksesibel (Dialog, Dropdown, Accordion, Tooltip) |
| **Backend & Routing** | **Hono Framework** | Routing API berkecepatan tinggi pada edge/node handler |
| **Database** | **PostgreSQL & Supabase** | Relational DB dengan Row Level Security (RLS) policies aktif |
| **Caching Layer** | **Upstash Redis** | Caching konfigurasi landing page untuk performa loading instan |
| **Security & Auth** | **JWT & Bcrypt** | Autentikasi terenkripsi dengan rate limiter (`authLimiter`) |
| **Security Scanner** | **Snyk Code Analysis** | 0 Vulnerabilities terverifikasi pada codebase |
| **Payment Gateway** | **Midtrans** | Pembayaran otomatis QRIS, Virtual Account, & Bank Transfer |
| **Notifications** | **Telegram Bot API & Resend** | Notifikasi real-time via Telegram dan email transaksional |

---

## 👥 Hak Akses & Kredensial Pengujian (Testing Accounts)

### 1. 🛡️ Akun Superadmin Platform (Gatekeeper)
Akses URL: `https://[domain]/gatekeeper/login` (atau `http://localhost:3000/gatekeeper/login`)

| Username | Email | Role | Catatan |
| :--- | :--- | :--- | :--- |
| `algi` | `algi@cationgate.id` | Platform Superadmin | Founder & Core Platform Admin |
| `farel` | `farel@cationgate.id` | Gatekeeper Admin | Verification & Operations Admin |
| `jepan` | `jepan@cationgate.id` | Gatekeeper Admin | Verification & Operations Admin |
| `husein` | `husein@cationgate.id` | Gatekeeper Admin | Verification & Operations Admin |
| `uno` | `uno@cationgate.id` | Gatekeeper Admin | Platform Security Monitor |

---

### 2. 🧪 Akun Khusus Pengujian Keamanan & QA (Pentester Account)
Akun ini disediakan khusus untuk keperluan **Security Audit, QA Testing, dan Penetration Testing**:

* **Login URL**: `/gatekeeper/login`
* **Username**: `pentester` *(atau `gatekeeper_test`)*
* **Email**: `pentester@cationgate.id`
* **Password**: `CationGate2026!` *(atau `cihuahua123`)*
* **Scope Akses**: Akses penuh ke Gatekeeper Dashboard untuk menguji endpoint verifikasi sekolah, audit log, manajemen transaksi, dan monitoring multi-tenant.

---

### 3. 🏫 Akun Admin Sekolah (Tenant Admin)
Akses URL: `http://localhost:3000/[school_slug]/login` atau subdomain sekolah `https://[school_slug].cationgate.site/login`

* **Demo Tenant (SMK Demo Indonesia)**:
  * URL: `http://localhost:3000/demo/dashboard`
  * Sifat: Bebas uji coba, data tersimpan di sesi browser lokal.
* **Instansi Resmi (SMK Taruna Bhakti)**:
  * URL: `http://localhost:3000/smktarunabhakti/login`
  * Email: `admin@smktarunabhakti.sch.id` *(atau `akunalgi62@gmail.com`)*
  * Password: `password123` *(atau `admin123`)*

---

## 📂 Struktur Direktori Proyek

```text
CationGate/
├── src/
│   ├── app/                               # Next.js App Router Pages
│   │   ├── (auth)/                        # Authentication Pages (Login, Register, Forgot Password)
│   │   ├── gatekeeper/                    # Platform Superadmin Portal
│   │   │   ├── login/                     # Gatekeeper Login
│   │   │   └── dashboard/                 # Verification, Subscriptions, Telemetry
│   │   ├── [school_slug]/                 # Dynamic School Tenant Route
│   │   │   ├── page.tsx                   # School Public Landing Page
│   │   │   ├── profil/                    # Public School Profile & History
│   │   │   ├── forum/                     # Public Announcements & School Forum
│   │   │   ├── daftar/                    # 14-Step Student Registration Wizard
│   │   │   ├── status/                    # Student Registration Status Tracker
│   │   │   ├── login/                     # School Admin Login
│   │   │   └── dashboard/                 # School Admin Panel
│   │   │       ├── kelola-ui/             # Landing Page Customizer
│   │   │       ├── profil-sekolah/        # School Profile & Leadership
│   │   │       ├── informasi/             # School Announcements CRUD
│   │   │       ├── pendaftar/             # PPDB Applicants Verification
│   │   │       ├── pembagian-kelas/       # Student Class Allocation
│   │   │       └── subscription/          # SaaS Subscription Plans
│   │   └── api/                           # Backend Hono API Routes
│   │       └── [[...route]]/route.ts      # Catch-all Hono Gateway
│   ├── components/                        # Reusable React UI Components
│   │   ├── features/                      # Feature-specific components
│   │   ├── landing/                       # Navbar, Hero, Footer, UI blocks
│   │   └── ui/                            # shadcn/ui base primitives
│   ├── context/                           # React Context Providers (PPDB, Auth, Toast)
│   ├── server/                            # Backend Hono Business Logic
│   │   ├── db/                            # Supabase Client, Postgres Pool, Resolvers
│   │   ├── middleware/                    # Auth, Rate Limiter, Tenant Resolution
│   │   ├── routes/                        # Auth, Config, Informasi, SaaS, Gatekeeper
│   │   └── services/                      # Cache, Email, Payment, Telegram services
│   └── stores/                            # Zustand Global State Stores
└── public/                                # Static Assets, Logos, Uploads
```

---

## ⚡ Panduan Menjalankan Project (Local Development)

### 1. Prasyarat Sistem
* **Node.js**: v18.18.0 atau lebih baru (direkomendasikan v20+)
* **Package Manager**: `npm` atau `pnpm`
* **Database**: PostgreSQL / Supabase instance

### 2. Instalasi Dependensi
```bash
git clone https://github.com/Algi221/CationGate.git
cd CationGate
npm install
```

### 3. Konfigurasi File Lingkungan (`.env.local`)
Buat file `.env.local` pada root direktori dan sesuaikan parameter berikut:
```env
# Supabase Database & Service Role
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT & Security
JWT_SECRET=your-jwt-secret-key-32-chars-min

# Superadmin Gatekeeper Defaults
GATEKEEPER_USERNAME=uno
GATEKEEPER_DEFAULT_PASS=CationGate2026!

# Upstash Redis Cache (Optional)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Telegram Alerts (Optional)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka peramban di:
* **Beranda Utama**: [http://localhost:3000](http://localhost:3000)
* **Gatekeeper Superadmin**: [http://localhost:3000/gatekeeper/login](http://localhost:3000/gatekeeper/login)
* **Demo Sekolah**: [http://localhost:3000/demo](http://localhost:3000/demo)

### 5. Validasi Tipe & Keamanan
```bash
# Validasi TypeScript
npx tsc --noEmit

# Pengujian Keamanan Snyk Code
npx snyk code test
```

---

## 🔒 Kebijakan Keamanan & Multi-Tenancy

1. **Strict Tenant Scoping**: Semua operasi CRUD diverifikasi melalui JWT claims dan UUID sekolah (`school_id`).
2. **Anti-AI Slop Standards**: Antarmuka dibangun dengan panduan UI/UX B2B yang bersih, fungsional, dan bebas gradien berlebih.
3. **Database RLS Policies**: Proteksi data terpusat di level database menggunakan PostgreSQL Row Level Security.
4. **Zero Vulnerability Guarantee**: Kode secara berkala dipindai menggunakan *Snyk Static Application Security Testing (SAST)*.

---

© 2026 **CationGate Platform**. Hak Cipta Dilindungi Undang-Undang.
