"use client";

import React, { Suspense } from "react";
import { 
  Search, 
  Download, 
  GraduationCap, 
  Calendar, 
  Users, 
  Filter, 
  BookOpen, 
  Upload, 
  FileSpreadsheet,
  Plus
} from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-linear-to-br from-indigo-500 to-indigo-600 dark:from-indigo-950/60 dark:to-indigo-900/40 border border-indigo-400/20 dark:border-indigo-850/40 rounded-3xl p-6 shadow-sm text-white flex items-center justify-between transition-all duration-300 hover:shadow-md">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Total Siswa Aktif</span>
            <h3 className="text-3xl font-black leading-none">
              {stats.total} <span className="text-xs font-bold text-indigo-200">Siswa</span>
            </h3>
            <p className="text-[10px] text-indigo-150 font-bold mt-1">Gabungan seluruh angkatan terverifikasi</p>
          </div>
          <div className="w-12 h-12 bg-white dark:bg-[#0f172a]/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
            <GraduationCap size={24} className="text-indigo-100" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">
              Periode Terkini (2026-2027)
            </span>
            <h3 className="text-3xl font-black leading-none text-slate-800 dark:text-white">
              {stats.currentBatch} <span className="text-xs font-bold text-slate-400">Siswa</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Calon angkatan tahun ini</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 shrink-0">
            <Calendar size={24} className="text-emerald-600 dark:text-emerald-450" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">
              Konsentrasi Populer
            </span>
            <h3 className="text-base font-black truncate max-w-50 leading-tight text-slate-800 dark:text-white uppercase tracking-wider">
              {stats.popular}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Kompetensi keahlian pendaftar terbanyak</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 shrink-0">
            <BookOpen size={24} className="text-blue-600 dark:text-blue-450" />
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row gap-4 items-center justify-between transition-colors duration-300">
        <div className="w-full xl:w-auto flex flex-col md:flex-row items-center gap-3 flex-1">
          {/* Universal Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550" size={16} />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, atau asal sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Major/Prodi selection dropdown */}
          <div className="relative w-full md:w-80">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550" size={14} />
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer uppercase tracking-wider"
            >
              <option value="ALL">Semua Jurusan</option>
              <option value="Rekayasa Perangkat Lunak">RPL / PPLG</option>
              <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT / TKJ</option>
              <option value="Desain Komunikasi Visual">DKV</option>
              <option value="Animasi">Animasi</option>
              <option value="Broadcasting & Perfilman">Broadcasting / BCF</option>
              <option value="Teknik Elektronika">Teknik Elektronika / TE</option>
            </select>
          </div>

          {/* Class selection dropdown */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550" size={14} />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer tracking-wider"
            >
              <option value="ALL">Semua Kelas</option>
              {uniqueClasses.map((kls) => (
                <option key={kls} value={kls}>
                  {kls} (L: {classStats[kls].L}, P: {classStats[kls].P})
                </option>
              ))}
            </select>
          </div>

          {/* Gender selection dropdown */}
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550" size={14} />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer tracking-wider"
            >
              <option value="ALL">Semua Gender</option>
              <option value="L">Laki-Laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-3 w-full xl:w-auto">
          {/* Add Period Button */}
          <button
            onClick={() => {
              setNewPeriodValue(getNextPeriod());
              setIsAddPeriodModalOpen(true);
            }}
            className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Plus size={14} />
            <span>Tambah Periode</span>
          </button>

          {/* Global Export active students */}
          <button
            onClick={handleExportAll}
            disabled={filteredApplicants.length === 0}
            className={`w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-sm ${
              filteredApplicants.length === 0
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 hover:border-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.15)] cursor-pointer"
            }`}
          >
            <Download size={14} />
            <span>Ekspor Semua Siswa</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 hover:border-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.15)] cursor-pointer"
          >
            <Upload size={14} />
            <span>Impor Siswa (Excel)</span>
          </button>

          {/* Download Template */}
          <button
            onClick={() => downloadActiveStudentsTemplate()}
            className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
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
