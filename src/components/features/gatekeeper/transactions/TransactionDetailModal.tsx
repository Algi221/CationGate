"use client";

import React from "react";
import { Receipt, X, CheckCircle2 } from "lucide-react";
import { TransactionItem, formatRupiah, formatDateTime } from "./types";

interface TransactionDetailModalProps {
  selectedTx: TransactionItem | null;
  onClose: () => void;
}

export function TransactionDetailModal({
  selectedTx,
  onClose,
}: TransactionDetailModalProps) {
  if (!selectedTx) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
            <Receipt size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Rincian Transaksi Pembayaran
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {selectedTx.order_id}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Status Pembayaran</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> {selectedTx.status} (LUNAS)
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Instansi Sekolah</span>
            <span className="font-bold text-slate-900 dark:text-white text-right">
              {selectedTx.school_name}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Subdomain Resmi</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              {selectedTx.school_slug.replace(/[^a-zA-Z0-9-]/g, "")}.cationgate.site
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Paket Langganan</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {selectedTx.plan_name}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Metode Pembayaran</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {selectedTx.payment_method}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Waktu Transaksi</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatDateTime(selectedTx.settlement_time || selectedTx.created_at)}
            </span>
          </div>

          <div className="flex justify-between py-1 pt-2 text-sm">
            <span className="text-slate-600 dark:text-slate-300 font-black">
              Total Gross Amount
            </span>
            <span className="font-mono font-black text-slate-900 dark:text-white">
              {formatRupiah(selectedTx.amount)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
}
