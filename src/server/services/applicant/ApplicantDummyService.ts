import { getSupabaseClient } from "../../db/supabase";
import { pool } from "../../db/client";
import { resolveSchoolUUID } from "../../db/resolve-school";
import { fontInMemSchools } from "../../routes/saas";

const FIRST_NAMES_MALE = [
  "Ahmad", "Budi", "Dimas", "Eka", "Fahri", "Farel", "Farhan", "Hadi", "Hafiz",
  "Ilham", "Indra", "Joko", "Kevin", "Muhammad", "Naufal", "Raditya", "Rafi",
  "Reza", "Rian", "Rizky", "Satria", "Taufik", "Umar", "Wahyu", "Yusuf", "Zacky"
];

const FIRST_NAMES_FEMALE = [
  "Adinda", "Anisa", "Aulia", "Cinta", "Dewi", "Dinda", "Fitri", "Gita", "Hani",
  "Intan", "Kartika", "Lestari", "Melati", "Nabila", "Nurul", "Oktavia", "Putri",
  "Qori", "Rahma", "Rania", "Salsabila", "Siti", "Syifa", "Tiara", "Vina", "Zahra"
];

const LAST_NAMES = [
  "Pratama", "Wijaya", "Santoso", "Lestari", "Putra", "Kusuma", "Hidayat", "Saputra",
  "Ramadhan", "Nugraha", "Permana", "Wibowo", "Utami", "Sari", "Firmansyah", "Syahputra",
  "Subagyo", "Setiawan", "Bahri", "Hasanah", "Mahendra", "Wahyudi", "Gunawan", "Siregar",
  "Pangestu", "Kurniawan", "Ardiansyah", "Wicaksono", "Firmansyah"
];

const SCHOOLS_ORIGIN = [
  "SMP Negeri 1", "SMP Negeri 2", "SMP Negeri 3", "SMP Negeri 4", "SMP Negeri 5",
  "SMP Negeri 7", "SMP Negeri 10", "SMP IT Al-Azhar", "SMP IT Nurul Fikri",
  "SMP PGRI 1", "SMP Mardi Yuana", "SMP Budi Luhur", "SMP Taruna Bangsa"
];

const OCCUPATIONS_FATHER = [
  "Wiraswasta", "Karyawan Swasta", "PNS", "Guru / Dosen", "TNI / POLRI",
  "Pedagang", "Buruh Harian Lepas", "Teknisi Industri", "Pengemudi Online"
];

const OCCUPATIONS_MOTHER = [
  "Ibu Rumah Tangga", "Karyawan Swasta", "Wiraswasta", "Guru", "PNS",
  "Pedagang", "Bidan / Perawat"
];

const SALARY_RANGES = [
  "< Rp 2.000.000",
  "Rp 2.000.000 - Rp 4.000.000",
  "Rp 4.000.000 - Rp 7.000.000",
  "Rp 7.000.000 - Rp 12.000.000",
  "> Rp 12.000.000"
];

const STREETS = [
  "Jl. Margonda Raya", "Jl. Siliwangi", "Jl. Pajajaran", "Jl. Merdeka", "Jl. Sudirman",
  "Jl. Pemuda", "Jl. Kartini", "Jl. Raya Bogor", "Jl. Kemakmuran", "Jl. Nusantara"
];

const DISTRICTS = [
  { kec: "Pancoran Mas", kel: "Depok Jaya", pos: "16432" },
  { kec: "Beji", kel: "Tanah Baru", pos: "16426" },
  { kec: "Sukmajaya", kel: "Mekarjaya", pos: "16411" },
  { kec: "Cimanggis", kel: "Harjamukti", pos: "16454" },
  { kec: "Bogor Barat", kel: "Menteng", pos: "16111" },
  { kec: "Tanah Sareal", kel: "Kebon Pedes", pos: "16162" },
  { kec: "Cibinong", kel: "Pabuaran", pos: "16916" }
];

export class ApplicantDummyService {
  /**
   * Mengambil daftar jurusan yang dibuat/dikonfigurasi oleh sekolah admin
   */
  static async getSchoolMajors(schoolId: string): Promise<string[]> {
    const supabase = getSupabaseClient();
    try {
      const resolvedId = (await resolveSchoolUUID(schoolId, fontInMemSchools)) || schoolId;
      const { data: majorsData } = await supabase
        .from("landing_page_config")
        .select("config_value")
        .eq("school_id", resolvedId)
        .eq("config_key", "ppdb_majors_config")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let majorsList = majorsData?.config_value;
      if (!majorsList) {
        try {
          const pgRes = await pool.query(
            `SELECT config_value FROM landing_page_config WHERE (school_id::text = $1 OR school_id::text = $2) AND config_key = 'ppdb_majors_config' ORDER BY updated_at DESC LIMIT 1`,
            [schoolId, resolvedId]
          );
          if (pgRes.rows && pgRes.rows.length > 0) {
            majorsList = pgRes.rows[0].config_value;
          }
        } catch (_pgErr) {}
      }

      if (typeof majorsList === "string") {
        try {
          majorsList = JSON.parse(majorsList);
          if (typeof majorsList === "string") majorsList = JSON.parse(majorsList);
        } catch (_e) {}
      }

      if (Array.isArray(majorsList) && majorsList.length > 0) {
        const extracted = majorsList
          .map((m: { title?: string; name?: string; code?: string } | string) => {
            if (typeof m === "string") return m;
            return m.title || m.name || m.code || "";
          })
          .filter(Boolean);

        if (extracted.length > 0) return extracted;
      }
    } catch (_err) {
      console.warn("Could not load dynamic majors for dummy generation, using fallback:", _err);
    }

    return [
      "Rekayasa Perangkat Lunak",
      "Teknik Jaringan Komputer & Telekomunikasi",
      "Desain Komunikasi Visual",
      "Broadcasting & Perfilman",
      "Animasi",
      "Teknik Elektronika"
    ];
  }

  /**
   * Menghasilkan dan menyimpan data calon siswa dummy langsung ke database sekolah terkait
   */
  static async generateDummyApplicants(
    schoolId: string,
    count: number = 5,
    statusPreference: "random" | "Pending" | "Approved" | "Rejected" = "random",
    _authToken?: string
  ) {
    const numToGenerate = Math.min(50, Math.max(1, count));
    const resolvedSchoolId = (await resolveSchoolUUID(String(schoolId), fontInMemSchools)) || schoolId;
    const schoolMajors = await this.getSchoolMajors(resolvedSchoolId);

    const supabase = getSupabaseClient();
    const createdApplicants: Record<string, unknown>[] = [];
    const now = Date.now();

    for (let i = 0; i < numToGenerate; i++) {
      const isMale = Math.random() > 0.5;
      const firstName = isMale
        ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
        : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const fullName = `${firstName} ${lastName}`;

      const gender = isMale ? "L" : "P";
      const randNisnSuffix = Math.floor(1000000 + Math.random() * 9000000);
      const nisn = `008${randNisnSuffix}`;
      const nik = `327601${String(10 + Math.floor(Math.random() * 20))}${String(10 + Math.floor(Math.random() * 12)).padStart(2, "0")}09${String(Math.floor(1000 + Math.random() * 9000))}`;

      // Pick major strictly from the school's configured majors!
      const chosenMajor = schoolMajors[Math.floor(Math.random() * schoolMajors.length)] || "Rekayasa Perangkat Lunak";

      const dist = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
      const street = STREETS[Math.floor(Math.random() * STREETS.length)];
      const houseNo = Math.floor(1 + Math.random() * 120);
      const address = `${street} No. ${houseNo}`;

      // Status
      let status: "Pending" | "Approved" | "Rejected" = "Pending";
      if (statusPreference === "Approved") status = "Approved";
      else if (statusPreference === "Rejected") status = "Rejected";
      else if (statusPreference === "Pending") status = "Pending";
      else {
        const randStatus = Math.random();
        if (randStatus < 0.6) status = "Pending";
        else if (randStatus < 0.9) status = "Approved";
        else status = "Rejected";
      }

      // Payment
      const isPaid = status === "Approved" || Math.random() > 0.35;
      const payMethod = Math.random() > 0.5 ? "Bayar Tunai di TU (Cash)" : "Transfer Virtual Account (VA)";
      const paymentStatus = isPaid ? "LUNAS" : "UNPAID";

      // Days ago (spread past 1-7 days)
      const daysAgo = Math.floor(Math.random() * 7);
      const hoursAgo = Math.floor(Math.random() * 24);
      const regDate = new Date(now - daysAgo * 86400000 - hoursAgo * 3600000).toISOString();

      const birthMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
      const birthDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
      const birthYear = Math.random() > 0.5 ? "2009" : "2010";
      const birthDate = `${birthYear}-${birthMonth}-${birthDay}T00:00:00.000Z`;

      const originSchool = `${SCHOOLS_ORIGIN[Math.floor(Math.random() * SCHOOLS_ORIGIN.length)]} ${dist.kec}`;

      const phoneRand = Math.floor(10000000 + Math.random() * 90000000);
      const waNumber = `0812${phoneRand}`;
      const ortuPhone = `0813${phoneRand + 1}`;

      const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(10 + Math.random() * 90)}`;
      const email = `${emailPrefix}@gmail.com`;

      const fatherName = `${FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]} ${lastName}`;
      const motherName = `${FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;

      const scoreTeori = (80 + Math.random() * 15).toFixed(2);
      const scorePraktik = (82 + Math.random() * 16).toFixed(2);
      const scoreMulo = (80 + Math.random() * 14).toFixed(2);

      const applicantPayload: Record<string, unknown> = {
        school_id: resolvedSchoolId,
        nama: fullName,
        nisn: nisn,
        nik: nik,
        tempat_lahir: dist.kec,
        tgl_lahir: birthDate,
        jenis_kelamin: gender,
        agama: "Islam",
        kewarganegaraan: "WNI",
        alamat: address,
        rt_rw: `0${Math.floor(1 + Math.random() * 8)}/0${Math.floor(1 + Math.random() * 8)}`,
        kelurahan: dist.kel,
        kecamatan: dist.kec,
        kode_pos: dist.pos,
        whatsapp: waNumber,
        email: email,
        tinggal_dengan: "Orang Tua",
        transportasi: Math.random() > 0.5 ? "Sepeda Motor" : "Angkutan Umum",
        tinggi_badan: Math.floor(155 + Math.random() * 25),
        berat_badan: Math.floor(45 + Math.random() * 25),
        jarak_sekolah: Math.random() > 0.5 ? "< 5 km" : "5 - 10 km",
        jarak_km: parseFloat((1.2 + Math.random() * 6.5).toFixed(1)),
        waktu_jam: 0,
        waktu_menit: Math.floor(15 + Math.random() * 30),
        jumlah_saudara: Math.floor(1 + Math.random() * 3),
        golongan_darah: ["A", "B", "AB", "O"][Math.floor(Math.random() * 4)],
        nama_ayah: fatherName,
        pekerjaan_ayah: OCCUPATIONS_FATHER[Math.floor(Math.random() * OCCUPATIONS_FATHER.length)],
        penghasilan_ayah: SALARY_RANGES[Math.floor(Math.random() * SALARY_RANGES.length)],
        nama_ibu: motherName,
        pekerjaan_ibu: OCCUPATIONS_MOTHER[Math.floor(Math.random() * OCCUPATIONS_MOTHER.length)],
        penghasilan_ibu: SALARY_RANGES[Math.floor(Math.random() * (SALARY_RANGES.length - 2))],
        telepon_ortu: ortuPhone,
        sekolah_asal: originSchool,
        tgl_lulus: "2026-06-15T00:00:00.000Z",
        jurusan_1: chosenMajor,
        alasan_memilih: "Memiliki minat tinggi dalam bidang vokasi dan prospek kerja industri.",
        cita_cita: "Profesional di Bidang Industri Vokasi",
        nilai_us_teori: parseFloat(scoreTeori),
        nilai_us_praktik: parseFloat(scorePraktik),
        nilai_muatan_lokal: parseFloat(scoreMulo),
        periode: "2026-2027",
        gelombang: Math.random() > 0.3 ? "Gelombang 1" : "Gelombang 2",
        status: status,
        payment_status: paymentStatus,
        metode_pembayaran: payMethod,
        tgl_daftar: regDate,
      };

      try {
        let inserted: Record<string, unknown> | null = null;
        const { data: dbData, error: dbErr } = await supabase
          .from("student_applicants")
          .insert(applicantPayload)
          .select()
          .maybeSingle();

        if (!dbErr && dbData) {
          inserted = dbData;
        } else {
          if (dbErr) {
            console.warn("Supabase student_applicants insert error, trying SQL pool:", dbErr.message);
          }
          // Fallback to PostgreSQL pool directly
          const keys = Object.keys(applicantPayload);
          const values = Object.values(applicantPayload).map((val) =>
            typeof val === "object" && val !== null ? JSON.stringify(val) : val
          );
          const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(", ");
          try {
            const pgRes = await pool.query(
              `INSERT INTO student_applicants (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`,
              values
            );
            if (pgRes.rows && pgRes.rows.length > 0) {
              inserted = pgRes.rows[0];
            }
          } catch (_pgErr1) {
            try {
              const pgRes2 = await pool.query(
                `INSERT INTO calon_siswa (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`,
                values
              );
              if (pgRes2.rows && pgRes2.rows.length > 0) {
                inserted = pgRes2.rows[0];
              }
            } catch (_pgErr2) {
              console.error("Direct SQL fallback insert error:", _pgErr2);
            }
          }
        }

        if (!inserted) {
          const fallbackId = Date.now() + i;
          const seq = String(fallbackId).slice(-4);
          const regNo = `26271${seq}`;
          inserted = {
            id: fallbackId,
            ...applicantPayload,
            registration_no: regNo,
            no_pendaftaran: regNo
          };
        }

        if (inserted) {
          // Set registration number if not present
          if (!inserted.registration_no) {
            const seq = String(inserted.id || Math.floor(1000 + Math.random() * 9000)).padStart(4, "0");
            const regNo = `26271${seq}`;
            try {
              await supabase
                .from("student_applicants")
                .update({ registration_no: regNo })
                .eq("id", inserted.id);
            } catch (_e) {}
            try {
              await pool.query(`UPDATE student_applicants SET registration_no = $1 WHERE id = $2`, [regNo, inserted.id]);
            } catch (_e) {}
            try {
              await pool.query(`UPDATE calon_siswa SET registration_no = $1 WHERE id = $2`, [regNo, inserted.id]);
            } catch (_e) {}
            inserted.registration_no = regNo;
            inserted.no_pendaftaran = regNo;
          }
          createdApplicants.push(inserted);
        }
      } catch (insertErr) {
        console.error("Failed to insert dummy applicant:", insertErr);
        const fallbackId = Date.now() + i;
        const seq = String(fallbackId).slice(-4);
        const regNo = `26271${seq}`;
        createdApplicants.push({
          id: fallbackId,
          ...applicantPayload,
          registration_no: regNo,
          no_pendaftaran: regNo
        });
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: `Berhasil menambahkan ${createdApplicants.length} calon siswa dummy berdasarkan jurusan sekolah.`,
      count: createdApplicants.length,
      majorsUsed: schoolMajors,
      data: createdApplicants
    };
  }
}
