import { LucideIcon } from "lucide-react";

export interface AlurItem {
  id: number;
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface MajorItem {
  code: string;
  title: string;
  icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  logo?: string;
  desc: string;
  color: string;
  careers: string;
  facilities: string;
  name?: string;
}

export interface GelombangDate {
  start: string;
  end: string;
}

export interface GelombangConfig {
  gelombang1: GelombangDate;
  gelombang2: GelombangDate;
}

export interface PartnerItem {
  name: string;
  logo: string;
  category?: string;
}
