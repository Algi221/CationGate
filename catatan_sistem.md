# Catatan Sistem & Dokumentasi Produksi PPDB SMK Taruna Bhakti

Dokumen ini berisi informasi teknis lengkap mengenai arsitektur, pustaka (libraries) yang digunakan, alur registrasi data calon siswa, konfigurasi ORM Prisma, mekanisme middleware, serta riwayat perubahan file database fallback.

---

## 1. Kelayakan Produksi (Production Readiness)
Projek ini **sangat aman dan siap untuk dideploy ke lingkungan produksi (Production)**. Berikut adalah jaminan keamanannya:
* **0 Isu Keamanan**: Hasil pemindaian statis Snyk (`snyk code test`) menunjukkan **0 kerentanan** (Total issues: 0). Seluruh celah keamanan DOM-based XSS (DOMXSS) di frontend telah sepenuhnya dibersihkan.
* **Bebas Dari Data Fallback Tidak Konsisten**: Seluruh kode database offline in-memory yang tidak konsisten telah dibuang. Backend kini 100% terhubung secara kuat ke PostgreSQL.
* **Build Sukses**: Build produksi Next.js (`npm run build`) berjalan dengan sukses tanpa ada kesalahan tipe (TypeScript) atau bundling pada Turbopack.

---

## 2. Daftar Library Utama & Fungsinya

### Frontend (`frontend/package.json`)
* **`next` (v16.2.6)**: Framework React untuk rendering di sisi server (SSR) dan static site generation (SSG). Menghasilkan performa web yang cepat dan SEO yang optimal.
* **`react` & `react-dom` (v19.2.4)**: Library UI dasar untuk membangun antarmuka web berbasis komponen.
* **`dompurify` (v3.4.9)**: Pustaka utama untuk melakukan sanitasi HTML/SVG/MathML guna mencegah serangan Cross-Site Scripting (XSS).
* **`isomorphic-dompurify` (v3.3.0)**: Digunakan sebagai library pendukung agar DOMPurify dapat dijalankan secara aman baik di sisi browser (client-side) maupun Node.js (server-side rendering) tanpa menyebabkan galat `window is undefined`.
* **`lucide-react`**: Kumpulan ikon modern berformat SVG yang ringan dan mudah disesuaikan.
* **`framer-motion` & `motion`**: Library animasi performa tinggi untuk transisi UI yang halus dan premium.
* **`exceljs` & `file-saver`**: Digunakan di dashboard admin untuk mengekspor data pendaftaran calon siswa langsung menjadi berkas spreadsheet Excel (.xlsx).

### Backend (`backend/package.json`)
* **`hono`**: Web framework minimalis dan super cepat yang berjalan di atas Bun/Node.js. Bertugas menangani routing API secara efisien.
* **`@prisma/client` & `prisma`**: ORM (Object-Relational Mapping) untuk berinteraksi dengan database PostgreSQL menggunakan model data type-safe.
* **`jsonwebtoken`**: Untuk membuat (sign) dan memverifikasi token JWT guna mengamankan sesi login admin.
* **`dotenv`**: Membaca variabel lingkungan dari berkas `.env` (seperti koneksi database, secret key, dsb).

---

## 3. Alur Input Data Calon Siswa (Pendaftaran)

Data calon siswa baru yang diinput melalui formulir pendaftaran di frontend dikirim via HTTP POST ke endpoint API backend `/api/applicants`.

* **Nama Berkas**: [applicants.ts](file:///d:/Website%20Project%20/PPDB_SMK_TarunaBhakti/backend/src/routes/applicants.ts)
* **Baris Kode Insert (Prisma)**:
  Proses pemetaan data dari frontend ke model database dilakukan di dalam endpoint `POST /`. Kode utama untuk menyimpan data tersebut ke database PostgreSQL menggunakan Prisma adalah:

```typescript
// Jalur: backend/src/routes/applicants.ts
// Baris 328-330
const savedRecord = await prisma.calonSiswa.create({
  data: mapped
});
```

### Penjelasan Variabel:
* `mapped`: Objek JavaScript yang menampung seluruh data calon siswa yang dikirim oleh pendaftar (termasuk NISN, NIK, Nama, Jurusan Pilihan, berkas KK/KTP ter-encode Base64, dan status awal `'Pending'`).
* `prisma.calonSiswa`: Model tabel database yang mewakili entitas Calon Siswa di PostgreSQL.

---

## 4. Mengapa Kita Menggunakan Prisma ORM?

Prisma digunakan sebagai ORM karena memberikan keuntungan besar berikut:
1. **Type Safety & Auto-completion**: Model database diubah menjadi tipe TypeScript otomatis. Hal ini mencegah kesalahan penulisan nama kolom/tipe data saat menulis kueri.
2. **Deklaratif & Mudah Dimigrasi**: Struktur tabel ditulis dalam berkas `schema.prisma`. Untuk membuat atau mengubah tabel di PostgreSQL, kita cukup menjalankan `prisma migrate dev`, tanpa perlu menulis query SQL manual.
3. **Optimasi Kueri Otomatis**: Prisma mengelola koneksi (connection pool) ke PostgreSQL secara cerdas dan mengoptimalkan kueri SQL di balik layar agar memiliki performa maksimal.

---

## 5. Cara Kerja & Fungsi Middleware

Akses ke API Dashboard Admin diamankan menggunakan berkas middleware otentikasi.

* **Nama Berkas**: [auth.ts (Middleware)](file:///d:/Website%20Project%20/PPDB_SMK_TarunaBhakti/backend/src/middleware/auth.ts)

### Kode Utama:
```typescript
export const adminAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      message: 'Akses ditolak: Token otentikasi tidak ditemukan.'
    }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set('admin', decoded); // Menyimpan info admin terotentikasi ke context
    return await next(); // Lanjut ke handler route berikutnya
  } catch (error) {
    return c.json({
      success: false,
      message: 'Akses ditolak: Session kedaluwarsa atau token tidak valid.'
    }, 401);
  }
});
```

### Penjelasan Mekanisme:
1. Setiap kali klien memanggil API admin (seperti mengambil data pendaftar), middleware `adminAuth` akan memeriksa header `Authorization`.
2. Token JWT diekstrak dari header.
3. Menggunakan kunci rahasia `JWT_SECRET`, token tersebut diverifikasi via `jwt.verify()`.
4. **Jika token Valid**: Informasi admin disimpan di context Hono (`c.set('admin', decoded)`) dan memanggil `next()` agar route utama dieksekusi.
5. **Jika token Tidak Valid/Kadaluwarsa**: Mengembalikan respons error `401 Unauthorized`, sehingga rute di belakangnya tidak bisa diakses sama sekali.
6. Middleware `superAdminAuth` bertugas memeriksa kembali apakah peran admin terotentikasi adalah `'superadmin'` untuk membatasi akses pada fitur-fitur kritis (seperti menghapus data).

---

## 6. Apa itu Berkas `in_memory.json` dan Kenapa Hilang?

### Kegunaan Sebelumnya:
Berkas `in_memory_applicants.json` dan `in_memory_config.json` sebelumnya digunakan sebagai **fallback database lokal (offline/mock)**. 
Jika koneksi backend ke database PostgreSQL lokal terputus, backend akan mendeteksi offline dan secara otomatis mengalihkan kueri baca/tulis data ke file JSON lokal tersebut agar aplikasi seolah-olah tetap berjalan.

### Alasan Dihapus:
Berkas tersebut **dihapus karena permintaan pembersihan kode cadangan (database offline fallback)**. 
Menggunakan in-memory JSON fallback sangat tidak aman untuk produksi karena:
1. **Ketidakkonsistenan Data**: Data yang masuk saat DB offline hanya tersimpan di file lokal tersebut dan tidak masuk ke PostgreSQL, menyebabkan perbedaan data (split-brain).
2. **Kerapuhan Sistem**: File JSON lokal dapat terhapus, rusak, atau ter-overwrite saat server dideploy ulang, menyebabkan hilangnya data calon siswa yang mendaftar.
3. **Ketergantungan Kuat PostgreSQL**: Untuk tingkat produksi, sistem wajib berjalan 100% secara transaksional di atas PostgreSQL demi integritas data pendaftaran yang valid dan permanen. Logika fallback offline tersebut kini telah dibersihkan secara total dari kode backend agar backend langsung melempar error koneksi jika PostgreSQL mati, sehingga admin dapat segera mengetahuinya.
