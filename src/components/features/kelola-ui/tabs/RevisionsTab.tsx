"use client";

import React from "react";
import { Clock, RotateCcw } from "lucide-react";
import { RevisionLog } from "../types";

interface RevisionsTabProps {
  revisions: RevisionLog[];
  onRestore: (id: string) => void;
  formatDate: (dateStr: string) => string;
}

export const RevisionsTab: React.FC<RevisionsTabProps> = ({
  revisions,
  onRestore,
  formatDate
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
          <Clock size={16} className="text-blue-500" />
          <span>Riwayat &amp; Catatan Perubahan User Interface</span>
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
          Audit log revisi. Klik &quot;Pulihkan&quot; untuk rollback seluruh tampilan landing page dan form ke versi riwayat yang diinginkan
        </p>
      </div>

      <div className="space-y-4">
        {revisions.map((rev, index) => (
          <div 
            key={rev.id}
            className="bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-extrabold rounded-lg text-[9px] uppercase tracking-wider">
                  Revisi #{rev.revision_number ?? (revisions.length - index)}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase">
                  Oleh: @{rev.changed_by}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {rev.description || "Melakukan pembaruan massal UI"}
              </p>
              <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                <Clock size={10} />
                <span>{formatDate(rev.created_at)}</span>
              </div>
            </div>

            <button
              onClick={() => onRestore(rev.id)}
              className="px-4.5 py-2 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-500 hover:text-white text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Pulihkan (Restore)</span>
            </button>
          </div>
        ))}

        {revisions.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            Belum ada catatan riwayat perubahan. Perubahan pertama Anda akan menghasilkan catatan baru.
          </div>
        )}
      </div>
    </div>
  );
};
