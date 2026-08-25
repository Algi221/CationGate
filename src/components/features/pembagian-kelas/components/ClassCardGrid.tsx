"use client";

import React from "react";
import { 
  Download, 
  Trash2, 
  Eye, 
  GraduationCap, 
  Plus,
  Layers
} from "lucide-react";
import { ClassItem } from "../types";

interface ClassCardGridProps {
  classes: ClassItem[];
  classEnrollments: Record<string, { total: number; L: number; P: number }>;
  activeDropClass: string | null;
  onDragOver: (e: React.DragEvent, className: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, className: string) => void;
  onSelectClassDetail: (cls: ClassItem) => void;
  onExportClassCSV: (className: string) => void;
  onDeleteClass: (id: string, name: string) => void;
  onOpenAddClassModal: () => void;
}

export const ClassCardGrid: React.FC<ClassCardGridProps> = ({
  classes,
  classEnrollments,
  activeDropClass,
  onDragOver,
  onDragLeave,
  onDrop,
  onSelectClassDetail,
  onExportClassCSV,
  onDeleteClass,
  onOpenAddClassModal
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <GraduationCap size={16} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-wide">
              Rombongan Belajar (Rombel)
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              {classes.length} Kelas Terdaftar
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddClassModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.25)] cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Rombel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const stats = classEnrollments[cls.name] || { total: 0, L: 0, P: 0 };
          const isDropTarget = activeDropClass === cls.name;

          return (
            <div
              key={cls.id}
              onDragOver={(e) => onDragOver(e, cls.name)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, cls.name)}
              className={`rounded-3xl border p-5 transition-all flex flex-col justify-between ${
                isDropTarget
                  ? "bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 ring-4 ring-blue-500/20 scale-[1.02]"
                  : "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 dark:hover:border-white/10"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white text-base uppercase tracking-wide">
                      {cls.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Jurusan {cls.majorCode}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 font-mono">
                      {stats.total} Siswa
                    </span>
                  </div>
                </div>

                {/* Gender Breakdown Badge */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                      Laki-Laki
                    </span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                      {stats.L} Siswa
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                      Perempuan
                    </span>
                    <span className="text-xs font-black text-pink-600 dark:text-pink-400 font-mono">
                      {stats.P} Siswa
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectClassDetail(cls)}
                  className="flex-1 py-2 px-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Lihat Siswa</span>
                </button>

                <button
                  onClick={() => onExportClassCSV(cls.name)}
                  disabled={stats.total === 0}
                  className="p-2 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-xl transition cursor-pointer disabled:opacity-30"
                  title="Ekspor Kelas Excel"
                >
                  <Download size={13} />
                </button>

                <button
                  onClick={() => onDeleteClass(cls.id, cls.name)}
                  disabled={stats.total > 0}
                  className="p-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 rounded-xl transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  title={stats.total > 0 ? "Tidak dapat menghapus kelas yang terisi siswa" : "Hapus Rombel"}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {classes.length === 0 && (
          <div className="col-span-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-12 text-center">
            <Layers size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">
              Belum Ada Rombel Kelas
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              Tambahkan kelas rombel baru untuk memulai pembagian siswa.
            </p>
            <button
              onClick={onOpenAddClassModal}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus size={14} />
              <span>Tambah Rombel Sekarang</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
