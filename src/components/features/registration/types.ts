import React from "react";
import { Code, Monitor, Palette, Sparkles, Film, Cpu } from "lucide-react";
import dompurify from "dompurify";

export interface RegistrationFormData {
  nama: string;
  nisn: string;
  nik: string;
  tempatLahir: string;
  tglLahir: string;
  jenisKelamin: string;
  agama: string;
  kewarganegaraan: string;
  alamat: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kodePos: string;
  whatsapp: string;
  email: string;
  tinggalDengan: string;
  transportasi: string;
  tinggiBadan: string;
  beratBadan: string;
  jarakSekolah: string;
  jarakKm: string;
  waktuJam: string;
  waktuMenit: string;
  jumlahSaudara: string;
  golonganDarah: string;
  penyakitDiderita: string;
  kebutuhanKhusus: string[];
  jenisPrestasi: string[];
  tingkatPrestasi: string[];
  uraianPrestasi: string;
  tahunPrestasi: string;
  penyelenggara: string;
  jenisBeasiswa: string[];
  uraianBeasiswa: string;
  tahunMulaiBeasiswa: string;
  tahunSelesaiBeasiswa: string;
  namaAyah: string;
  tempatLahirAyah: string;
  tglLahirAyah: string;
  agamaAyah: string;
  kewarganegaraanAyah: string;
  pendidikanAyah: string;
  pekerjaanAyah: string;
  penghasilanAyah: string;
  alamatAyah: string;
  rtrwAyah: string;
  kelurahanAyah: string;
  kecamatanAyah: string;
  kodePosAyah: string;
  statusAyah: string;
  namaIbu: string;
  tempatLahirIbu: string;
  tglLahirIbu: string;
  agamaIbu: string;
  kewarganegaraanIbu: string;
  pendidikanIbu: string;
  pekerjaanIbu: string;
  penghasilanIbu: string;
  alamatIbu: string;
  rtrwIbu: string;
  kelurahanIbu: string;
  kecamatanIbu: string;
  kodePosIbu: string;
  statusIbu: string;
  namaWali: string;
  tempatLahirWali: string;
  tglLahirWali: string;
  agamaWali: string;
  kewarganegaraanWali: string;
  pendidikanWali: string;
  pekerjaanWali: string;
  penghasilanWali: string;
  alamatWali: string;
  rtrwWali: string;
  kelurahanWali: string;
  kecamatanWali: string;
  kodePosWali: string;
  statusWali: string;
  teleponOrtu: string;
  sekolahAsal: string;
  tglLulus: string;
  noIjazah: string;
  noSKHUN: string;
  noPesertaUN: string;
  lamaBelajar: string;
  pindahanDari: string;
  alasanPindah: string;
  diterimaKelas: string;
  diterimaTanggal: string;
  jurusan1: string;
  hobi: string[];
  citaCita: string;
  nilaiUSTeori: string;
  nilaiUSPraktik: string;
  nilaiMuatanLokal: string;
  alasanMemilih: string;
  citaCitaSetelahLulus: string;
  pelajaranDisenangi: string;
  punyaKPS: string;
  noKPS: string;
  punyaKIP: string;
  noKIP: string;
  alasanDisenangi: string;
  kesulitanBelajar: string;
  perkelahian: string;
  ketPerkelahian: string;
  narkoba: string;
  ketNarkoba: string;
  pelanggaranLain: string;
  ketPelanggaranLain: string;
  janjiTaat: string;
  janjiSanksi: string;
  janjiAkrab: string;
  janjiBelajar: string;
  janjiNamaBaik: string;
  deklarasi: boolean;
  periode: string;
  berkasFotoOk: boolean;
  berkasFotoFile: File | null;
  berkasFotoName: string;
  berkasFotoBase64: string;
  berkasPrestasiBase64: string;
}

export const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (_e) {
    return "";
  }
};

export const sanitizeSrc = (src: string | undefined | null): string => {
  let url = sanitizeUrl(src);
  if (url && url.startsWith("/jurusan/")) {
    url = url.replace("/jurusan/", "/assets/jurusan/");
  }
  return url;
};

export const getMajorDetails = (majorName: string) => {
  const nameLower = (majorName || "").toLowerCase();
  if (nameLower.includes("rekayasa") || nameLower.includes("rpl") || nameLower.includes("perangkat lunak")) {
    return {
      icon: React.createElement(Code, { className: "w-5 h-5 text-blue-500" }),
      logoText: "RPL",
      logoPath: "/assets/jurusan/pplg.png",
      bg: "bg-primary/5 dark:bg-blue-950/45",
      textColor: "text-primary dark:text-sky-400"
    };
  }
  if (nameLower.includes("jaringan") || nameLower.includes("tjkt") || nameLower.includes("komputer")) {
    return {
      icon: React.createElement(Monitor, { className: "w-5 h-5 text-amber-500" }),
      logoText: "TJKT",
      logoPath: "/assets/jurusan/tjkt.png",
      bg: "bg-amber-50 dark:bg-amber-950/45",
      textColor: "text-amber-600 dark:text-amber-400"
    };
  }
  if (nameLower.includes("desain") || nameLower.includes("dkv") || nameLower.includes("visual")) {
    return {
      icon: React.createElement(Palette, { className: "w-5 h-5 text-purple-500" }),
      logoText: "DKV",
      logoPath: "/assets/jurusan/dkv.png",
      bg: "bg-purple-50 dark:bg-purple-950/45",
      textColor: "text-purple-600 dark:text-purple-400"
    };
  }
  if (nameLower.includes("animasi") || nameLower.includes("anm")) {
    return {
      icon: React.createElement(Sparkles, { className: "w-5 h-5 text-pink-500" }),
      logoText: "ANM",
      logoPath: "/assets/jurusan/animasi.png",
      bg: "bg-pink-50 dark:bg-pink-950/45",
      textColor: "text-pink-600 dark:text-pink-400"
    };
  }
  if (nameLower.includes("broadcast") || nameLower.includes("bc") || nameLower.includes("perfilman")) {
    return {
      icon: React.createElement(Film, { className: "w-5 h-5 text-red-500" }),
      logoText: "BC",
      logoPath: "/assets/jurusan/bc.png",
      bg: "bg-red-50 dark:bg-red-950/45",
      textColor: "text-red-600 dark:text-red-400"
    };
  }
  if (nameLower.includes("elektronika") || nameLower.includes("te")) {
    return {
      icon: React.createElement(Cpu, { className: "w-5 h-5 text-emerald-500" }),
      logoText: "TE",
      logoPath: "/assets/jurusan/te.png",
      bg: "bg-emerald-50 dark:bg-emerald-950/45",
      textColor: "text-emerald-600 dark:text-emerald-400"
    };
  }
  return {
    icon: React.createElement(Sparkles, { className: "w-5 h-5 text-blue-500" }),
    logoText: "PPDB",
    logoPath: "",
    bg: "bg-primary/5 dark:bg-blue-950/45",
    textColor: "text-primary dark:text-sky-400"
  };
};

export const DEFAULT_FIELDS_CONFIG: Record<string, { label: string; required: boolean; active: boolean }> = {
  nama: { label: "Nama Lengkap", required: true, active: true },
  nisn: { label: "NISN", required: true, active: true },
  nik: { label: "NIK", required: true, active: true },
  tempatLahir: { label: "Tempat Lahir", required: true, active: true },
  tglLahir: { label: "Tanggal Lahir", required: true, active: true },
  jenisKelamin: { label: "Jenis Kelamin", required: true, active: true },
  agama: { label: "Agama", required: true, active: true },
  kewarganegaraan: { label: "Kewarganegaraan", required: true, active: true },
  alamat: { label: "Alamat Lengkap", required: true, active: true },
  rtRw: { label: "RT / RW", required: true, active: true },
  kelurahan: { label: "Kelurahan", required: true, active: true },
  kecamatan: { label: "Kecamatan", required: true, active: true },
  kodePos: { label: "Kode Pos", required: true, active: true },
  whatsapp: { label: "Nomor WhatsApp (Calon Siswa)", required: true, active: true },
  email: { label: "Alamat Email", required: false, active: true },
  tinggalDengan: { label: "Tinggal Dengan", required: true, active: true },
  transportasi: { label: "Transportasi Ke Sekolah", required: true, active: true },
  tinggiBadan: { label: "Tinggi Badan (cm)", required: true, active: true },
  beratBadan: { label: "Berat Badan (kg)", required: true, active: true },
  golonganDarah: { label: "Golongan Darah", required: true, active: true },
  penyakitDiderita: { label: "Penyakit Diderita", required: false, active: true },
  kebutuhanKhusus: { label: "Berkebutuhan Khusus", required: false, active: true },
  jenisPrestasi: { label: "Jenis Prestasi", required: false, active: true },
  tingkatPrestasi: { label: "Tingkat Prestasi", required: false, active: true },
  uraianPrestasi: { label: "Uraian Prestasi", required: false, active: true },
  tahunPrestasi: { label: "Tahun Prestasi", required: false, active: true },
  penyelenggara: { label: "Penyelenggara Prestasi", required: false, active: true },
  berkasPrestasi: { label: "Himbauan Sertifikat Prestasi", required: false, active: true },
  jenisBeasiswa: { label: "Jenis Beasiswa", required: false, active: true },
  uraianBeasiswa: { label: "Uraian/Nama Beasiswa", required: false, active: true },
  tahunMulaiBeasiswa: { label: "Tahun Mulai Beasiswa", required: false, active: true },
  tahunSelesaiBeasiswa: { label: "Tahun Selesai Beasiswa", required: false, active: true },
  sekolahAsal: { label: "Nama SMP/MTs Asal", required: true, active: true },
  tglLulus: { label: "Tanggal Lulus SMP/MTs", required: true, active: true },
  noIjazah: { label: "Nomor Seri Ijazah", required: false, active: true },
  noSKHUN: { label: "Nomor Seri SKHUN", required: false, active: true },
  noPesertaUN: { label: "Nomor Peserta UN", required: false, active: true },
  lamaBelajar: { label: "Lama Belajar (Tahun)", required: true, active: true },
  pindahanDari: { label: "Pindahan Dari", required: false, active: true },
  alasanPindah: { label: "Alasan Pindah Sekolah", required: false, active: true },
  diterimaKelas: { label: "Diterima di Tingkat/Kelas", required: true, active: true },
  jurusan1: { label: "Program Keahlian (Jurusan)", required: true, active: true },
  alasanMemilih: { label: "Alasan Memilih Jurusan", required: false, active: true },
  namaAyah: { label: "Nama Lengkap Ayah", required: true, active: true },
  tempatLahirAyah: { label: "Tempat Lahir Ayah", required: true, active: true },
  tglLahirAyah: { label: "Tanggal Lahir Ayah", required: true, active: true },
  agamaAyah: { label: "Agama Ayah", required: true, active: true },
  kewarganegaraanAyah: { label: "Kewarganegaraan Ayah", required: true, active: true },
  pendidikanAyah: { label: "Pendidikan Terakhir Ayah", required: true, active: true },
  pekerjaanAyah: { label: "Pekerjaan Ayah", required: true, active: true },
  penghasilanAyah: { label: "Penghasilan Bulanan Ayah", required: true, active: true },
  alamatAyah: { label: "Alamat Lengkap Ayah", required: true, active: true },
  statusAyah: { label: "Status Ayah", required: true, active: true },
  namaIbu: { label: "Nama Lengkap Ibu", required: true, active: true },
  tempatLahirIbu: { label: "Tempat Lahir Ibu", required: true, active: true },
  tglLahirIbu: { label: "Tanggal Lahir Ibu", required: true, active: true },
  agamaIbu: { label: "Agama Ibu", required: true, active: true },
  kewarganegaraanIbu: { label: "Kewarganegaraan Ibu", required: true, active: true },
  pendidikanIbu: { label: "Pendidikan Terakhir Ibu", required: true, active: true },
  pekerjaanIbu: { label: "Pekerjaan Ibu", required: true, active: true },
  penghasilanIbu: { label: "Penghasilan Bulanan Ibu", required: true, active: true },
  alamatIbu: { label: "Alamat Lengkap Ibu", required: true, active: true },
  statusIbu: { label: "Status Ibu", required: true, active: true },
  namaWali: { label: "Nama Lengkap Wali", required: false, active: true },
  tempatLahirWali: { label: "Tempat Lahir Wali", required: false, active: true },
  tglLahirWali: { label: "Tanggal Lahir Wali", required: false, active: true },
  agamaWali: { label: "Agama Wali", required: false, active: true },
  kewarganegaraanWali: { label: "Kewarganegaraan Wali", required: false, active: true },
  pendidikanWali: { label: "Pendidikan Terakhir Wali", required: false, active: true },
  pekerjaanWali: { label: "Pekerjaan Wali", required: false, active: true },
  penghasilanWali: { label: "Penghasilan Bulanan Wali", required: false, active: true },
  alamatWali: { label: "Alamat Lengkap Wali", required: false, active: true },
  statusWali: { label: "Status Wali", required: false, active: true },
  teleponOrtu: { label: "Nomor Telepon Orang Tua", required: true, active: true },
  nilaiUSTeori: { label: "Nilai US Teori", required: false, active: true },
  nilaiUSPraktik: { label: "Nilai US Praktik", required: false, active: true },
  nilaiMuatanLokal: { label: "Nilai Muatan Lokal", required: false, active: true },
  citaCita: { label: "Cita-cita Utama", required: false, active: true },
  hobi: { label: "Hobi", required: false, active: true },
  pelajaranDisenangi: { label: "Pelajaran Yang Disenangi", required: false, active: true },
  alasanDisenangi: { label: "Alasan Menyenangi Pelajaran", required: false, active: true },
  kesulitanBelajar: { label: "Kesulitan Belajar Yang Dialami", required: false, active: true },
  citaCitaSetelahLulus: { label: "Rencana Setelah Lulus", required: false, active: true },
  punyaKPS: { label: "Status KPS", required: false, active: true },
  noKPS: { label: "Nomor KPS", required: false, active: true },
  punyaKIP: { label: "Status KIP", required: false, active: true },
  noKIP: { label: "Nomor KIP", required: false, active: true }
};
