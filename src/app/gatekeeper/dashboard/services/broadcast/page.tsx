"use client";

import React from "react";
import { Megaphone, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function GatekeeperBroadcastPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-blue-600" /> Pusat Komunikasi
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              AKTIF
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Broadcast Pengumuman
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Kirimkan informasi atau pemberitahuan massal ke seluruh admin sekolah yang terdaftar dalam sistem.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2">
            <Plus size={14} /> Buat Pengumuman
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-8 shadow-sm flex items-center justify-center min-h-75"
      >
        <p className="text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase text-xs">Modul Dalam Pengembangan</p>
      </motion.div>
    </div>
  );
}
