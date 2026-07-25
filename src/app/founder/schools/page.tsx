"use client";

import React, { useEffect, useState } from "react";
import { Building, CheckCircle, XCircle, Search, Edit } from "lucide-react";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for now, you can hook this up to a real GET /api/saas/schools later.
    setSchools([
      { id: "1", name: "SMK Taruna Bhakti", slug: "smktarunabhakti", status: "active", email: "info@smktarunabhakti.sch.id", phone: "08123" }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Manajemen Sekolah</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola pendaftaran tenant sekolah di sistem SaaS Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Cari sekolah..." className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="p-4 font-semibold">Sekolah</th>
              <th className="p-4 font-semibold">Subdomain Slug</th>
              <th className="p-4 font-semibold">Kontak</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {schools.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Building size={18} />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">{s.name}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs text-slate-500">/{s.slug}</td>
                <td className="p-4">
                  <p className="text-slate-800 dark:text-white font-medium">{s.email}</p>
                  <p className="text-slate-500 text-xs">{s.phone}</p>
                </td>
                <td className="p-4">
                  {s.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} /> Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                      <XCircle size={14} /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
