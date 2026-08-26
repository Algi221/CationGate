export type VerificationStep = 1 | 2 | 3 | 4;

export type VerificationDocumentType = 
  | "SK_OPERASIONAL" 
  | "ID_CARD" 
  | "SOSMED_PROOF";

export interface VerificationDocumentItem {
  id: string;
  type: VerificationDocumentType;
  name: string;
  url: string;
  size?: number;
}

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
  documents?: VerificationDocumentItem[];
}
