export interface SyllabusItem {
  subject: string;
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

export interface MajorDetail {
  code: string;
  title: string;
  alias: string;
  subtitle: string;
  tagline: string;
  desc: string;
  color: string;
  accentColor: string;
  bgAccent: string;
  textAccent: string;
  glowColor: string;
  logo: string;
  banner: string;
  video?: string;
  syllabus: SyllabusItem[];
  careers: CareerItem[];
  facilities: string[];
  gallery: GalleryItem[];
  partners: string;
}

export interface KuotaItem {
  no?: number;
  key: string;
  target: number;
  jumlah: number;
  konsentrasi_keahlian?: string;
  presentase?: string;
}
