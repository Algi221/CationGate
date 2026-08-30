import { formatNoPendaftaran } from "@/components/features/pendaftar/components/detail-sections/sanitizeUrl";
import { PPDBApplicant } from "../types/ppdbTypes";

const NAMES_FIRST = [
  "Ahmad", "Budi", "Cinta", "Dewi", "Eka", "Fahri", "Gita", "Hani", "Indra", "Joko",
  "Kartika", "Lestari", "Muhammad", "Nabila", "Oktavia", "Putri", "Qori", "Rizky",
  "Siti", "Taufik", "Umar", "Vina", "Wahyu", "Xena", "Yusuf", "Zahra", "Dimas", "Farhan",
  "Anisa", "Rian", "Bayu", "Tiara", "Kevin", "Salsabila", "Reza", "Melati", "Aditya", "Nurul"
];

const NAMES_LAST = [
  "Pratama", "Wijaya", "Santoso", "Lestari", "Putra", "Kusuma", "Hidayat", "Saputra",
  "Ramadhan", "Nugraha", "Permana", "Wibowo", "Utami", "Sari", "Firmansyah", "Syahputra",
  "Subagyo", "Setiawan", "Bahri", "Hasanah", "Mahendra", "Wahyudi", "Gunawan", "Siregar"
];

const MAJORS_LIST = [
  "Rekayasa Perangkat Lunak",
  "Teknik Komputer dan Jaringan",
  "Desain Komunikasi Visual",
  "Broadcasting dan Perfilman",
  "Animasi",
  "Teknik Elektronika"
];

const SCHOOLS_ORIGIN = [
  "SMPN 1 Depok", "SMPN 2 Depok", "SMPN 4 Jakarta", "SMP Al-Azhar 9",
  "SMPN 1 Bogor", "SMP YPB Depok", "SMP PGRI 1", "SMPN 3 Bekasi",
  "SMP IT Nurul Fikri", "SMPN 1 Cibinong", "SMP Mardi Yuana"
];

const TRANSFER_ORIGINS = [
  "SMK Negeri 1 Jakarta",
  "SMA Negeri 8 Jakarta",
  "SMK Telkom Sandhy Putra",
  "SMA Negeri 1 Bogor",
  "SMK Negeri 2 Depok",
  "SMA Labschool Cibubur",
  "SMK Taruna Terpadu 1",
  "SMA Negeri 3 Bekasi"
];

const TRANSFER_REASONS = [
  "Mengikuti perpindahan dinas tugas kerja orang tua ke wilayah Depok",
  "Penyesuaian kurikulum peminatan kejuruan vokasi industri",
  "Pindah domisili keluarga dari luar daerah ke Kota Depok",
  "Mencari program vokasi yang memiliki kerja sama sertifikasi industri"
];

export function generateDemoApplicants(): PPDBApplicant[] {
  return [];
}

/*
    const fn = NAMES_FIRST[i % NAMES_FIRST.length];
    const ln = NAMES_LAST[(i * 3) % NAMES_LAST.length];
    const nisn = `008${1000000 + i * 13579}`.slice(0, 10);
    const nik = `327601${String(10 + (i % 20)).padStart(2, "0")}0409${String(i).padStart(4, "0")}`;
    const major = MAJORS_LIST[i % MAJORS_LIST.length];
    const secondaryMajor = MAJORS_LIST[(i + 1) % MAJORS_LIST.length];
    const status = statuses[i % statuses.length];
    const school = SCHOOLS_ORIGIN[i % SCHOOLS_ORIGIN.length];
    const daysAgo = i % 7;
    const dateStr = new Date(now - daysAgo * dayMs - i * 3600000).toISOString();
    const gender = i % 2 === 0 ? "L" : "P";
    const regNo = formatNoPendaftaran(currentPeriode, i, "demo");

    let diterimaKelas: string | null = null;
    if (status === "Approved") {
      if (i <= 20) {
        if (major === "Rekayasa Perangkat Lunak") {
          diterimaKelas = i % 2 === 0 ? "X RPL 1" : "X RPL 2";
        } else if (major === "Teknik Komputer dan Jaringan") {
          diterimaKelas = i % 2 === 0 ? "X TJKT 1" : "X TJKT 2";
        } else if (major === "Desain Komunikasi Visual") {
          diterimaKelas = "X DKV 1";
        } else if (major === "Broadcasting dan Perfilman") {
          diterimaKelas = "X BC 1";
        } else if (major === "Animasi") {
          diterimaKelas = "X ANM 1";
        } else {
          diterimaKelas = "X TE 1";
        }
      }
    }

    const payMethod =
      i % 3 === 0
        ? "Bayar Tunai di TU (Cash)"
        : i % 3 === 1
          ? "Transfer Manual"
          : "Midtrans Payment Gateway";

    result.push({
      id: i,
      nama: `${fn} ${ln}`,
      nisn,
      nik,
      registration_no: regNo,
      no_pendaftaran: regNo,
      periode: currentPeriode,
      sekolah_asal: school,
      sekolahAsal: school,
      jurusan_1: major,
      jurusan_2: secondaryMajor,
      jurusan1: major,
      jurusan2: secondaryMajor,
      status,
      tipe_pendaftar: "REGULER",
      jalur_pendaftaran: "REGULER",
      is_pindahan: false,
      pindahan_dari: "",
      pindahanDari: "",
      metode_pembayaran: payMethod,
      status_pembayaran:
        status === "Rejected" ? "BELUM_BAYAR" : i % 5 === 0 ? "PENDING" : "LUNAS",
      bukti_bayar:
        payMethod === "Transfer Manual"
          ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"
          : null,
      diterima_kelas: diterimaKelas,
      diterimaKelas,
      tgl_daftar: dateStr,
      createdAt: dateStr,
      jenis_kelamin: gender,
      jenisKelamin: gender,
      tempat_lahir: i % 2 === 0 ? "Depok" : "Jakarta",
      tgl_lahir: "2009-05-14",
      gelombang: i % 3 === 0 ? "Gelombang 2" : "Gelombang 1",
      no_telepon: `08129${1000000 + i * 4567}`.slice(0, 12),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`,
      nama_ayah: `Bpk. ${ln} ${fn}`,
      nama_ibu: `Ibu Siti ${ln}`,
      pekerjaan_ayah: i % 2 === 0 ? "Karyawan Swasta" : "Wiraswasta",
      alamat_jalan: `Jl. Margonda Raya No. ${i * 3}, Kota Depok`,
      alasan_ditolak:
        status === "Rejected"
          ? "Berkas administrasi tidak memenuhi kelengkapan NISN & Surat Keterangan Lulus."
          : null,
      verified_by: status === "Approved" ? "Admin PPDB" : null,
    });
  }

  for (let j = 1; j <= 15; j++) {
    const id = 50 + j;
    const fn = NAMES_FIRST[(id * 2) % NAMES_FIRST.length];
    const ln = NAMES_LAST[(id * 4) % NAMES_LAST.length];
    const nisn = `007${1000000 + id * 24680}`.slice(0, 10);
    const nik = `327601${String(20 + (j % 10)).padStart(2, "0")}0408${String(id).padStart(4, "0")}`;
    const major = MAJORS_LIST[(j - 1) % MAJORS_LIST.length];
    const transferSchool = TRANSFER_ORIGINS[(j - 1) % TRANSFER_ORIGINS.length];
    const transferReason = TRANSFER_REASONS[(j - 1) % TRANSFER_REASONS.length];
    const status = j % 6 === 0 ? "Rejected" : j % 4 === 0 ? "Pending" : "Approved";
    const gradeLevel = j % 2 === 0 ? "XI" : "XII";
    const majorCode =
      major === "Rekayasa Perangkat Lunak"
        ? "RPL"
        : major === "Teknik Komputer dan Jaringan"
          ? "TJKT"
          : major === "Desain Komunikasi Visual"
            ? "DKV"
            : major === "Broadcasting dan Perfilman"
              ? "BC"
              : major === "Animasi"
                ? "ANM"
                : "TE";
    const assignedClass = status === "Approved" ? `${gradeLevel} ${majorCode} 1` : null;
    const regNo = formatNoPendaftaran(currentPeriode, id, "demo");
    const dateStr = new Date(now - (j + 2) * dayMs).toISOString();
    const gender = j % 2 === 0 ? "L" : "P";

    result.push({
      id,
      nama: `${fn} ${ln}`,
      nisn,
      nik,
      registration_no: regNo,
      no_pendaftaran: regNo,
      periode: currentPeriode,
      sekolah_asal: transferSchool,
      sekolahAsal: transferSchool,
      pindahan_dari: transferSchool,
      pindahanDari: transferSchool,
      alasan_pindah: transferReason,
      is_pindahan: true,
      tipe_pendaftar: "PINDAHAN",
      jalur_pendaftaran: "PINDAHAN",
      jurusan_1: major,
      jurusan_2: major,
      jurusan1: major,
      jurusan2: major,
      status,
      metode_pembayaran: "Transfer Manual",
      status_pembayaran: status === "Rejected" ? "BELUM_BAYAR" : "LUNAS",
      bukti_bayar: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
      diterima_kelas: assignedClass,
      diterimaKelas: assignedClass,
      tgl_daftar: dateStr,
      createdAt: dateStr,
      jenis_kelamin: gender,
      jenisKelamin: gender,
      tempat_lahir: "Jakarta",
      tgl_lahir: "2008-03-20",
      gelombang: "Jalur Mutasi Pindahan",
      no_telepon: `08138${2000000 + j * 6789}`.slice(0, 12),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${id}@gmail.com`,
      nama_ayah: `Bpk. ${ln} ${fn}`,
      nama_ibu: `Ibu ${fn} ${ln}`,
      pekerjaan_ayah: "PNS / Pegawai BUMN",
      alamat_jalan: `Jl. Raya Sawangan No. ${j * 5}, Kota Depok`,
      alasan_ditolak:
        status === "Rejected"
          ? "Akreditasi sekolah asal dan kesesuaian kurikulum mata pelajaran vokasi belum terpenuhi."
          : null,
      verified_by: status === "Approved" ? "Admin PPDB" : null,
    });
  }

  return result;
}
*/

export function generateDemoTrashedApplicants(): PPDBApplicant[] {
  const result: PPDBApplicant[] = [];
  const currentPeriode = "2026-2027";
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const reasons = [
    "Permintaan pembatalan pendaftaran resmi dari orang tua karena diterima di SMA Negeri",
    "Data pendaftaran ganda / duplikasi data calon siswa",
    "Mengundurkan diri karena kendala perpindahan lokasi domisili keluarga",
    "Salah input jurusan dan mengajukan pendaftaran ulang",
    "Tidak melengkapi berkas fisik persyaratan hingga batas akhir penutupan gelombang",
    "Pindah domisili ke luar provinsi mengikuti dinas orang tua"
  ];

  for (let k = 1; k <= 6; k++) {
    const id = 90 + k;
    const fn = NAMES_FIRST[(id * 3) % NAMES_FIRST.length];
    const ln = NAMES_LAST[(id * 7) % NAMES_LAST.length];
    const nisn = `008${9000000 + k * 12345}`.slice(0, 10);
    const major = MAJORS_LIST[(k + 2) % MAJORS_LIST.length];
    const school = SCHOOLS_ORIGIN[k % SCHOOLS_ORIGIN.length];
    const regNo = formatNoPendaftaran(currentPeriode, id, "demo");
    const dateStr = new Date(now - (k + 5) * dayMs).toISOString();
    const deletedStr = new Date(now - k * dayMs).toISOString();

    result.push({
      id,
      nama: `${fn} ${ln}`,
      nisn,
      registration_no: regNo,
      no_pendaftaran: regNo,
      periode: currentPeriode,
      sekolah_asal: school,
      sekolahAsal: school,
      jurusan_1: major,
      jurusan1: major,
      status: "Rejected",
      deleted_at: deletedStr,
      deleted_by: "Admin PPDB",
      alasan_hapus: reasons[k - 1] || "Pembatalan berkas pendaftaran",
      alasan_ditolak: reasons[k - 1] || "Pembatalan berkas pendaftaran",
      tgl_daftar: dateStr,
      jenis_kelamin: k % 2 === 0 ? "L" : "P",
      jenisKelamin: k % 2 === 0 ? "L" : "P",
      gelombang: "Gelombang 1",
    });
  }
  return result;
}

export const DEMO_TRASHED_APPLICANTS_SEED = generateDemoTrashedApplicants();

export function generateDemoActiveStudents(): PPDBApplicant[] {
  const result: PPDBApplicant[] = [];
  const periodes = ["2024-2025", "2025-2026", "2026-2027"];
  let idCounter = 1;

  periodes.forEach((periode, pIdx) => {
    for (let i = 1; i <= 25; i++) {
      const fn = NAMES_FIRST[(idCounter * 2) % NAMES_FIRST.length];
      const ln = NAMES_LAST[(idCounter * 5) % NAMES_LAST.length];
      const major = MAJORS_LIST[i % MAJORS_LIST.length];
      const school = SCHOOLS_ORIGIN[i % SCHOOLS_ORIGIN.length];
      const nisn = `007${1000000 + idCounter * 8888}`.slice(0, 10);
      const gender = i % 2 === 0 ? "L" : "P";
      const regNo = formatNoPendaftaran(periode, idCounter, "demo");

      const grade = pIdx === 0 ? "XII" : pIdx === 1 ? "XI" : "X";
      const majorCode =
        major === "Rekayasa Perangkat Lunak"
          ? "RPL"
          : major === "Teknik Komputer dan Jaringan"
            ? "TJKT"
            : major === "Desain Komunikasi Visual"
              ? "DKV"
              : major === "Broadcasting dan Perfilman"
                ? "BC"
                : major === "Animasi"
                  ? "ANM"
                  : "TE";

      const assignedClass = `${grade} ${majorCode} ${i % 2 === 0 ? "1" : "2"}`;

      result.push({
        id: 1000 + idCounter,
        nama: `${fn} ${ln}`,
        nisn,
        registration_no: regNo,
        no_pendaftaran: regNo,
        periode,
        sekolah_asal: school,
        sekolahAsal: school,
        jurusan_1: major,
        jurusan1: major,
        status: "Approved",
        metode_pembayaran: "LUNAS",
        status_pembayaran: "LUNAS",
        diterima_kelas: assignedClass,
        diterimaKelas: assignedClass,
        tgl_daftar: new Date(Date.now() - (300 - pIdx * 100) * 86400000).toISOString(),
        jenis_kelamin: gender,
        jenisKelamin: gender,
        tempat_lahir: "Depok",
        tgl_lahir: "2008-01-15",
        gelombang: "Gelombang 1",
        no_telepon: `0812${10000000 + idCounter}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${idCounter}@gmail.com`,
      });
      idCounter++;
    }
  });

  return result;
}
