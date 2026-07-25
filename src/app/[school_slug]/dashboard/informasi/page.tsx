"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import dompurify from "dompurify";

const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (e) {
    return "";
  }
};

const sanitizeSrc = (src: string | undefined | null): string => sanitizeUrl(src);
import { 
  Megaphone, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  Loader2, 
  AlertCircle, 
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface Informasi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  foto_url?: string | null;
  created_at?: string;
}

export default function KelolaInformasi() {
  const { adminToken, addToast } = usePPDB();
  const [informasiList, setInformasiList] = useState<Informasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [judul, setJudul] = useState<string>("");
  const [konten, setKonten] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string>(""); 
  const [videoUrl, setVideoUrl] = useState<string>(""); 
  const [videoName, setVideoName] = useState<string>("");
  const [dokumenUrl, setDokumenUrl] = useState<string>(""); 
  const [dokumenName, setDokumenName] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);

  const [previewItem, setPreviewItem] = useState<Informasi | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const BACKEND_URL = "/api";

  const parseMedia = (raw: string | null | undefined) => {
    if (!raw) return { foto: "", video: "", videoName: "", dokumen: "", dokumenName: "" };
    if (raw.startsWith("{")) {
      try {
        const parsed = JSON.parse(raw);
        return {
          foto: parsed.foto || "",
          video: parsed.video || "",
          videoName: parsed.video_name || "",
          dokumen: parsed.dokumen || "",
          dokumenName: parsed.dokumen_name || ""
        };
      } catch (e) {
        // fallback
      }
    }
    return { foto: raw, video: "", videoName: "", dokumen: "", dokumenName: "" };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  const formatInputDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (1 + date.getMonth()).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return "";
    }
  };

  const fetchDetailItem = async (id: number): Promise<Informasi | null> => {
    try {
      setLoadingDetailId(id);
      const res = await fetch(`${BACKEND_URL}/api/informasi/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal Memuat Detail", "Gagal memuat detail informasi dari server.", "danger");
        }
        return null;
      }
    } catch (err: any) {
      console.error("Error fetching detail:", err);
      if (typeof addToast === "function") {
        addToast("Koneksi Error", "Gagal menghubungi server.", "danger");
      }
      return null;
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handleOpenPreview = async (item: Informasi) => {
    if (loadingDetailId !== null) return;
    const fullItem = await fetchDetailItem(item.id);
    if (fullItem) {
      setPreviewItem(fullItem);
    }
  };

  const fetchInformasi = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/informasi`);
      const data = await res.json();
      if (data.success) {
        setInformasiList(data.data);
      } else {
        if (typeof addToast === "function") {
          addToast("Error", "Gagal memuat informasi dari server.", "danger");
        }
      }
    } catch (err: any) {
      console.warn("Backend offline, using fallback seeded data:", err.message);
      
      const fallbackData: Informasi[] = [
        {
          id: 101,
          judul: "Pendaftaran Peserta Didik Baru (PPDB) SMK Taruna Bhakti 2026/2027 Resmi Dibuka!",
          konten: "SMK Taruna Bhakti Depok resmi membuka pendaftaran bagi calon peserta didik baru untuk tahun ajaran 2026/2027. Tersedia 6 Program Keahlian unggulan yaitu Rekayasa Perangkat Lunak, Teknik Jaringan Komputer, Desain Komunikasi Visual, Broadcasting & Perfilman, Teknik Elektronika, dan Animasi. Segera lakukan registrasi online dan unggah berkas Anda sebelum kuota penuh!",
          tanggal: "2026-05-15",
          foto_url: "",
          created_at: new Date().toISOString()
        },
        {
          id: 102,
          judul: "Sosialisasi Jurusan Baru: Teknik Elektronika (TE) dengan Fokus Robotika Industri",
          konten: "Menjawab tantangan revolusi industri 4.0, SMK Taruna Bhakti menghadirkan inovasi di jurusan Teknik Elektronika. Kurikulum diperkuat dengan pemelajaran mikrokontroler, IoT, PLC, dan Robotika Industri modern. Lulusan TE siap diserap oleh industri manufaktur dan teknologi terkemuka.",
          tanggal: "2026-05-20",
          foto_url: "",
          created_at: new Date().toISOString()
        }
      ];
      setInformasiList(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInformasi();
  }, []);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setJudul("");
    setKonten("");
    
    const today = new Date().toISOString().split('T')[0];
    setTanggal(today);
    setFotoUrl("");
    setVideoUrl("");
    setVideoName("");
    setDokumenUrl("");
    setDokumenName("");
    setIsOpenModal(true);
  };

  const handleOpenEditModal = async (item: Informasi) => {
    if (loadingDetailId !== null) return;
    const fullItem = await fetchDetailItem(item.id);
    if (!fullItem) return;

    setIsEditMode(true);
    setSelectedId(fullItem.id);
    setJudul(fullItem.judul);
    setKonten(fullItem.konten);
    setTanggal(formatInputDate(fullItem.tanggal));
    
    const media = parseMedia(fullItem.foto_url);
    setFotoUrl(media.foto);
    setVideoUrl(media.video);
    setVideoName(media.videoName);
    setDokumenUrl(media.dokumen);
    setDokumenName(media.dokumenName);
    
    setIsOpenModal(true);
  };

  const processFile = (file: File) => {
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran File Terlalu Besar", "Harap pilih foto dengan ukuran di bawah 3 MB.", "warning");
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya berkas gambar/foto yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFotoUrl(reader.result); 
        if (typeof addToast === "function") {
          addToast("Foto Siap", "Foto berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processVideoFile = (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran Video Terlalu Besar", "Harap pilih video dengan ukuran di bawah 10 MB.", "warning");
      }
      return;
    }

    if (!file.type.startsWith("video/")) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya berkas video yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setVideoUrl(reader.result);
        setVideoName(file.name);
        if (typeof addToast === "function") {
          addToast("Video Siap", "Video berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const processDokumenFile = (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran Dokumen Terlalu Besar", "Harap pilih dokumen dengan ukuran di bawah 5 MB.", "warning");
      }
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain"
    ];
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(ext || "");

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya dokumen PDF, Word, Excel, atau Text yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setDokumenUrl(reader.result);
        setDokumenName(file.name);
        if (typeof addToast === "function") {
          addToast("Dokumen Siap", "Dokumen berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDokumenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processDokumenFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!judul.trim() || !konten.trim() || !tanggal) {
      if (typeof addToast === "function") {
        addToast("Gagal", "Harap lengkapi semua kolom wajib (Judul, Konten, Tanggal).", "warning");
      }
      return;
    }

    setSubmitting(true);
    const mediaObj = {
      foto: fotoUrl || "",
      video: videoUrl || "",
      video_name: videoName || "",
      dokumen: dokumenUrl || "",
      dokumen_name: dokumenName || ""
    };
    const hasMedia = fotoUrl || videoUrl || dokumenUrl;
    const payload = {
      judul: judul.trim(),
      konten: konten.trim(),
      tanggal,
      foto_url: hasMedia ? JSON.stringify(mediaObj) : null
    };

    try {
      const url = isEditMode 
        ? `${BACKEND_URL}/api/informasi/${selectedId}` 
        : `${BACKEND_URL}/api/informasi`;
      
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (typeof addToast === "function") {
          addToast(
            isEditMode ? "Berhasil Diperbarui" : "Berhasil Ditambahkan", 
            isEditMode ? "Informasi berhasil diperbarui di sistem." : "Informasi baru berhasil dipublikasikan.", 
            "success"
          );
        }
        setIsOpenModal(false);
        fetchInformasi();
      } else {
        if (typeof addToast === "function") {
          addToast("Error", data.message || "Gagal memproses data.", "danger");
        }
      }
    } catch (err) {
      console.error("API error, executing offline fallback operations:", err);

      if (isEditMode) {
        setInformasiList(prev => prev.map(item => item.id === selectedId ? { ...item, ...payload } : item));
        if (typeof addToast === "function") {
          addToast("Diperbarui (Offline)", "Perubahan disimpan secara lokal di memori.", "success");
        }
      } else {
        const mockNew: Informasi = {
          id: Date.now(),
          ...payload,
          created_at: new Date().toISOString()
        };
        setInformasiList(prev => [mockNew, ...prev]);
        if (typeof addToast === "function") {
          addToast("Ditambahkan (Offline)", "Informasi ditambahkan secara lokal di memori.", "success");
        }
      }
      setIsOpenModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/informasi/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });

      const data = await res.json();
      if (data.success) {
        if (typeof addToast === "function") {
          addToast("Berhasil Dihapus", "Informasi telah dihapus secara permanen.", "success");
        }
        fetchInformasi();
      } else {
        if (typeof addToast === "function") {
          addToast("Error", data.message || "Gagal menghapus informasi.", "danger");
        }
      }
    } catch (err) {
      console.error("Delete API error, removing from local state:", err);
      setInformasiList(prev => prev.filter(item => item.id !== id));
      if (typeof addToast === "function") {
        addToast("Dihapus (Offline)", "Informasi dihapus dari tampilan lokal.", "success");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      
      {/* Dynamic Header & Stats Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info & CTA Panel */}
        <div className="lg:col-span-2 bg-gradient-to-tr from-blue-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 border border-blue-500/20 dark:border-white/5 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-extrabold uppercase tracking-widest text-blue-200">
              <Sparkles size={12} className="animate-pulse" />
              <span>Portal Pusat Informasi</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">PUBLIKASIKAN PENGUMUMAN & KEGIATAN TERBARU</h2>
            <p className="text-sm text-slate-350 max-w-xl font-medium leading-relaxed">
              Tulis, kelola, dan atur tanggal berita, informasi pendaftaran, sosialisasi program keahlian, atau pengumuman kelulusan di portal utama PPDB SMK Taruna Bhakti.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-wrap gap-4">
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.35)] active:scale-[0.98] transition-all flex items-center gap-2 border border-blue-400/30"
            >
              <Plus size={16} />
              <span>Buat Informasi Baru</span>
            </button>
            <button
              onClick={fetchInformasi}
              className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all border border-white/5 flex items-center gap-2"
            >
              Sinkronkan Ulang
            </button>
          </div>
        </div>

        {/* Informational Metric Display */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden transition-colors duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 dark:text-slate-550 font-extrabold text-[10px] uppercase tracking-widest block">Ringkasan Publikasi</span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-center text-blue-500 dark:text-blue-400">
                <Megaphone size={16} />
              </div>
            </div>
            <div>
              <div className="text-5xl font-black tracking-tight text-slate-850 dark:text-white">
                {informasiList.length}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block mt-1.5 uppercase tracking-wide">Total Informasi Aktif</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              Update terakhir
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-300">
              {informasiList.length > 0 ? formatDate(informasiList[0].tanggal) : "Belum Ada"}
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center gap-4 text-slate-500 transition-colors duration-300">
          <Loader2 size={32} className="animate-spin text-blue-500 dark:text-blue-400" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Sedang memuat data informasi...</span>
        </div>
      ) : informasiList.length === 0 ? (
        <div className="py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/60 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center text-center p-8 transition-colors duration-300">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-450 dark:text-slate-500 mb-4 border border-slate-200/60 dark:border-white/5">
            <Megaphone size={24} />
          </div>
          <h3 className="text-slate-850 dark:text-white font-black text-sm uppercase tracking-wide">Belum Ada Informasi</h3>
          <p className="text-xs text-slate-400 dark:text-slate-550 font-medium max-w-xs mt-2 leading-relaxed">
            Tidak ditemukan pengumuman informasi yang aktif di database saat ini. Buat pengumuman baru Anda sekarang!
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-6 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Buat Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {informasiList.map((item) => {
            const media = parseMedia(item.foto_url);
            return (
              <div 
                key={item.id}
                className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 hover:border-slate-350 dark:hover:border-white/10 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative cursor-pointer ${loadingDetailId === item.id ? 'opacity-75 pointer-events-none' : ''}`}
                onClick={() => {
                  if (loadingDetailId === null) {
                    handleOpenPreview(item);
                  }
                }}
              >
                
                {/* Floating Date Badge */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-md">
                  <Calendar size={11} className="text-blue-400" />
                  <span>{formatDate(item.tanggal)}</span>
                </div>

                {/* Floating Media Indicators */}
                <div className="absolute top-4 right-4 z-10 flex gap-1">
                  {media.video && (
                    <span className="px-2.5 py-1.5 bg-blue-600/90 backdrop-blur-md border border-blue-400/20 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md">
                      🎥 Video
                    </span>
                  )}
                  {media.dokumen && (
                    <span className="px-2.5 py-1.5 bg-emerald-600/90 backdrop-blur-md border border-emerald-400/20 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md">
                      📄 Dokumen
                    </span>
                  )}
                </div>

                <div>
                  {/* Image Section */}
                  <div className="h-48 bg-slate-100 dark:bg-slate-955 overflow-hidden relative border-b border-slate-150 dark:border-white/5">
                    {media.foto ? (
                      <img 
                        src={sanitizeSrc(media.foto)} 
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-650/10 dark:from-blue-600/5 dark:to-indigo-500/5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-650 gap-2">
                        <ImageIcon size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-600">Media Poster Kosong</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-3">
                    <h4 className="text-slate-850 dark:text-white font-extrabold text-base tracking-tight leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.judul}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-405 font-medium leading-relaxed line-clamp-3">
                      {item.konten}
                    </p>
                  </div>
                </div>

                {/* Action Bar Footer */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-955/20 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-20" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenPreview(item)}
                    className="text-[11px] font-extrabold uppercase tracking-wide text-blue-550 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1 active:scale-[0.98] transition-all"
                    disabled={loadingDetailId !== null}
                  >
                    {loadingDetailId === item.id ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 size={11} className="animate-spin" />
                        <span>Memuat...</span>
                      </span>
                    ) : (
                      <>
                        <span>Pratinjau</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className={`p-2 bg-slate-100 hover:bg-blue-500/10 dark:bg-white/5 dark:hover:bg-blue-500/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300 rounded-xl transition-all border border-slate-200/50 dark:border-white/5 hover:border-blue-500/20 ${loadingDetailId !== null ? 'opacity-50 pointer-events-none' : ''}`}
                      title="Edit Informasi"
                      disabled={loadingDetailId !== null}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 bg-slate-100 hover:bg-rose-500/10 dark:bg-white/5 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl transition-all border border-slate-200/50 dark:border-white/5 hover:border-rose-500/20"
                      title="Hapus Informasi"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT FORM MODAL */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-2xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 my-8 transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/15">
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wide flex items-center gap-2">
                  <Megaphone size={18} className="text-blue-600 dark:text-blue-400" />
                  <span>{isEditMode ? "Edit Publikasi Informasi" : "Publikasikan Informasi Baru"}</span>
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider mt-1">Lengkapi form isian di bawah ini dengan tepat</p>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-none">
                
                {/* Judul Input */}
                <div className="space-y-2">
                  <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Judul Pengumuman <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-500">
                      <FileText size={15} />
                    </span>
                    <input
                      type="text"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                      placeholder="Masukkan judul pengumuman informasi..."
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Tanggal Input */}
                <div className="space-y-2">
                  <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Tanggal Publikasi <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-500">
                      <Calendar size={15} />
                    </span>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Konten Input */}
                <div className="space-y-2">
                  <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Isi Konten Informasi <span className="text-rose-500">*</span></label>
                  <textarea
                    value={konten}
                    onChange={(e) => setKonten(e.target.value)}
                    placeholder="Tuliskan detail pengumuman informasi secara rinci di sini..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm font-semibold leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
                  />
                </div>

                {/* Premium Drag & Drop Image Uploader */}
                <div className="space-y-2">
                  <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Foto / Poster Penunjang</label>
                  
                  {fotoUrl ? (
                    <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-52 bg-slate-100 dark:bg-slate-950 group">
                      <img src={fotoUrl && /^(https?:\/\/|\/(?!\/)|data:image\/)/i.test(fotoUrl) ? fotoUrl : ""} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => setFotoUrl("")}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95"
                        >
                          <Trash2 size={12} />
                          <span>Hapus Foto</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer h-52 relative overflow-hidden ${
                        dragActive
                          ? "border-blue-500 bg-blue-500/5"
                          : "border-slate-300 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/20"
                      }`}
                    >
                      <input
                        type="file"
                        id="image-file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                        <Upload size={18} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Pilih atau Seret Foto Anda</h5>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">Format JPG, PNG, atau WEBP. Maksimum ukuran file 3 MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Media Uploaders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-150 dark:border-white/5">
                  {/* Video Uploader */}
                  <div className="space-y-2 text-left">
                    <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Video Informasi (Maks 10MB)</label>
                    
                    {videoUrl ? (
                      <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-36 bg-slate-950 group flex items-center justify-center">
                        <video src={videoUrl && /^(https?:\/\/|\/(?!\/)|data:video\/)/i.test(videoUrl) ? videoUrl : ""} className="h-full w-full object-contain" />
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-200">
                          <span className="text-[9px] text-white font-extrabold uppercase tracking-wider truncate max-w-[90%]">{videoName}</span>
                          <button
                            type="button"
                            onClick={() => { setVideoUrl(""); setVideoName(""); }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95"
                          >
                            <Trash2 size={11} />
                            <span>Hapus Video</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer h-36 relative overflow-hidden">
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={handleVideoFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                          <Upload size={16} />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Pilih Berkas Video</h5>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">Format MP4 atau WEBM. Maksimal 10 MB</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Document Uploader */}
                  <div className="space-y-2 text-left">
                    <label className="text-slate-650 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">Dokumen Lampiran (Maks 5MB)</label>
                    
                    {dokumenUrl ? (
                      <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-36 bg-slate-50 dark:bg-slate-950/40 p-4 group flex flex-col items-center justify-center text-center shadow-inner">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 mb-1">
                          <FileText size={18} />
                        </div>
                        <h6 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[90%] leading-tight">{dokumenName}</h6>
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider block mt-0.5">Dokumen Siap</span>
                        
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                          <button
                            type="button"
                            onClick={() => { setDokumenUrl(""); setDokumenName(""); }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95"
                          >
                            <Trash2 size={11} />
                            <span>Hapus Berkas</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer h-36 relative overflow-hidden">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                          onChange={handleDokumenFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                          <Upload size={16} />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Pilih Berkas Dokumen</h5>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">PDF, DOCX, XLSX, TXT. Maksimal 5 MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Action Buttons Footer */}
              <div className="p-6 bg-slate-50/50 dark:bg-slate-950/15 border-t border-slate-150 dark:border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-655 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(59,130,246,0.25)] active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Sedang Menyimpan...</span>
                    </>
                  ) : (
                    <span>{isEditMode ? "Simpan Perubahan" : "Publikasikan"}</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DETAIL PREVIEW MODAL */}
      {previewItem && (() => {
        const media = parseMedia(previewItem.foto_url);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-3xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 my-8 transition-colors duration-300">
              
              {/* Poster Header */}
              {media.foto ? (
                <div className="h-80 relative border-b border-slate-150 dark:border-white/5">
                  <img src={sanitizeSrc(media.foto)} alt={previewItem.judul} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  
                  {/* Floating Date Over Image */}
                  <div className="absolute bottom-6 left-6 z-10 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-md border border-blue-500">
                    <Calendar size={11} />
                    <span>{formatDate(previewItem.tanggal)}</span>
                  </div>
                  
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-slate-955 flex items-center justify-center transition-all font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="p-6 border-b border-slate-150 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/15">
                  <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-sm">
                    <Calendar size={11} />
                    <span>{formatDate(previewItem.tanggal)}</span>
                  </div>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Content Details */}
              <div className="p-8 space-y-6">
                <h2 className="text-xl font-black text-slate-850 dark:text-white uppercase leading-snug tracking-tight text-left">
                  {previewItem.judul}
                </h2>

                <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed font-semibold whitespace-pre-line text-left">
                  {previewItem.konten}
                </p>

                {/* Additional Media in Preview */}
                {(media.video || media.dokumen) && (
                  <div className="pt-6 border-t border-slate-150 dark:border-white/5 space-y-6">
                    <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-left">Lampiran Media Forum</h5>
                    
                    <div className="space-y-6">
                      {/* Video Player (Inline playback only, no download) */}
                      {media.video && (
                        <div className="space-y-3 text-left">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block">🎥 Video Lampiran:</span>
                          <div className="rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden bg-slate-950 shadow-md">
                            <video src={sanitizeSrc(media.video)} controls className="w-full max-h-72 object-contain" />
                          </div>
                        </div>
                      )}

                      {/* Document Preview & Download Button */}
                      {media.dokumen && (
                        <div className="space-y-3 text-left w-full">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">📄 Pratinjau Dokumen Resmi:</span>
                                   {media.dokumen.startsWith("data:application/pdf") ? (
                            <div className="rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-md bg-white">
                              <iframe src={sanitizeSrc(media.dokumen)} className="w-full h-[450px] border-0" />
                            </div>
                          ) : media.dokumen.startsWith("data:image/") ? (
                            <div className="rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-md bg-slate-100 dark:bg-slate-955 flex items-center justify-center p-4">
                              <img src={sanitizeSrc(media.dokumen)} alt="Dokumen Preview" className="max-w-full max-h-96 object-contain rounded-xl" />
                            </div>
                          ) : (
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                <FileText size={18} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{media.dokumenName || "dokumen.pdf"}</h6>
                                <span className="text-[9px] text-slate-455 dark:text-slate-550 block mt-0.5">Pratinjau langsung tidak tersedia untuk format berkas ini. Silakan unduh dokumen untuk melihat isi berkas.</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <a
                              href={sanitizeUrl(media.dokumen)}
                              download={media.dokumenName || "dokumen.pdf"}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
                            >
                              Unduh Dokumen ({media.dokumenName || "dokumen.pdf"})
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            {/* Detail Actions Footer */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-955/15 border-t border-slate-150 dark:border-white/5 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">
                ID Publikasi: #{previewItem.id}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const item = previewItem;
                    setPreviewItem(null);
                    handleOpenEditModal(item);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-blue-500/10 dark:bg-white/5 dark:hover:bg-blue-500/10 text-slate-655 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-all flex items-center gap-1.5"
                >
                  <Edit3 size={13} />
                  <span>Ubah Data</span>
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>

          </div>
        </div>
        );
      })()}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 my-8 transition-colors duration-300 text-center relative p-8">
            <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 dark:text-rose-400 mx-auto mb-6 border border-rose-200 dark:border-rose-900/30">
              <AlertCircle size={36} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black text-slate-850 dark:text-white uppercase tracking-tight mb-3">Hapus Informasi?</h3>
            <p className="text-sm text-slate-550 dark:text-slate-400 font-medium leading-relaxed mb-8">
              Apakah Anda yakin ingin menghapus pengumuman informasi ini secara permanen? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-655 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-all w-full sm:w-auto"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(225,29,72,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <Trash2 size={14} />
                <span>Ya, Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
