"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  Layers
} from "lucide-react";
import { ActiveStudent } from "../types";

interface PeriodAccordionProps {
  period: string;
  students: ActiveStudent[];
  isExpanded: boolean;
  onToggle: () => void;
  nipdMap: Map<number, string>;
  onViewDetail: (student: ActiveStudent) => void;
  onBatalVerifikasi: (id: number, nama: string) => void;
  onExportPeriod: (students: ActiveStudent[], period: string) => void;
}

export const PeriodAccordion: React.FC<PeriodAccordionProps> = ({
  period,
  students,
  isExpanded,
  onToggle,
  nipdMap,
  onViewDetail,
  onBatalVerifikasi,
  onExportPeriod
}) => {
  // Count by class inside this period
  const classBreakdown = students.reduce((acc, curr) => {
    const kls = curr.diterima_kelas || curr.diterimaKelas || "Belum Ada Kelas";
    acc[kls] = (acc[kls] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-colors duration-300">
      {/* Accordion Trigger Header */}
      <div 
        onClick={onToggle}
        className="px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none bg-slate-50/50 dark:bg-slate-950/15 border-b border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-900/40"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <span>Angkatan / Periode {period}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {students.length} Siswa
              </span>
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold flex-wrap">
              <Layers size={11} className="text-slate-400" />
              <span>Rombel Terisi:</span>
              {Object.entries(classBreakdown).map(([kls, count]) => (
                <span key={kls} className="px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {kls} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onExportPeriod(students, `periode_${period}`)}
            disabled={students.length === 0}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
          >
            <Download size={13} />
            <span>Ekspor Periode Ini</span>
          </button>

          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Accordion Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs font-bold text-slate-600 dark:text-slate-400 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-550 uppercase tracking-widest text-[9px]">
                    <th className="py-3 px-3 text-left w-12">No</th>
                    <th className="py-3 px-4 text-left">NIPD</th>
                    <th className="py-3 px-4 text-left">Kelas</th>
                    <th className="py-3 px-4 text-left">Nama Siswa</th>
                    <th className="py-3 px-4 text-center w-20">L/P</th>
                    <th className="py-3 px-4 text-left">NISN</th>
                    <th className="py-3 px-4 text-left">Asal Sekolah</th>
                    <th className="py-3 px-4 text-left">Jurusan</th>
                    <th className="py-3 px-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {students.map((student, idx) => (
                    <tr 
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-950/10 transition-colors"
                    >
                      <td className="py-3.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                        {nipdMap.get(student.id) || student.nipd || "-"}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-xs">
                        {student.diterima_kelas || student.diterimaKelas ? (
                          student.diterima_kelas || student.diterimaKelas
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-400">
                            BELUM ADA
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-800 dark:text-white uppercase tracking-wider">
                          {student.nama}
                        </div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider block mt-0.5">
                          Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {(student.jenis_kelamin || student.jenisKelamin) ? (
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-xs ${
                            (student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l")
                              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                          }`}>
                            {(student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">{student.nisn}</td>
                      <td className="py-3.5 px-4 uppercase">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase">
                          {student.jurusan || student.jurusan_1 || student.jurusan1}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onViewDetail(student)}
                            className="p-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 cursor-pointer"
                            title="Detail Siswa"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => onBatalVerifikasi(student.id, student.nama)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all border border-rose-200/50 dark:border-rose-500/20 cursor-pointer"
                            title="Batal Verifikasi (Kembalikan ke Pendaftar)"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {students.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                        Tidak ada siswa pada angkatan ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
