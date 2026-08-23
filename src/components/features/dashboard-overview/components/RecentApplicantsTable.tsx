"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ApplicantItem, MajorItem } from "../types";

interface RecentApplicantsTableProps {
  schoolSlug: string;
  applicants: ApplicantItem[];
  majorsList: MajorItem[];
}

export const RecentApplicantsTable: React.FC<RecentApplicantsTableProps> = ({
  schoolSlug,
  applicants,
  majorsList
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-xs text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-wider uppercase">
            Pendaftar Terbaru
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            7 calon siswa yang baru mendaftar
          </p>
        </div>
        <Link
          href={`/${schoolSlug}/dashboard/pendaftar`}
          className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors uppercase tracking-wider cursor-pointer"
        >
          Lihat Semua <ArrowRight size={12} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-bold">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 text-[9px] uppercase tracking-widest">
              <th className="pb-2 pt-1 pl-2">Nama</th>
              <th className="pb-2 pt-1">Asal Sekolah</th>
              <th className="pb-2 pt-1">Jurusan</th>
              <th className="pb-2 pt-1 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-white/5">
            {applicants.slice(0, 7).map((a: ApplicantItem, idx: number) => (
              <motion.tr
                key={a.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.06, duration: 0.35 }}
                className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                <td className="py-2.5 pl-2 font-bold text-slate-800 dark:text-white max-w-32.5 truncate">
                  {a.nama}
                </td>
                <td className="py-2.5 truncate max-w-27.5 text-slate-500 dark:text-slate-400 font-medium">
                  {a.sekolah_asal || a.sekolahAsal}
                </td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[9px] font-bold uppercase tracking-wide">
                    {majorsList.find((m) => m.dbName === a.jurusan_1 || m.dbName === a.jurusan1)?.name ||
                      a.jurusan_1 ||
                      "PPLG"}
                  </span>
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wide ${
                      a.status === "Approved"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : a.status === "Rejected"
                        ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                        : "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                  </span>
                </td>
              </motion.tr>
            ))}
            {applicants.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-slate-400 font-bold uppercase tracking-wider text-[10px]"
                >
                  Belum ada data pendaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
