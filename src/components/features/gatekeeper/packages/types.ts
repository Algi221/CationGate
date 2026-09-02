export interface Plan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export function formatRupiahDisplay(num: number): string {
  if (num === 0) return "Gratis";
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function parseRupiahInput(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function formatInputDisplay(num: number): string {
  if (num === 0) return "";
  return num.toLocaleString("id-ID");
}
