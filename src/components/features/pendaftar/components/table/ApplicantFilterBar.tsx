"use client";

import React from "react";
import { Search, TableProperties, FileSpreadsheet, Download, Sparkles } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Applicant } from "../../types";

interface ApplicantFilterBarProps {
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
  onOpenDummyModal?: () => void;
  filteredApplicants: Applicant[];
}

export const ApplicantFilterBar: React.FC<ApplicantFilterBarProps> = ({
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
  onOpenDummyModal,
  filteredApplicants
}) => {
  return (
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
              <SelectItem value="UNPAID">Belum Lunas</SelectItem>
            </SelectContent>
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

        {/* Gender Segmented Switch */}
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
            type="button"
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
            type="button"
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

        {/* Tambah Siswa Dummy Button */}
        {onOpenDummyModal && (
          <button
            type="button"
            onClick={onOpenDummyModal}
            className="px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
            title="Tambah calon siswa dummy untuk testing berdasarkan jurusan sekolah"
          >
            <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Tambah Siswa Dummy</span>
            <span className="sm:hidden">Dummy</span>
          </button>
        )}

        {/* Export button */}
        <button
          type="button"
          onClick={onExport}
          disabled={filteredApplicants.length === 0}
          className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Download size={14} />
          <span>Export XLS</span>
        </button>
      </div>
    </div>
  );
};
