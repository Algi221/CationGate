"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Search, User, Users, MapPin, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import { usePPDB } from "@/context/PPDBContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "smktarunabhakti";
  const { publicApplicants } = usePPDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [activeRows, setActiveRows] = useState<Student[]>([]);
  const prevApplicantsRef = useRef<Student[]>([]);

  useEffect(() => {
    setActiveRows((currentRows) => {
      if (currentRows.length === 0 && publicApplicants.length > 0) {
        prevApplicantsRef.current = publicApplicants;
        return publicApplicants.map((a: Student) => ({ ...a, isNew: false, isFadingOut: false }));
      }

      const currentIds = publicApplicants.map((a: Student) => a.id);
      const removedApplicants = prevApplicantsRef.current.filter((a: Student) => !currentIds.includes(a.id));

      const updatedRows = [...currentRows];

      removedApplicants.forEach(removed => {
        const idx = updatedRows.findIndex(r => r.id === removed.id);
        if (idx > -1) {
          updatedRows[idx] = { ...updatedRows[idx], isFadingOut: true };
        } else {
          updatedRows.push({ ...removed, isFadingOut: true });
        }
      });

      publicApplicants.forEach((newItem: Student) => {
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

      prevApplicantsRef.current = publicApplicants;
      return updatedRows;
    });

    const timer = setTimeout(() => {
      setActiveRows(prev => 
        prev
          .filter(r => !r.isFadingOut)
          .map(r => ({ ...r, isNew: false }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [publicApplicants]);

  const displayApplicants = publicApplicants.length > 0 ? activeRows : [
    { id: 1, nama: "Ahmad Bintang Pratama", nisn: "0012345678", sekolahAsal: "SMPN 1 Depok", status: "Approved", isNew: false, isFadingOut: false },
    { id: 2, nama: "Putri Ayu Lestari", nisn: "0012345679", sekolahAsal: "SMPN 2 Depok", status: "Pending", isNew: false, isFadingOut: false }
  ];

  // ==========================================
  // TAMPILAN DETAIL KANDIDAT (CARD VIEW)
  // ==========================================
  if (selectedStudent) {
    return (
      <div className="w-full bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 md:p-14 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col min-h-[500px]">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full">
          
          {/* Top Bar / Back Button */}
          <button
            onClick={() => setSelectedStudent(null)}
            className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors w-fit tracking-widest uppercase mb-8"
          >
            <ChevronLeft size={14} strokeWidth={3} />
            Kembali ke Daftar
          </button>

          <div className="flex-1 flex flex-col md:flex-row gap-12 justify-between items-center">
            
            {/* Left Column: Info */}
            <div className="flex-1 flex flex-col justify-center w-full">
              
              {/* Pill Kandidat */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-fit mb-6">
                <User size={14} className="text-[#F3C625]" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  Kandidat Peserta Didik
                </span>
              </div>

              {/* Name */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-10 max-w-2xl break-words">
                {selectedStudent.nama}
              </h2>

              {/* Info Box: Asal Sekolah */}
              <div className="inline-flex items-center gap-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-fit min-w-[280px]">
                <GraduationCap size={22} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asal Sekolah</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase">
                    {selectedStudent.sekolah_asal || selectedStudent.sekolahAsal || "-"}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: QR & Status */}
            <div className="flex flex-col items-center md:items-end justify-center gap-6 w-full md:w-auto mt-8 md:mt-0">
              
              {/* QR Code Box */}
              <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                {(() => {
                  const verifyUrl = typeof window !== 'undefined'
                    ? `${window.location.origin}/${schoolSlug}/verify/${selectedStudent.id}`
                    : `https://cationgate.site/${schoolSlug}/verify/${selectedStudent.id}`;
                  return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(verifyUrl)}&color=0f172a`}
                      alt="Verification QR"
                      className="w-44 h-44 object-contain rounded-xl dark:invert opacity-90"
                      loading="lazy"
                    />
                  );
                })()}
              </div>

              {/* Info Box: Verifikasi Digital */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full min-w-[240px] text-center gap-1.5">
                <ShieldCheck size={20} className="text-[#F3C625] mb-1" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                  Verifikasi Digital
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  Sistem PPDB Terintegrasi
                </span>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="mt-14 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-50" />
                <div className="relative w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Live Encrypted Ticket
              </span>
            </div>

            <div className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              selectedStudent.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
              selectedStudent.status === 'Rejected' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' :
              'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
            }`}>
              {selectedStudent.status === 'Approved' ? 'Data Diverifikasi Panitia' :
               selectedStudent.status === 'Rejected' ? 'Pendaftaran Ditolak' :
               'Dalam Proses Verifikasi'}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN UTAMA DAFTAR TABEL
  // ==========================================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="flex flex-col h-full w-full relative z-10 bg-transparent animate-in fade-in duration-500">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
            Data Pendaftar PPDB
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Pantau status verifikasi calon peserta didik secara real-time.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
          <Users size={18} className="text-[#F3C625]" />
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Total Pendaftar: <span className="text-[#F3C625]">{displayTotal}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F3C625] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau NISN pendaftar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F3C625]/20 focus:border-[#F3C625] text-slate-800 dark:text-white transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select value={filterJurusan} onValueChange={(val) => setFilterJurusan(val)}>
            <SelectTrigger className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm focus:ring-[#F3C625]/20">
              <SelectValue placeholder="Semua Jurusan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
              <SelectItem value="Semua" className="font-medium rounded-lg">Semua Jurusan</SelectItem>
              {uniqueMajors.map((major: string) => (
                <SelectItem key={major} value={major} className="font-medium rounded-lg">{major}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[40%]">NAMA LENGKAP</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[25%] hidden sm:table-cell">ASAL SEKOLAH</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[20%]">STATUS</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[15%] text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      opacity: item.isFadingOut ? 0 : 1,
                      transform: item.isFadingOut ? "translateY(10px)" : "translateY(0)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                    className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 ${
                      item.isNew ? "bg-[#F3C625]/5 dark:bg-[#F3C625]/10 animate-[pulse_2s_ease-in-out_infinite]" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className={`text-sm md:text-[15px] font-bold ${item.status === 'Rejected' ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-white'}`}>
                        {item.nama}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 sm:hidden">{item.sekolah_asal || item.sekolahAsal || "-"}</div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400 opacity-50" />
                        {item.sekolah_asal || item.sekolahAsal || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                        item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20' :
                        item.status === 'Rejected' ? 'bg-rose-50 text-rose-600 ring-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20' :
                        'bg-amber-50 text-amber-600 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
                      }`}>
                        {item.status === 'Approved' ? 'TERVERIFIKASI' : item.status === 'Rejected' ? 'DITOLAK' : 'MENUNGGU'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedStudent(item); }}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-[#F3C625] dark:bg-slate-800 dark:hover:bg-[#F3C625] hover:text-slate-900 transition-all duration-300 px-4 py-2 rounded-xl"
                      >
                        Detail <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#F3C625]/20 rounded-full blur-xl animate-pulse" />
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm relative z-10">
                          <Search className="text-slate-400 w-8 h-8" />
                        </div>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        <p className="text-[15px] font-bold text-slate-700 dark:text-slate-200 mb-1">Data tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba sesuaikan kata kunci atau filter pencarian Anda.</p>
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
          <div className="py-4 px-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between mt-auto">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Menampilkan halaman <span className="text-slate-800 dark:text-white">{currentPage}</span> dari {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Halaman Sebelumnya"
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Halaman Berikutnya"
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}