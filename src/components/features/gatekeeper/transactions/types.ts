export interface TransactionItem {
  id: number | string;
  order_id: string;
  school_name: string;
  school_slug: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  status: "SETTLEMENT" | "PENDING" | "CANCELLED" | "EXPIRED";
  customer_name?: string;
  customer_email?: string;
  created_at: string;
  settlement_time?: string;
}

export interface TransactionStats {
  total_revenue: number;
  total_transactions: number;
  active_subscriptions: number;
  avg_order_value: number;
}

export function formatRupiah(num: number): string {
  return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
}

export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_e) {
    return dateStr;
  }
}
