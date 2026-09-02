"use client";

import React from "react";
import { Receipt, RefreshCw, Copy, Check, CheckCircle2, Clock, Eye } from "lucide-react";
import { TransactionItem, formatRupiah, formatDateTime } from "./types";

interface TransactionsTableProps {
  loading: boolean;
  filteredTransactions: TransactionItem[];
  copiedOrderId: string | null;
  onCopyOrderId: (text: string) => void;
  onSelectTransaction: (tx: TransactionItem) => void;
}

export function TransactionsTable({
  loading,
  filteredTransactions,
  copiedOrderId,
  onCopyOrderId,
  onSelectTransaction,
}: TransactionsTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">ID Transaksi / Order</th>
              <th className="py-4 px-6">Instansi Sekolah</th>
              <th className="py-4 px-6">Paket Langganan</th>
              <th className="py-4 px-6">Nominal (Gross)</th>
              <th className="py-4 px-6">Metode Pembayaran</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Waktu Transaksi</th>
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={20} className="animate-spin text-blue-600" />
                    <span>Memuat riwayat transaksi...</span>
                  </div>
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Receipt size={32} className="text-slate-300 dark:text-slate-700" />
                    <p className="font-bold text-slate-600 dark:text-slate-400">
                      Belum Ada Transaksi Tercatat
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Transaksi baru akan otomatis muncul saat sekolah melakukan pembayaran paket.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isSettled = tx.status === "SETTLEMENT";
                return (
                  <tr
                    key={tx.id || tx.order_id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                          {tx.order_id}
                        </span>
                        <button
                          type="button"
                          onClick={() => onCopyOrderId(tx.order_id)}
                          title="Salin Order ID"
                          className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                        >
                          {copiedOrderId === tx.order_id ? (
                            <Check size={13} className="text-emerald-500" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* School */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {tx.school_name}
                        </span>
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                          {tx.school_slug}.cationgate.site
                        </span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-900/50">
                        {tx.plan_name}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                        {formatRupiah(tx.amount)}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      <span className="text-[11px]">{tx.payment_method}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isSettled
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {isSettled ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {tx.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-[11px]">
                      {formatDateTime(tx.settlement_time || tx.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectTransaction(tx)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
