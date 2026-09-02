"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { MajorItem } from "../../types";

interface MajorGalleryFormProps {
  editingMajor: MajorItem;
  setEditingMajor: (val: MajorItem | null) => void;
  dragActiveStates: Record<string, boolean>;
  setDragActiveStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleDragState: (e: React.DragEvent, key: string, status: boolean) => void;
  processMediaFile: (file: File, type: `gallery-${number}`) => void;
}

export const MajorGalleryForm: React.FC<MajorGalleryFormProps> = ({
  editingMajor,
  setEditingMajor,
  dragActiveStates,
  setDragActiveStates,
  handleDragState,
  processMediaFile,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
          Galeri Aktivitas (4 Foto &amp; Caption)
        </h4>
        <span className="text-[8px] text-slate-400 font-bold block mt-1 uppercase">
          Ganti foto standard Unsplash menggunakan File Explorer Anda secara visual
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((slotIdx) => {
          const galItem =
            (editingMajor.gallery && editingMajor.gallery[slotIdx]) || {
              url: "",
              caption: "",
            };
          const elementId = `gallery-${slotIdx}`;

          return (
            <div
              key={slotIdx}
              className="border border-slate-200 dark:border-slate-800/60 p-4.5 rounded-2xl bg-white dark:bg-[#0f172a] flex flex-col justify-between gap-3 shadow-sm"
            >
              <div
                onDragEnter={(e) => handleDragState(e, elementId, true)}
                onDragOver={(e) => handleDragState(e, elementId, true)}
                onDragLeave={(e) => handleDragState(e, elementId, false)}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActiveStates((prev) => ({
                    ...prev,
                    [elementId]: false,
                  }));
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processMediaFile(
                      e.dataTransfer.files[0],
                      `gallery-${slotIdx}` as `gallery-${number}`,
                    );
                  }
                }}
                onClick={() =>
                  document.getElementById(`picker-gallery-${slotIdx}`)?.click()
                }
                className={`h-32 border border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                  dragActiveStates[elementId]
                    ? "border-blue-500 bg-blue-50/10"
                    : "border-slate-300 dark:border-slate-800 hover:border-blue-500/40"
                }`}
                style={{
                  backgroundImage: galItem.url ? `url(${galItem.url})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <input
                  id={`picker-gallery-${slotIdx}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processMediaFile(
                        e.target.files[0],
                        `gallery-${slotIdx}` as `gallery-${number}`,
                      );
                    }
                  }}
                  className="hidden"
                />
                <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] opacity-80 group-hover:opacity-90 transition-opacity flex flex-col items-center justify-center text-white p-2">
                  <ImageIcon
                    size={18}
                    className="text-blue-400 mb-1 animate-pulse"
                  />
                  <span className="text-[8px] font-black uppercase tracking-wider">
                    Ganti Foto Galeri #{slotIdx + 1}
                  </span>
                  <span className="text-[6px] font-bold text-slate-400 uppercase mt-0.5">
                    Atau Klik Explorer
                  </span>
                </div>
              </div>

              <input
                type="text"
                maxLength={100}
                value={galItem.caption}
                onChange={(e) => {
                  const updatedGallery = [...(editingMajor.gallery || [])];
                  if (!updatedGallery[slotIdx])
                    updatedGallery[slotIdx] = { url: "", caption: "" };
                  updatedGallery[slotIdx] = {
                    ...updatedGallery[slotIdx],
                    caption: e.target.value,
                  };
                  setEditingMajor({
                    ...editingMajor,
                    gallery: updatedGallery,
                  });
                }}
                placeholder={`Caption Foto #${slotIdx + 1}`}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-bold text-[10px] focus:outline-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
