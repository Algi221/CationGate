"use client";

import React from "react";
import { MajorItem } from "../../types";

interface MajorCareersFormProps {
  editingMajor: MajorItem;
  setEditingMajor: (val: MajorItem | null) => void;
}

export const MajorCareersForm: React.FC<MajorCareersFormProps> = ({
  editingMajor,
  setEditingMajor,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
        Peluang Kerja / Karir Lulusan (4 Item)
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((idx) => {
          const career =
            (editingMajor.careers && editingMajor.careers[idx]) || {
              title: "",
              desc: "",
            };

          return (
            <div
              key={idx}
              className="p-4 border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0f172a] rounded-2xl space-y-2"
            >
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                Karir Lulusan #{idx + 1}
              </span>
              <input
                type="text"
                maxLength={60}
                value={career.title}
                onChange={(e) => {
                  const updated = [...(editingMajor.careers || [])];
                  if (!updated[idx]) updated[idx] = { title: "", desc: "" };
                  updated[idx] = { ...updated[idx], title: e.target.value };
                  setEditingMajor({ ...editingMajor, careers: updated });
                }}
                placeholder="Nama Profesi"
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
              />
              <textarea
                maxLength={200}
                value={career.desc}
                onChange={(e) => {
                  const updated = [...(editingMajor.careers || [])];
                  if (!updated[idx]) updated[idx] = { title: "", desc: "" };
                  updated[idx] = { ...updated[idx], desc: e.target.value };
                  setEditingMajor({ ...editingMajor, careers: updated });
                }}
                rows={2}
                placeholder="Penjelasan profesi..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-semibold text-[10px] focus:outline-none resize-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
