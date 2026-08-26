"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search, RefreshCw, Radio, Trash2,
  AlertCircle, AlertTriangle, CheckCircle2,
  Download, Terminal, ChevronRight, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SystemLog {
  id: string;
  timestamp: string; // e.g. "AUG 26 20:00:05.09"
  isoTime: string;
  method: string;
  status: number;
  host: string;
  request: string;
  durationMs: number;
  message?: string;
  level: "info" | "warn" | "error";
}

export default function GatekeeperLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveMode, setLiveMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedHost, setSelectedHost] = useState<string>("ALL");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gatekeeper_token") : null;
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (selectedHost !== "ALL") params.append("host", selectedHost);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("limit", "150");

      const res = await fetch(`/api/gatekeeper/system-logs?${params.toString()}&t=${Date.now()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) return;
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLogs(json.data);
      }
    } catch (_err) {
      // Ignore polling errors
    } finally {
      setLoading(false);
    }
  }, [statusFilter, selectedHost, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Real-time live mode polling interval (2 seconds)
  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      fetchLogs();
    }, 2000);

    return () => clearInterval(interval);
  }, [liveMode, fetchLogs]);

  // Clear logs handler
  const handleClearLogs = async () => {
    if (!confirm("Bersihkan seluruh log runtime saat ini?")) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gatekeeper_token") : null;
      await fetch("/api/gatekeeper/system-logs", {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      setLogs([]);
    } catch (_e) {}
  };

  // Export logs to JSON
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cationgate_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Unique hosts for filter dropdown
  const uniqueHosts = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.host) set.add(l.host);
    });
    return Array.from(set);
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchQuery ||
        log.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.message && log.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
        String(log.status).includes(searchQuery);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "5xx" && log.status >= 500) ||
        (statusFilter === "4xx" && log.status >= 400 && log.status < 500) ||
        (statusFilter === "3xx" && log.status >= 300 && log.status < 400) ||
        (statusFilter === "2xx" && log.status >= 200 && log.status < 300);

      const matchesHost = selectedHost === "ALL" || log.host.toLowerCase().includes(selectedHost.toLowerCase());

      return matchesSearch && matchesStatus && matchesHost;
    });
  }, [logs, searchQuery, statusFilter, selectedHost]);

  // Counts for badges
  const counts = useMemo(() => {
    let s2xx = 0, s3xx = 0, s4xx = 0, s5xx = 0;
    logs.forEach((l) => {
      if (l.status >= 500) s5xx++;
      else if (l.status >= 400) s4xx++;
      else if (l.status >= 300) s3xx++;
      else if (l.status >= 200) s2xx++;
    });
    return { s2xx, s3xx, s4xx, s5xx, total: logs.length };
  }, [logs]);

  const getStatusBadge = (status: number) => {
    if (status >= 500) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40 flex items-center gap-1 font-mono">
          <AlertCircle className="w-3 h-3 shrink-0" /> {status}
        </span>
      );
    }
    if (status >= 400) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 flex items-center gap-1 font-mono">
          <AlertTriangle className="w-3 h-3 shrink-0" /> {status}
        </span>
      );
    }
    if (status >= 300) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/40 font-mono">
          {status}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 flex items-center gap-1 font-mono">
        <CheckCircle2 className="w-3 h-3 shrink-0" /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 w-full max-w-full transition-colors duration-300">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#2e3749] border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#FFD33B]/15 dark:bg-white/10 text-[#2e3749] dark:text-[#FFD33B] border border-[#FFD33B]/30 dark:border-white/10 shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              Log Aktivitas &amp; Runtime Gateway
              <span className="text-xs px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 font-mono font-bold">
                LIVE STREAM
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-white/60 font-medium mt-1">
              Pantau seluruh request multi-tenant, error API 500, webhook, dan akses portal secara real-time tanpa perlu membuka konsol Vercel.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              liveMode
                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveMode ? "animate-pulse" : ""}`} />
            {liveMode ? "Live: Streaming" : "Live: Paused"}
          </button>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
            title="Refresh Manual"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportLogs}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
            title="Export Log JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 transition-colors shadow-xs"
            title="Bersihkan Log"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Main Terminal Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white dark:bg-[#1e2533] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col transition-colors duration-300"
      >
        {/* Controls Toolbar (Search & Filter Status Bar) */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 transition-colors duration-300">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari log (contoh: /api/applicants, error, 500, slug)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
            />
          </div>

          {/* Filter Status Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                statusFilter === "ALL"
                  ? "bg-[#2e3749] text-white dark:bg-[#FFD33B] dark:text-[#2e3749] shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              Semua ({counts.total})
            </button>

            <button
              onClick={() => setStatusFilter("2xx")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                statusFilter === "2xx"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800"
              }`}
            >
              2xx ({counts.s2xx})
            </button>

            <button
              onClick={() => setStatusFilter("3xx")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                statusFilter === "3xx"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-800"
              }`}
            >
              3xx ({counts.s3xx})
            </button>

            <button
              onClick={() => setStatusFilter("4xx")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                statusFilter === "4xx"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800"
              }`}
            >
              4xx ({counts.s4xx})
            </button>

            <button
              onClick={() => setStatusFilter("5xx")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                statusFilter === "5xx"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800"
              }`}
            >
              5xx Error ({counts.s5xx})
            </button>

            {/* Host Filter Dropdown */}
            {uniqueHosts.length > 1 && (
              <select
                value={selectedHost}
                onChange={(e) => setSelectedHost(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shrink-0 shadow-xs"
              >
                <option value="ALL">Semua Host ({uniqueHosts.length})</option>
                {uniqueHosts.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Logs Table Area */}
        <div className="overflow-x-auto min-h-120 max-h-[70vh] overflow-y-auto scrollbar-thin [scrollbar-color:#cbd5e1_transparent] dark:[scrollbar-color:#475569_transparent]">
          {filteredLogs.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
              <Terminal className="w-10 h-10 text-slate-300 dark:text-slate-600 animate-pulse" />
              <p className="text-slate-700 dark:text-slate-300 font-mono text-sm font-bold">Tidak ada log yang sesuai filter.</p>
              <p className="text-slate-400 dark:text-slate-500 font-mono text-xs">Request baru yang masuk ke server akan otomatis tercatat di sini.</p>
            </div>
          ) : (
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-slate-100/90 dark:bg-slate-950/70 sticky top-0 z-10 border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-wider font-extrabold select-none">
                <tr>
                  <th className="py-3 px-4 w-44">Time</th>
                  <th className="py-3 px-3 w-24">Status</th>
                  <th className="py-3 px-4 w-48">Host</th>
                  <th className="py-3 px-4 w-64">Request</th>
                  <th className="py-3 px-4">Messages / Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => {
                  const isError = log.status >= 500;
                  const isWarn = log.status >= 400 && log.status < 500;
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className={`cursor-pointer transition-colors duration-150 group ${
                          isError
                            ? "bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-100/70 dark:hover:bg-rose-950/35 text-rose-900 dark:text-rose-200 border-l-4 border-rose-500"
                            : isWarn
                            ? "bg-amber-50/60 dark:bg-amber-950/15 hover:bg-amber-100/60 dark:hover:bg-amber-950/25 text-amber-900 dark:text-amber-200 border-l-4 border-amber-500"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {/* Time */}
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-1.5">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100" />
                          )}
                          <span className="font-semibold">{log.timestamp}</span>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {getStatusBadge(log.status)}
                        </td>

                        {/* Host */}
                        <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap truncate max-w-48 text-[11px]">
                          {log.host}
                        </td>

                        {/* Request Method + Path */}
                        <td className="py-2.5 px-4 whitespace-nowrap truncate max-w-64 font-bold text-slate-900 dark:text-white">
                          <span
                            className={`mr-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.method === "POST"
                                ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                : log.method === "PUT" || log.method === "PATCH"
                                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                : log.method === "DELETE"
                                ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            }`}
                          >
                            {log.method}
                          </span>
                          <span>{log.request}</span>
                        </td>

                        {/* Messages / Execution details */}
                        <td className="py-2.5 px-4 text-[11px] truncate max-w-md">
                          {log.message ? (
                            <span className={isError ? "text-rose-600 dark:text-rose-400 font-bold" : isWarn ? "text-amber-700 dark:text-amber-300 font-semibold" : "text-slate-600 dark:text-slate-400"}>
                              {log.message}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">-- completed in {log.durationMs}ms</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Details Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50/90 dark:bg-slate-950/60 border-y border-slate-200 dark:border-slate-800"
                          >
                            <td colSpan={5} className="p-4 pl-12">
                              <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-xs">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                  <span className="text-slate-700 dark:text-slate-300 font-bold">Request ID: {log.id}</span>
                                  <span className="text-slate-500 dark:text-slate-400">
                                    Duration: <strong className="text-slate-900 dark:text-white font-bold">{log.durationMs} ms</strong>
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
                                  <div><strong className="text-slate-500 dark:text-slate-400">Timestamp:</strong> <span className="text-slate-800 dark:text-slate-200">{log.isoTime}</span></div>
                                  <div><strong className="text-slate-500 dark:text-slate-400">Host:</strong> <span className="text-slate-800 dark:text-slate-200">{log.host}</span></div>
                                  <div><strong className="text-slate-500 dark:text-slate-400">Method:</strong> <span className="text-slate-800 dark:text-slate-200">{log.method}</span></div>
                                  <div><strong className="text-slate-500 dark:text-slate-400">Path:</strong> <span className="text-slate-800 dark:text-slate-200">{log.request}</span></div>
                                  <div><strong className="text-slate-500 dark:text-slate-400">Status Code:</strong> <span className="text-slate-800 dark:text-slate-200">{log.status}</span></div>
                                  <div><strong className="text-slate-500 dark:text-slate-400">Level:</strong> <span className="text-slate-800 dark:text-slate-200">{log.level.toUpperCase()}</span></div>
                                </div>
                                {log.message && (
                                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <strong className="text-slate-500 dark:text-slate-400 block mb-1">Message / Response Detail:</strong>
                                    <pre className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl text-slate-800 dark:text-rose-300 border border-slate-200 dark:border-slate-800/80 whitespace-pre-wrap overflow-x-auto text-[11px]">
                                      {log.message}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Status Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-6 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${liveMode ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`}></span>
              {liveMode ? "Streaming realtime gateway buffer" : "Streaming dijeda"}
            </span>
          </div>
          <div>
            Menampilkan <strong className="text-slate-800 dark:text-white font-bold">{filteredLogs.length}</strong> dari <strong className="text-slate-600 dark:text-slate-300">{logs.length}</strong> log
          </div>
        </div>
      </motion.div>
    </div>
  );
}
