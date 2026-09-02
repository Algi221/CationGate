export interface SaasTransaction {
  id: number | string;
  order_id: string;
  school_name: string;
  school_slug: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  status: 'SETTLEMENT' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
  customer_name?: string;
  customer_email?: string;
  created_at: string;
  settlement_time?: string;
}

// In-memory registered schools fallback map
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fontInMemSchools = new Map<string, any>();

export const inMemTransactions: SaasTransaction[] = [
  {
    id: 1,
    order_id: "CG-SUB-20260815-001",
    school_name: "SMK Taruna Bhakti",
    school_slug: "smktarunabhakti",
    plan_name: "Pro Tahunan",
    amount: 1200000,
    payment_method: "Midtrans (BCA Virtual Account)",
    status: "SETTLEMENT",
    customer_name: "Admin SMK Taruna Bhakti",
    customer_email: "info@smktarunabhakti.sch.id",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    settlement_time: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 120000).toISOString()
  },
  {
    id: 2,
    order_id: "CG-SUB-20260820-002",
    school_name: "SMK TI Bali Global Denpasar",
    school_slug: "smktiglobal",
    plan_name: "Enterprise Institution",
    amount: 1200000,
    payment_method: "Midtrans (QRIS Mandiri)",
    status: "SETTLEMENT",
    customer_name: "Panitia SPMB Bali Global",
    customer_email: "spmb@smktiglobal.sch.id",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    settlement_time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 65000).toISOString()
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkThreeDayTakedown(schoolObj: any): boolean {
  if (!schoolObj || schoolObj.status === 'FULL_VERIFIED' || schoolObj.status === 'TAKEDOWN') {
    return false;
  }
  const createdAt = schoolObj.created_at ? new Date(schoolObj.created_at).getTime() : Date.now();
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  if (Date.now() - createdAt > THREE_DAYS_MS && schoolObj.status !== 'PENDING_VERIFICATION') {
    schoolObj.status = 'TAKEDOWN';
    schoolObj.is_verified = false;
    return true;
  }
  return false;
}
