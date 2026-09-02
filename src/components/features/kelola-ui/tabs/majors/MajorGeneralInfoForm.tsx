"use client";

import React from "react";
import { MajorItem } from "../../types";

interface MajorGeneralInfoFormProps {
  editingMajor: MajorItem;
  setEditingMajor: (val: MajorItem | null) => void;
  isNewMajor: boolean;
}

export const MajorGeneralInfoForm: React.FC<MajorGeneralInfoFormProps> = ({
  editingMajor,
  setEditingMajor,
  isNewMajor,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
        Informasi Umum
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">
            Kode Jurusan (e.g. RPL, TJKT)
          </label>
          <input
            type="text"
            maxLength={10}
            value={editingMajor.code}
            disabled={!isNewMajor}
            onChange={(e) =>
              setEditingMajor({
                ...editingMajor,
                code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
              })
            }
            placeholder="Masukkan kode jurusan..."
            className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none ${!isNewMajor ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">
              Nama Program Studi
            </label>
            <span className="text-[8px] text-slate-400 font-bold">
              {editingMajor.title.length}/80
            </span>
          </div>
          <input
            type="text"
            maxLength={80}
            value={editingMajor.title}
            onChange={(e) =>
              setEditingMajor({ ...editingMajor, title: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">
            Warna Hex Aksen
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={editingMajor.color}
              onChange={(e) =>
                setEditingMajor({ ...editingMajor, color: e.target.value })
              }
              className="w-10 h-10 p-0 rounded-xl border-0 cursor-pointer overflow-hidden shrink-0"
            />
            <input
              type="text"
              maxLength={7}
              value={editingMajor.color}
              onChange={(e) =>
                setEditingMajor({ ...editingMajor, color: e.target.value })
              }
              className="flex-1 px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs uppercase focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">
            Deskripsi Lengkap
          </label>
          <span className="text-[8px] text-slate-400 font-bold">
            {editingMajor.desc.length}/400
          </span>
        </div>
        <textarea
          maxLength={400}
          value={editingMajor.desc}
          onChange={(e) =>
            setEditingMajor({ ...editingMajor, desc: e.target.value })
          }
          rows={3}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
