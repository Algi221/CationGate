export interface SchoolTenant {
  id: number;
  name: string;
  slug: string;
  npsn: string;
  dapodik_code: string;
  official_email: string;
  plan_type: "STARTER" | "PRO" | "ENTERPRISE";
  status: "UNVERIFIED" | "PENDING_VERIFICATION" | "FULL_VERIFIED" | "SUSPENDED" | "REJECTED";
  created_at: string;
  legal_sk_number?: string;
  sk_document_name?: string;
  sk_document_url?: string;
  accreditation?: string;
  admin_name?: string;
  is_verified?: boolean;
  is_official?: boolean;
  documents?: Array<{
    id?: string;
    type?: string;
    name?: string;
    url?: string;
    size?: number;
  }>;
}
