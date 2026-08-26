"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, MapPin, User, ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { useSchoolHref } from "@/hooks/useSchoolHref";

interface VerificationData {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal: string;
  jenis_kelamin: string;
  tgl_lahir: string;
  status: string;
  tgl_daftar: string;
  jurusan_1: string;
  periode: string;
  alasan_ditolak?: string;
}

const getMajorLogoUrl = (jurusan: string | null | undefined): string => {
  if (!jurusan) return "/logo_smktb.png";
  const upper = jurusan.toUpperCase().trim();
  if (upper.includes("RPL") || upper.includes("REKAYASA PERANGKAT LUNAK") || upper.includes("PPLG") || upper.includes("PENGEMBANGAN PERANGKAT LUNAK")) {
    return "/assets/jurusan/pplg.png";
  }
  if (upper.includes("TJKT") || upper.includes("TEKNIK JARINGAN KOMPUTER") || upper.includes("TKJ")) {
    return "/assets/jurusan/tjkt.png";
  }
  if (upper.includes("DKV") || upper.includes("DESAIN KOMUNIKASI VISUAL")) {
    return "/assets/jurusan/dkv.png";
  }
  if (upper.includes("BC") || upper.includes("BROADCASTING") || upper.includes("PRODUKSI FILM")) {
    return "/assets/jurusan/bc.png";
  }
  if (upper.includes("ANM") || upper.includes("ANIMASI")) {
    return "/assets/jurusan/animasi.png";
  }
  if (upper.includes("TE") || upper.includes("TEKNIK ELEKTRONIKA") || upper.includes("TEI")) {
    return "/assets/jurusan/te.png";
  }
  return "/logo_smktb.png";
};

export default function VerificationPage() {
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "smk-taruna-bhakti";
  const id = params?.id;
  const { href } = useSchoolHref();

  const [inputNik, setInputNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VerificationData | null>(null);
  const [waAdmin, _setWaAdmin] = useState<string>("6281292244456");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNik.trim() || inputNik.trim().length < 16) {
      setError("Masukkan 16 digit NIK pendaftar yang valid.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/applicants/verify/${id}?school_slug=${encodeURIComponent(schoolSlug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik: inputNik.trim() }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.message || "Data calon siswa tidak ditemukan atau NIK tidak sesuai.");
      }
    } catch (err) {
      console.error("Fetch verification error:", err);
      setError("Gagal menghubungi server verifikasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-md w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-4xl p-8 shadow-2xl space-y-6 relative z-10 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto border border-blue-100 dark:border-blue-900/30">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-slate-800 dark:text-white">Verifikasi Status Pendaftaran</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-2">
              Masukkan NIK calon siswa untuk melihat status pendaftaran secara aman.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Nomor Induk Kependudukan (NIK)
              </label>
              <input
                type="text"
                maxLength={16}
                value={inputNik}
                onChange={(e) => setInputNik(e.target.value.replace(/\D/g, ""))}
                placeholder="Contoh: 3276012345670001"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {loading ? "Memverifikasi..." : "Verifikasi Status"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={href("/")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={14} />
              Kembali ke Portal Sekolah
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl md:max-w-2xl w-full space-y-6 relative z-10 duration-500">

        {/* Premium flex ticket card display (same layout as DataPendaftarTable detail but read-only) */}
        <div className="w-full bg-linear-to-br from-white via-slate-50/50 to-blue-50/20 dark:from-slate-950 dark:via-slate-900/90 dark:to-indigo-950/30 border border-slate-200 dark:border-blue-500/20 rounded-4xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
          {/* Perforated Ticket Notches */}
          <div className="hidden md:block absolute -top-3.5 left-[66.67%] -translate-x-1/2 w-7 h-7 rounded-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-900 z-20 transition-colors" />
          <div className="hidden md:block absolute -bottom-3.5 left-[66.67%] -translate-x-1/2 w-7 h-7 rounded-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-900 z-20 transition-colors" />

          {/* Ticket Top bar */}
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4 mb-4 transition-colors">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo_smktb.png" alt="Logo TB" className="w-9 h-9 object-contain" />
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none">SMK Taruna Bhakti</h4>
                <p className="text-[10px] text-slate-400 font-bold tracking-tight">Terakreditasi &quot;A&quot; Unggul</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/40 px-3 py-1 rounded-full uppercase tracking-wider">
                Resmi
              </span>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2">

            {/* Left Side: Student Main Info */}
            <div className="md:col-span-7 flex flex-col justify-center py-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
                  <User size={14} className="text-blue-700 dark:text-blue-400" />
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Calon Peserta Didik Baru</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-white dark:via-blue-100 dark:to-indigo-200 uppercase tracking-tight leading-tight truncate mb-4">
                {data.nama}
              </h2>

              {/* Sekolah Asal Details - Clean & borderless */}
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1e293b]/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <MapPin size={16} />
                 </div>
                 <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-0.5">Asal Sekolah</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                      {data.sekolah_asal || "-"}
                    </span>
                 </div>
              </div>
            </div>

            {/* Right Side: Major selection */}
            <div className="md:col-span-5 flex flex-col justify-center h-full">
              <div className="relative w-full h-full min-h-35 bg-linear-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/80 dark:to-indigo-950/40 border border-slate-200 dark:border-blue-500/20 rounded-3xl p-6 transition-all flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400/50 dark:hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10">
                {/* Decorative background circle */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/15 transition-colors duration-500" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-colors duration-500" />

                <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-[#0f172a] flex items-center justify-center mb-4 relative z-10 border border-slate-200 dark:border-blue-500/25 p-1 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getMajorLogoUrl(data.jurusan_1)}
                    alt="Logo Jurusan"
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "/logo_smktb.png";
                    }}
                  />
                </div>

                <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase block mb-2 relative z-10 text-center">Program Keahlian</span>
                <span className="text-base md:text-lg font-black text-slate-800 dark:text-white uppercase block tracking-wider leading-tight text-center relative z-10">
                  {data.jurusan_1}
                </span>
                <div className="mt-4 inline-block px-4 py-1.5 bg-white dark:bg-[#0f172a] rounded-full border border-slate-200 dark:border-white/10 relative z-10 shadow-sm">
                  <span className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">SMK Taruna Bhakti</span>
                </div>
              </div>
            </div>

          </div>

          {/* Ticket Footer */}
          <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] font-bold text-slate-400 dark:text-slate-400 tracking-wider transition-colors">
            <div></div>
            <span className="text-slate-500 dark:text-slate-400 font-black">TERVERIFIKASI SISTEM PPDB</span>
          </div>

        </div>

        {/* Verification Alert Panel based on Status */}
        {data.status === "Approved" ? (
          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-[28px] p-6 shadow-lg text-center flex flex-col items-center gap-3 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 border border-emerald-400 dark:border-emerald-600">
              <CheckCircle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-emerald-700 dark:text-emerald-400 text-sm font-black uppercase tracking-wider">Pendaftaran Terverifikasi Sah</h3>
              <p className="text-slate-700 dark:text-slate-400 text-xs md:text-sm font-bold leading-relaxed max-w-md mx-auto">
                Selamat, <span className="underline font-black text-slate-800 dark:text-white uppercase tracking-wider">{data.nama}</span>! Data pendaftaran Anda telah secara resmi diverifikasi sah oleh Panitia PPDB SMK Taruna Bhakti.
              </p>
            </div>
          </div>
        ) : data.status === "Rejected" ? (
          <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-[28px] p-6 shadow-lg text-center flex flex-col items-center gap-3 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0 border border-rose-400 dark:border-rose-600">
              <XCircle size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-rose-750 dark:text-rose-400 text-sm font-black uppercase tracking-wider">Pendaftaran Gugur / Ditolak</h3>
              <p className="text-slate-700 dark:text-slate-400 text-xs md:text-sm font-bold leading-relaxed max-w-md mx-auto">
                Mohon maaf, pendaftaran atas nama <span className="font-black text-rose-600 dark:text-rose-450 uppercase tracking-wider">{data.nama}</span> dinyatakan <strong className="text-rose-600 dark:text-rose-400">ditolak / tidak memenuhi syarat</strong>.
              </p>
              {data.alasan_ditolak && (
                <div className="mt-3 p-4 bg-white/80 dark:bg-slate-900 border border-rose-200 dark:border-rose-950/20 rounded-2xl text-left max-w-md mx-auto">
                  <span className="text-[9px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-wider block mb-1">Alasan Penolakan:</span>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-relaxed">{data.alasan_ditolak}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-[28px] p-6 shadow-lg text-center flex flex-col items-center gap-3 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400 dark:border-blue-600">
              <Clock size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-blue-750 dark:text-blue-400 text-sm font-black uppercase tracking-wider">Menunggu Proses Verifikasi</h3>
              <p className="text-slate-700 dark:text-slate-355 text-xs md:text-sm font-bold leading-relaxed max-w-md mx-auto">
                Pendaftaran atas nama <span className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{data.nama}</span> sedang diproses dan menunggu verifikasi berkas oleh Panitia PPDB SMK Taruna Bhakti.
              </p>
            </div>
          </div>
        )}

        {/* Footer links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            href={href("/")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all shadow-sm w-full sm:w-auto"
          >
            <ArrowLeft size={14} />
            Ke Halaman Utama
          </Link>

          <a
            href={`https://wa.me/${waAdmin.replace(/\D/g, '')}?text=Halo%20Admin%20PPDB.%20Saya%20ingin%20bertanya%20terkait%20status%20pendaftaran%20atas%20nama%20${encodeURIComponent(data.nama)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white text-xs font-black uppercase tracking-wider text-[#075E54] dark:text-[#25D366] transition-all shadow-sm w-full sm:w-auto"
          >
            <MessageCircle size={14} />
            Hubungi Admin WA
          </a>
        </div>

      </div>
    </div>
  );
}
