import { ApplicantSyncService } from "./applicant/ApplicantSyncService";
import { ApplicantQueryService } from "./applicant/ApplicantQueryService";
import { ApplicantMutationService } from "./applicant/ApplicantMutationService";

export class ApplicantService {
  // ── Sync Methods ─────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async syncCandidateToSiswaAktif(candidate: any): Promise<void> {
    return ApplicantSyncService.syncCandidateToSiswaAktif(candidate);
  }

  static async syncAllExistingApprovedApplicants(): Promise<void> {
    return ApplicantSyncService.syncAllExistingApprovedApplicants();
  }

  static async checkAndDisqualifyExpiredApplicants(): Promise<void> {
    return ApplicantSyncService.checkAndDisqualifyExpiredApplicants();
  }

  // ── Query Methods ────────────────────────────────────────────────────────────
  static async getPublicApplicants(schoolIdOrSlug?: string, authToken?: string) {
    return ApplicantQueryService.getPublicApplicants(schoolIdOrSlug, authToken);
  }

  static async getAdminApplicants(schoolId: string, authToken?: string) {
    return ApplicantQueryService.getAdminApplicants(schoolId, authToken);
  }

  static async getTrashedApplicants(schoolId: string, authToken?: string) {
    return ApplicantQueryService.getTrashedApplicants(schoolId, authToken);
  }

  static async getApplicantById(id: number, schoolId: string, authToken?: string) {
    return ApplicantQueryService.getApplicantById(id, schoolId, authToken);
  }

  static async getRegistrationCard(nisn: string, schoolSlug?: string) {
    return ApplicantQueryService.getRegistrationCard(nisn, schoolSlug);
  }

  static async getPublicInvoice(nisn: string, schoolSlug?: string) {
    return ApplicantQueryService.getPublicInvoice(nisn, schoolSlug);
  }

  static async verifyApplicantIdentity(id: number, nik: string, schoolSlug: string) {
    return ApplicantQueryService.verifyApplicantIdentity(id, nik, schoolSlug);
  }

  // ── Mutation Methods ─────────────────────────────────────────────────────────
  static async registerApplicant(rawBody: unknown, schoolSlug: string | undefined) {
    return ApplicantMutationService.registerApplicant(rawBody, schoolSlug);
  }

  static async restoreApplicant(id: number, schoolId: string, authToken?: string) {
    return ApplicantMutationService.restoreApplicant(id, schoolId, authToken);
  }

  static async updateApplicant(id: number, schoolId: string, rawBody: unknown, authToken?: string) {
    return ApplicantMutationService.updateApplicant(id, schoolId, rawBody, authToken);
  }

  static async updateApplicantStatus(
    id: number,
    schoolId: string,
    status: string,
    alasanDitolak?: string,
    adminName: string = "Sistem",
    authToken?: string
  ) {
    return ApplicantMutationService.updateApplicantStatus(
      id,
      schoolId,
      status,
      alasanDitolak,
      adminName,
      authToken
    );
  }

  static async deleteApplicant(
    id: number,
    schoolId: string,
    permanent: boolean,
    adminName: string = "Sistem",
    authToken?: string
  ) {
    return ApplicantMutationService.deleteApplicant(id, schoolId, permanent, adminName, authToken);
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
    return ApplicantMutationService.verifyPhysicalDoc(
      id,
      schoolId,
      verified,
      checklist,
      adminName,
      authToken
    );
  }
}
