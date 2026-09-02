"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Layers, Plus, Download, Trash2, ChevronRight } from "lucide-react";
import { GradeLevel, MajorConfigItem, ClassItem } from "@/components/features/pembagian-kelas/types";
import { getMajorLogoUrl } from "@/components/features/pembagian-kelas/utils/classDistribution";

interface PembagianKelasHeaderStatsProps {
  ppdbTitle: string;
  selectedGrade: GradeLevel;
  selectedMajor: string;
  classesOfSelectedMajor: ClassItem[];
  filledClassesCount: number;
  activeMajors: MajorConfigItem[];
  setSelectedMajor: (val: string) => void;
  setSelectedGrade: (val: GradeLevel) => void;
  gradeList: GradeLevel[];
  kelolaHref: string;
  handleExportAllClasses: () => void;
  handleExportAllMajors: () => void;
  setIsAddingClass: (val: boolean) => void;
  classEnrollments: Record<string, { total: number; L: number; P: number }>;
  activeDropClass: string | null;
  handleDragOver: (e: React.DragEvent, className: string) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, className: string) => void;
  handleDeleteClass: (id: string, name: string) => void;
  setSelectedClassDetail: (cls: ClassItem) => void;
}

export function PembagianKelasHeaderStats({
  ppdbTitle,
  selectedGrade,
  selectedMajor,
  classesOfSelectedMajor,
  filledClassesCount,
  activeMajors,
  setSelectedMajor,
  setSelectedGrade,
  gradeList,
  kelolaHref,
  handleExportAllClasses,
  handleExportAllMajors,
  setIsAddingClass,
  classEnrollments,
  activeDropClass,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDeleteClass,
  setSelectedClassDetail,
}: PembagianKelasHeaderStatsProps) {
  return (
    <>
      {/* Row 1: Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Card 1: Wide Title Card */}
        <div className="md:col-span-6 lg:col-span-6 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
              Manajemen Pembagian Kelas
            </h2>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {ppdbTitle || "SMK Taruna Bhakti"} - PPDB Portal Kelas
            </p>
          </div>
        </div>

        {/* Card 2: Kelas Terbentuk */}
        <div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Kelas Terbentuk (Kelas {selectedGrade} {selectedMajor})
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {classesOfSelectedMajor.length}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kelas</span>
          </div>
        </div>

        {/* Card 3: Jumlah Kelas Terisi */}
        <div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Jumlah Kelas Terisi Siswa
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {filledClassesCount}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Terisi</span>
          </div>
        </div>
      </div>

      {/* Row 2: Major Cards Grid or Empty State */}
      {activeMajors.length === 0 ? (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/50">
            <Layers className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Belum Ada Program Keahlian (Jurusan)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sekolah Anda belum memiliki daftar program keahlian. Silakan tambahkan jurusan melalui menu Kelola UI/Data untuk mulai melakukan pembagian kelas.
            </p>
          </div>
          <Link
            href={kelolaHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Kelola Program Keahlian (Jurusan)
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeMajors.map((major) => {
            const isSelected = selectedMajor === major.code;
            return (
              <button
                key={major.code}
                onClick={() => setSelectedMajor(major.code)}
                className={`rounded-3xl p-5 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                    : "bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 shadow-xs hover:scale-[1.01]"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full p-2 mb-3 shadow-xs flex items-center justify-center overflow-hidden shrink-0 ${
                    isSelected ? "bg-white" : "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                  }`}
                >
                  <Image
                    src={major.logo || getMajorLogoUrl(major.code)}
                    alt={major.name || major.code}
                    width={44}
                    height={44}
                    className="w-10 h-10 object-contain"
                    unoptimized
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const fallback = getMajorLogoUrl(major.code);
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                </div>
                <h4
                  className={`text-[11px] font-black uppercase tracking-tight leading-tight line-clamp-2 ${
                    isSelected ? "text-white" : "text-slate-800 dark:text-white"
                  }`}
                >
                  {major.name || major.code}
                </h4>
                <span
                  className={`text-[10px] font-bold uppercase mt-1 ${
                    isSelected ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  ({major.code})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Row 3: Grade Level Pills */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 shadow-xs flex items-center gap-2 w-fit">
        {gradeList.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              selectedGrade === grade
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {grade === 10 ? "Kelas 10 (Baru Masuk)" : `Kelas ${grade}`}
          </button>
        ))}
      </div>

      {/* Row 4: Daftar Kelas Aktif (Rombel) */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Daftar Kelas Aktif (Tingkat {selectedGrade} Jurusan {selectedMajor})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportAllClasses}
              disabled={classesOfSelectedMajor.length === 0}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download size={13} />
              <span>Ekspor Semua Kelas ({selectedMajor})</span>
            </button>

            <button
              onClick={handleExportAllMajors}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Ekspor Semua Jurusan</span>
            </button>

            <button
              onClick={() => setIsAddingClass(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>Buat Kelas Baru</span>
            </button>
          </div>
        </div>

        {classesOfSelectedMajor.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-sm">
            Belum ada rombel untuk jurusan {selectedMajor} di tingkat {selectedGrade}. Silakan klik &quot;Buat Kelas Baru&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classesOfSelectedMajor.map((cls) => {
              const stats = classEnrollments[cls.name] || { total: 0, L: 0, P: 0 };
              const isDropTarget = activeDropClass === cls.name;
              return (
                <div
                  key={cls.id}
                  onDragOver={(e) => handleDragOver(e, cls.name)}
                  onDragLeave={(e) => handleDragLeave(e)}
                  onDrop={(e) => handleDrop(e, cls.name)}
                  className={`rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 border relative overflow-hidden ${
                    isDropTarget
                      ? "bg-blue-50/90 dark:bg-blue-950/80 border-blue-500 ring-4 ring-blue-500/30 scale-[1.03] shadow-lg shadow-blue-500/15"
                      : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                  }`}
                >
                  {isDropTarget && (
                    <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-500/20 pointer-events-none flex items-center justify-center backdrop-blur-2xs z-10">
                      <div className="bg-blue-600 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1.5 animate-bounce">
                        <Plus size={14} /> Lepaskan Siswa di Sini
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-black text-base uppercase text-slate-900 dark:text-white">
                          {cls.name}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Jurusan {cls.majorCode}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteClass(cls.id, cls.name)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        title="Hapus Rombel"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="my-5 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {stats.total}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Siswa Terdaftar</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          stats.total === 0 ? "text-slate-400" : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {stats.total === 0 ? "KOSONG" : `${stats.total} SISWA`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedClassDetail(cls)}
                    className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer w-full text-left"
                  >
                    <span>Lihat Daftar Kelas</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
