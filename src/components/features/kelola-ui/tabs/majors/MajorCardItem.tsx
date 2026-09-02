"use client";

import React from "react";
import { GraduationCap, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import { sanitizeSrc } from "@/utils/security";
import { MajorItem } from "../../types";

interface MajorCardItemProps {
  major: MajorItem;
  majorsList: MajorItem[];
  setMajorsList: React.Dispatch<React.SetStateAction<MajorItem[]>>;
  setEditingMajor: (val: MajorItem | null) => void;
  showToastMsg: (msg: string, type?: "success" | "error" | "info") => void;
}

export const MajorCardItem: React.FC<MajorCardItemProps> = ({
  major,
  majorsList,
  setMajorsList,
  setEditingMajor,
  showToastMsg,
}) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin menghapus jurusan ${major.title} (${major.code}) secara lokal? Klik "Simpan Perubahan" di atas untuk menyimpan secara permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const updated = majorsList.filter((m) => m.code !== major.code);
      setMajorsList(updated);
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
      showToastMsg(`Jurusan ${major.code} berhasil dihapus.`, "info");
    }
  };

  return (
    <div
      onClick={() =>
        setEditingMajor({
          ...major,
          careers: major.careers || [],
          facilities: major.facilities || [],
          gallery: major.gallery || [],
        })
      }
      className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/65 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative"
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: major.color }}
      />

      {/* Card Preview Banner Frame */}
      <div className="h-40 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b border-slate-200 dark:border-slate-800/60">
        {major.banner ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={DOMPurify.sanitize(sanitizeSrc(major.banner))}
            alt={major.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          />
        ) : (
          <div className="text-slate-400 flex flex-col items-center gap-2">
            <ImageIcon size={32} />
            <span className="text-[8px] font-black uppercase">Tanpa Banner</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div
          className="absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase text-white rounded-full shadow"
          style={{ backgroundColor: major.color }}
        >
          {major.code}
        </div>

        {/* Delete Button Overlay */}
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-3 right-3 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl shadow-lg border border-rose-500/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 z-10 hover:scale-105 cursor-pointer"
          title="Hapus Jurusan"
        >
          <Trash2 size={13} />
        </button>

        <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-[#0f172a]/90 p-0.5 border shadow border-white/20">
          {major.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={DOMPurify.sanitize(sanitizeSrc(major.logo))}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
              <GraduationCap size={18} />
            </div>
          )}
        </div>
      </div>

      {/* Card Copy */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
            {major.title}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-3 leading-relaxed font-semibold">
            {major.desc}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-600">
          <span>Ubah Program Studi</span>
          <Eye
            size={12}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};
