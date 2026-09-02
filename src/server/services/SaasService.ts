import {
  SaasTransaction,
  fontInMemSchools,
  inMemTransactions,
  checkThreeDayTakedown
} from './saas/SaasTypes';
import { SaasTenantService } from './saas/SaasTenantService';
import { SaasProvisioningService } from './saas/SaasProvisioningService';
import { SaasBillingService } from './saas/SaasBillingService';
import { SaasVerificationService } from './saas/SaasVerificationService';

export type { SaasTransaction };
export { fontInMemSchools, inMemTransactions, checkThreeDayTakedown };

export class SaasService {
  // Tenant Lookup & Availability
  static async getSchoolBySlug(slug: string) {
    return SaasTenantService.getSchoolBySlug(slug);
  }

  static async checkEmailAvailability(email: string) {
    return SaasTenantService.checkEmailAvailability(email);
  }

  static async checkSlugAvailability(slug: string) {
    return SaasTenantService.checkSlugAvailability(slug);
  }

  // Tenant Provisioning & Onboarding
  static async registerSchool(data: {
    school_name: string;
    slug: string;
    email: string;
    phone?: string;
    address?: string;
    plan_type?: string;
    admin_name?: string;
    admin_username: string;
    admin_password: string;
    admin_email?: string;
  }) {
    return SaasProvisioningService.registerSchool(data);
  }

  // Billing & Subscription Management
  static async activateSchool(
    targetSlug: string,
    orderId?: string,
    planName?: string,
    amount?: number,
    paymentMethod?: string
  ) {
    return SaasBillingService.activateSchool(targetSlug, orderId, planName, amount, paymentMethod);
  }

  static async getTransactions() {
    return SaasBillingService.getTransactions();
  }

  static async getTransactionStats() {
    return SaasBillingService.getTransactionStats();
  }

  static async createMidtransOrder(params: {
    orderType: 'SCHOOL_PLAN' | 'STUDENT_FORM';
    amount: number;
    customerName: string;
    customerEmail: string;
    itemId: string;
    itemName: string;
  }) {
    return SaasBillingService.createMidtransOrder(params);
  }

  static async getPlans() {
    return SaasBillingService.getPlans();
  }

  static async getSubscriptionStatus(schoolId?: string | null, slug?: string | null) {
    return SaasBillingService.getSubscriptionStatus(schoolId, slug);
  }

  static async activateSubscription(data: {
    school_id?: string | null;
    slug?: string | null;
    plan_name?: string;
    order_id?: string;
  }) {
    return SaasBillingService.activateSubscription(data);
  }

  static async simulatePayment(data: {
    school_slug?: string;
    plan_name?: string;
    amount?: number;
    order_id?: string;
  }) {
    return SaasBillingService.simulatePayment(data);
  }

  // Legal Document Verification
  static async submitSchoolVerification(payload: {
    school_id?: string | number;
    school_slug?: string;
    sk_document_url?: string;
    sk_document_name?: string;
    legal_sk_number?: string;
    accreditation?: string;
    official_email?: string;
    admin_name?: string;
    npsn?: string;
    dapodik_code?: string;
    whatsapp?: string;
    website_url?: string;
    instagram_url?: string;
    documents?: Array<{
      id: string;
      type: string;
      name: string;
      url: string;
      size?: number;
    }>;
  }) {
    return SaasVerificationService.submitSchoolVerification(payload);
  }
}
