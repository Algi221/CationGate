import { Hono } from 'hono';
import { adminAuth } from '../middleware/auth';
import { registerLimiter } from '../middleware/rate-limiter';
import { SaasController } from '../controllers/SaasController';
import { fontInMemSchools, checkThreeDayTakedown } from '../services/SaasService';

export { fontInMemSchools, checkThreeDayTakedown };

const saasRouter = new Hono();

// 1. PUBLIC: Fetch school profile & status by slug
saasRouter.get('/school-by-slug/:slug', SaasController.getSchoolBySlug);

// 2. PUBLIC: Check if email or slug already exists
saasRouter.post('/check-email', SaasController.checkEmail);
saasRouter.post('/check-slug', SaasController.checkSlug);

// 3. PUBLIC: Register new school from Landing Page
saasRouter.post('/register', registerLimiter, SaasController.register);

// 4. ADMIN ONLY: Activate school after payment (Sandbox / Manual activate)
saasRouter.post('/activate', adminAuth, SaasController.activate);

// 5. PUBLIC: Create payment token for school plan
saasRouter.post('/create-payment-token', SaasController.createPaymentToken);
saasRouter.post('/create-transaction', SaasController.createPaymentToken);

// 6. PUBLIC: Create payment token for student registration fee
saasRouter.post('/payment/student-form-token', SaasController.createStudentFormToken);

// 7. PUBLIC: Midtrans Webhook Notification
saasRouter.post('/midtrans-webhook', SaasController.midtransWebhook);

// 8. PUBLIC: Get active pricing plans
saasRouter.get('/plans', SaasController.getPlans);

// 9. PUBLIC: Get subscription status for a school
saasRouter.get('/subscription-status', SaasController.getSubscriptionStatus);
saasRouter.post('/activate-subscription', SaasController.activateSubscription);
saasRouter.post('/simulate-payment', SaasController.simulatePayment);

// 10. PUBLIC/ADMIN: Submit school verification documents (SK & legal accreditation)
saasRouter.post('/submit-school-verification', SaasController.submitSchoolVerification);

// 11. PUBLIC/ADMIN: Get transaction history (optionally filtered by school slug)
saasRouter.get('/transactions', SaasController.getTransactions);

// 12. PUBLIC: Platform Maintenance Status Check
saasRouter.get('/maintenance-status', async (c) => {
  const { globalIsMaintenanceMode } = await import('./gatekeeper');
  return c.json({ success: true, is_maintenance: globalIsMaintenanceMode });
});

export default saasRouter;
