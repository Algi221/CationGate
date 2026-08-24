"use client";

import React, { Suspense } from "react";
import { 
  Search, 
  Download, 
  GraduationCap, 
  Calendar, 
  Users, 
  BookOpen, 
  Upload, 
  FileSpreadsheet,
  Plus
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useSiswaAktifState } from "@/components/features/siswa-aktif/hooks/useSiswaAktifState";
import { PeriodAccordion } from "@/components/features/siswa-aktif/components/PeriodAccordion";
import { DetailStudentModal } from "@/components/features/siswa-aktif/components/DetailStudentModal";
import { EditStudentModal } from "@/components/features/siswa-aktif/components/EditStudentModal";
import { AddPeriodModal } from "@/components/features/siswa-aktif/components/AddPeriodModal";
import { ImportExcelModal } from "@/components/features/siswa-aktif/components/ImportExcelModal";
import { downloadActiveStudentsTemplate } from "@/components/features/siswa-aktif/utils/excelHelper";

function ActiveStudentsDirectoryContent() {
  const {
    filteredApplicants,
    searchTerm,
    setSearchTerm,
    majorFilter,
    setMajorFilter,
    classFilter,
    setClassFilter,
    genderFilter,
    setGenderFilter,
    expandedPeriods,
    togglePeriod,
    sortedPeriods,
    groupedByPeriod,
    stats,
    classStats,
    uniqueClasses,
    nipdMap,
    isImportModalOpen,
    setIsImportModalOpen,
    isAddPeriodModalOpen,
    setIsAddPeriodModalOpen,
    newPeriodValue,
    setNewPeriodValue,
    getNextPeriod,
    handleAddPeriod,
    selectedApplicant,
    setSelectedApplicant,
    handleViewDetail,
    handleBatalVerifikasi,
    editApplicant,
    setEditApplicant,
    editForm,
    setEditForm,
    isSaving,
    handleSaveEdit,
    handleExportAll,
    handleExportPeriod,
    fetchActiveStudents,
    addToast
  } = useSiswaAktifState();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Executive Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {/* Card 1: Total Siswa Aktif */}
        <div className="group relative bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-600 opacity-90 group-hover:h-1.5 transition-all" />
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Siswa Aktif
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {stats.total}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Siswa</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              Gabungan seluruh angkatan terverifikasi
            </p>
          </div>
        </div>

        {/* Card 2: Periode Terkini */}
        <div className="group relative bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500 opacity-90 group-hover:h-1.5 transition-all" />
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Periode Terkini (2026–2027)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-450 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Calendar size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {stats.currentBatch}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Siswa</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Calon angkatan tahun ini
            </p>
          </div>
        </div>

        {/* Card 3: Konsentrasi Populer */}
        <div className="group relative bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-orange-500 opacity-90 group-hover:h-1.5 transition-all" />
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Konsentrasi Populer
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
          </div>
          <div>
            <div className="min-h-9 flex items-center">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1" title={stats.popular}>
                {stats.popular}
              </h3>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              Kompetensi keahlian pendaftar terbanyak
            </p>
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-5 shadow-xs flex flex-col xl:flex-row gap-3.5 items-stretch xl:items-center justify-between transition-colors duration-300">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 flex-1 min-w-0">
          {/* Universal Search Input */}
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Cari siswa, NISN, asal sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9.5 pr-3.5 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Major/Prodi selection dropdown */}
          <div className="w-full sm:w-auto min-w-37.5">
            <Select value={majorFilter} onValueChange={(val) => setMajorFilter(val)}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200">
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jurusan</SelectItem>
                <SelectItem value="Rekayasa Perangkat Lunak">RPL / PPLG</SelectItem>
                <SelectItem value="Teknik Jaringan Komputer & Telekomunikasi">TJKT / TKJ</SelectItem>
                <SelectItem value="Desain Komunikasi Visual">DKV</SelectItem>
                <SelectItem value="Animasi">Animasi</SelectItem>
                <SelectItem value="Broadcasting & Perfilman">Broadcasting / BCF</SelectItem>
                <SelectItem value="Teknik Elektronika">Teknik Elektronika / TE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Class selection dropdown */}
          <div className="w-full sm:w-auto min-w-35">
            <Select value={classFilter} onValueChange={(val) => setClassFilter(val)}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Kelas</SelectItem>
                {uniqueClasses.map((kls) => (
                  <SelectItem key={kls} value={kls}>
                    {kls} (L: {classStats[kls]?.L || 0}, P: {classStats[kls]?.P || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender selection dropdown */}
          <div className="w-full sm:w-auto min-w-32.5">
            <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val)}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200">
                <SelectValue placeholder="Semua Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Gender</SelectItem>
                <SelectItem value="L">Laki-Laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* Add Period Button */}
          <button
            onClick={() => {
              setNewPeriodValue(getNextPeriod());
              setIsAddPeriodModalOpen(true);
            }}
            className="h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
            title="Tambah Periode Angkatan Baru"
          >
            <Plus size={14} />
            <span>Tambah Periode</span>
          </button>

          {/* Global Export active students */}
          <button
            onClick={handleExportAll}
            disabled={filteredApplicants.length === 0}
            className={`h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border shadow-xs whitespace-nowrap ${
              filteredApplicants.length === 0
                ? "bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-transparent cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-blue-500/20 cursor-pointer"
            }`}
            title="Ekspor Seluruh Siswa Aktif ke Excel"
          >
            <Download size={14} />
            <span>Ekspor Semua</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20 cursor-pointer whitespace-nowrap"
            title="Impor Data Siswa dari Excel"
          >
            <Upload size={14} />
            <span>Impor Excel</span>
          </button>

          {/* Download Template */}
          <button
            onClick={() => downloadActiveStudentsTemplate()}
            className="h-10 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
            title="Unduh Template Excel Format Siswa Aktif"
          >
            <FileSpreadsheet size={14} />
            <span>Template</span>
          </button>
        </div>
      </div>

      {/* Accordion List (Grouped by Period) */}
      <div className="space-y-4">
        {sortedPeriods.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-[#020617] border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Users size={28} />
            </div>
            <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Tidak Ada Siswa Aktif</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold max-w-sm mx-auto mt-1 uppercase tracking-wider">
              {searchTerm || majorFilter !== "ALL" 
                ? "Tidak ada data siswa aktif yang cocok dengan kriteria filter pencarian Anda."
                : "Belum ada data siswa aktif yang terdaftar di sekolah ini."}
            </p>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload size={14} />
              <span>Impor Data Siswa dari Excel (Migrasi Dapodik)</span>
            </button>
          </div>
        ) : (
          sortedPeriods.map((period) => (
            <PeriodAccordion
              key={period}
              period={period}
              students={groupedByPeriod[period] || []}
              isExpanded={expandedPeriods[period] ?? false}
              onToggle={() => togglePeriod(period)}
              nipdMap={nipdMap}
              onViewDetail={handleViewDetail}
              onBatalVerifikasi={handleBatalVerifikasi}
              onExportPeriod={handleExportPeriod}
            />
          ))
        )}
      </div>

      {/* Detail Student Modal */}
      <DetailStudentModal
        selectedApplicant={selectedApplicant}
        nipdMap={nipdMap}
        onClose={() => setSelectedApplicant(null)}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        editApplicant={editApplicant}
        editForm={editForm}
        setEditForm={setEditForm}
        isSaving={isSaving}
        onClose={() => setEditApplicant(null)}
        onSave={handleSaveEdit}
      />

      {/* Add Period Modal */}
      <AddPeriodModal
        isOpen={isAddPeriodModalOpen}
        newPeriodValue={newPeriodValue}
        setNewPeriodValue={setNewPeriodValue}
        onClose={() => setIsAddPeriodModalOpen(false)}
        onConfirm={handleAddPeriod}
      />

      {/* Import Excel Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          if (typeof fetchActiveStudents === "function") {
            fetchActiveStudents();
          }
        }}
        addToast={addToast}
      />
    </div>
  );
}

export default function ActiveStudentsDirectory() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold animate-pulse">Memuat direktori siswa...</div>}>
      <ActiveStudentsDirectoryContent />
    </Suspense>
  );
}
