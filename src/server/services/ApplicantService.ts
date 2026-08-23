import { getSupabaseClient } from "../db/supabase";

export class ApplicantService {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async syncToActive(candidate: any): Promise<void> {
    try {
      const supabase = getSupabaseClient(); 
      const schoolId = candidate.school_id;

      if (!schoolId) {
        console.warn("Sync ignored: Candidate missing school_id", candidate.id);
        return;
      }

      if (candidate.status === "Approved") {
        const payload = {
          school_id: schoolId,
          calon_siswa_id: candidate.id,
          nama: candidate.nama,
          nisn: candidate.nisn,
          jenis_kelamin: candidate.jenis_kelamin,

        };

        const { data: existingSiswa } = await supabase
          .from("active_students")
          .select("id")
          .eq("calon_siswa_id", candidate.id)
          .eq("school_id", schoolId)
          .maybeSingle();

        if (existingSiswa) {
          await supabase
            .from("active_students")
            .update(payload)
            .eq("id", existingSiswa.id)
            .eq("school_id", schoolId);
        } else {
          await supabase.from("active_students").insert(payload);
        }
      } else {
        await supabase
          .from("active_students")
          .delete()
          .eq("calon_siswa_id", candidate.id)
          .eq("school_id", schoolId);
      }
    } catch (err) {
      console.error("Error syncing candidate to SiswaAktif:", err);
    }
  }
}
