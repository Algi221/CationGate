export interface WsLog {
  id: string;
  timestamp: string;
  direction: string;
  event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface PPDBApplicant {
  id: number;
  nama: string;
  nisn: string;
  nik?: string;
  registration_no?: string;
  no_pendaftaran?: string;
  periode?: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan_2?: string;
  jurusan1?: string;
  jurusan2?: string;
  status: string;
  tipe_pendaftar?: string;
  jalur_pendaftaran?: string;
  is_pindahan?: boolean;
  pindahan_dari?: string;
  pindahanDari?: string;
  alasan_pindah?: string;
  metode_pembayaran?: string;
  status_pembayaran?: string;
  bukti_bayar?: string | null;
  diterima_kelas?: string | null;
  diterimaKelas?: string | null;
  tgl_daftar?: string;
  createdAt?: string;
  jenis_kelamin?: string;
  jenisKelamin?: string;
  tempat_lahir?: string;
  tempatLahir?: string;
  tgl_lahir?: string;
  tglLahir?: string;
  gelombang?: string;
  no_telepon?: string;
  whatsapp?: string;
  email?: string;
  nama_ayah?: string;
  nama_ibu?: string;
  pekerjaan_ayah?: string;
  alamat_jalan?: string;
  alasan_ditolak?: string | null;
  verified_by?: string | null;
  rejected_by?: string | null;
  physical_doc_verified?: boolean;
  physical_doc_verified_by?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
  alasan_hapus?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

