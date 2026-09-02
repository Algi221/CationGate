"use client";

import React from "react";
import { DollarSign, TrendingUp, Receipt, Building, Shield, Sparkles } from "lucide-react";
import { TransactionStats, formatRupiah } from "./types";

interface TransactionsStatsCardsProps {
  stats: TransactionStats;
}

export function TransactionsStatsCards({ stats }: TransactionsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Card 1: Total Revenue */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Pendapatan (Gross)
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatRupiah(stats.total_revenue)}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> 100% Terverifikasi Lunas
          </p>
        </div>
      </div>

      {/* Card 2: Total Transactions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Transaksi Sukses
          </span>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
            <Receipt size={20} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.total_transactions} <span className="text-sm font-bold text-slate-400">Orders</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Midtrans Payment Gateway + Sandbox
          </p>
        </div>
      </div>

      {/* Card 3: Active Subscriptions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Instansi Berlangganan
          </span>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
            <Building size={20} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.active_subscriptions} <span className="text-sm font-bold text-slate-400">Sekolah</span>
          </h3>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-1 flex items-center gap-1">
            <Shield size={12} /> Lisensi Aktif Tahunan
          </p>
        </div>
      </div>

      {/* Card 4: Average Order Value */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rata-Rata Nilai Order
          </span>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center border border-amber-100 dark:border-amber-900/50">
            <Sparkles size={20} />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatRupiah(stats.avg_order_value)}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            ARPU / Average Revenue Per Unit
          </p>
        </div>
      </div>
    </div>
  );
}
