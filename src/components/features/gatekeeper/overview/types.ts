import { LucideIcon } from "lucide-react";

export interface SchoolTenant {
  id: number | string;
  name: string;
  slug: string;
  npsn?: string;
  dapodik_code?: string;
  official_email?: string;
  plan_type?: string;
  status:
    | "UNVERIFIED"
    | "BELUM_KIRIM_VERIFIKASI"
    | "PENDING_VERIFICATION"
    | "FULL_VERIFIED"
    | "TAKEDOWN"
    | "SUSPENDED";
  created_at?: string;
  legal_sk_number?: string;
  accreditation?: string;
  admin_name?: string;
  sk_document_name?: string;
  sk_document_url?: string;
  lat?: number;
  lng?: number;
  region?: string;
}

export interface MapSchoolItem {
  id: number | string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  region: string;
  status: string;
  npsn?: string;
}

export interface RegionDemographicItem {
  region: string;
  count: number;
  percentage: string;
}

export interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}
