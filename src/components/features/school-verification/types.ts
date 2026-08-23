export type VerificationStep = 1 | 2 | 3 | 4;

export interface SchoolVerificationFormData {
  npsn: string;
  dapodik_code: string;
  legal_sk_number: string;
  accreditation: string;
  admin_name: string;
  official_email: string;
  whatsapp: string;
  website_url: string;
  instagram_url: string;
  sk_document_name: string;
  sk_document_url: string;
}
