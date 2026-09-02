"use client";

import React from "react";
import { Search, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassItem } from "@/components/features/pembagian-kelas/types";
import { PPDBApplicant } from "@/stores/types/ppdbTypes";

interface PembagianKelasStudentTableProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  assignmentFilter: "ALL" | "UNASSIGNED" | "ASSIGNED";
  setAssignmentFilter: (val: "ALL" | "UNASSIGNED" | "ASSIGNED") => void;
  genderFilter: "ALL" | "L" | "P";
  setGenderFilter: (val: "ALL" | "L" | "P") => void;
  selectedStudentIds: (string | number)[];
  isLoading: boolean;
  handleAssignSelectedToClass: (val: string) => void;
  classesOfSelectedMajor: ClassItem[];
  filteredStudents: PPDBApplicant[];
  paginatedStudents: PPDBApplicant[];
  handleSelectAll: () => void;
  handleSelectStudent: (id: string | number) => void;
  handleDragStart: (e: React.DragEvent, id: string | number) => void;
  nipdMap: Map<string | number, string>;
  selectedMajor: string;
  handleAssignSingleStudent: (id: string | number, className: string) => void;
  page: number;
  setPage: (val: number) => void;
  pageSize: number;
  setPageSize: (val: number) => void;
  totalPages: number;
}

export function PembagianKelasStudentTable({
  searchTerm,
  setSearchTerm,
  assignmentFilter,
  setAssignmentFilter,
  genderFilter,
  setGenderFilter,
  selectedStudentIds,
  isLoading,
  handleAssignSelectedToClass,
  classesOfSelectedMajor,
  filteredStudents,
  paginatedStudents,
  handleSelectAll,
  handleSelectStudent,
  handleDragStart,
  nipdMap,
  selectedMajor,
  handleAssignSingleStudent,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
}: PembagianKelasStudentTableProps) {
  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Search & Filter Bar */}
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
            <Select
              value={assignmentFilter}
              onValueChange={(val) => setAssignmentFilter(val as "ALL" | "UNASSIGNED" | "ASSIGNED")}
            >
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
            <Select
              value={genderFilter}
              onValueChange={(val) => setGenderFilter(val as "ALL" | "L" | "P")}
            >
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
              <SelectTrigger className="h-9.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 rounded-xl border-blue-500 shadow-md cursor-pointer">
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

      {/* Table Content */}
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
  );
}
