"use client";

import React from "react";

interface ProfileTujuanFormProps {
  tujuan: string;
  setTujuan: (val: string) => void;
}

export function ProfileTujuanForm({
  tujuan,
  setTujuan,
}: ProfileTujuanFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Tujuan Pendidikan
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Target dan sasaran mutu lulusan yang ingin dicapai.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Uraian Tujuan Institusi
          </label>
          <span className="text-xs text-slate-400 font-medium">
            {tujuan.length}/2000
          </span>
        </div>
        <textarea
          maxLength={2000}
          value={tujuan}
          onChange={(e) => setTujuan(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="1. Menghasilkan lulusan yang kompeten...&#10;2. Mewujudkan tata kelola institusi transparan..."
        />
      </div>
    </div>
  );
}
