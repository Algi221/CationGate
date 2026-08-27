"use client";

import React from "react";
import { CreditCard } from "lucide-react";

export interface TransactionItem {
  id: number | string;
  order_id: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  settlement_time?: string;
}

interface SubscriptionTransactionHistoryProps {
  transactions: TransactionItem[];
  loadingTx: boolean;
  onRefresh: () => void;
}

export const SubscriptionTransactionHistory: React.FC<SubscriptionTransactionHistoryProps> = ({
  transactions,
  loadingTx,
  onRefresh
}) => {
  return (
    <div className="mt-12 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Riwayat Transaksi Langganan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar invoice dan pembayaran lisensi SaaS PPDB untuk sekolah Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          Refresh Data
        </button>
      </div>

      {loadingTx ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 animate-pulse">Memuat riwayat transaksi...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <CreditCard size={18} />
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Riwayat Transaksi</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Saat Anda mengaktifkan paket berbayar atau menjalankan simulasi pembayaran, bukti invoice resmi akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 font-mono">Order ID / Invoice</th>
                  <th className="py-3.5 px-4">Paket Lisensi</th>
                  <th className="py-3.5 px-4">Tanggal Transaksi</th>
                  <th className="py-3.5 px-4">Metode Bayar</th>
                  <th className="py-3.5 px-4 font-mono text-right">Nominal</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
                {transactions.map((tx, idx) => {
                  const isPaid = tx.status === "SETTLEMENT" || tx.status === "SUCCESS" || tx.status === "PAID";
                  return (
                    <tr key={tx.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                        {tx.order_id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {tx.plan_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) : "-"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs">
                        {tx.payment_method || "Midtrans Sandbox"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-right text-slate-900 dark:text-white text-xs">
                        Rp {Number(tx.amount || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPaid
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                        }`}>
                          {isPaid ? "SETTLEMENT (LUNAS)" : tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
