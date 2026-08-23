"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Info, Calendar, Heart, HelpCircle, Layers, School, FileCheck, Check } from "lucide-react";
import dompurify from "dompurify";
import { Applicant } from "../types";

const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (_e) {
    return "";
  }
};

const sanitizeSrc = (src: string | undefined | null): string => sanitizeUrl(src);

export const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (_e) {
    return `2627${10000 + id}`;
  }
};

interface DetailModalProps {
  selectedApplicant: Applicant | null;
  onClose: () => void;
  onVerify: (id: number) => void;
  onOpenReject: (id: number) => void;
  onChecklistChange: (applicantId: number, newChecklist: Record<string, boolean>) => Promise<void>;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  selectedApplicant,
  onClose,
  onVerify,
  onOpenReject,
  onChecklistChange
}) => {
  const [activeTab, setActiveTab] = useState<string>("biodata");
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState<boolean>(false);

  if (!selectedApplicant) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">

          {/* Modal Header */}
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between shrink-0 bg-white dark:bg-[#0f172a] relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-2xl font-black shrink-0">
                {selectedApplicant.nama.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                  <span>{selectedApplicant.nama}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-widest ${
                      selectedApplicant.status === "Approved"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : selectedApplicant.status === "Rejected"
                          ? "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                          : "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {selectedApplicant.status === "Approved" ? "Terverifikasi" : selectedApplicant.status === "Rejected" ? "Ditolak" : "Pending"}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center flex-wrap gap-2">
                  <span className="text-blue-500">No. Pendaftaran:</span> <span className="font-mono text-blue-600 dark:text-blue-400">{formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}</span>
                  <span className="text-slate-300 dark:text-slate-400">•</span> 
                  <span className="text-blue-500">NISN:</span> {selectedApplicant.nisn} 
                  <span className="text-slate-300 dark:text-slate-400">•</span> 
                  <span className="text-blue-500">Asal:</span> {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}
                </p>
                {selectedApplicant.status === "Approved" && selectedApplicant.verified_by && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide mt-1">
                    ✓ Diverifikasi oleh: {selectedApplicant.verified_by}
                  </p>
                )}
                {selectedApplicant.status === "Rejected" && selectedApplicant.rejected_by && (
                  <div className="mt-1.5 flex flex-col gap-1.5 align-start text-left">
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold uppercase tracking-wide">
                      ✗ Digugurkan oleh: {selectedApplicant.rejected_by}
                    </p>
                    <div className="text-[10px] p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-300 max-w-md">
                      <span className="font-extrabold uppercase tracking-wider block mb-0.5">Alasan Penolakan:</span>
                      <span className="font-bold">{selectedApplicant.alasan_ditolak || "Tidak ada alasan spesifik yang diberikan."}</span>
                    </div>
                  </div>
                )}
                {selectedApplicant.deleted_at && selectedApplicant.deleted_by && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wide mt-1">
                    🗑️ Dihapus oleh: {selectedApplicant.deleted_by}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center justify-center transition-all font-bold relative z-10 shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Modal Tabs Navigation */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-white/5 shrink-0 w-full overflow-hidden">
            <div className="flex overflow-x-auto bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1 w-full max-w-full border border-slate-200 dark:border-slate-800/50">
              {[
                { id: "biodata", label: "Biodata" },
                { id: "periodik", label: "Periodik" },
                { id: "bantuan", label: "Bantuan" },
                { id: "orangtua", label: "Orang Tua" },
                { id: "akademik", label: "Akademik" },
                { id: "pembayaran", label: "Verifikasi Berkas" },
                { id: "pernyataan", label: "Pernyataan" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-2.5 text-[10px] md:text-xs font-black transition-all rounded-xl uppercase tracking-wider shrink-0 text-center min-w-22.5 whitespace-nowrap cursor-pointer ${
                    activeTab === t.id
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800/50"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Tab Content Viewport */}
          <div className="flex-1 overflow-y-auto p-8 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-bold max-h-[50vh] transition-colors duration-300">
            {activeTab === "biodata" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <User size={12} />
                    </div>
                    Identitas Diri
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                      <span className="text-slate-800 dark:text-white text-sm font-black">{selectedApplicant.nama}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">NISN / NIK</span>
                      <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tempat, Tanggal Lahir</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Kelamin / Agama</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Info size={12} />
                    </div>
                    Alamat & Kontak
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">WhatsApp / Email</span>
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-black">{selectedApplicant.whatsapp} / {selectedApplicant.email}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alamat Tempat Tinggal</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Kelurahan / Kecamatan</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggal Dengan / Transportasi</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "periodik" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Calendar size={12} />
                    </div>
                    Data Fisik & Periodik
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <Heart size={12} />
                    </div>
                    Kondisi Kesehatan
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span>
                      <span className="text-rose-600 dark:text-rose-400 font-black text-xs uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-2 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                          <span key={idx} className="bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase shadow-sm">{k}</span>
                        )) : <span className="text-slate-400 italic font-semibold">Tidak Ada</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bantuan" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <HelpCircle size={12} />
                    </div>
                    Jaminan Sosial / Bantuan
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Layers size={12} />
                    </div>
                    Beasiswa & Prestasi
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Prestasi</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{String(Array.isArray(selectedApplicant.jenis_prestasi) ? selectedApplicant.jenis_prestasi.join(", ") : (selectedApplicant.jenis_prestasi || selectedApplicant.jenisPrestasi || "Tidak Ada"))}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tingkat Prestasi</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{String(Array.isArray(selectedApplicant.tingkat_prestasi) ? selectedApplicant.tingkat_prestasi.join(", ") : (selectedApplicant.tingkat_prestasi || selectedApplicant.tingkatPrestasi || "Tidak Ada"))}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{String(selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada")}</span>
                    </div>
                    {selectedApplicant.berkas_prestasi && (
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                        <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Berkas Prestasi</span>
                        <a href={sanitizeUrl(typeof selectedApplicant.berkas_prestasi === "string" ? selectedApplicant.berkas_prestasi : undefined)} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold text-xs">Lihat Berkas</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orangtua" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <User size={12} />
                    </div>
                    Data Ayah Kandung
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Nama Ayah</span>
                      <span className="text-slate-800 dark:text-white font-black">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Pekerjaan</span>
                      <span className="text-slate-800 dark:text-white font-bold">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Penghasilan</span>
                      <span className="text-slate-800 dark:text-white font-bold">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <User size={12} />
                    </div>
                    Data Ibu Kandung
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Nama Ibu</span>
                      <span className="text-slate-800 dark:text-white font-black">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Pekerjaan</span>
                      <span className="text-slate-800 dark:text-white font-bold">{selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Penghasilan</span>
                      <span className="text-slate-800 dark:text-white font-bold">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Telepon Ortu</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono font-black">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "akademik" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <School size={12} />
                    </div>
                    Pendidikan Sebelumnya
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Asal Sekolah</span>
                      <span className="text-slate-800 dark:text-white font-black uppercase">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Tahun Lulus</span>
                      <span className="text-slate-800 dark:text-white font-mono">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKL</span>
                      <span className="text-slate-800 dark:text-white font-mono">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">No. SKHUN</span>
                      <span className="text-slate-800 dark:text-white font-mono">{selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Layers size={12} />
                    </div>
                    Pilihan Minat & Bakat
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Jurusan Pilihan</span>
                      <span className="text-blue-600 dark:text-blue-400 font-black uppercase">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1 || "PPLG"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Cita - Cita</span>
                      <span className="text-slate-800 dark:text-white font-bold">{selectedApplicant.cita_cita || selectedApplicant.citaCita || "-"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih</span>
                      <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pembayaran" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <FileCheck size={12} className="text-blue-500" /> Status Verifikasi Berkas Fisik
                </h4>
                <div className="p-6 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-3xl flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                    <div className="space-y-1">
                      <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Check size={12} />
                        </div>
                        Checklist Berkas Fisik
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Tandai dokumen yang telah diserahkan secara fisik ke sekolah.</p>
                      {selectedApplicant.physical_doc_verified && selectedApplicant.physical_doc_verified_by && (
                        <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          ✓ Diverifikasi oleh admin {selectedApplicant.physical_doc_verified_by}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        selectedApplicant.physical_doc_verified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                      }`}>
                        {selectedApplicant.physical_doc_verified ? "Lengkap & Valid" : "Belum Lengkap"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'kk', label: 'Fotokopi Kartu Keluarga (KK)' },
                      { id: 'ktp_ortu', label: 'Fotokopi KTP Orang Tua (Ayah & Ibu)' },
                      { id: 'akta', label: 'Akta Kelahiran asli & 1 Fotokopi' },
                      { id: 'ijazah', label: 'Fotokopi Ijazah / SKL legalisir' },
                      { id: 'pas_foto', label: 'Pas foto berwarna 3x4 (3 lembar)' },
                      { id: 'bukti_bayar', label: 'Bukti Pembayaran Pendaftaran' }
                    ].map(doc => {
                      const isChecked = selectedApplicant.physical_docs_checklist?.[doc.id] || false;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => {
                            const currentChecklist = selectedApplicant.physical_docs_checklist || {};
                            const newChecklist = { ...currentChecklist, [doc.id]: !isChecked };
                            onChecklistChange(selectedApplicant.id, newChecklist);
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isChecked 
                              ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50" 
                              : "bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-400/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            isChecked ? "bg-emerald-500 border-emerald-600 text-white" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          }`}>
                            {isChecked && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className={`text-xs font-bold leading-tight ${isChecked ? "text-emerald-900 dark:text-emerald-100" : "text-slate-600 dark:text-slate-400"}`}>
                            {doc.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedApplicant.bukti_bayar && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Foto / Bukti Transfer:</span>
                      <div
                        onClick={() => setIsFullscreenImageOpen(true)}
                        className="cursor-pointer inline-block border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:opacity-90 transition"
                      >
                        <Image
                          src={sanitizeSrc(selectedApplicant.bukti_bayar)}
                          alt="Bukti Transfer"
                          width={200}
                          height={150}
                          className="object-cover h-32 w-48"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "pernyataan" && (
              <div className="space-y-6">
                <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                  <FileCheck size={12} className="text-blue-500" /> Komitmen & Janji Kedisiplinan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tawuran / Perkelahian</span>
                    <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penyalahgunaan Narkoba</span>
                    <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.narkoba === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-2xl">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pelanggaran Hukum Lain</span>
                    <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                  </div>
                </div>
                <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
                  <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Calon Taruna Baru:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah</div>
                    <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah</div>
                    <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna</div>
                    <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun</div>
                    <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Action Controls Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-end shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-white/5 cursor-pointer"
              >
                Tutup
              </button>

              {selectedApplicant.status !== "Approved" && (
                <button
                  onClick={() => onVerify(selectedApplicant.id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5 cursor-pointer"
                >
                  Verifikasi Lolos
                </button>
              )}

              {selectedApplicant.status !== "Rejected" && (
                <button
                  onClick={() => onOpenReject(selectedApplicant.id)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] flex items-center gap-1.5 cursor-pointer"
                >
                  Tolak / Gugurkan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreenImageOpen && (
        <div 
          className="fixed inset-0 z-110 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsFullscreenImageOpen(false)}
        >
          <button
            onClick={() => setIsFullscreenImageOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center text-xl transition-all shadow font-bold cursor-pointer hover:scale-110"
          >
            ✕
          </button>
          <Image
            src={sanitizeSrc(selectedApplicant?.bukti_bayar || "/placeholder.png")}
            alt="Bukti Transfer Manual Fullscreen"
            width={800}
            height={600}
            className="max-w-full max-h-[90vh] object-contain rounded-xl select-none cursor-default"
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
