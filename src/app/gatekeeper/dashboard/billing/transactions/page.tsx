"use client";

import React, { useState } from "react";
import { Receipt, Search, Filter, Download, ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function GatekeeperTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy Data for Transactions
  const dummyTransactions = [
    {
      id: "TRX-10928374",
      school: "SMA Negeri 1 Jakarta",
      plan: "PRO PPDB & CBT",
      amount: 1500000,
      date: "19 Agt 2026, 14:30 WIB",
      status: "success",
      method: "BCA Virtual Account"
    },
    {
      id: "TRX-10928373",
      school: "SMK Bisa Hebat Bandung",
      plan: "STARTER SEKOLAH",
      amount: 0,
      date: "18 Agt 2026, 09:15 WIB",
      status: "success",
      method: "Free Trial"
    },
    {
      id: "TRX-10928372",
      school: "SMP IT Al-Fatih",
      plan: "ENTERPRISE INSTANSI",
      amount: 7500000,
      date: "17 Agt 2026, 16:45 WIB",
      status: "pending",
      method: "Mandiri Virtual Account"
    },
    {
      id: "TRX-10928371",
      school: "SD Negeri 05 Pagi",
      plan: "PRO PPDB & CBT",
      amount: 1500000,
      date: "15 Agt 2026, 11:20 WIB",
      status: "failed",
      method: "QRIS"
    },
    {
      id: "TRX-10928370",
      school: "SMA Taruna Bangsa",
      plan: "PRO PPDB & CBT",
      amount: 1500000,
      date: "12 Agt 2026, 08:00 WIB",
      status: "success",
      method: "BNI Virtual Account"
    }
  ];

  const filteredTransactions = dummyTransactions.filter(trx => 
    trx.school.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="font-bold text-slate-800 dark:text-white">Daftar Transaksi Terbaru</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID trx atau nama sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6 whitespace-nowrap">ID Transaksi</th>
                <th className="p-4 whitespace-nowrap">Sekolah & Paket</th>
                <th className="p-4 whitespace-nowrap">Nominal</th>
                <th className="p-4 whitespace-nowrap">Metode Pembayaran</th>
                <th className="p-4 whitespace-nowrap">Tanggal</th>
                <th className="p-4 pr-6 whitespace-nowrap">Status</th>
                <th className="p-4 pr-6 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {trx.id}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{trx.school}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{trx.plan}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {trx.amount > 0 ? `Rp ${trx.amount.toLocaleString("id-ID")}` : "Gratis"}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                        {trx.method}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-xs font-medium">
                      {trx.date}
                    </td>
                    <td className="p-4">
                      {trx.status === "success" && (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          <CheckCircle2 size={16} /> Sukses
                        </div>
                      )}
                      {trx.status === "pending" && (
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold">
                          <Clock size={16} /> Menunggu
                        </div>
                      )}
                      {trx.status === "failed" && (
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-bold">
                          <XCircle size={16} /> Gagal
                        </div>
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Lihat Invoice">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ada transaksi yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
