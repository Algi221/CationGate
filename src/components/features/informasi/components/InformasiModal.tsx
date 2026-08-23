"use client";

import React from "react";
import Image from "next/image";
import { 
  X, 
  FileText, 
  Calendar, 
  Trash2, 
  Upload, 
  Loader2, 
  Sparkles 
} from "lucide-react";

interface InformasiModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  judul: string;
  setJudul: (val: string) => void;
  konten: string;
  setKonten: (val: string) => void;
  tanggal: string;
  setTanggal: (val: string) => void;
  fotoUrl: string;
  setFotoUrl: (val: string) => void;
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  videoName: string;
  setVideoName: (val: string) => void;
  dokumenUrl: string;
  setDokumenUrl: (val: string) => void;
  dokumenName: string;
  setDokumenName: (val: string) => void;
  dragActive: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDokumenFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InformasiModal: React.FC<InformasiModalProps> = ({
  isOpen,
  isEditMode,
  judul,
  setJudul,
  konten,
  setKonten,
  tanggal,
  setTanggal,
  fotoUrl,
  setFotoUrl,
  videoUrl,
  setVideoUrl,
  videoName,
  setVideoName,
  dokumenUrl,
  setDokumenUrl,
  dokumenName,
  setDokumenName,
  dragActive,
  submitting,
  onClose,
  onSubmit,
  handleDrag,
  handleDrop,
  handleFileChange,
  handleVideoFileChange,
  handleDokumenFileChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wide">
                {isEditMode ? "Edit Informasi" : "Publikasikan Informasi Baru"}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Kelola konten pengumuman resmi sekolah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Judul Input */}
            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                Judul Pengumuman <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <FileText size={15} />
                </span>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul pengumuman informasi..."
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Tanggal Input */}
            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                Tanggal Publikasi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Calendar size={15} />
                </span>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Konten Input */}
            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                Isi Konten Informasi <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                placeholder="Tuliskan detail pengumuman informasi secara rinci di sini..."
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 text-sm font-semibold leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
              />
            </div>

            {/* Image Uploader */}
            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                Foto / Poster Penunjang
              </label>

              {fotoUrl ? (
                <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-52 bg-slate-100 dark:bg-slate-950 group">
                  <Image
                    src={fotoUrl}
                    alt="Preview"
                    width={600}
                    height={300}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => setFotoUrl("")}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
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
                      : "border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#020617]/20"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                    <Upload size={18} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Pilih atau Seret Foto Anda
                    </h5>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Format JPG, PNG, atau WEBP. Maksimum ukuran file 3 MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Media Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
              {/* Video Uploader */}
              <div className="space-y-2 text-left">
                <label className="text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                  Video Informasi (Maks 10MB)
                </label>

                {videoUrl ? (
                  <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-36 bg-slate-950 group flex items-center justify-center">
                    <video src={videoUrl} className="h-full w-full object-contain" />
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-200">
                      <span className="text-[9px] text-white font-extrabold uppercase tracking-wider truncate max-w-[90%]">
                        {videoName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl("");
                          setVideoName("");
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Trash2 size={11} />
                        <span>Hapus Video</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#020617]/20 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer h-36 relative overflow-hidden">
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                      <Upload size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                        Pilih Berkas Video
                      </h5>
                      <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                        Format MP4 atau WEBM. Maksimal 10 MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Uploader */}
              <div className="space-y-2 text-left">
                <label className="text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                  Dokumen Lampiran (Maks 5MB)
                </label>

                {dokumenUrl ? (
                  <div className="relative rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-36 bg-slate-50 dark:bg-[#020617]/40 p-4 group flex flex-col items-center justify-center text-center shadow-inner">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 mb-1">
                      <FileText size={18} />
                    </div>
                    <h6 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[90%] leading-tight">
                      {dokumenName}
                    </h6>
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider block mt-0.5">
                      Dokumen Siap
                    </span>

                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => {
                          setDokumenUrl("");
                          setDokumenName("");
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Trash2 size={11} />
                        <span>Hapus Berkas</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#020617]/20 rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer h-36 relative overflow-hidden">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleDokumenFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                      <Upload size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                        Pilih Berkas Dokumen
                      </h5>
                      <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                        PDF, DOCX, XLSX, TXT. Maksimal 5 MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Action Buttons Footer */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.35)] active:scale-[0.98] transition-all flex items-center gap-2 border border-blue-400/30 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Sedang Menyimpan...</span>
                </>
              ) : (
                <span>{isEditMode ? "Simpan Perubahan" : "Publikasikan Sekarang"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
