export interface Informasi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
  created_at?: string;
}

export interface ParsedMedia {
  foto: string;
  video: string;
  videoName: string;
  dokumen: string;
  dokumenName: string;
}
