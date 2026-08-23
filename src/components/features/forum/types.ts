export interface InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
}

export interface ParsedMedia {
  foto: string;
  video: string;
  videoName: string;
  dokumen: string;
  dokumenName: string;
}
