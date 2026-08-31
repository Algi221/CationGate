import { ApplicantCreateService } from "./ApplicantCreateService";
import { ApplicantUpdateService } from "./ApplicantUpdateService";
import { ApplicantStatusService } from "./ApplicantStatusService";
import { ApplicantDeleteService } from "./ApplicantDeleteService";
import { ApplicantDummyService } from "./ApplicantDummyService";

export class ApplicantMutationService {
  static async generateDummyApplicants(
    schoolId: string,
    count: number = 5,
    statusPreference: "random" | "Pending" | "Approved" | "Rejected" = "random",
    authToken?: string
  ) {
    return ApplicantDummyService.generateDummyApplicants(schoolId, count, statusPreference, authToken);
  }
  static async registerApplicant(rawBody: unknown, schoolSlug: string | undefined) {
    return ApplicantCreateService.registerApplicant(rawBody, schoolSlug);
  }

  static async updateApplicant(
    id: number,
    schoolId: string,
    rawBody: unknown,
    authToken?: string
  ) {
    return ApplicantUpdateService.updateApplicant(id, schoolId, rawBody, authToken);
  }

  static async updateApplicantStatus(
    id: number,
    schoolId: string,
    status: string,
    alasanDitolak?: string,
    adminName: string = "Sistem",
    authToken?: string
  ) {
    return ApplicantStatusService.updateApplicantStatus(
      id,
      schoolId,
      status,
      alasanDitolak,
      adminName,
      authToken
    );
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
    return ApplicantStatusService.verifyPhysicalDoc(
      id,
      schoolId,
      verified,
      checklist,
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
    return ApplicantDeleteService.deleteApplicant(id, schoolId, permanent, adminName, authToken);
  }

  static async restoreApplicant(id: number, schoolId: string, authToken?: string) {
    return ApplicantDeleteService.restoreApplicant(id, schoolId, authToken);
  }
}
