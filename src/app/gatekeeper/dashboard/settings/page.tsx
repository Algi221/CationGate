"use client";

import React, { useState } from "react";
import {
  Settings, ShieldCheck, Key, Lock, Globe, Database, Server, Save,
  AlertTriangle, Check, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function GatekeeperSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);


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
      
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Pengaturan Platform CationGate
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasi parameter global SaaS, sistem langganan, dan tingkat keamanan Gatekeeper.
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
        >
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      {/* Maintenance Mode Toggle */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Mode Pemeliharaan Platform (Maintenance)
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Mengaktifkan mode ini akan menampilkan pesan pemeliharaan sistem pada seluruh landing page sekolah tenant. Akses Gatekeeper tetap dapat berjalan.
        </p>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-xs">Status Maintenance System</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {maintenanceMode ? "🚨 System saat ini dalam mode maintenance" : "🟢 Platform berjalan normal (Live Production)"}
            </p>
          </div>

          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
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



    </div>
  );
}
