"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Eye, X, CheckCircle, Clock, XCircle, User, Users, MapPin, Phone, Mail, FileText, ChevronLeft, ChevronRight, ArrowRight, Calendar, Sparkles } from "lucide-react";
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

  // Inject dummy data if empty so the UI doesn't look barren
  const displayApplicants = publicApplicants.length > 0 ? activeRows : [
    { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0012345678", sekolahAsal: "SMPN 1 Depok", status: "Approved", isNew: false, isFadingOut: false },
    { id: 2, nama: "Putri Ayu Lestari", nisn: "0012345679", sekolahAsal: "SMPN 2 Depok", status: "Pending", isNew: false, isFadingOut: false }
  ];

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
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 ease-out text-left relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-sm p-8 sm:p-12 overflow-hidden">
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      
      {/* Back navigation header */}
      <div className="flex items-center justify-start pb-8 relative z-10">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedStudent(null); }}
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={3} />
          <span>KEMBALI KE DAFTAR</span>
        </button>
      </div>

      <div className="flex-1 w-full flex flex-col justify-center relative z-10">
        
        {/* Card Grid Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Student Info */}
          <div className="flex flex-col justify-center">
            {/* Calon Peserta Didik Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full py-1.5 px-1.5 pr-5 w-fit mb-6 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center shrink-0">
                <User size={14} className="text-blue-500" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em]">
                Calon Peserta Didik
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-[1.1] mb-12 max-w-sm break-words">
              {selectedStudent.nama}
            </h2>
            
            {/* Sekolah Asal Details */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 w-fit shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/30">
                  <MapPin size={20} />
                </div>
                <div className="pr-6">
                  <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] block mb-1">Asal Sekolah</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">
                    {selectedStudent.sekolah_asal || selectedStudent.sekolahAsal || "-"}
                  </span>
                </div>
            </div>
          </div>

          {/* Right Side: QR Code Verification Badge */}
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-700">
              {(() => {
                const verifyUrl = typeof window !== 'undefined' 
                  ? `${window.location.origin}/verify/${selectedStudent.id}` 
                  : `http://localhost:3000/verify/${selectedStudent.id}`;
                return (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(verifyUrl)}&color=0f172a`} 
                    alt="Verification QR" 
                    className="w-48 h-48 object-contain rounded-xl"
                    loading="lazy"
                  />
                );
              })()}
            </div>
            
            <div className="flex flex-col items-center bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full px-8 py-3 shadow-sm">
              <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 tracking-[0.3em] uppercase block mb-1">
                VERIFIKASI DIGITAL
              </span>
              <span className="text-[8px] text-slate-500 dark:text-slate-400 font-extrabold uppercase block tracking-widest">SISTEM PPDB TERINTEGRASI</span>
            </div>
          </div>

        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold tracking-[0.2em] relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 absolute animate-ping opacity-30" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>
          <span className="text-slate-600 dark:text-slate-400">LIVE ENCRYPTED TICKET</span>
        </div>
        <div className="flex items-center">
            <span className="text-blue-600 dark:text-blue-500 font-black text-[9px] uppercase tracking-[0.2em]">
              {selectedStudent.status === 'Approved' ? 'DATA TELAH DIVERIFIKASI PANITIA' : 
                selectedStudent.status === 'Rejected' ? 'PENDAFTARAN DITOLAK' : 
                'SEDANG DALAM PROSES VERIFIKASI'}
            </span>
        </div>
      </div>

    </div>
    );
  }

  const uniqueMajors = Array.from(new Set(displayApplicants.map((item: any) => item.jurusan_1 || item.jurusan1).filter(Boolean)));
  const filteredData = displayApplicants.filter(item => {
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

  const displayTotal = publicApplicants.length > 0 ? publicApplicants.length : displayApplicants.length;

  return (
    <div className="flex flex-col h-full w-full relative z-10 bg-transparent">
      
      {/* Header Inside Mockup Box */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-black text-slate-800 dark:text-white mb-1">Calon Peserta Didik Baru</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Data pendaftar PPDB Online secara real-time.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-transparent border border-blue-200 dark:border-blue-800/50 shadow-sm text-blue-500 dark:text-blue-400 shrink-0">
          <User size={16} className="text-blue-500" />
          <div className="text-sm font-bold">Total: {displayTotal}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari Nama Pendaftar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Cari nama atau NISN pendaftar"
            className="w-full bg-white dark:bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="filter-jurusan-select" className="sr-only">Filter berdasarkan jurusan</label>
          <select
            id="filter-jurusan-select"
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            aria-label="Filter berdasarkan jurusan"
            className="bg-white dark:bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-white transition-all cursor-pointer min-w-[180px]"
          >
            <option value="Semua">Semua Jurusan</option>
            {uniqueMajors.map((major: any) => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[35%]">NAMA LENGKAP</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[25%]">ASAL SEKOLAH</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[20%]">STATUS</th>
                <th className="px-4 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[20%]">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      opacity: item.isFadingOut ? 0 : 1,
                      transform: item.isFadingOut ? "translateX(-20px)" : "translateX(0)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300 ${
                      item.isNew ? "bg-emerald-50 dark:bg-emerald-900/10 animate-[pulse_2s_ease-in-out_infinite]" : ""
                    }`}
                  >
                    <td className="px-4 py-5">
                      <div className={`text-[15px] font-bold ${item.status === 'Rejected' ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-white'}`}>
                        {item.nama}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="text-[14px] font-semibold text-slate-600 dark:text-slate-300">{item.sekolah_asal || item.sekolahAsal || "-"}</div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Approved' ? 'bg-transparent text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 dark:border-emerald-800' :
                        item.status === 'Rejected' ? 'bg-transparent text-rose-500 dark:text-rose-400 border border-rose-500/40 dark:border-rose-800' :
                        'bg-transparent text-blue-500 dark:text-blue-400 border border-blue-500/40 dark:border-blue-800'
                      }`}>
                        {item.status === 'Approved' ? 'TERVERIFIKASI' : item.status === 'Rejected' ? 'DITOLAK' : 'MENUNGGU'}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedStudent(item); }}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-500 dark:text-blue-300 hover:text-blue-600 transition-colors bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/80 px-3 py-1.5 rounded-md relative z-50 cursor-pointer"
                      >
                        Detail <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl animate-pulse" />
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md relative z-10">
                          <Users className="text-slate-400 w-8 h-8 opacity-75" />
                        </div>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Belum ada data pendaftar</p>
                        <p className="text-xs font-medium">Jadilah yang pertama mendaftar atau sesuaikan pencarian Anda.</p>
                      </div>
                    </div>
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
