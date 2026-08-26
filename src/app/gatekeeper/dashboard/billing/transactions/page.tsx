"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Receipt,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  Building,
  CreditCard,
  TrendingUp,
  DollarSign,
  Copy,
  Check,
  Shield,
  Eye,
  X,
  Sparkles
} from "lucide-react";
import Swal from "sweetalert2";

interface TransactionItem {
  id: number | string;
  order_id: string;
  school_name: string;
  school_slug: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  status: "SETTLEMENT" | "PENDING" | "CANCELLED" | "EXPIRED";
  customer_name?: string;
  customer_email?: string;
  created_at: string;
  settlement_time?: string;
}

interface TransactionStats {
  total_revenue: number;
  total_transactions: number;
  active_subscriptions: number;
  avg_order_value: number;
}

function formatRupiah(num: number): string {
  return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (_e) {
    return dateStr;
  }
}

export default function GatekeeperTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    total_revenue: 0,
    total_transactions: 0,
    active_subscriptions: 0,
    avg_order_value: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? (localStorage.getItem("gatekeeper_token") || localStorage.getItem("ppdb_admin_token")) : null;
      const res = await fetch("/api/gatekeeper/transactions", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data || []);
        if (json.stats) setStats(json.stats);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedOrderId(text);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.school_slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.customer_name && tx.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.customer_email && tx.customer_email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === "ALL" || tx.status === statusFilter;
      const matchPlan =
        planFilter === "ALL" ||
        tx.plan_name.toLowerCase().includes(planFilter.toLowerCase());

      return matchSearch && matchStatus && matchPlan;
    });
  }, [transactions, searchQuery, statusFilter, planFilter]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      Swal.fire({
        title: "Tidak Ada Data",
        text: "Tidak ada transaksi untuk diekspor ke CSV.",
        icon: "info",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    const headers = ["Order ID", "Instansi Sekolah", "Subdomain", "Paket", "Nominal (IDR)", "Metode Pembayaran", "Status", "Tanggal Transaksi"];
    const rows = filteredTransactions.map((tx) => [
      `"${tx.order_id}"`,
      `"${tx.school_name}"`,
      `"${tx.school_slug}.cationgate.site"`,
      `"${tx.plan_name}"`,
      tx.amount,
      `"${tx.payment_method}"`,
      `"${tx.status}"`,
      `"${formatDateTime(tx.created_at)}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Transaksi_CationGate_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100 dark:border-blue-900/40">
            <CreditCard size={14} /> SaaS Financial Gateway
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Receipt className="text-blue-600 dark:text-blue-500" /> Riwayat Transaksi SaaS
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Monitoring seluruh arus pembayaran langganan lisensi sekolah, baik pembayaran real Midtrans maupun simulasi Sandbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchTransactions}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
            <span>Muat Ulang</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pendapatan (Gross)</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaksi Sukses</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Instansi Berlangganan</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rata-Rata Nilai Order</span>
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

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Order ID, nama sekolah, email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="SETTLEMENT">SETTLEMENT (Lunas)</option>
            <option value="PENDING">PENDING</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Paket</option>
            <option value="pro">Pro Tahunan</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
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
                      <p className="font-bold text-slate-600 dark:text-slate-400">Belum Ada Transaksi Tercatat</p>
                      <p className="text-[11px] text-slate-400">Transaksi baru akan otomatis muncul saat sekolah melakukan pembayaran paket.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isSettled = tx.status === "SETTLEMENT";
                  return (
                    <tr key={tx.id || tx.order_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      {/* Order ID */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                            {tx.order_id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tx.order_id)}
                            title="Salin Order ID"
                            className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                          >
                            {copiedOrderId === tx.order_id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>

                      {/* School */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{tx.school_name}</span>
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
                          onClick={() => setSelectedTx(tx)}
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

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative">
            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Rincian Transaksi Pembayaran</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedTx.order_id}</p>
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
                <span className="font-bold text-slate-900 dark:text-white text-right">{selectedTx.school_name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Subdomain Resmi</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  {selectedTx.school_slug.replace(/[^a-zA-Z0-9-]/g, "")}.cationgate.site
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Paket Langganan</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTx.plan_name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Metode Pembayaran</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTx.payment_method}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 font-medium">Waktu Transaksi</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatDateTime(selectedTx.settlement_time || selectedTx.created_at)}
                </span>
              </div>

              <div className="flex justify-between py-1 pt-2 text-sm">
                <span className="text-slate-600 dark:text-slate-300 font-black">Total Gross Amount</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  {formatRupiah(selectedTx.amount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
