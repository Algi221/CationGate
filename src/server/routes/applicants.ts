import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limiter';
import { ApplicantController } from '../controllers/ApplicantController';
import { ApplicantService } from '../services/ApplicantService';

const appRouter = new Hono();

export const syncCandidateToSiswaAktif = ApplicantService.syncCandidateToSiswaAktif;
export const syncAllExistingApprovedApplicants = ApplicantService.syncAllExistingApprovedApplicants;
export const checkAndDisqualifyExpiredApplicants = ApplicantService.checkAndDisqualifyExpiredApplicants;

// 1. PUBLIC: Register a student applicant (Calon Siswa)
appRouter.post('/', rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Batas pendaftaran online terlampaui. Silakan coba lagi beberapa saat lagi.'
}), ApplicantController.register);

// 2. PUBLIC: Fetch candidates with limited non-sensitive columns
appRouter.get('/public', ApplicantController.getAll);

// 3. PUBLIC: Get registration card data by NISN (untuk Kartu SPMB)
appRouter.get('/registration-card/:nisn', ApplicantController.getRegistrationCard);

// 4. PUBLIC: Get public invoice data by NISN
appRouter.get('/public-invoice/:nisn', ApplicantController.getPublicInvoice);

// 5. PUBLIC: POST Verify applicant identity before revealing details
appRouter.post('/verify/:id', rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Batas verifikasi terlampaui. Silakan coba lagi 15 menit lagi.'
}), ApplicantController.verifyIdentity);

// 6. ADMIN ONLY: Fetch all candidates with full columns (Protected)
appRouter.get('/', adminAuth, ApplicantController.getAdminList);

// 6b. ADMIN ONLY: Generate dummy applicants based on school majors (Protected)
appRouter.post('/generate-dummy', adminAuth, ApplicantController.generateDummy);

// 7. ADMIN ONLY: Fetch all trashed applicants (Protected)
appRouter.get('/trashed', adminAuth, ApplicantController.getTrashed);

// 8. ADMIN ONLY: Export candidates to Excel (Protected)
appRouter.get('/export', adminAuth, ApplicantController.exportExcel);

// 9. ADMIN ONLY: Restore applicant (Protected)
appRouter.post('/:id/restore', adminAuth, ApplicantController.restore);

// 10. ADMIN ONLY: Fetch full details of a specific applicant (Protected)
appRouter.get('/:id', adminAuth, ApplicantController.getDetail);

// 11. ADMIN ONLY: Update applicant details (Protected)
appRouter.put('/:id', adminAuth, ApplicantController.update);

// 12. ADMIN ONLY: Approve/Verify or Reject applicant status (Protected)
appRouter.patch('/:id/status', adminAuth, ApplicantController.updateStatus);

// 13. ADMIN ONLY: Delete applicant (Protected)
appRouter.delete('/:id', adminAuth, ApplicantController.delete);

// 14. ADMIN ONLY: Verifikasi Berkas Fisik (Protected)
appRouter.patch('/:id/physical-doc', adminAuth, ApplicantController.verifyPhysicalDoc);

export default appRouter;
