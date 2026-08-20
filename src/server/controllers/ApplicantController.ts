import { Context } from "hono";
import { getSupabaseClient } from "../db/supabase";
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from '../routes/saas';

export class ApplicantController {
  /**
   * Fetch all applicants with optional pagination and filtering
   * Used by the TanStack Query polling hook on the frontend
   */
  static async getAll(c: Context) {
    try {
      const supabase = getSupabaseClient(c.req.header("Authorization"));
      const schoolIdOrSlug = c.req.query("school_slug") || c.req.query("school_id");

      if (!schoolIdOrSlug) {
        return c.json({ success: true, data: [] });
      }

      // Resolve to actual UUID
      const resolvedId = await resolveSchoolUUID(String(schoolIdOrSlug), fontInMemSchools);
      
      if (!resolvedId) {
        return c.json({ success: true, data: [] });
      }

      const { data, error } = await supabase
        .from("student_applicants")
        .select("id, nama, nisn, status, tgl_daftar, jurusan_1, sekolah_asal, diterima_kelas, jenis_kelamin")
        .eq("school_id", resolvedId)
        .in("status", ["Pending", "Approved", "Rejected", "Terverifikasi"])
        .is("deleted_at", null)
        .order("tgl_daftar", { ascending: false });

      if (error) {
        console.warn('Fetch public applicants Supabase query warning:', (error as any).message);
        return c.json({ success: true, data: [] });
      }

      // Mask NISN: only show last 4 digits for privacy
      const sanitizedRows = (data || []).map((row) => ({
        ...row,
        nisn: row.nisn ? '******' + row.nisn.slice(-4) : null
      }));

      return c.json({ success: true, data: sanitizedRows });
    } catch (err: unknown) {
      console.error("ApplicantController.getAll Error:", err);
      return c.json(
        { success: false, message: "Gagal mengambil data pendaftar" },
        500
      );
    }
  }

  // Example for optimistic updates endpoint
  static async updateStatus(_c: Context) {
    // Controller logic to approve/reject an applicant
    // Will be called by useMutation in frontend
  }
}
