export interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

export interface CareerItem {
  title: string;
  desc: string;
}

export interface GalleryItem {
  url: string;
  caption: string;
}

export interface MajorItem {
  code: string;
  title: string;
  desc: string;
  color: string;
  careers: CareerItem[];
  facilities?: string[];
  logo?: string;
  banner?: string;
  video?: string;
  gallery?: GalleryItem[];
}

export interface RevisionLog {
  id: string;
  version: number;
  changed_by: string;
  description: string;
  created_at: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PartnerItem {
  id: number;
  name: string;
  logo: string;
  url: string;
  h: string;
}

export interface BankConfigItem {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface FieldConfigItem {
  label: string;
  required: boolean;
  active: boolean;
}

export type KelolaUITab = "hero" | "majors" | "alur" | "form" | "faq" | "revisions" | "bank" | "partners";
