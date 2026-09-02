"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface MaintenanceModeCardProps {
  maintenanceMode: boolean;
  maintenanceLoading: boolean;
  onToggleMaintenance: () => void;
}

export function MaintenanceModeCard({
  maintenanceMode,
  maintenanceLoading,
  onToggleMaintenance,
}: MaintenanceModeCardProps) {
  return (
    <div className="bg-white dark:bg-[#2e3749] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs space-y-4 transition-colors duration-300">
      <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2 tracking-tight">
        <AlertTriangle className="w-5 h-5 text-amber-500" /> Mode Pemeliharaan Platform (Maintenance)
      </h3>
      <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed font-medium">
        Mengaktifkan mode ini akan menampilkan pesan pemeliharaan sistem pada seluruh landing page sekolah tenant. Akses Gatekeeper tetap dapat berjalan normal.
      </p>

      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-xs">
            Status Maintenance System
          </p>
          <p className="text-[11px] text-slate-500 dark:text-white/60 mt-0.5 font-medium flex items-center gap-1.5">
            {maintenanceMode ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                🚨 System saat ini dalam mode maintenance (Landing page dialihkan ke error UFO)
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                🟢 Platform berjalan normal (Live Production)
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          disabled={maintenanceLoading}
          onClick={onToggleMaintenance}
          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
            maintenanceMode ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              maintenanceMode ? "left-6" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
