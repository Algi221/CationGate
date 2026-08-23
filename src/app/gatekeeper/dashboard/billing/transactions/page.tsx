"use client";

import React from "react";
import { Receipt } from "lucide-react";

export default function GatekeeperTransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="text-blue-600" /> Riwayat Transaksi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Pantau pembayaran langganan SaaS dari seluruh sekolah yang terdaftar (Integrasi Midtrans).
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-75">
        <p className="text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">Modul Dalam Pengembangan</p>
      </div>
    </div>
  );
}
