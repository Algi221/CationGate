"use client";

import React from "react";
import { Globe, Eye, Check, Trash2, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { SchoolTenant } from "./SchoolDetailsModal";

interface SchoolTenantRowProps {
  school: SchoolTenant;
  getSubdomainUrl: (slug: string, path?: string) => string;
  onSelect: (school: SchoolTenant) => void;
  onApprove: (school: SchoolTenant) => void;
  onTakedown: (school: SchoolTenant) => void;
  onPurge: (school: SchoolTenant) => void;
}

export const SchoolTenantRow: React.FC<SchoolTenantRowProps> = ({
  school: sc,
  getSubdomainUrl,
  onSelect,
  onApprove,
  onTakedown,
  onPurge
}) => {
  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
      {/* Sekolah */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2e3749] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            {sc.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">{sc.name}</h4>
            <a
              href={getSubdomainUrl(sc.slug)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-[#FFD33B] font-mono font-bold hover:underline mt-0.5"
              title={`Kunjungi ${sc.slug}.cationgate.site`}
            >
              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{sc.slug}.cationgate.site</span>
            </a>
          </div>
        </div>
      </td>

      {/* NPSN & Dapodik */}
      <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
        <p className="font-bold">{sc.npsn || "-"}</p>
        <p className="text-[10px] text-slate-400">{sc.dapodik_code || "-"}</p>
      </td>

      {/* Email Resmi */}
      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-mono">
        {sc.official_email || sc.email || "-"}
      </td>

      {/* Paket SaaS */}
      <td className="py-4 px-4">
        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] uppercase border border-slate-200 dark:border-slate-700">
          {sc.plan_type || "TRIAL"}
        </span>
      </td>

      {/* Status Verifikasi */}
      <td className="py-4 px-4">
        <StatusBadge status={sc.status} size="sm" />
      </td>

      {/* Aksi Platform */}
      <td className="py-4 px-5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Lihat Detail Modal */}
          <button
            type="button"
            onClick={() => onSelect(sc)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Lihat Seluruh Data & Dokumen SK"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Approve Button if pending/unverified */}
          {sc.status !== "FULL_VERIFIED" && (
            <button
              type="button"
              onClick={() => onApprove(sc)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              title="Approve & Verifikasi Sekolah"
            >
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
          )}

          {/* Takedown Button */}
          <button
            type="button"
            onClick={() => onTakedown(sc)}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
            title="Takedown / Dibekukan Subdomain & Akun"
          >
            Takedown
          </button>

          {/* Purge / Hapus Permanen */}
          <button
            type="button"
            onClick={() => onPurge(sc)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Hapus Permanen Subdomain & Akun (Purge Data)"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Direct Links */}
          <a
            href={getSubdomainUrl(sc.slug)}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Lihat Landing Page (${sc.slug}.cationgate.site)`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={getSubdomainUrl(sc.slug, "/dashboard")}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2e3749] dark:text-[#FFD33B] text-xs font-bold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
            title={`Buka Dashboard (${sc.slug}.cationgate.site/dashboard)`}
          >
            Dashboard
          </a>
        </div>
      </td>
    </tr>
  );
};
