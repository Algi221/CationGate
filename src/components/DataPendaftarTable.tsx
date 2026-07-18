"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Eye, X, CheckCircle, Clock, XCircle, User, MapPin, Phone, Mail, FileText, ChevronLeft, ChevronRight, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import Image from "next/image";

interface Student {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan1?: string;
  jenis_kelamin?: string;
  jenisKelamin?: string;
  status: string;
  whatsapp?: string;
  email?: string;
  alamat?: string;
  isNew?: boolean;
  isFadingOut?: boolean;
}

export default function DataPendaftarTable() {
  const { publicApplicants } = usePPDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [activeRows, setActiveRows] = useState<Student[]>([]);
  const prevApplicantsRef = useRef<Student[]>([]);

  useEffect(() => {
    
    if (activeRows.length === 0 && publicApplicants.length > 0) {
      setActiveRows(publicApplicants.map((a: any) => ({ ...a, isNew: false, isFadingOut: false })));
      prevApplicantsRef.current = publicApplicants;
      return;
    }

    const currentIds = publicApplicants.map((a: any) => a.id);

    const removedApplicants = prevApplicantsRef.current.filter((a: any) => !currentIds.includes(a.id));

    let updatedRows = [...activeRows];

    removedApplicants.forEach(removed => {
      const idx = updatedRows.findIndex(r => r.id === removed.id);
      if (idx > -1) {
        updatedRows[idx] = { ...updatedRows[idx], isFadingOut: true };
      } else {
        updatedRows.push({ ...removed, isFadingOut: true });
      }
    });

    publicApplicants.forEach((newItem: any) => {
      const idx = updatedRows.findIndex(r => r.id === newItem.id);
      if (idx > -1) {
        updatedRows[idx] = { 
          ...updatedRows[idx], 
          ...newItem, 
          isFadingOut: false 
        };
      } else {
        
        updatedRows.unshift({ ...newItem, isNew: true, isFadingOut: false });
      }
    });

    setActiveRows(updatedRows);
    prevApplicantsRef.current = publicApplicants;

    const timer = setTimeout(() => {
      setActiveRows(prev => 
        prev
          .filter(r => !r.isFadingOut)
          .map(r => ({ ...r, isNew: false }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [publicApplicants, activeRows.length]);

  if (selectedStudent) {
    const getGenderLabel = (g: string | null | undefined) => {
      if (!g) return "Laki-laki";
      const clean = g.toUpperCase().trim();
      if (clean === "L" || clean === "LAKI-LAKI" || clean === "LAKI_LAKI") return "Laki-laki";
      if (clean === "P" || clean === "PEREMPUAN") return "Perempuan";
      return g;
    };

    const getFormattedDate = (d: string | null | undefined) => {
      if (!d) return "14 Juni 2010";
      try {
        const date = new Date(d);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
      } catch (e) {
        return d;
      }
    };

    return (
      <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 ease-out text-left relative z-10">
        {/* Back navigation header inside mockup browser */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedStudent(null); }}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer relative z-50"
          >
            <ChevronLeft size={16} />
            <span>Kembali ke Daftar</span>
          </button>
        </div>

        {/* Premium Flexing Card */}
        <div className="flex-1 w-full flex flex-col items-center py-4 overflow-y-auto scrollbar-none">
          
          <div className="w-full max-w-xl md:max-w-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 border border-slate-200/80 dark:border-blue-500/30 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 shrink-0 mb-6 group hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] hover:border-blue-300 dark:hover:border-blue-500/60">
            <style>{`
              @keyframes scan {
                0%, 100% { top: 0%; opacity: 0; }
                10%, 90% { opacity: 1; }
                50% { top: 100%; opacity: 1; }
              }
              .scanner-line {
                animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}</style>

            {/* Subtle Ambient Orbs for Web Theme */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-1000" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-1000" />
            
            {/* Holographic grid lines - subtle */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-50 dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

            {/* Faint rotating background logo */}
            <img src="/logo_smktb.png" alt="" width={288} height={288} className="absolute -right-10 -bottom-10 w-72 h-72 object-contain opacity-[0.03] dark:opacity-[0.05] grayscale animate-[spin_80s_linear_infinite] pointer-events-none" />

            {/* Card Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/50 blur-md rounded-full animate-pulse" />
                  <img src="/logo_smktb.png" alt="Logo TB" width={40} height={40} className="w-10 h-10 object-contain relative z-10 drop-shadow-sm" />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] leading-none">SMK Taruna Bhakti</h4>
                  <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] block mt-1">PPDB ONLINE 2026</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end w-fit">
                  <div className="relative group/badge cursor-default">
                    <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/40 blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity rounded-full" />
                    <span className={`relative px-4 py-1.5 border text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 shadow-sm backdrop-blur-md ${
                      selectedStudent.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' :
                      selectedStudent.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-750 dark:text-rose-300 border-rose-200 dark:border-rose-500/30' :
                      'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
                    }`}>
                      {selectedStudent.status === 'Approved' ? <><CheckCircle size={12} className="text-emerald-500" /> TERVERIFIKASI</> : 
                       selectedStudent.status === 'Rejected' ? <><XCircle size={12} className="text-rose-500" /> DITOLAK</> : 
                       <><Clock size={12} className="text-blue-500 animate-spin-slow" /> MENUNGGU VERIFIKASI</>}
                    </span>
                  </div>
              </div>
            </div>

            {/* Card Grid Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Side: Student Info */}
              <div className="md:col-span-7 flex flex-col justify-center py-2 relative">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 shadow-sm">
                    <User size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.3em] bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/50">Calon Peserta Didik</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-slate-800 dark:via-blue-600 dark:to-indigo-500 dark:dark:from-white dark:dark:via-blue-100 dark:dark:to-indigo-300 uppercase tracking-tighter leading-tight break-words whitespace-normal mb-5 group-hover:scale-[1.02] origin-left transition-transform duration-300 cursor-default">
                  {selectedStudent.nama}
                </h2>
                
                {/* Sekolah Asal Details - Clean dynamic card */}
                <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-4 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 group/school w-fit shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/40">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20 group-hover/school:scale-110 group-hover/school:rotate-3 transition-transform duration-500">
                      <MapPin size={18} />
                   </div>
                   <div>
                      <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] block mb-1">Asal Sekolah</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider group-hover/school:text-blue-600 dark:group-hover/school:text-blue-400 transition-colors">
                        {selectedStudent.sekolah_asal || selectedStudent.sekolahAsal || "-"}
                      </span>
                   </div>
                </div>
              </div>

              {/* Right Side: QR Code Verification Badge (Clean Modern Scanner) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative p-2.5 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 group/qr hover:shadow-xl transition-all duration-500 hover:border-blue-400 dark:hover:border-blue-500/50">
                  
                  {/* Modern scanner corners */}
                  <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-4 border-l-4 border-blue-500 rounded-tl-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-4 border-r-4 border-blue-500 rounded-tr-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-4 border-l-4 border-blue-500 rounded-bl-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-4 border-r-4 border-blue-500 rounded-br-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300" />
                  
                  {/* Scanner line (animated laser) */}
                  <div className="absolute left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.5)] z-20 scanner-line pointer-events-none rounded-full hidden group-hover/qr:block" />
                  
                  {(() => {
                    const verifyUrl = typeof window !== 'undefined' 
                      ? `${window.location.origin}/verify/${selectedStudent.id}` 
                      : `http://localhost:3000/verify/${selectedStudent.id}`;
                    return (
                      <div className="bg-white p-1.5 rounded-2xl relative z-10" key={selectedStudent.id}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(verifyUrl)}&color=0f172a`} 
                          alt="Verification QR" 
                          className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-xl"
                          loading="lazy"
                        />
                      </div>
                    );
                  })()}
                </div>
                
                <div className="space-y-1.5 relative z-10 bg-slate-50 dark:bg-slate-800/80 px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 backdrop-blur-md group-hover:border-blue-200 dark:group-hover:border-blue-900/50 transition-colors">
                  <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase block animate-pulse">
                    VERIFIKASI DIGITAL
                  </span>
                  <span className="text-[8px] text-slate-500 dark:text-slate-400 font-extrabold uppercase block tracking-widest">SISTEM PPDB TERINTEGRASI</span>
                </div>
              </div>

            </div>

            {/* Card Footer */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute animate-ping opacity-75" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 relative" />
                </div>
                <span>LIVE ENCRYPTED TICKET</span>
              </div>
              <div className="flex items-center gap-2">
                  <span className="text-blue-700 dark:text-blue-400 font-black text-[9px] uppercase tracking-wider">
                    {selectedStudent.status === 'Approved' ? 'DATA TELAH DIVERIFIKASI PANITIA' : 
                     selectedStudent.status === 'Rejected' ? 'PENDAFTARAN DITOLAK' : 
                     'SEDANG DALAM PROSES VERIFIKASI'}
                  </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }

  const filteredData = activeRows.filter(item => {
    const matchName = 
      (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.nisn || "").includes(searchTerm);
    
    const matchJurusan = 
      filterJurusan === "Semua" || 
      (item.jurusan_1 || item.jurusan1 || "").includes(filterJurusan);
      
    return matchName && matchJurusan;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* Header Inside Mockup Box */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Calon Peserta Didik Baru</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Data pendaftar PPDB Online secara real-time.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 shrink-0">
          <User size={16} className="text-blue-500" />
          <div className="text-xs font-semibold">Total: <span className="font-bold text-sm">{publicApplicants.length}</span></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Cari Nama Pendaftar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Cari nama atau NISN pendaftar"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="filter-jurusan-select" className="sr-only">Filter berdasarkan jurusan</label>
          <select
            id="filter-jurusan-select"
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            aria-label="Filter berdasarkan jurusan"
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white transition-all"
          >
            <option value="Semua">Semua Jurusan</option>
            <option value="Rekayasa Perangkat Lunak">RPL</option>
            <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT</option>
            <option value="Desain Komunikasi Visual">DKV</option>
            <option value="Broadcasting & Perfilman">BC</option>
            <option value="Animasi">Animasi</option>
            <option value="Teknik Elektronika">TE</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Asal Sekolah</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      opacity: item.isFadingOut ? 0 : 1,
                      transform: item.isFadingOut ? "translateX(-50px)" : "translateX(0)",
                      transition: "all 0.5s ease"
                    }}
                    className={`hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors group ${
                      item.isNew ? "bg-emerald-500/10 dark:bg-emerald-500/5 animate-pulse" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className={`text-xs font-bold mb-0.5 ${item.status === 'Rejected' ? 'text-red-700 dark:text-red-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                        {item.nama}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.sekolah_asal || item.sekolahAsal}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        item.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20' :
                        item.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-750 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20' :
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20'
                      }`}>
                        {item.status === 'Approved' ? 'Terverifikasi' : item.status === 'Rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedStudent(item); }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors bg-blue-50 dark:bg-blue-900/40 px-2 py-1.5 rounded-md relative z-50 cursor-pointer"
                      >
                        Detail <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-xs font-medium">Tidak ada data pendaftar yang cocok dengan filter Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between mt-auto">
            <div className="text-[10px] font-semibold text-slate-500">
              Hal {currentPage} dari {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Halaman Sebelumnya"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200/50 dark:border-slate-700/50 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Halaman Berikutnya"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200/50 dark:border-slate-700/50 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
