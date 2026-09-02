"use client";

import React from "react";
import { GraduationCap, Plus } from "lucide-react";
import { MajorItem } from "../types";
import { MajorCardItem, MajorEditorWorkspace } from "./majors";

interface MajorsTabProps {
  majorsList: MajorItem[];
  setMajorsList: React.Dispatch<React.SetStateAction<MajorItem[]>>;
  editingMajor: MajorItem | null;
  setEditingMajor: (val: MajorItem | null) => void;
  isNewMajor: boolean;
  setIsNewMajor: (val: boolean) => void;
  dragActiveStates: Record<string, boolean>;
  setDragActiveStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleDragState: (e: React.DragEvent, key: string, status: boolean) => void;
  processMediaFile: (file: File, type: "logo" | "banner" | "video" | `gallery-${number}`) => void;
  showToastMsg: (msg: string, type?: "success" | "error" | "info") => void;
}

export const MajorsTab: React.FC<MajorsTabProps> = ({
  majorsList,
  setMajorsList,
  editingMajor,
  setEditingMajor,
  isNewMajor,
  setIsNewMajor,
  dragActiveStates,
  setDragActiveStates,
  handleDragState,
  processMediaFile,
  showToastMsg,
}) => {
  const emptyMajor = (): MajorItem => ({
    code: "",
    title: "",
    desc: "",
    color: "#2563eb",
    careers: [
      { title: "", desc: "" },
      { title: "", desc: "" },
      { title: "", desc: "" },
      { title: "", desc: "" },
    ],
    facilities: [
      "Laboratorium Komputer & Praktikum",
      "Smart Interactive Classroom",
      "Pusat Pengembangan Kompetensi",
    ],
    logo: "",
    banner: "",
    video: "",
    gallery: [
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" },
    ],
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {editingMajor === null ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                <GraduationCap size={16} className="text-blue-500" />
                <span>Kompetensi Keahlian (Jurusan)</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Klik salah satu kartu jurusan untuk membuka Workspace Editor penuh secara inline.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsNewMajor(true);
                setEditingMajor(emptyMajor());
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase font-black tracking-wider transition-all shadow-md shadow-blue-500/10 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Tambah Jurusan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorsList.map((major) => (
              <MajorCardItem
                key={major.code}
                major={major}
                majorsList={majorsList}
                setMajorsList={setMajorsList}
                setEditingMajor={setEditingMajor}
                showToastMsg={showToastMsg}
              />
            ))}
          </div>
        </>
      ) : (
        <MajorEditorWorkspace
          editingMajor={editingMajor}
          setEditingMajor={setEditingMajor}
          isNewMajor={isNewMajor}
          setIsNewMajor={setIsNewMajor}
          majorsList={majorsList}
          setMajorsList={setMajorsList}
          dragActiveStates={dragActiveStates}
          setDragActiveStates={setDragActiveStates}
          handleDragState={handleDragState}
          processMediaFile={processMediaFile}
          showToastMsg={showToastMsg}
        />
      )}
    </div>
  );
};
