"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Receipt,
  Search,
  RefreshCw,
  Download,
  CreditCard,
} from "lucide-react";
import {
  TransactionItem,
  TransactionStats,
  TransactionsStatsCards,
  TransactionsTable,
  TransactionDetailModal,
  exportTransactionsToExcel,
} from "@/components/features/gatekeeper/transactions";

export default function GatekeeperTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    total_revenue: 0,
    total_transactions: 0,
    active_subscriptions: 0,
    avg_order_value: 0,
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
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("gatekeeper_token") ||
            localStorage.getItem("ppdb_admin_token")
          : null;
      const res = await fetch("/api/gatekeeper/transactions", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
        (tx.customer_name &&
          tx.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.customer_email &&
          tx.customer_email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === "ALL" || tx.status === statusFilter;
      const matchPlan =
        planFilter === "ALL" ||
        tx.plan_name.toLowerCase().includes(planFilter.toLowerCase());

      return matchSearch && matchStatus && matchPlan;
    });
  }, [transactions, searchQuery, statusFilter, planFilter]);

  const handleExport = () => {
    exportTransactionsToExcel(filteredTransactions);
  };

  return (
    <div className="space-y-8 font-sans transition-colors animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100 dark:border-blue-900/40">
            <CreditCard size={14} /> SaaS Financial Gateway
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Receipt className="text-blue-600 dark:text-blue-500" /> Riwayat
            Transaksi SaaS
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Monitoring seluruh arus pembayaran langganan lisensi sekolah, baik
            pembayaran real Midtrans maupun simulasi Sandbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchTransactions}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-blue-600" : ""}
            />
            <span>Muat Ulang</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <TransactionsStatsCards stats={stats} />

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
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
      <TransactionsTable
        loading={loading}
        filteredTransactions={filteredTransactions}
        copiedOrderId={copiedOrderId}
        onCopyOrderId={handleCopy}
        onSelectTransaction={setSelectedTx}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        selectedTx={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
