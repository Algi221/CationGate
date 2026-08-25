"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  TableProperties, 
  FileSpreadsheet, 
  Download, 
  Eye, 
  Pencil, 
  Check, 
  X, 
  Trash2,
  CreditCard,
  Banknote,
  FileImage
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { Applicant } from "../types";
import { formatNoPendaftaran } from "./DetailModal";

interface ApplicantTableProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  majorFilter: string;
  setMajorFilter: (val: string) => void;
  gelombangFilter: string;
  setGelombangFilter: (val: string) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
  paymentFilter: string;
  setPaymentFilter: (val: string) => void;
  majorsList: string[];
  isSpreadsheetMode: boolean;
  setIsSpreadsheetMode: (val: boolean) => void;
  onExport: () => void;
  filteredApplicants: Applicant[];
  paginatedApplicants: Applicant[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  currentPage: number;
  onViewDetail: (applicant: Applicant) => void;
  onOpenEdit: (applicant: Applicant) => void;
  onVerify: (id: number) => void;
  onOpenReject: (id: number) => void;
  onDelete: (id: number) => void;
  onTogglePhysicalDoc: (applicant: Applicant) => Promise<void>;
  onOpenReceipt: (applicant: Applicant) => void;
  onConfirmPayment: (applicantId: number) => Promise<void>;
  activeCell: { row: number; col: number } | null;
  setActiveCell: (cell: { row: number; col: number } | null) => void;
}

export const ApplicantTable: React.FC<ApplicantTableProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  majorFilter,
  setMajorFilter,
  gelombangFilter,
  setGelombangFilter,
  genderFilter,
  setGenderFilter,
  paymentFilter,
  setPaymentFilter,
  majorsList,
  isSpreadsheetMode,
  setIsSpreadsheetMode,
  onExport,
  filteredApplicants,
  paginatedApplicants,
  page: _page,
  setPage,
  totalPages,
  currentPage,
  onViewDetail,
  onOpenEdit,
  onVerify,
  onOpenReject,
  onDelete,
  onTogglePhysicalDoc,
  onOpenReceipt,
  onConfirmPayment: _onConfirmPayment,
  activeCell,
  setActiveCell
}) => {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Date.now());
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingCashTime = (createdDate?: string) => {
    if (!createdDate) return { isExpired: false, text: "24 Jam" };
    try {
      const created = new Date(createdDate).getTime();
      if (isNaN(created)) return { isExpired: false, text: "24 Jam" };
      const now = currentTime ?? 0;
      if (!now) return { isExpired: false, text: "24 Jam" };
      const diffMs = 24 * 60 * 60 * 1000 - (now - created);
      if (diffMs <= 0) {
        return { isExpired: true, text: "Lewat 24 Jam" };
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { isExpired: false, text: `Sisa ${hours}j ${mins}m` };
    } catch (_) {
      return { isExpired: false, text: "24 Jam" };
    }
  };



  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xs transition-colors duration-300">
      {/* Search and Toolbar Header */}
      <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full xl:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari: nama, jurusan, sekolah, gelombang..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
          />
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {/* Status Filter */}
          <div className="w-full sm:w-auto min-w-32.5">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
              <SelectTrigger className="h-9.5 rounded-xl bg-slate-50 dark:bg-[#020617]/40 border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="Pending">Menunggu Verifikasi</SelectItem>
                <SelectItem value="Approved">Terverifikasi</SelectItem>
                <SelectItem value="Rejected">Ditolak / Gugur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="w-full sm:w-auto min-w-35">
            <Select value={paymentFilter} onValueChange={(val) => setPaymentFilter(val)}>
              <SelectTrigger className="h-9.5 rounded-xl bg-slate-50 dark:bg-[#020617]/40 border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <SelectValue placeholder="Semua Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Pembayaran</SelectItem>
                <SelectItem value="TU">Tunai</SelectItem>
                <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                <SelectItem value="LUNAS">Lunas</SelectItem>
                <SelectItem value="UNPAID">Belum Lunas</SelectItem>              </SelectContent>
            </Select>
          </div>

          {/* Major Filter */}
          <div className="w-full sm:w-auto min-w-35">
            <Select value={majorFilter} onValueChange={(val) => setMajorFilter(val)}>
              <SelectTrigger className="h-9.5 rounded-xl bg-slate-50 dark:bg-[#020617]/40 border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jurusan</SelectItem>
                {majorsList.map((m, idx) => (
                  <SelectItem key={idx} value={m}>
                    {m.replace("Teknik ", "").replace("Komunikasi ", "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gelombang Filter Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner">
            {[
              { id: "ALL", label: "Semua Gelombang" },
              { id: "Gelombang 1", label: "Gel. 1" },
              { id: "Gelombang 2", label: "Gel. 2" }
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGelombangFilter(g.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  gelombangFilter === g.id
                    ? "bg-black text-white border-black dark:bg-black dark:border-slate-500 shadow-xs"
                    : "bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200/70 dark:hover:bg-slate-800"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Gender Segmented Switch (Semua, Cowo [Biru], Cewe [Pink]) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setGenderFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                genderFilter === "ALL"
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs"
                  : "bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/70 dark:hover:bg-slate-800"
              }`}
              title="Tampilkan Semua Gender"
            >
              Semua
            </button>

            <button
              type="button"
              onClick={() => setGenderFilter("L")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                genderFilter === "L"
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-blue-50/80 text-blue-700 hover:bg-blue-100 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50"
              }`}
              title="Filter Calon Siswa Laki-Laki (Cowo)"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="4" r="2.2" />
                <path d="M8.5 8.5C8.5 7.67 9.17 7 10 7h4c.83 0 1.5.67 1.5 1.5V14h-1.5v7h-4v-7H8.5V8.5z" />
              </svg>
              <span>Laki-Laki</span>
            </button>

            <button
              type="button"
              onClick={() => setGenderFilter("P")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                genderFilter === "P"
                  ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                  : "bg-pink-50/80 text-pink-700 hover:bg-pink-100 border-pink-200/80 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/50"
              }`}
              title="Filter Calon Siswa Perempuan (Cewe)"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="4" r="2.2" />
                <path d="M12 7.5L7.5 15h3v6h3v-6h3L12 7.5z" />
              </svg>
              <span>Perempuan</span>
            </button>
          </div>

          {/* Toggle View: Standard Table vs Excel Spreadsheet Grid */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800/50 shrink-0 shadow-inner">
            <button
              onClick={() => setIsSpreadsheetMode(false)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                !isSpreadsheetMode
                  ? "bg-white dark:bg-[#0f172a] text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800/40"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
              title="Tampilan Tabel Standard"
            >
              <TableProperties size={14} />
              <span className="hidden sm:inline">Standard</span>
            </button>
            <button
              onClick={() => setIsSpreadsheetMode(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isSpreadsheetMode
                  ? "bg-white dark:bg-[#0f172a] text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800/40"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
              title="Tampilan Excel Sheet Mode"
            >
              <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline text-emerald-500 font-bold">Excel Preview</span>
            </button>
          </div>

          {/* Export button */}
          <button
            onClick={onExport}
            disabled={filteredApplicants.length === 0}
            className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Download size={14} />
            <span>Export XLS</span>
          </button>
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl backdrop-blur-md overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        {!isSpreadsheetMode ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50">
                  <th className="py-4 px-6 pl-8">No. Pendaftaran</th>
                  <th className="py-4 px-6">Nama Calon Siswa</th>
                  <th className="py-4 px-6 text-center w-20">L/P</th>
                  <th className="py-4 px-6">Asal Sekolah</th>
                  <th className="py-4 px-6">Pilihan Jurusan Utama</th>
                  <th className="py-4 px-6 text-center">Status Berkas</th>
                  <th className="py-4 px-6 text-center">Biaya Formulir</th>
                  <th className="py-4 px-6 text-center">Berkas Fisik</th>
                  <th className="py-4 px-6 text-right pr-8">Aksi Administrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {paginatedApplicants.map((a: Applicant, idx: number) => {
                  const isCashTU = 
                    a.metode_pembayaran === "Bayar Tunai di TU (Cash)" ||
                    a.metode_pembayaran === "Tunai di TU" ||
                    a.metode_pembayaran === "tu";
                  const isLunas = a.status_pembayaran === "LUNAS" || a.status_pembayaran === "PAID" || a.status === "Approved";
                  const cashTime = getRemainingCashTime(a.tgl_daftar || a.createdAt);

                  return (
                    <tr
                      key={a.id || idx}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group cursor-pointer"
                      onDoubleClick={() => onViewDetail(a)}
                    >
                      <td className="py-4 px-6 pl-8">
                        <div className="font-extrabold text-blue-600 dark:text-blue-400 text-sm font-mono">
                          {a.registration_no || formatNoPendaftaran(a.periode, a.id)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-slate-800 dark:text-white text-sm">{a.nama}</div>
                        <span className="text-[9px] text-slate-400 font-bold tracking-wide uppercase mt-0.5 block">
                          Daftar: {(a.tgl_daftar || a.createdAt) ? new Date(a.tgl_daftar || a.createdAt).toLocaleDateString("id-ID") : "-"} · {a.gelombang || "Gelombang 1"} · Lahir: {a.tempat_lahir || a.tempatLahir || "-"}, {a.tgl_lahir || a.tglLahir || "-"}
                          {a.status === "Approved" && a.verified_by && ` · Diverifikasi: ${a.verified_by}`}
                          {a.status === "Rejected" && a.rejected_by && ` · Digugurkan: ${a.rejected_by}`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {(a.jenis_kelamin || a.jenisKelamin) ? (
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                            (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
                              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                          }`}>
                            {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-semibold">
                        <div>{a.pindahan_dari || a.sekolah_asal || a.sekolahAsal}</div>
                        {a.alasan_pindah && (
                          <span
                            className="text-[9px] text-slate-400 font-normal block truncate max-w-55"
                            title={a.alasan_pindah}
                          >
                            {a.alasan_pindah}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50/70 dark:bg-blue-950/40 text-blue-550 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 font-extrabold text-[9px] uppercase tracking-wide">
                          {a.jurusan_1 || a.jurusan1}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                            a.status === "Approved"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                              : a.status === "Rejected"
                                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                                : "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                        </span>
                      </td>

                      {/* Biaya Formulir Column */}
                      <td className="py-4 px-6 text-center">
                        {isLunas ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 shadow-2xs">
                            LUNAS {isCashTU ? "(Tunai)" : "(Transfer)"}
                          </span>
                        ) : isCashTU ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                              cashTime.isExpired 
                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300"
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300"
                            }`}>
                              <Banknote size={11} />
                              <span>{cashTime.isExpired ? "⌛ Expired (24j)" : `🏢 ${cashTime.text}`}</span>
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenReceipt(a);
                              }}
                              className="text-[9px] font-black text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              Loket Kasir TU
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300">
                              <CreditCard size={11} />
                              <span>Transfer</span>
                            </span>
                            {a.bukti_bayar ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenReceipt(a);
                                }}
                                className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <FileImage size={11} /> Lihat Struk
                              </button>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-bold">Belum Ada Struk</span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePhysicalDoc(a);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-wider cursor-pointer transition-all ${
                            a.physical_doc_verified
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-400 hover:bg-emerald-100"
                              : "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400 hover:bg-rose-100"
                          }`}
                          title={a.physical_doc_verified ? `Diverifikasi oleh ${a.physical_doc_verified_by || 'Admin'} - Klik untuk batalkan` : "Klik jika Berkas Fisik siswa sudah diterima di sekolah"}
                        >
                          {a.physical_doc_verified ? "Diterima" : "Belum Ada"}
                        </button>
                      </td>
                    <td className="py-4 px-6 text-right pr-8 shrink-0">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onViewDetail(a)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 cursor-pointer"
                          title="Lihat Detail Form"
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          onClick={() => onOpenEdit(a)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl transition-all border border-blue-200/50 dark:border-blue-500/20 cursor-pointer"
                          title="Edit Data Pendaftar"
                        >
                          <Pencil size={13} />
                        </button>

                        {a.status !== "Approved" && (
                          <button
                            onClick={() => onVerify(a.id)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl transition-all border border-emerald-200 dark:border-emerald-500/20 cursor-pointer"
                            title="Setujui & Verifikasi"
                          >
                            <Check size={13} />
                          </button>
                        )}

                        {a.status !== "Rejected" && (
                          <button
                            onClick={() => onOpenReject(a.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-all border border-rose-200 dark:border-rose-500/20 cursor-pointer"
                            title="Tolak Pendaftaran"
                          >
                            <X size={13} />
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: 'Konfirmasi',
                              text: "Apakah Anda yakin ingin memindahkan data pendaftar ini ke tempat sampah?",
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Ya',
                              cancelButtonText: 'Batal'
                            });
                            if (result.isConfirmed) {
                              onDelete(a.id);
                            }
                          }}
                          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 hover:border-rose-500/25 cursor-pointer"
                          title="Pindahkan ke Tempat Sampah"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                      Tidak ditemukan data calon siswa yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Spreadsheet Excel Mode */
          <div className="overflow-x-auto select-none">
            <table className="w-full text-left text-xs font-mono border-collapse border border-slate-200 dark:border-slate-800">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-black">
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800 text-center w-10 bg-slate-200/60 dark:bg-slate-800">#</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">REG_NO</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">NISN</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">NAMA_LENGKAP</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">GENDER</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">ASAL_SEKOLAH</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">JURUSAN</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">STATUS</th>
                  <th className="p-2">WHATSAPP</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplicants.map((a: Applicant, rIdx: number) => (
                  <tr 
                    key={a.id}
                    onDoubleClick={() => onViewDetail(a)}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer border-b border-slate-100 dark:border-slate-800/50"
                  >
                    <td className="p-2 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 text-[10px]">
                      {(currentPage - 1) * 10 + rIdx + 1}
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 0 })}
                      className={`p-2 border-r border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold ${
                        activeCell?.row === rIdx && activeCell?.col === 0 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      {a.registration_no || formatNoPendaftaran(a.periode, a.id)}
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 1 })}
                      className={`p-2 border-r border-slate-100 dark:border-slate-800 ${
                        activeCell?.row === rIdx && activeCell?.col === 1 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      {a.nisn}
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 2 })}
                      className={`p-2 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white ${
                        activeCell?.row === rIdx && activeCell?.col === 2 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      {a.nama}
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 3 })}
                      className={`p-2 border-r border-slate-100 dark:border-slate-800 text-center ${
                        activeCell?.row === rIdx && activeCell?.col === 3 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 4 })}
                      className={`p-2 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 ${
                        activeCell?.row === rIdx && activeCell?.col === 4 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      {a.sekolah_asal || a.sekolahAsal || "-"}
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 5 })}
                      className={`p-2 border-r border-slate-100 dark:border-slate-800 ${
                        activeCell?.row === rIdx && activeCell?.col === 5 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      {a.jurusan_1 || a.jurusan1 || "-"}
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 6 })}
                      className={`p-2 border-r border-slate-100 dark:border-slate-800 text-xs font-bold ${
                        activeCell?.row === rIdx && activeCell?.col === 6 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      <span className={a.status === "Approved" ? "text-emerald-500 font-bold" : a.status === "Rejected" ? "text-rose-500 font-bold" : "text-amber-500 font-bold"}>
                        {a.status || "Pending"}
                      </span>
                    </td>
                    <td 
                      onClick={() => setActiveCell({ row: rIdx, col: 7 })}
                      className={`p-2 ${
                        activeCell?.row === rIdx && activeCell?.col === 7 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
                      }`}
                    >
                      {a.whatsapp || "-"}
                    </td>
                  </tr>
                ))}
                {paginatedApplicants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 font-medium text-xs">
                      Belum ada calon siswa yang mendaftar pada kriteria/tab ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Toolbar */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/20">
          <div>
            Menampilkan <span className="text-slate-800 dark:text-white font-extrabold">{paginatedApplicants.length}</span> dari{" "}
            <span className="text-slate-800 dark:text-white font-extrabold">{filteredApplicants.length}</span> pendaftar
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1.5 font-mono text-slate-700 dark:text-slate-300">
              Halaman {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
