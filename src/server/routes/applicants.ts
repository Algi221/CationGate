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

// 3. ADMIN ONLY: Fetch all candidates with full columns (Protected)
appRouter.get('/', adminAuth, ApplicantController.getAdminList);

// 4. ADMIN ONLY: Fetch all trashed applicants (Protected)
appRouter.get('/trashed', adminAuth, ApplicantController.getTrashed);

// 5. ADMIN ONLY: Export candidates to Excel (Protected)
appRouter.get('/export', adminAuth, ApplicantController.exportExcel);

// 6. ADMIN ONLY: Restore applicant (Protected)
appRouter.post('/:id/restore', adminAuth, ApplicantController.restore);

// 7. ADMIN ONLY: Fetch full details of a specific applicant (Protected)
appRouter.get('/:id', adminAuth, ApplicantController.getDetail);

// 8. ADMIN ONLY: Update applicant details (Protected)
appRouter.put('/:id', adminAuth, ApplicantController.update);

// 9. ADMIN ONLY: Approve/Verify or Reject applicant status (Protected)
appRouter.patch('/:id/status', adminAuth, ApplicantController.updateStatus);

// 10. ADMIN ONLY: Delete applicant (Protected)
appRouter.delete('/:id', adminAuth, ApplicantController.delete);

// 11. ADMIN ONLY: Verifikasi Berkas Fisik (Protected)
appRouter.patch('/:id/physical-doc', adminAuth, ApplicantController.verifyPhysicalDoc);

// 12. PUBLIC: Get registration card data by NISN (untuk Kartu SPMB)
appRouter.get('/registration-card/:nisn', ApplicantController.getRegistrationCard);

// 13. PUBLIC: POST Verify applicant identity before revealing details
appRouter.post('/verify/:id', rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Batas verifikasi terlampaui. Silakan coba lagi 15 menit lagi.'
}), ApplicantController.verifyIdentity);

export default appRouter;
