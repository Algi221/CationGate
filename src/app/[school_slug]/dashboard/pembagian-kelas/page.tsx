"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { 
  Download, 
  GraduationCap, 
  Plus, 
  Layers, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Search,
  GripVertical
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePPDB } from "@/context/PPDBContext";
import { usePembagianKelasState } from "@/components/features/pembagian-kelas/hooks/usePembagianKelasState";
import { AddClassModal } from "@/components/features/pembagian-kelas/components/AddClassModal";
import { ClassDetailModal } from "@/components/features/pembagian-kelas/components/ClassDetailModal";
import { getMajorLogoUrl } from "@/components/features/pembagian-kelas/utils/classDistribution";
import Link from "next/link";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import { GradeLevel } from "@/components/features/pembagian-kelas/types";

function ClassDivisionManagementContent() {
  const { ppdbTitle } = usePPDB();
  const { href } = useSchoolHref();
  const {
    selectedMajor,
    setSelectedMajor,
    selectedGrade,
    setSelectedGrade,
    activeMajors,
    classesOfSelectedMajor,
    filteredStudents,
    paginatedStudents,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    classEnrollments,
    filledClassesCount,
    selectedStudentIds,
    searchTerm,
    setSearchTerm,
    assignmentFilter,
    setAssignmentFilter,
    genderFilter,
    setGenderFilter,
    isLoading,
    toast,
    isAddingClass,
    setIsAddingClass,
    newClassName,
    setNewClassName,
    selectedClassDetail,
    setSelectedClassDetail,
    enrolledStudentsInDetail,
    classSearchTerm,
    setClassSearchTerm,
    activeDropClass,
    nipdMap,
    handleSelectAll,
    handleSelectStudent,
    handleAssignSelectedToClass,
    handleAssignSingleStudent,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCreateClass,
    handleDeleteClass,
    handleRemoveStudentFromClassDetail,
    handleExportClassCSV,
    handleExportAllClasses,
    handleExportAllMajors
  } = usePembagianKelasState();

  const gradeList: GradeLevel[] = [10, 11, 12];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl border text-xs font-black uppercase tracking-wider flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : toast.type === "error"
                ? "bg-rose-600 text-white border-rose-500"
                : "bg-blue-600 text-white border-blue-500"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Belum Ada Program Keahlian (Jurusan)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sekolah Anda belum memiliki daftar program keahlian. Silakan tambahkan jurusan melalui menu Kelola UI/Data untuk mulai melakukan pembagian kelas.
            </p>
          </div>
          <Link
            href={href("/dashboard/kelola-ui?tab=majors")}
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

      {/* Row 5: Daftar Calon Siswa (Table) */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama / NISN..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="w-full sm:w-auto min-w-37.5">
              <Select value={assignmentFilter} onValueChange={(val) => setAssignmentFilter(val as "ALL" | "UNASSIGNED" | "ASSIGNED")}>
                <SelectTrigger className="h-9.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <SelectValue placeholder="Semua Calon Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Calon Kelas</SelectItem>
                  <SelectItem value="UNASSIGNED">Belum Diatur</SelectItem>
                  <SelectItem value="ASSIGNED">Sudah Diatur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto min-w-32.5">
              <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val as "ALL" | "L" | "P")}>
                <SelectTrigger className="h-9.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <SelectValue placeholder="Semua Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Gender</SelectItem>
                  <SelectItem value="L">Laki-Laki (L)</SelectItem>
                  <SelectItem value="P">Perempuan (P)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 px-3 py-2 rounded-xl">
              <GripVertical size={13} className="text-blue-600 dark:text-blue-400" />
              <span>Drag &amp; drop baris siswa ke kartu kelas di atas</span>
            </div>
          </div>

          {selectedStudentIds.length > 0 && (
            <div className="flex items-center gap-2 shrink-0 animate-in fade-in">
              <Select
                disabled={isLoading}
                onValueChange={(val) => {
                  if (val) {
                    handleAssignSelectedToClass(val === "REMOVE" ? "" : val);
                  }
                }}
              >
                <SelectTrigger className="h-9.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 rounded-xl border-blue-500 shadow-md">
                  <SelectValue placeholder={`+ Masukkan Ke (${selectedStudentIds.length} Siswa)...`} />
                </SelectTrigger>
                <SelectContent>
                  {classesOfSelectedMajor.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="REMOVE" className="text-rose-600 focus:text-rose-600">
                    Keluarkan Dari Kelas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3 px-2 w-8 text-center" title="Drag Handle"></th>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">NIPD</th>
                <th className="py-3 px-4">Nama Lengkap Siswa</th>
                <th className="py-3 px-4 text-center">L/P</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">Asal Sekolah SMP</th>
                <th className="py-3 px-4">Pilihan Keahlian</th>
                <th className="py-3 px-4 text-center">Kelas Sekarang</th>
                <th className="py-3 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-bold">
                    Tidak ada data siswa yang sesuai filter.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const currentClass = student.diterima_kelas || student.diterimaKelas;
                  const nipd = nipdMap.get(student.id) || student.nipd || "-";
                  const jk = (student.jenis_kelamin || student.jenisKelamin || "").toUpperCase().startsWith("L") ? "L" : "P";
                  const isL = jk === "L";
                  const majorTitle = student.jurusan || student.jurusan_1 || student.jurusan1 || selectedMajor;

                  return (
                    <tr
                      key={student.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, student.id)}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-grab active:cursor-grabbing select-none group ${
                        isSelected ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-2 text-center text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <GripVertical size={14} className="mx-auto" />
                      </td>
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectStudent(student.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {nipd}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {student.nama}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                          Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tanggal_lahir || student.tanggalLahir || "-"} · Periode Daftar: {student.periode || "2026-2027"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs ${
                          isL ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" : "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400"
                        }`}>
                          {jk}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {student.nisn || "-"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300 uppercase">
                        {student.sekolah_asal || student.sekolahAsal || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase">
                          {majorTitle}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                          currentClass
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}>
                          {currentClass || "BELUM DIATUR"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-block min-w-32.5">
                          <Select
                            value={currentClass || "UNASSIGNED"}
                            disabled={isLoading}
                            onValueChange={(val) => handleAssignSingleStudent(student.id, val === "UNASSIGNED" ? "" : val)}
                          >
                            <SelectTrigger className="h-8 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                              <SelectValue placeholder="Belum Diatur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UNASSIGNED">Belum Diatur</SelectItem>
                              {classesOfSelectedMajor.map((c) => (
                                <SelectItem key={c.id} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>
                Menampilkan{" "}
                <strong className="text-slate-800 dark:text-white">
                  {(page - 1) * pageSize + 1}
                </strong>{" "}
                -{" "}
                <strong className="text-slate-800 dark:text-white">
                  {Math.min(page * pageSize, filteredStudents.length)}
                </strong>{" "}
                dari{" "}
                <strong className="text-slate-800 dark:text-white">
                  {filteredStudents.length}
                </strong>{" "}
                calon siswa ({selectedMajor})
              </span>

              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-400">Baris:</span>
                <div className="w-18">
                  <Select
                    value={String(pageSize)}
                    onValueChange={(val) => setPageSize(Number(val))}
                  >
                    <SelectTrigger className="h-7.5 px-2 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && (
                          <span className="px-1 text-slate-400 text-xs font-bold">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                            page === p
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Class Modal */}
      <AddClassModal
        isOpen={isAddingClass}
        selectedGrade={selectedGrade}
        selectedMajor={selectedMajor}
        newClassName={newClassName}
        setNewClassName={setNewClassName}
        onClose={() => setIsAddingClass(false)}
        onCreateClass={handleCreateClass}
      />

      {/* Class Detail Modal */}
      <ClassDetailModal
        selectedClassDetail={selectedClassDetail}
        enrolledStudents={enrolledStudentsInDetail}
        classSearchTerm={classSearchTerm}
        setClassSearchTerm={setClassSearchTerm}
        nipdMap={nipdMap}
        onClose={() => setSelectedClassDetail(null)}
        onRemoveStudent={handleRemoveStudentFromClassDetail}
        onExportCSV={handleExportClassCSV}
      />
    </div>
  );
}

export default function ClassDivisionManagement() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold animate-pulse">
          Memuat pembagian kelas...
        </div>
      }
    >
      <ClassDivisionManagementContent />
    </Suspense>
  );
}
