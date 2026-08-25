import { getSupabaseClient } from "../../db/supabase";
import { ApplicantSyncService } from "./ApplicantSyncService";

export class ApplicantStatusService {
  static async updateApplicantStatus(
    id: number,
    schoolId: string,
    status: string,
    alasanDitolak?: string,
    adminName: string = "Sistem",
    authToken?: string
  ) {
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return {
        success: false as const,
        statusCode: 400 as const,
        message: "Status tidak valid. Harus Pending, Approved, atau Rejected."
      };
    }

    const supabase = getSupabaseClient(authToken);
    const query = supabase
      .from("student_applicants")
      .select("*")
      .eq("id", id)
      .eq("school_id", schoolId);
    const { data: applicant } = await query.single();
    if (!applicant) {
      return {
        success: false as const,
        statusCode: 404 as const,
        message: "Calon siswa tidak ditemukan."
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };
    if (status === "Approved") {
      updateData.verified_by = adminName;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
    } else if (status === "Rejected") {
      updateData.rejected_by = adminName;
      updateData.verified_by = null;
      updateData.alasan_ditolak = alasanDitolak || null;
    } else if (status === "Pending") {
      updateData.verified_by = null;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
    }

    const updateQuery = supabase
      .from("student_applicants")
      .update(updateData)
      .eq("id", id)
      .eq("school_id", schoolId);
    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    await ApplicantSyncService.syncCandidateToSiswaAktif(updatedRecord);

    return {
      success: true as const,
      statusCode: 200 as const,
      message: `Status calon siswa berhasil diperbarui menjadi ${status}.`,
      data: updatedRecord
    };
  }

  static async verifyPhysicalDoc(
    id: number,
    schoolId: string,
    verified: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checklist: any,
    adminName: string = "Admin",
    authToken?: string
  ) {
    const supabase = getSupabaseClient(authToken);
    let isVerified = Boolean(verified);

    if (checklist) {
      const requiredDocs = ["kk", "akta", "ijazah", "ktp_ortu", "pas_foto", "bukti_bayar"];
      isVerified = requiredDocs.every((doc) => checklist[doc] === true);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      physical_doc_verified: isVerified,
      physical_doc_verified_by: isVerified ? adminName : null,
      physical_doc_verified_at: isVerified ? new Date().toISOString() : null
    };
    if (checklist) {
      updateData.physical_docs_checklist = checklist;
    }

    const query = supabase
      .from("student_applicants")
      .update(updateData)
      .eq("id", id)
      .eq("school_id", schoolId);
    const { data: updatedRecord, error } = await query.select().single();
    if (error) throw error;

    return updatedRecord;
  }
}
