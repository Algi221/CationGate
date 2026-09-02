"use client";

import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { MajorItem } from "../../types";
import { MajorMediaUploaders } from "./MajorMediaUploaders";
import { MajorGeneralInfoForm } from "./MajorGeneralInfoForm";
import { MajorGalleryForm } from "./MajorGalleryForm";
import { MajorCareersForm } from "./MajorCareersForm";
import { MajorFacilitiesForm } from "./MajorFacilitiesForm";

interface MajorEditorWorkspaceProps {
  editingMajor: MajorItem;
  setEditingMajor: (val: MajorItem | null) => void;
  isNewMajor: boolean;
  setIsNewMajor: (val: boolean) => void;
  majorsList: MajorItem[];
  setMajorsList: React.Dispatch<React.SetStateAction<MajorItem[]>>;
  dragActiveStates: Record<string, boolean>;
  setDragActiveStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleDragState: (e: React.DragEvent, key: string, status: boolean) => void;
  processMediaFile: (file: File, type: "logo" | "banner" | "video" | `gallery-${number}`) => void;
  showToastMsg: (msg: string, type?: "success" | "error" | "info") => void;
}

export const MajorEditorWorkspace: React.FC<MajorEditorWorkspaceProps> = ({
  editingMajor,
  setEditingMajor,
  isNewMajor,
  setIsNewMajor,
  majorsList,
  setMajorsList,
  dragActiveStates,
  setDragActiveStates,
  handleDragState,
  processMediaFile,
  showToastMsg,
}) => {
  const handleSave = () => {
    if (!editingMajor.code.trim()) {
      showToastMsg("Kode Jurusan wajib diisi.", "error");
      return;
    }
    if (!editingMajor.title.trim()) {
      showToastMsg("Nama Program Studi wajib diisi.", "error");
      return;
    }

    let updated: MajorItem[];
    if (isNewMajor) {
      updated = [...majorsList, editingMajor];
    } else {
      updated = majorsList.map((m) =>
        m.code === editingMajor.code ? editingMajor : m,
      );
    }
    setMajorsList(updated);
    if (isNewMajor) setIsNewMajor(false);

    if (typeof window !== "undefined") {
      const slug = window.location.pathname.split("/")[1];
      if (slug)
        localStorage.setItem(
          `ppdb_majors_config_${slug}`,
          JSON.stringify(updated),
        );
      localStorage.setItem(`ppdb_majors_config`, JSON.stringify(updated));
      try {
        const token = localStorage.getItem("ppdb_admin_token");
        fetch(`/api/config?school_slug=${encodeURIComponent(slug)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            key: "ppdb_majors_config",
            value: updated,
          }),
        }).catch(() => {});
      } catch (_) {}
    }

    const savedCode = editingMajor.code;
    setEditingMajor(null);
    showToastMsg(`Program Studi ${savedCode} berhasil disimpan.`, "success");
  };

  const handleCancel = () => {
    setEditingMajor(null);
    setIsNewMajor(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Kembali ke List Kartu</span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className="w-3 h-6 rounded-full"
            style={{ backgroundColor: editingMajor.color }}
          />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
            {isNewMajor
              ? "WORKSPACE BARU JURUSAN"
              : `WORKSPACE EDITOR JURUSAN: ${editingMajor.code}`}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: General & Media Uploaders */}
        <div className="lg:col-span-1 space-y-6">
          <MajorMediaUploaders
            editingMajor={editingMajor}
            setEditingMajor={setEditingMajor}
            dragActiveStates={dragActiveStates}
            setDragActiveStates={setDragActiveStates}
            handleDragState={handleDragState}
            processMediaFile={processMediaFile}
          />
        </div>

        {/* Right: Core Fields, Careers, Facilities, Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <MajorGeneralInfoForm
            editingMajor={editingMajor}
            setEditingMajor={setEditingMajor}
            isNewMajor={isNewMajor}
          />

          <MajorGalleryForm
            editingMajor={editingMajor}
            setEditingMajor={setEditingMajor}
            dragActiveStates={dragActiveStates}
            setDragActiveStates={setDragActiveStates}
            handleDragState={handleDragState}
            processMediaFile={processMediaFile}
          />

          <MajorCareersForm
            editingMajor={editingMajor}
            setEditingMajor={setEditingMajor}
          />

          <MajorFacilitiesForm
            editingMajor={editingMajor}
            setEditingMajor={setEditingMajor}
          />
        </div>
      </div>

      {/* Control Footer */}
      <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-white/5 pt-4.5 mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-750 dark:text-slate-300 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Check size={14} />
          <span>Simpan Detail</span>
        </button>
      </div>
    </div>
  );
};
