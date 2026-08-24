import { getSupabaseClient } from "../../db/supabase";
import { ApplicantSyncService } from "./ApplicantSyncService";

export class ApplicantDeleteService {
  static async deleteApplicant(
    id: number,
    schoolId: string,
    permanent: boolean,
    adminName: string = "Sistem",
    authToken?: string
  ) {
    const supabase = getSupabaseClient(authToken);

    if (permanent) {
      await supabase.from("active_students").delete().eq("calon_siswa_id", id).eq("school_id", schoolId);
      await supabase.from("student_applicants").delete().eq("id", id).eq("school_id", schoolId);
      return { success: true as const, message: "Data calon siswa berhasil dihapus secara permanen." };
    } else {
      await supabase
        .from("student_applicants")
        .update({ deleted_at: new Date().toISOString(), deleted_by: adminName })
        .eq("id", id)
        .eq("school_id", schoolId);
      await supabase.from("active_students").delete().eq("calon_siswa_id", id).eq("school_id", schoolId);
      return { success: true as const, message: "Data calon siswa berhasil dipindahkan ke tempat sampah." };
    }
  }

  static async restoreApplicant(id: number, schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);

    const query = supabase
      .from("student_applicants")
      .select("*")
      .eq("id", id)
      .eq("school_id", schoolId);
    const { data: existing } = await query.single();
    if (!existing) return null;

    let updateQuery = supabase
      .from("student_applicants")
      .update({ deleted_at: null, deleted_by: null })
      .eq("id", id);
    if (schoolId) updateQuery = updateQuery.eq("school_id", schoolId);
    const { data: updated, error } = await updateQuery.select().single();
    if (error) throw error;

    await ApplicantSyncService.syncCandidateToSiswaAktif(updated);
    return updated;
  }
}
