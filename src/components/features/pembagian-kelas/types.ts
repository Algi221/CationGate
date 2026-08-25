export interface Applicant {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan?: string;
  jurusan_1?: string;
  jurusan1?: string;
  diterima_kelas?: string | null;
  diterimaKelas?: string | null;
  status?: string;
  periode?: string;
  tempat_lahir?: string;
  tempatLahir?: string;
  tgl_lahir?: string;
  tglLahir?: string;
  jenis_kelamin?: string;
  jenisKelamin?: string;
  whatsapp?: string;
  email?: string;
  tgl_daftar?: string;
  createdAt?: string;
  deleted_at?: string;
  deleted_by?: string;
  verified_by?: string;
  rejected_by?: string;
  alasan_ditolak?: string;
  no_pendaftaran?: string;
  registration_no?: string;
  nipd?: string;
  diterima_tanggal?: string;
  diterimaTanggal?: string;
  [key: string]: unknown;
}

export interface ClassItem {
  id: string;
  name: string;
  majorCode: string;
  maxCapacity: number;
}

export interface MajorConfigItem {
  code: string;
  name?: string;
  title?: string;
  logo?: string;
}

export type GradeLevel = 10 | 11 | 12;
