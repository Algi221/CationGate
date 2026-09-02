"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowUpRight, CheckCircle2, XCircle, AlertCircle, Activity } from "lucide-react";
import { SchoolTenant } from "./types";

interface GatekeeperPendingSchoolsProps {
  loading: boolean;
  pendingSchools: SchoolTenant[];
}

export function GatekeeperPendingSchools({
  loading,
  pendingSchools,
}: GatekeeperPendingSchoolsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full">
      {/* Antrean Verifikasi Sekolah Real-time */}
      <div className="bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Antrean Verifikasi Real-time
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  Sekolah menunggu verifikasi SK
                </p>
              </div>
            </div>

            <Link
              href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
              className="text-xs font-bold text-[#FFD33B] hover:underline flex items-center gap-1"
            >
              Lihat Semua ({pendingSchools.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 py-2 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold">
                Memuat antrean verifikasi...
              </div>
            ) : pendingSchools.length > 0 ? (
              <>
                {pendingSchools.slice(0, 5).map((sc) => (
                  <div
                    key={sc.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFD33B] text-[#2e3749] font-black text-sm flex items-center justify-center shrink-0">
                        {sc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {sc.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-white/60 font-mono">
                          NPSN: {sc.npsn || "-"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/gatekeeper/dashboard/schools?filter=PENDING_VERIFICATION"
                      className="px-3.5 py-2 rounded-xl bg-[#FFD33B] hover:bg-[#F3C625] text-[#2e3749] text-xs font-bold transition-colors shadow-xs flex items-center gap-1 shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Review
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-slate-700 dark:text-white text-sm">
                  Tidak Ada Antrean Verifikasi
                </h4>
                <p className="text-xs text-slate-500 dark:text-white/60 max-w-xs mx-auto">
                  Semua dokumen sekolah yang terdaftar saat ini sudah diverifikasi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gatekeeper Audit Log */}
      <div className="bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/80 border border-slate-200 dark:border-white/10">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Gatekeeper Audit Log
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  Riwayat aksi verifikasi terbaru
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 py-2 max-h-80 overflow-y-auto">
            {[
              {
                action: "Verifikasi SK Diterima",
                subject: "SMAN 1 Nusantara",
                time: "10 menit lalu",
                icon: CheckCircle2,
                color: "text-emerald-500",
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
              },
              {
                action: "Pendaftaran Ditolak (SK Buram)",
                subject: "SMP Cipta Bangsa",
                time: "1 jam lalu",
                icon: XCircle,
                color: "text-rose-500",
                bg: "bg-rose-50 dark:bg-rose-950/40",
              },
              {
                action: "Suspend Tenant (Tunggakan)",
                subject: "SMK Budi Mulia",
                time: "3 jam lalu",
                icon: AlertCircle,
                color: "text-amber-500",
                bg: "bg-amber-50 dark:bg-amber-950/40",
              },
              {
                action: "Verifikasi SK Diterima",
                subject: "SD Global Islamic",
                time: "Kemarin",
                icon: CheckCircle2,
                color: "text-emerald-500",
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
              },
            ].map((log, idx) => (
              <div
                key={idx}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-2xl ${log.bg} ${log.color} shrink-0`}>
                    <log.icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {log.action}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-white/60 truncate">
                      {log.subject}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider shrink-0">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
