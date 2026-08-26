import {
  FileText,
  CreditCard,
  Phone,
  Users,
  Award,
  ShieldCheck,
  GraduationCap,
  ClipboardCheck,
  Calendar,
  School,
  MapPin,
  CheckCircle2,
  UserCheck,
  BookOpen,
  Sparkles,
  Download,
  Upload,
  QrCode,
  Laptop,
  Send,
  HeartHandshake,
  BadgeCheck,
  HelpCircle,
  Clock,
  Key,
  Lock,
  Mail,
  Bell,
  Camera,
  Layers,
  Search,
  Check
} from "lucide-react";
import React from "react";

export interface IconOption {
  name: string;
  label: string;
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ALUR_ICON_MAP: Record<string, React.ComponentType<any>> = {
  FileText,
  CreditCard,
  Phone,
  Users,
  Award,
  ShieldCheck,
  GraduationCap,
  ClipboardCheck,
  Calendar,
  School,
  MapPin,
  CheckCircle2,
  UserCheck,
  BookOpen,
  Sparkles,
  Download,
  Upload,
  QrCode,
  Laptop,
  Send,
  HeartHandshake,
  BadgeCheck,
  HelpCircle,
  Clock,
  Key,
  Lock,
  Mail,
  Bell,
  Camera,
  Layers,
  Search,
  Check
};

export const ALUR_ICON_OPTIONS: IconOption[] = [
  { name: "FileText", label: "Formulir / Pendaftaran Online", category: "Administrasi", icon: FileText },
  { name: "CreditCard", label: "Pembayaran / Keuangan", category: "Pembayaran", icon: CreditCard },
  { name: "Phone", label: "Kontak / WhatsApp", category: "Komunikasi", icon: Phone },
  { name: "Users", label: "Pemberkasan Fisik / Tatap Muka", category: "Administrasi", icon: Users },
  { name: "Award", label: "Pengumuman / Prestasi", category: "Hasil & Seleksi", icon: Award },
  { name: "ShieldCheck", label: "Verifikasi & Validasi", category: "Verifikasi", icon: ShieldCheck },
  { name: "GraduationCap", label: "Akademik / Kelulusan", category: "Akademik", icon: GraduationCap },
  { name: "ClipboardCheck", label: "Tes Seleksi / Ujian Masuk", category: "Hasil & Seleksi", icon: ClipboardCheck },
  { name: "Calendar", label: "Jadwal & Agenda", category: "Waktu", icon: Calendar },
  { name: "School", label: "Kunjungan Gedung / Sekolah", category: "Lokasi", icon: School },
  { name: "MapPin", label: "Lokasi / Penempatan Kelas", category: "Lokasi", icon: MapPin },
  { name: "CheckCircle2", label: "Konfirmasi / Approval", category: "Verifikasi", icon: CheckCircle2 },
  { name: "UserCheck", label: "Wawancara & Minat Bakat", category: "Hasil & Seleksi", icon: UserCheck },
  { name: "BookOpen", label: "Kurikulum & Modul", category: "Akademik", icon: BookOpen },
  { name: "Sparkles", label: "Beasiswa / Program Khusus", category: "Akademik", icon: Sparkles },
  { name: "Download", label: "Unduh Berkas / Surat", category: "Dokumen", icon: Download },
  { name: "Upload", label: "Upload Berkas Digital", category: "Dokumen", icon: Upload },
  { name: "QrCode", label: "Scan QR / Kartu Peserta", category: "Teknologi", icon: QrCode },
  { name: "Laptop", label: "Ujian CBT Online", category: "Teknologi", icon: Laptop },
  { name: "Send", label: "Pengiriman Berkas", category: "Administrasi", icon: Send },
  { name: "HeartHandshake", label: "Daftar Ulang & Komitmen", category: "Administrasi", icon: HeartHandshake },
  { name: "BadgeCheck", label: "Sertifikasi Kelayakan", category: "Hasil & Seleksi", icon: BadgeCheck },
  { name: "HelpCircle", label: "Pusat Bantuan / FAQ", category: "Komunikasi", icon: HelpCircle },
  { name: "Clock", label: "Batas Waktu / Periode", category: "Waktu", icon: Clock },
  { name: "Key", label: "Akses Akun Calon Siswa", category: "Teknologi", icon: Key },
  { name: "Mail", label: "Surat Undangan / Email", category: "Komunikasi", icon: Mail },
  { name: "Bell", label: "Pengumuman Penting", category: "Komunikasi", icon: Bell },
  { name: "Camera", label: "Pas Foto & Wajah", category: "Dokumen", icon: Camera }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAlurIconComponent(name?: string, defaultIndex: number = 0): React.ComponentType<any> {
  if (name && ALUR_ICON_MAP[name]) {
    return ALUR_ICON_MAP[name];
  }
  const defaultFallbackNames = ["FileText", "CreditCard", "Phone", "Users", "Award", "ShieldCheck"];
  const fallbackKey = defaultFallbackNames[defaultIndex % defaultFallbackNames.length];
  return ALUR_ICON_MAP[fallbackKey] || FileText;
}
