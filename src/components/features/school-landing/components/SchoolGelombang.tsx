"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { GelombangConfig } from "../types";

interface SchoolGelombangProps {
  schoolPeriod: string;
  gelombangConfig: GelombangConfig;
  formatDate: (dateStr: string | null | undefined) => string;
}

export const SchoolGelombang: React.FC<SchoolGelombangProps> = ({
  schoolPeriod,
  gelombangConfig,
  formatDate
}) => {
  const getGelombangStatus = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) {
      return {
        label: "Belum Diatur",
        color: "bg-slate-100 dark:bg-[#1e293b] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
        active: false
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999);

    if (today < start) {
      return {
        label: "Akan Datang",
        color: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
        active: false
      };
    } else if (today >= start && today <= end) {
      return {
        label: "Sedang Berlangsung",
        color: "bg-emerald-50 dark:bg-[#022c22] text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50",
        active: true
      };
    } else {
      return {
        label: "Telah Ditutup",
        color: "bg-rose-50 dark:bg-[#4c0519] text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50",
        active: false
      };
    }
  };

  const effectiveGelombang1 = (gelombangConfig?.gelombang1?.start && gelombangConfig?.gelombang1?.end)
    ? gelombangConfig.gelombang1
    : { start: "2026-01-01", end: "2026-06-30" };
  const effectiveGelombang2 = (gelombangConfig?.gelombang2?.start && gelombangConfig?.gelombang2?.end)
    ? gelombangConfig.gelombang2
    : { start: "2026-07-01", end: "2026-08-31" };

  const status1 = getGelombangStatus(effectiveGelombang1.start, effectiveGelombang1.end);
  const status2 = getGelombangStatus(effectiveGelombang2.start, effectiveGelombang2.end);

  return (
    <section id="gelombang" className="py-20 max-w-6xl mx-auto px-6 relative z-10 text-left">
      <div className="text-center mb-12">
        <span className="inline-block mb-2 text-blue-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full">
          Jadwal Penerimaan · TP. {schoolPeriod}
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mt-3 mb-3">
          Gelombang Pendaftaran PPDB
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">
          Perhatikan rentang tanggal pendaftaran di setiap gelombang untuk mengamankan kuota jurusan pilihan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Gelombang 1 Card */}
        <div
          className={`bg-white dark:bg-[#0f172a] border ${
            status1.active
              ? "border-blue-500/30 dark:border-blue-500/30 shadow-blue-500/5"
              : "border-slate-200 dark:border-slate-800/80"
          } rounded-3xl p-8 shadow-sm transition-all duration-300 relative overflow-hidden group`}
        >
          {status1.active && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-500/10 to-transparent pointer-events-none" />
          )}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Periode Pertama
              </span>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 1</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status1.color}`}
            >
              {status1.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              {status1.label}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-[#020617] p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <Calendar size={18} className="text-blue-500 shrink-0" />
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Tanggal Pendaftaran
                </span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                  {gelombangConfig.gelombang1.start ? formatDate(gelombangConfig.gelombang1.start) : "Belum diatur"} -{" "}
                  {gelombangConfig.gelombang1.end ? formatDate(gelombangConfig.gelombang1.end) : "Belum diatur"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gelombang 2 Card */}
        <div
          className={`bg-white dark:bg-[#0f172a] border ${
            status2.active
              ? "border-blue-500/30 dark:border-blue-500/30 shadow-blue-500/5"
              : "border-slate-200 dark:border-slate-800/80"
          } rounded-3xl p-8 shadow-sm transition-all duration-300 relative overflow-hidden group`}
        >
          {status2.active && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-500/10 to-transparent pointer-events-none" />
          )}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Periode Kedua
              </span>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">Gelombang 2</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status2.color}`}
            >
              {status2.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              {status2.label}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-[#020617] p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <Calendar size={18} className="text-blue-500 shrink-0" />
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Tanggal Pendaftaran
                </span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                  {gelombangConfig.gelombang2.start ? formatDate(gelombangConfig.gelombang2.start) : "Belum diatur"} -{" "}
                  {gelombangConfig.gelombang2.end ? formatDate(gelombangConfig.gelombang2.end) : "Belum diatur"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
