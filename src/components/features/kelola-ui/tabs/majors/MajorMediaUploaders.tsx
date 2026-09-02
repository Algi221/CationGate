"use client";

import React from "react";
import { GraduationCap, Upload, Video, Trash2 } from "lucide-react";
import DOMPurify from "dompurify";
import { sanitizeSrc } from "@/utils/security";
import { MajorItem } from "../../types";

interface MajorMediaUploadersProps {
  editingMajor: MajorItem;
  setEditingMajor: (val: MajorItem | null) => void;
  dragActiveStates: Record<string, boolean>;
  setDragActiveStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleDragState: (e: React.DragEvent, key: string, status: boolean) => void;
  processMediaFile: (file: File, type: "logo" | "banner" | "video" | `gallery-${number}`) => void;
}

export const MajorMediaUploaders: React.FC<MajorMediaUploadersProps> = ({
  editingMajor,
  setEditingMajor,
  dragActiveStates,
  setDragActiveStates,
  handleDragState,
  processMediaFile,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Logo Drag & Drop */}
      <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-5 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
              Logo Kompetensi
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">
              Akan tampil di badge lingkar beranda
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border shadow p-0.5 flex items-center justify-center text-slate-400">
            {editingMajor.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={DOMPurify.sanitize(sanitizeSrc(editingMajor.logo))}
                alt=""
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <GraduationCap size={20} />
            )}
          </div>
        </div>

        <div
          onDragEnter={(e) => handleDragState(e, "logo", true)}
          onDragOver={(e) => handleDragState(e, "logo", true)}
          onDragLeave={(e) => handleDragState(e, "logo", false)}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActiveStates((prev) => ({ ...prev, logo: false }));
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processMediaFile(e.dataTransfer.files[0], "logo");
            }
          }}
          onClick={() => document.getElementById("logo-picker")?.click()}
          className={`h-36 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
            dragActiveStates.logo
              ? "border-blue-500 bg-blue-50/20"
              : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white dark:bg-[#0f172a]"
          }`}
          style={{
            backgroundImage: editingMajor.logo
              ? `url(${editingMajor.logo})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <input
            id="logo-picker"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processMediaFile(e.target.files[0], "logo");
              }
            }}
            className="hidden"
          />
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-90 group-hover:opacity-95 flex flex-col items-center justify-center text-white p-3">
            <Upload size={20} className="animate-bounce text-blue-400 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-wider">
              Drag / Ganti Logo
            </span>
            <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">
              Atau Klik Explorer
            </span>
          </div>
        </div>
      </div>

      {/* 2. Banner Image Drag & Drop */}
      <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-5 rounded-3xl space-y-3">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
            Banner Utama Unsplash
          </span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">
            Tampil di header visual detail halaman
          </span>
        </div>

        <div
          onDragEnter={(e) => handleDragState(e, "banner", true)}
          onDragOver={(e) => handleDragState(e, "banner", true)}
          onDragLeave={(e) => handleDragState(e, "banner", false)}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActiveStates((prev) => ({ ...prev, banner: false }));
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processMediaFile(e.dataTransfer.files[0], "banner");
            }
          }}
          onClick={() => document.getElementById("banner-picker")?.click()}
          className={`h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
            dragActiveStates.banner
              ? "border-blue-500 bg-blue-50/20"
              : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white dark:bg-[#0f172a]"
          }`}
          style={{
            backgroundImage: editingMajor.banner
              ? `url(${editingMajor.banner})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <input
            id="banner-picker"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processMediaFile(e.target.files[0], "banner");
              }
            }}
            className="hidden"
          />
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-90 group-hover:opacity-95 flex flex-col items-center justify-center text-white p-3">
            <Upload size={20} className="animate-bounce text-blue-400 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-wider">
              Drag / Ganti Banner
            </span>
            <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">
              Atau Klik Explorer
            </span>
          </div>
        </div>
      </div>

      {/* 3. Video Upload Picker */}
      <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-5 rounded-3xl space-y-3">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
            Video Profil Jurusan
          </span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">
            Upload dari file explorer (Maks. 15MB MP4/WebM)
          </span>
        </div>

        {editingMajor.video ? (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            <video
              src={DOMPurify.sanitize(sanitizeSrc(editingMajor.video))}
              controls
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setEditingMajor({ ...editingMajor, video: "" })}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg shadow transition-colors cursor-pointer"
              title="Hapus Video"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ) : (
          <div
            onDragEnter={(e) => handleDragState(e, "video", true)}
            onDragOver={(e) => handleDragState(e, "video", true)}
            onDragLeave={(e) => handleDragState(e, "video", false)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActiveStates((prev) => ({ ...prev, video: false }));
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processMediaFile(e.dataTransfer.files[0], "video");
              }
            }}
            onClick={() => document.getElementById("video-picker")?.click()}
            className={`h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
              dragActiveStates.video
                ? "border-blue-500 bg-blue-50/20"
                : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white dark:bg-[#0f172a]"
            }`}
          >
            <input
              id="video-picker"
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processMediaFile(e.target.files[0], "video");
                }
              }}
              className="hidden"
            />
            <div className="p-3 flex flex-col items-center">
              <Video size={24} className="text-slate-400 mb-1.5 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Drag &amp; Drop Video MP4
              </span>
              <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">
                Atau Klik Explorer
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
