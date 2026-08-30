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
    const resolvedUUID = await resolveSchoolUUID(schoolId, fontInMemSchools);
    const targetId = resolvedUUID || schoolId;
    const numericSchoolId = !isNaN(Number(targetId)) ? Number(targetId) : null;

    let query = supabase
      .from("student_applicants")
      .select(calonSiswaFields.join(","))
      .is("deleted_at", null)
      .order("tgl_daftar", { ascending: false });

    if (numericSchoolId !== null) {
      query = query.eq("school_id", numericSchoolId);
    } else {
      query = query.eq("school_id", targetId);
    }

    const { data: rows, error } = await query;
    if (error) {
      try {
        const isNum = numericSchoolId !== null;
        const pgRes = await pool.query(
          `SELECT ${calonSiswaFields.join(", ")} FROM student_applicants 
           WHERE deleted_at IS NULL 
             AND ((CASE WHEN $1 = true THEN school_id = $2::integer ELSE false END) OR school_id::text = $3)
           ORDER BY tgl_daftar DESC`,
          [isNum, isNum ? numericSchoolId : 0, String(targetId)]
        );
        return pgRes.rows || [];
      } catch (_pgErr) {
        console.warn('getAdminApplicants fallback query error:', error.message || error);
        return [];
      }
    }
    return rows || [];
  }

  static async getTrashedApplicants(schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);
    const resolvedUUID = await resolveSchoolUUID(schoolId, fontInMemSchools);
    const targetId = resolvedUUID || schoolId;
    const numericSchoolId = !isNaN(Number(targetId)) ? Number(targetId) : null;

    let query = supabase
      .from("student_applicants")
      .select([...calonSiswaFields, "deleted_at"].join(","))
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (numericSchoolId !== null) {
      query = query.eq("school_id", numericSchoolId);
    } else {
      query = query.eq("school_id", targetId);
    }

    const { data: rows, error } = await query;
    if (error) {
      return [];
    }
    return rows || [];
  }

  static async getApplicantById(id: number, schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);
    const query = supabase
      .from("student_applicants")
      .select("*")
      .eq("id", id)
      .eq("school_id", schoolId);
    const { data: applicant, error } = await query.single();
    if (error || !applicant) return null;
    return applicant;
  }

  static async getRegistrationCard(nisn: string, schoolSlug?: string) {
    const supabase = getSupabaseClient();
    const schoolId = schoolSlug ? await resolveSchoolUUID(schoolSlug, fontInMemSchools) : null;

    let query = supabase
      .from("student_applicants")
      .select(
        "id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist"
      )
      .eq("nisn", nisn);
    if (schoolId) query = query.eq("school_id", schoolId);

    const { data: record, error } = await query.single();
    if (error || !record) return null;
    return record;
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
