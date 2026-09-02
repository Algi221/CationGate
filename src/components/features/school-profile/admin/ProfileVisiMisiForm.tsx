"use client";

import React from "react";

interface ProfileVisiMisiFormProps {
  visi: string;
  setVisi: (val: string) => void;
  misi: string;
  setMisi: (val: string) => void;
}

export function ProfileVisiMisiForm({
  visi,
  setVisi,
  misi,
  setMisi,
}: ProfileVisiMisiFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Visi &amp; Misi Sekolah
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gunakan baris baru atau nomor urut untuk poin-poin misi.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Visi Institusi
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {visi.length}/500
            </span>
          </div>
          <textarea
            maxLength={500}
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="Menjadi lembaga pendidikan unggul..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Misi Institusi
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {misi.length}/2000
            </span>
          </div>
          <textarea
            maxLength={2000}
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="1. Menyelenggarakan proses pembelajaran...&#10;2. Membentuk karakter peserta didik..."
          />
        </div>
      </div>
    </div>
  );
}
