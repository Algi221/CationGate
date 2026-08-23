"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  CheckSquare, 
  MinusSquare, 
  Layers, 
  ShieldAlert
} from "lucide-react";
import { Applicant, ClassItem } from "../types";

interface UnassignedPanelProps {
  students: Applicant[];
  classes: ClassItem[];
  selectedStudentIds: number[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  assignmentFilter: "ALL" | "UNASSIGNED" | "ASSIGNED";
  setAssignmentFilter: (filter: "ALL" | "UNASSIGNED" | "ASSIGNED") => void;
  genderFilter: "ALL" | "L" | "P";
  setGenderFilter: (filter: "ALL" | "L" | "P") => void;
  onSelectAll: () => void;
  onSelectStudent: (id: number) => void;
  onAssignSelected: (className: string) => void;
  onDragStart: (e: React.DragEvent, id: number) => void;
  isLoading: boolean;
}

export const UnassignedPanel: React.FC<UnassignedPanelProps> = ({
  students,
  classes,
  selectedStudentIds,
  searchTerm,
  setSearchTerm,
  assignmentFilter,
  setAssignmentFilter,
  genderFilter,
  setGenderFilter,
  onSelectAll,
  onSelectStudent,
  onAssignSelected,
  onDragStart,
  isLoading
}) => {
  const isAllSelected = students.length > 0 && selectedStudentIds.length === students.length;
  const isPartialSelected = selectedStudentIds.length > 0 && !isAllSelected;

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full text-left">
      {/* Header & Filter Controls */}
      <div className="space-y-4 pb-5 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Layers size={16} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-wide">
                Daftar Calon Siswa
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {students.length} Siswa Terfilter
              </p>
            </div>
          </div>

          {/* Quick Assign Dropdown for Batch */}
          {selectedStudentIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <select
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value) {
                    onAssignSelected(e.target.value === "REMOVE" ? "" : e.target.value);
                    e.target.value = "";
                  }
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider py-2 px-3 rounded-xl focus:outline-none cursor-pointer shadow-md"
              >
                <option value="">+ Masukkan Ke ({selectedStudentIds.length})...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name} className="text-slate-800 bg-white">
                    {c.name}
                  </option>
                ))}
                <option value="REMOVE" className="text-rose-600 bg-white">
                  Keluarkan Dari Kelas
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as "ALL" | "UNASSIGNED" | "ASSIGNED")}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer uppercase"
              >
                <option value="ALL">Status: Semua</option>
                <option value="UNASSIGNED">Belum Dapat Kelas</option>
                <option value="ASSIGNED">Sudah Ada Kelas</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as "ALL" | "L" | "P")}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer uppercase"
              >
                <option value="ALL">Gender: Semua</option>
                <option value="L">Laki-Laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Select All Toggle */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-blue-600 transition cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare size={16} className="text-blue-600" />
            ) : isPartialSelected ? (
              <MinusSquare size={16} className="text-blue-600" />
            ) : (
              <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600" />
            )}
            <span>Pilih Semua ({students.length})</span>
          </button>

          {selectedStudentIds.length > 0 && (
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              {selectedStudentIds.length} Dipilih
            </span>
          )}
        </div>
      </div>

      {/* Student List (Scrollable) */}
      <div className="flex-1 overflow-y-auto pt-4 space-y-2 max-h-150 pr-1">
        {students.map((student) => {
          const isSelected = selectedStudentIds.includes(student.id);
          const currentClass = student.diterima_kelas || student.diterimaKelas;
          const jk = (student.jenis_kelamin || student.jenisKelamin || "").toLowerCase();

          return (
            <div
              key={student.id}
              draggable
              onDragStart={(e) => onDragStart(e, student.id)}
              onClick={() => onSelectStudent(student.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-grab active:cursor-grabbing select-none ${
                isSelected
                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-xs"
                  : "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/70 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student.id);
                    }}
                    className="cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare size={16} className="text-blue-600" />
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-xs text-slate-800 dark:text-white uppercase truncate">
                      {student.nama}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>NISN: {student.nisn}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span
                        className={`font-black ${
                          jk.startsWith("l") ? "text-blue-500" : "text-pink-500"
                        }`}
                      >
                        {jk.startsWith("l") ? "L" : "P"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {currentClass ? (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      {currentClass}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Belum Ada
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {students.length === 0 && (
          <div className="p-8 text-center text-slate-400 font-bold uppercase text-xs space-y-2">
            <ShieldAlert size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p>Tidak ada calon siswa yang cocok dengan filter ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};
