"use client";

import React from "react";
import { CheckCircle2, Globe, Eye, Trash2, RefreshCw } from "lucide-react";
import { sanitizeSlug, safeOpenWindow } from "@/lib/sanitizeUrl";
import { SchoolTenant } from "./types";

interface ActiveSchoolsTableProps {
  loading: boolean;
  filteredSchools: SchoolTenant[];
  onSelectSchool: (school: SchoolTenant) => void;
  onTakedownSchool: (school: SchoolTenant) => void;
}

export function ActiveSchoolsTable({
  loading,
  filteredSchools,
  onSelectSchool,
  onTakedownSchool,
}: ActiveSchoolsTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-4 px-6">Sekolah &amp; Subdomain</th>
              <th className="py-4 px-4">NPSN &amp; Legalitas</th>
              <th className="py-4 px-4">Penanggung Jawab</th>
              <th className="py-4 px-4">Paket SaaS</th>
              <th className="py-4 px-4">Status Portal</th>
              <th className="py-4 px-6 text-right">Aksi Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                  <p className="font-semibold text-xs">
                    Memuat data sekolah aktif...
                  </p>
                </td>
              </tr>
            ) : filteredSchools.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="font-bold text-sm text-slate-600 dark:text-slate-400">
                    Belum ada sekolah aktif yang cocok
                  </p>
                  <p className="text-xs mt-0.5">
                    Coba periksa kata kunci pencarian Anda.
                  </p>
                </td>
              </tr>
            ) : (
              filteredSchools.map((school) => (
                <tr
                  key={school.id || school.slug}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {school.name
                          ? school.name.substring(0, 2).toUpperCase()
                          : "SMK"}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                          {school.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-slate-400">
                            /{sanitizeSlug(school.slug)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              safeOpenWindow(
                                `http://${sanitizeSlug(school.slug)}.localhost:3000`,
                              );
                            }}
                            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            title="Buka Landing Page"
                          >
                            <Globe className="w-2.5 h-2.5" /> Web
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold font-mono text-slate-700 dark:text-slate-300 block text-xs">
                      {school.npsn || "NPSN: -"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      SK: {school.legal_sk_number || "-"}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      {school.admin_name || "Admin Sekolah"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate max-w-35">
                      {school.official_email || "-"}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase font-mono">
                      {school.plan_type || "TRIAL"}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Aktif
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectSchool(school)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Detail & Berkas Legalitas"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onTakedownSchool(school)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Takedown Instansi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
