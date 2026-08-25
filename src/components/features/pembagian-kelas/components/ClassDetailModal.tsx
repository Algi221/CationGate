"use client";

import React from "react";
import { X, Search, Download, Trash2, Users } from "lucide-react";
import { Applicant, ClassItem } from "../types";

interface ClassDetailModalProps {
  selectedClassDetail: ClassItem | null;
  enrolledStudents: Applicant[];
  classSearchTerm: string;
  setClassSearchTerm: (term: string) => void;
  nipdMap: Map<number, string>;
  onClose: () => void;
  onRemoveStudent: (studentId: number, studentNama: string) => void;
  onExportCSV: (className: string) => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  selectedClassDetail,
  enrolledStudents,
  classSearchTerm,
  setClassSearchTerm,
  nipdMap,
  onClose,
  onRemoveStudent,
  onExportCSV
}) => {
  if (!selectedClassDetail) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all text-left">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 shrink-0">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <span>Daftar Siswa — {selectedClassDetail.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {enrolledStudents.length} Siswa
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Rombel Terdaftar Resmi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportCSV(selectedClassDetail.name)}
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-white/5 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Cari siswa dalam kelas ini..."
              value={classSearchTerm}
              onChange={(e) => setClassSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-xs font-bold text-slate-600 dark:text-slate-400 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase tracking-widest text-[9px]">
                <th className="py-2.5 px-3 text-left w-12">No</th>
                <th className="py-2.5 px-3 text-left">NIPD</th>
                <th className="py-2.5 px-3 text-left">Nama Siswa</th>
                <th className="py-2.5 px-3 text-center w-16">L/P</th>
                <th className="py-2.5 px-3 text-left">NISN</th>
                <th className="py-2.5 px-3 text-left">Asal Sekolah</th>
                <th className="py-2.5 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {enrolledStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/10 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {nipdMap.get(s.id) || s.nipd || "-"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-black text-slate-800 dark:text-white uppercase tracking-wide">
                      {s.nama}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                        (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l")
                          ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                          : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                      }`}
                    >
                      {(s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{s.nisn}</td>
                  <td className="py-3 px-3 uppercase text-slate-500">{s.sekolah_asal || s.sekolahAsal || "-"}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onRemoveStudent(s.id, s.nama)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg transition border border-rose-200/50 dark:border-rose-500/20 cursor-pointer"
                      title="Keluarkan dari kelas"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}

              {enrolledStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                    Tidak ada siswa yang ditemukan di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
