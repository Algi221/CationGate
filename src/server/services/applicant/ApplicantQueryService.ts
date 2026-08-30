import { getSupabaseClient } from "../../db/supabase";
import { pool } from "../../db/client";
import { resolveSchoolUUID } from "../../db/resolve-school";
import { fontInMemSchools } from "../../routes/saas";
import { ApplicantSyncService } from "./ApplicantSyncService";

const calonSiswaFields = [
  "id",
  "nama",
  "nisn",
  "nipd",
  "nik",
  "tempat_lahir",
  "tgl_lahir",
  "jenis_kelamin",
  "agama",
  "kewarganegaraan",
  "alamat",
  "rt_rw",
  "kelurahan",
  "kecamatan",
  "kode_pos",
  "whatsapp",
  "email",
  "tinggal_dengan",
  "transportasi",
  "tinggi_badan",
  "berat_badan",
  "jarak_sekolah",
  "jarak_km",
  "waktu_jam",
  "waktu_menit",
  "jumlah_saudara",
  "golongan_darah",
  "penyakit_diderita",
  "kebutuhan_khusus",
  "punya_kps",
  "no_kps",
  "punya_kip",
  "no_kip",
  "jenis_prestasi",
  "tingkat_prestasi",
  "uraian_prestasi",
  "tahun_prestasi",
  "penyelenggara",
  "jenis_beasiswa",
  "uraian_beasiswa",
  "tahun_mulai_beasiswa",
  "tahun_selesai_beasiswa",
  "nama_ayah",
  "tempat_lahir_ayah",
  "tgl_lahir_ayah",
  "agama_ayah",
  "kewarganegaraan_ayah",
  "pendidikan_ayah",
  "pekerjaan_ayah",
  "penghasilan_ayah",
  "alamat_ayah",
  "rtrw_ayah",
  "kelurahan_ayah",
  "kecamatan_ayah",
  "kode_pos_ayah",
  "status_ayah",
  "nama_ibu",
  "tempat_lahir_ibu",
  "tgl_lahir_ibu",
  "agama_ibu",
  "kewarganegaraan_ibu",
  "pendidikan_ibu",
  "pekerjaan_ibu",
  "penghasilan_ibu",
  "alamat_ibu",
  "rtrw_ibu",
  "kelurahan_ibu",
  "kecamatan_ibu",
  "kode_pos_ibu",
  "status_ibu",
  "nama_wali",
  "tempat_lahir_wali",
  "tgl_lahir_wali",
  "agama_wali",
  "kewarganegaraan_wali",
  "pendidikan_wali",
  "pekerjaan_wali",
  "penghasilan_wali",
  "alamat_wali",
  "rtrw_wali",
  "kelurahan_wali",
  "kecamatan_wali",
  "kode_pos_wali",
  "status_wali",
  "telepon_ortu",
  "sekolah_asal",
  "tgl_lulus",
  "no_ijazah",
  "no_skhun",
  "no_peserta_un",
  "lama_belajar",
  "pindahan_dari",
  "alasan_pindah",
  "diterima_kelas",
  "diterima_tanggal",
  "jurusan_1",
  "alasan_memilih",
  "hobi",
  "cita_cita",
  "nilai_us_teori",
  "nilai_us_praktik",
  "nilai_muatan_lokal",
  "cita_cita_setelah_lulus",
  "pelajaran_disenangi",
  "alasan_disenangi",
  "kesulitan_belajar",
  "perkelahian",
  "ket_perkelahian",
  "narkoba",
  "ket_narkoba",
  "pelanggaran_lain",
  "ket_pelanggaran_lain",
  "janji_taat",
  "janji_sanksi",
  "janji_akrab",
  "janji_belajar",
  "janji_nama_baik",
  "periode",
  "gelombang",
  "registration_no",
  "status",
  "tgl_daftar",
  "verified_by",
  "rejected_by",
  "deleted_by"
];

export class ApplicantQueryService {
  static async getPublicApplicants(schoolIdOrSlug?: string, authToken?: string) {
    if (!schoolIdOrSlug) {
      return { success: true, data: [] };
    }

    const resolvedId = await resolveSchoolUUID(String(schoolIdOrSlug), fontInMemSchools);
    if (!resolvedId) {
      return { success: true, data: [] };
    }

    const supabase = getSupabaseClient(authToken);
    const numericId = !isNaN(Number(resolvedId)) ? Number(resolvedId) : null;

    let query = supabase
      .from("student_applicants")
      .select("id, nama, nisn, status, tgl_daftar, jurusan_1, sekolah_asal, diterima_kelas, jenis_kelamin")
      .in("status", ["Pending", "Approved", "Rejected", "Terverifikasi"])
      .is("deleted_at", null)
      .order("tgl_daftar", { ascending: false });

    if (numericId !== null) {
      query = query.or(`school_id.eq.${resolvedId},school_id.eq.${numericId}`);
    } else {
      query = query.eq("school_id", resolvedId);
    }

    const { data, error } = await query;
    let finalRows = data;

    if (error || !data || data.length === 0) {
      try {
        const isNum = numericId !== null;
        const pgRes = await pool.query(
          `SELECT id, nama, nisn, status, tgl_daftar, jurusan_1, sekolah_asal, diterima_kelas, jenis_kelamin
           FROM student_applicants
           WHERE deleted_at IS NULL
             AND status IN ('Pending', 'Approved', 'Rejected', 'Terverifikasi')
             AND ((CASE WHEN $1 = true THEN school_id = $2::integer ELSE false END) OR school_id::text = $3)
           ORDER BY tgl_daftar DESC`,
          [isNum, isNum ? numericId : 0, String(resolvedId)]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          finalRows = pgRes.rows;
        }
      } catch (_pgErr) {}
    }

    const sanitizedRows = (finalRows || []).map((row) => ({
      ...row,
      nisn: row.nisn ? "******" + row.nisn.slice(-4) : null
    }));

    return { success: true, data: sanitizedRows };
  }

  static async getAdminApplicants(schoolId: string, authToken?: string) {
    // Run auto-disqualify in background without blocking applicant fetch
    ApplicantSyncService.checkAndDisqualifyExpiredApplicants().catch(() => {});
    const supabase = getSupabaseClient(authToken);
    const { resolveAllSchoolIdentifiers } = await import("../../db/resolve-school");
    const allMatchIds = await resolveAllSchoolIdentifiers(schoolId, fontInMemSchools);
    if (!allMatchIds.includes(schoolId)) allMatchIds.push(schoolId);

    let query = supabase
      .from("student_applicants")
      .select(calonSiswaFields.join(","))
      .in("school_id", allMatchIds)
      .is("deleted_at", null)
      .order("tgl_daftar", { ascending: false });

    const { data: rows, error } = await query;
    if (error || !rows || rows.length === 0) {
      try {
        const pgRes = await pool.query(
          `SELECT ${calonSiswaFields.join(", ")} FROM student_applicants 
           WHERE deleted_at IS NULL 
             AND school_id::text = ANY($1::text[])
           ORDER BY tgl_daftar DESC`,
          [allMatchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) return pgRes.rows;
      } catch (_pgErr) {
        console.warn('getAdminApplicants fallback query error:', error?.message || _pgErr);
      }
    }
    return rows || [];
  }

  static async getTrashedApplicants(schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);
    const { resolveAllSchoolIdentifiers } = await import("../../db/resolve-school");
    const allMatchIds = await resolveAllSchoolIdentifiers(schoolId, fontInMemSchools);
    if (!allMatchIds.includes(schoolId)) allMatchIds.push(schoolId);

    let query = supabase
      .from("student_applicants")
      .select([...calonSiswaFields, "deleted_at"].join(","))
      .in("school_id", allMatchIds)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    const { data: rows, error } = await query;
    if (error || !rows || rows.length === 0) {
      try {
        const pgRes = await pool.query(
          `SELECT ${[...calonSiswaFields, "deleted_at"].join(", ")} FROM student_applicants 
           WHERE deleted_at IS NOT NULL 
             AND school_id::text = ANY($1::text[])
           ORDER BY deleted_at DESC`,
          [allMatchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) return pgRes.rows;
      } catch (_pgErr) {
        console.warn('getTrashedApplicants fallback query error:', error?.message || _pgErr);
      }
    }
    return rows || [];
  }

  static async getApplicantById(id: number, schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);
    const { resolveAllSchoolIdentifiers } = await import("../../db/resolve-school");
    const allMatchIds = await resolveAllSchoolIdentifiers(schoolId, fontInMemSchools);
    if (!allMatchIds.includes(schoolId)) allMatchIds.push(schoolId);

    const query = supabase
      .from("student_applicants")
      .select("*")
      .eq("id", id)
      .in("school_id", allMatchIds);
    const { data: applicant, error } = await query.maybeSingle();
    if (!error && applicant) return applicant;

    // PostgreSQL pool fallback
    try {
      const pgRes = await pool.query(
        `SELECT * FROM student_applicants 
         WHERE id = $1 AND school_id::text = ANY($2::text[])
         LIMIT 1`,
        [id, allMatchIds]
      );
      if (pgRes.rows && pgRes.rows.length > 0) return pgRes.rows[0];
    } catch (_pgErr) {}

    return null;
  }

  static async getRegistrationCard(nisn: string, schoolSlug?: string) {
    const supabase = getSupabaseClient();
    const { resolveAllSchoolIdentifiers } = await import("../../db/resolve-school");
    const matchIds = schoolSlug ? await resolveAllSchoolIdentifiers(schoolSlug, fontInMemSchools) : [];

    let query = supabase
      .from("student_applicants")
      .select(
        "id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist, school_id"
      )
      .eq("nisn", nisn);
    if (matchIds.length > 0) {
      query = query.in("school_id", matchIds);
    }

    const { data: record, error } = await query.maybeSingle();
    if (!error && record) return record;

    // PostgreSQL pool fallback
    try {
      if (matchIds.length > 0) {
        const pgRes = await pool.query(
          `SELECT id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist, school_id
           FROM student_applicants
           WHERE nisn = $1 AND school_id::text = ANY($2::text[])
           LIMIT 1`,
          [nisn, matchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) return pgRes.rows[0];
      } else {
        const pgRes = await pool.query(
          `SELECT id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist, school_id
           FROM student_applicants
           WHERE nisn = $1
           LIMIT 1`,
          [nisn]
        );
        if (pgRes.rows && pgRes.rows.length > 0) return pgRes.rows[0];
      }
    } catch (_pgErr) {}

    return null;
  }

  static async getPublicInvoice(nisn: string, schoolSlug?: string) {
    const supabase = getSupabaseClient();
    const { resolveAllSchoolIdentifiers } = await import("../../db/resolve-school");
    const matchIds = schoolSlug ? await resolveAllSchoolIdentifiers(schoolSlug, fontInMemSchools) : [];

    let query = supabase
      .from("student_applicants")
      .select(
        "id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist, payment_status, payment_proof_url, school_id"
      )
      .eq("nisn", nisn);
    if (matchIds.length > 0) {
      query = query.in("school_id", matchIds);
    }

    const { data: record, error } = await query.maybeSingle();
    if (!error && record) return record;

    // PostgreSQL pool fallback
    try {
      if (matchIds.length > 0) {
        const pgRes = await pool.query(
          `SELECT id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist, payment_status, payment_proof_url, school_id
           FROM student_applicants
           WHERE nisn = $1 AND school_id::text = ANY($2::text[])
           LIMIT 1`,
          [nisn, matchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) return pgRes.rows[0];
      } else {
        const pgRes = await pool.query(
          `SELECT id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist, payment_status, payment_proof_url, school_id
           FROM student_applicants
           WHERE nisn = $1
           LIMIT 1`,
          [nisn]
        );
        if (pgRes.rows && pgRes.rows.length > 0) return pgRes.rows[0];
      }
    } catch (_pgErr) {}

    return null;
  }

  static async verifyApplicantIdentity(id: number, nik: string, schoolSlug: string) {
    const schoolId = await resolveSchoolUUID(schoolSlug, fontInMemSchools);
    if (!schoolId) return { notFoundSchool: true };

    const supabase = getSupabaseClient();
    const { data: applicant } = await supabase
      .from("student_applicants")
      .select("id, nama, nisn, nik, tgl_lahir, status, tgl_daftar, jurusan_1, alasan_ditolak")
      .eq("id", id)
      .eq("school_id", schoolId)
      .single();

    if (!applicant || applicant.nik !== nik) {
      return null;
    }
    return applicant;
  }
}
