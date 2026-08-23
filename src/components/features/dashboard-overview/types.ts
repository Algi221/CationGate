export interface MajorItem {
  name: string;
  dbName: string;
  color: string;
  count?: number;
}

export interface MajorConfigItem {
  code?: string;
  title?: string;
  name?: string;
  color?: string;
}

export interface ApplicantItem {
  id?: number | string;
  nama?: string;
  nisn?: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan1?: string;
  status?: string;
  tgl_daftar?: string;
  created_at?: string;
}
