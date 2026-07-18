import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const namesL = ["Ahmad", "Budi", "Candra", "Dedi", "Eko", "Fajar", "Guntur", "Hendra", "Irfan", "Joko", "Kevin", "Lukman", "Miko", "Naufal", "Oki", "Pratama", "Rian", "Sandi", "Tegar", "Wahyu", "Yanto", "Zaki", "Aditya", "Bagas", "Dwi", "Fahreza", "Gilang", "Hafiz", "Iqbal", "Mahendra", "Rafi", "Satria", "Rizky", "Taufik", "Yusuf"];
const namesP = ["Ayu", "Bunga", "Citra", "Dewi", "Elisa", "Fitri", "Gita", "Hana", "Indah", "Jasmine", "Kartika", "Laras", "Mega", "Nadia", "Olivia", "Putri", "Rani", "Sari", "Tiara", "Wulan", "Yuli", "Zara", "Amanda", "Bella", "Dian", "Febri", "Gisela", "Intan", "Keysha", "Mutia", "Riska", "Syifa", "Tri", "Viona", "Winda"];
const lastNames = ["Saputra", "Lestari", "Hidayat", "Putri", "Pratama", "Kusuma", "Utami", "Wijaya", "Setiawan", "Santoso", "Ramadhan", "Nugroho", "Wibowo", "Suryono", "Hadi", "Pratiwi", "Rahayu", "Fitriani", "Larasati", "Siregar", "Nasution", "Ginting", "Kurniawan", "Gunawan", "Susanto", "Budiman", "Mulyono", "Hartono", "Darmawan"];
const juniorHighs = ["SMPN 1 Depok", "SMPN 2 Depok", "SMPN 3 Depok", "SMPN 4 Depok", "SMPN 7 Depok", "SMP IT Al-Hikmah", "SMP Taruna Bhakti", "SMP Lazuardi", "SMP Al-Azhar Depok", "SMP PGRI Depok", "SMPN 14 Depok", "SMPN 19 Depok"];

const majors = [
  "Rekayasa Perangkat Lunak",
  "Teknik Jaringan Komputer & Telekomunikasi",
  "Desain Komunikasi Visual",
  "Broadcasting & Perfilman",
  "Teknik Elektronika",
  "Animasi"
];

function getMajorClassInfo(majorName) {
  switch (majorName) {
    case "Rekayasa Perangkat Lunak": return { code: "RPL", count: 5 };
    case "Teknik Jaringan Komputer & Telekomunikasi": return { code: "TJKT", count: 4 };
    case "Desain Komunikasi Visual": return { code: "DKV", count: 2 };
    case "Broadcasting & Perfilman": return { code: "BC", count: 3 };
    case "Teknik Elektronika": return { code: "TE", count: 1 };
    case "Animasi": return { code: "ANM", count: 2 };
    default: return { code: "RPL", count: 1 };
  }
}

function generateCustomClasses() {
  const majorsConfig = [
    { code: "RPL", count: 5 }, { code: "ANM", count: 2 }, { code: "DKV", count: 2 },
    { code: "TE", count: 1 }, { code: "TJKT", count: 4 }, { code: "BC", count: 3 }
  ];
  const list = [];
  const grades = ["X", "XI", "XII"];
  majorsConfig.forEach(m => {
    grades.forEach(g => {
      for (let i = 1; i <= m.count; i++) {
        list.push({ id: `${g}-${m.code}-${i}`, name: `${g} ${m.code} ${i}`, majorCode: m.code, maxCapacity: 40 });
      }
    });
  });
  return list;
}

function generateStudent(period, idx, overrides = {}) {
  const isMale = Math.random() > 0.5;
  const firstName = isMale ? namesL[Math.floor(Math.random() * namesL.length)] : namesP[Math.floor(Math.random() * namesP.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const nama = `${firstName} ${lastName}`;
  const gender = isMale ? "L" : "P";
  
  const suffix = String(idx).padStart(3, '0');
  let periodCode = "26";
  if (period === "2025-2026") periodCode = "25";
  else if (period === "2024-2025") periodCode = "24";
  
  const nisn = `00${periodCode}8${suffix}9`;
  const nik = `327601${periodCode}0${suffix}000${gender === 'L' ? '1' : '2'}`;
  
  let birthYear = 2010;
  if (period === "2025-2026") birthYear = 2009;
  else if (period === "2024-2025") birthYear = 2008;
  
  const tgl_lahir = new Date(`${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`);
  
  const j1 = majors[idx % majors.length];

  let grade = "X";
  if (period === "2025-2026") grade = "XI";
  else if (period === "2024-2025") grade = "XII";

  const majorInfo = getMajorClassInfo(j1);
  const classNum = (idx % majorInfo.count) + 1;

  const defaultDiterimaKelas = `${grade} ${majorInfo.code} ${classNum}`;
  const defaultDiterimaTanggal = new Date("2026-07-01");
  
  const detectedGelombang = idx % 2 === 0 ? "Gelombang 1" : "Gelombang 2";

  return {
    nama, nisn, nik, tempat_lahir: "Depok", tgl_lahir, jenis_kelamin: gender, agama: "Islam", kewarganegaraan: "WNI",
    alamat: `Jl. Raya Pekapuran No. ${idx + 1}, Cimanggis, Depok`, rt_rw: "03/05", kelurahan: "Curug", kecamatan: "Cimanggis", kode_pos: "16453", whatsapp: `+62812999${suffix}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@email.com`, tinggal_dengan: "Orang Tua", transportasi: "Jalan Kaki",
    tinggi_badan: 155 + (idx % 25), berat_badan: 45 + (idx % 20), jarak_sekolah: "Kurang dari 1 km", jarak_km: 0.7, waktu_jam: 0, waktu_menit: 10,
    jumlah_saudara: (idx % 4) + 1, golongan_darah: ["A", "B", "AB", "O"][idx % 4], telepon_ortu: `+62812888${suffix}`,
    sekolah_asal: juniorHighs[idx % juniorHighs.length], tgl_lulus: new Date(period === "2026-2027" ? "2026-06-10" : (period === "2025-2026" ? "2025-06-10" : "2024-06-10")),
    jurusan_1: j1, periode: period, status: overrides.status !== undefined ? overrides.status : "Approved",
    payment_status: overrides.payment_status !== undefined ? overrides.payment_status : "Paid", diterima_kelas: overrides.diterima_kelas !== undefined ? overrides.diterima_kelas : defaultDiterimaKelas,
    diterima_tanggal: overrides.diterima_tanggal !== undefined ? overrides.diterima_tanggal : defaultDiterimaTanggal, gelombang: detectedGelombang,
    bukti_bayar: (overrides.payment_status || "Paid") === "Paid" ? "Receipt_Data_Seed_Base64" : "", metode_pembayaran: (overrides.payment_status || "Paid") === "Paid" ? "Payment Gateway (Midtrans - QRIS)" : "Unpaid",
    tgl_daftar: new Date(period === "2026-2027" ? "2026-06-05T10:00:00.000Z" : (period === "2025-2026" ? "2025-05-12T10:00:00.000Z" : "2024-05-12T10:00:00.000Z"))
  };
}

async function main() {
  console.log("Cleaning database...");
  await prisma.mutasiHistory.deleteMany({});
  await prisma.siswaAktif.deleteMany({});
  await prisma.calonSiswa.deleteMany({});
  await prisma.informasi.deleteMany({});
  
  console.log("Seeding admin users...");
  const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || "superadmin";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || Math.random().toString(36).slice(-8);
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || Math.random().toString(36).slice(-8);

  await prisma.adminUser.upsert({
    where: { username: superAdminUsername },
    update: {},
    create: {
      username: superAdminUsername,
      password_hash: bcrypt.hashSync(superAdminPassword, 10),
      nama_lengkap: 'Administrator PPDB TB',
      role: 'superadmin'
    }
  });

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password_hash: bcrypt.hashSync(adminPassword, 10),
      nama_lengkap: 'Panitia PPDB Biasa',
      role: 'admin'
    }
  });

  console.log("Seeding announcements...");
  const announcements = [
    { judul: "Pendaftaran PPDB SMK Taruna Bhakti 2026/2027 Resmi Dibuka!", konten: "Kami mengundang seluruh calon peserta didik baru untuk mendaftarkan diri secara online melalui portal resmi PPDB SMK Taruna Bhakti Depok. Pilih kompetensi keahlian unggulanmu!", tanggal: new Date("2026-05-20") },
    { judul: "Jadwal Pelaksanaan Ujian Seleksi Masuk Potensi Akademik", konten: "Ujian seleksi potensi akademik bagi calon taruna baru gelombang 1 akan diselenggarakan secara tatap muka di laboratorium komputer sekolah. Harap membawa kartu bukti pendaftaran.", tanggal: new Date("2026-06-05") },
    { judul: "Simulasi Pembayaran Formulir PPDB secara Instan", konten: "Untuk mempercepat proses validasi pendaftaran, sistem PPDB telah terintegrasi dengan Payment Gateway otomatis. Calon pendaftar dapat menggunakan QRIS, Virtual Account, atau e-wallet lainnya.", tanggal: new Date("2026-05-25") },
    { judul: "Layanan Konsultasi Pemilihan Jurusan via WhatsApp Panitia", konten: "Bagi calon siswa yang bingung menentukan minat dan program keahlian (RPL, TJKT, DKV, Broadcast, Animasi, Elektronika), panitia membuka posko konsultasi online setiap hari kerja.", tanggal: new Date("2026-05-28") },
    { judul: "Informasi Penutupan Kuota Pendaftaran Gelombang 1", konten: "Pendaftaran gelombang 1 untuk jurusan RPL dan DKV akan segera ditutup apabila kuota tampung laboratorium komputer telah terpenuhi. Mohon segera selesaikan administrasi Anda.", tanggal: new Date("2026-06-01") }
  ];

  for (const a of announcements) {
    await prisma.informasi.create({ data: a });
  }

  console.log("Seeding configuration...");
  const configItems = [
    { config_key: 'ppdb_classes_config', config_value: generateCustomClasses() },
    { config_key: 'ppdb_gelombang_config', config_value: { gelombang1: { start: "2026-06-03", end: "2026-07-24" }, gelombang2: { start: "2026-07-25", end: "2026-08-30" } } },
    { config_key: 'ppdb_bank_config', config_value: { bankName: "Bank Mandiri", accountNumber: "157-00-0174092-2", accountHolder: "Yayasan Taruna Bhakti" } }
  ];

  for (const c of configItems) {
    await prisma.landingPageConfig.upsert({
      where: { config_key: c.config_key },
      update: { config_value: c.config_value },
      create: c
    });
  }

  console.log("Seeding students...");
  const students = [];
  for (let i = 1; i <= 45; i++) students.push(generateStudent("2024-2025", i));
  for (let i = 1; i <= 45; i++) students.push(generateStudent("2025-2026", i));
  for (let i = 1; i <= 15; i++) students.push(generateStudent("2026-2027", i));
  for (let i = 16; i <= 25; i++) students.push(generateStudent("2026-2027", i, { diterima_kelas: null, diterima_tanggal: null }));
  for (let i = 26; i <= 28; i++) students.push(generateStudent("2026-2027", i, { status: "Pending", payment_status: "Unpaid", diterima_kelas: null, diterima_tanggal: null }));
  for (let i = 29; i <= 30; i++) students.push(generateStudent("2026-2027", i, { status: "Rejected", payment_status: "Unpaid", diterima_kelas: null, diterima_tanggal: null }));

  for (const s of students) {
    await prisma.calonSiswa.create({ data: s });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
