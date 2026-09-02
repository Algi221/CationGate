"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { MajorItem } from "../../types";

interface MajorFacilitiesFormProps {
  editingMajor: MajorItem;
  setEditingMajor: (val: MajorItem | null) => void;
}

export const MajorFacilitiesForm: React.FC<MajorFacilitiesFormProps> = ({
  editingMajor,
  setEditingMajor,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
        Fasilitas Laboratorium &amp; Sarana Utama
      </h4>

      <div className="space-y-2.5">
        {(editingMajor.facilities || []).map((fac, fIdx) => (
          <div key={fIdx} className="flex items-center gap-2">
            <input
              type="text"
              maxLength={80}
              value={fac}
              onChange={(e) => {
                const updated = [...(editingMajor.facilities || [])];
                updated[fIdx] = e.target.value;
                setEditingMajor({ ...editingMajor, facilities: updated });
              }}
              className="flex-1 px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                const updated = (editingMajor.facilities || []).filter(
                  (_, i) => i !== fIdx,
                );
                setEditingMajor({ ...editingMajor, facilities: updated });
              }}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all shrink-0 cursor-pointer"
              title="Hapus Fasilitas"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            setEditingMajor({
              ...editingMajor,
              facilities: [
                ...(editingMajor.facilities || []),
                "Laboratorium / Sarana Baru",
              ],
            });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[9px] uppercase tracking-wider font-black transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={12} />
          <span>Tambah Baris Fasilitas</span>
        </button>
      </div>
    </div>
  );
};
