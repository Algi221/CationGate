"use client";

import React from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Pengaturan Sistem</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Atur konfigurasi global untuk SaaS CationGate.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm max-w-2xl">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama Platform</label>
            <input type="text" defaultValue="CationGate" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Dukungan (Support)</label>
            <input type="email" defaultValue="support@cationgate.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="pt-4">
            <button type="button" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
              <Save size={18} /> Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
