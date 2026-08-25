"use client";

import React, { useState } from "react";
import {
  Settings, Save, AlertTriangle, RefreshCw, Server, ShieldCheck, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function GatekeeperSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [debugLogs, setDebugLogs] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Swal.fire({
        title: "Pengaturan Disimpan!",
        text: "Konfigurasi platform CationGate berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Pengaturan Sistem Platform
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasi parameter global SaaS, sistem pemeliharaan, dan tingkat keamanan Gatekeeper.
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Mode Pemeliharaan Platform (Maintenance)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Mengaktifkan mode ini akan menampilkan pesan pemeliharaan sistem pada seluruh landing page sekolah tenant. Akses Gatekeeper tetap dapat berjalan normal.
        </p>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-xs">Status Maintenance System</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {maintenanceMode ? "🚨 System saat ini dalam mode maintenance" : "🟢 Platform berjalan normal (Live Production)"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
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

      {/* Server & Security Parameters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" /> Parameter Keamanan & Database Server
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Automated Daily Database Backup</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Cadangkan seluruh data database multi-tenant secara terenkripsi setiap pukul 02:00 WIB.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAutoBackup(!autoBackup)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoBackup ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  autoBackup ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Extended Diagnostic & Audit Logs</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Rekam detail payload request ke server untuk investigasi keamanan dan forensik digital.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDebugLogs(!debugLogs)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                debugLogs ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  debugLogs ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
