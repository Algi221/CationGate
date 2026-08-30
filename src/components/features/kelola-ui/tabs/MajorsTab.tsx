"use client";

import React from "react";
import { GraduationCap, Plus, Trash2, Eye, Upload, Video, ArrowLeft, Check, Image as ImageIcon } from "lucide-react";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import { sanitizeSrc } from "@/utils/security";
import { MajorItem } from "../types";

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
  showToastMsg
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
      { title: "", desc: "" }
    ],
    facilities: [
      "Laboratorium Komputer & Praktikum",
      "Smart Interactive Classroom",
      "Pusat Pengembangan Kompetensi"
    ],
    logo: "",
    banner: "",
    video: "",
    gallery: [
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" }
    ]
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
              <div
                key={major.code}
                onClick={() => setEditingMajor({ ...major, careers: major.careers || [], facilities: major.facilities || [], gallery: major.gallery || [] })}
                className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/65 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: major.color }} />

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
                  <div className="absolute top-3 left-3 px-3 py-1 text-[9px] font-black uppercase text-white rounded-full shadow" style={{ backgroundColor: major.color }}>
                    {major.code}
                  </div>

                  {/* Delete Button Overlay */}
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const result = await Swal.fire({
                        title: 'Konfirmasi',
                        text: `Apakah Anda yakin ingin menghapus jurusan ${major.title} (${major.code}) secara lokal? Klik "Simpan Perubahan" di atas untuk menyimpan secara permanen.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Ya',
                        cancelButtonText: 'Batal'
                      });
                      if (result.isConfirmed) {
                        const updated = majorsList.filter(m => m.code !== major.code);
                        setMajorsList(updated);
                        if (typeof window !== "undefined") {
                          const slug = window.location.pathname.split("/")[1];
                          if (slug) localStorage.setItem(`ppdb_majors_config_${slug}`, JSON.stringify(updated));
                          localStorage.setItem(`ppdb_majors_config`, JSON.stringify(updated));
                          try {
                            const token = localStorage.getItem("ppdb_admin_token");
                            fetch(`/api/config?school_slug=${encodeURIComponent(slug)}`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                ...(token ? { "Authorization": `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({
                                key: "ppdb_majors_config",
                                value: updated
                              })
                            }).catch(() => {});
                          } catch (_) {}
                        }
                        showToastMsg(`Jurusan ${major.code} berhasil dihapus.`, "info");
                      }
                    }}
                    className="absolute top-3 right-3 p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl shadow-lg border border-rose-500/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 z-10 hover:scale-105 cursor-pointer"
                    title="Hapus Jurusan"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-[#0f172a]/90 p-0.5 border shadow border-white/20">
                    {major.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={DOMPurify.sanitize(sanitizeSrc(major.logo))} alt="" className="w-full h-full object-cover rounded-lg" />
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
                    <Eye size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
            <button
              onClick={() => {
                setEditingMajor(null);
                setIsNewMajor(false);
              }}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>Kembali ke List Kartu</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="w-3 h-6 rounded-full" style={{ backgroundColor: editingMajor.color }} />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                {isNewMajor ? "WORKSPACE BARU JURUSAN" : `WORKSPACE EDITOR JURUSAN: ${editingMajor.code}`}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: General & Media Uploaders */}
            <div className="lg:col-span-1 space-y-6">

              {/* 2.1 Logo Drag & Drop */}
              <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Logo Kompetensi</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Akan tampil di badge lingkar beranda</span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border shadow p-0.5 flex items-center justify-center text-slate-400">
                    {editingMajor.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={DOMPurify.sanitize(sanitizeSrc(editingMajor.logo))} alt="" className="w-full h-full object-cover rounded-xl" />
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
                    e.preventDefault(); e.stopPropagation();
                    setDragActiveStates(prev => ({ ...prev, logo: false }));
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
                    backgroundImage: editingMajor.logo ? `url(${editingMajor.logo})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
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
                    <span className="text-[9px] font-black uppercase tracking-wider">Drag / Ganti Logo</span>
                    <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                  </div>
                </div>
              </div>

              {/* 2.2 Banner Image Drag & Drop */}
              <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-5 rounded-3xl space-y-3">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Banner Utama Unsplash</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Tampil di header visual detail halaman</span>
                </div>

                <div
                  onDragEnter={(e) => handleDragState(e, "banner", true)}
                  onDragOver={(e) => handleDragState(e, "banner", true)}
                  onDragLeave={(e) => handleDragState(e, "banner", false)}
                  onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    setDragActiveStates(prev => ({ ...prev, banner: false }));
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
                    backgroundImage: editingMajor.banner ? `url(${editingMajor.banner})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
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
                    <span className="text-[9px] font-black uppercase tracking-wider">Drag / Ganti Banner</span>
                    <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                  </div>
                </div>
              </div>

              {/* 2.3 Video Upload Picker */}
              <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-5 rounded-3xl space-y-3">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Video Profil Jurusan</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Upload dari file explorer (Maks. 15MB MP4/WebM)</span>
                </div>

                {editingMajor.video ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                    <video src={DOMPurify.sanitize(sanitizeSrc(editingMajor.video))} controls className="w-full h-full object-cover" />
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
                      e.preventDefault(); e.stopPropagation();
                      setDragActiveStates(prev => ({ ...prev, video: false }));
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
                      <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Drag &amp; Drop Video MP4</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right: Core Fields, Careers, Facilities, Gallery */}
            <div className="lg:col-span-2 space-y-6">

              {/* 2.4 General Texts */}
              <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">Informasi Umum</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Kode Jurusan (e.g. RPL, TJKT)</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={editingMajor.code}
                      disabled={!isNewMajor}
                      onChange={(e) => setEditingMajor({ ...editingMajor, code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "") })}
                      placeholder="Masukkan kode jurusan..."
                      className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none ${!isNewMajor ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Nama Program Studi</label>
                      <span className="text-[8px] text-slate-400 font-bold">{editingMajor.title.length}/80</span>
                    </div>
                    <input
                      type="text"
                      maxLength={80}
                      value={editingMajor.title}
                      onChange={(e) => setEditingMajor({ ...editingMajor, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Warna Hex Aksen</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editingMajor.color}
                        onChange={(e) => setEditingMajor({ ...editingMajor, color: e.target.value })}
                        className="w-10 h-10 p-0 rounded-xl border-0 cursor-pointer overflow-hidden shrink-0"
                      />
                      <input
                        type="text"
                        maxLength={7}
                        value={editingMajor.color}
                        onChange={(e) => setEditingMajor({ ...editingMajor, color: e.target.value })}
                        className="flex-1 px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs uppercase focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Deskripsi Lengkap</label>
                    <span className="text-[8px] text-slate-400 font-bold">{editingMajor.desc.length}/400</span>
                  </div>
                  <textarea
                    maxLength={400}
                    value={editingMajor.desc}
                    onChange={(e) => setEditingMajor({ ...editingMajor, desc: e.target.value })}
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-semibold text-xs focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* 2.5 Dynamic Gallery Slots */}
              <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">Galeri Aktivitas (4 Foto &amp; Caption)</h4>
                  <span className="text-[8px] text-slate-400 font-bold block mt-1 uppercase">Ganti foto standard Unsplash menggunakan File Explorer Anda secara visual</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const galItem = (editingMajor.gallery && editingMajor.gallery[slotIdx]) || { url: "", caption: "" };
                    const elementId = `gallery-${slotIdx}`;

                    return (
                      <div key={slotIdx} className="border border-slate-200 dark:border-slate-800/60 p-4.5 rounded-2xl bg-white dark:bg-[#0f172a] flex flex-col justify-between gap-3 shadow-sm">
                        <div
                          onDragEnter={(e) => handleDragState(e, elementId, true)}
                          onDragOver={(e) => handleDragState(e, elementId, true)}
                          onDragLeave={(e) => handleDragState(e, elementId, false)}
                          onDrop={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            setDragActiveStates(prev => ({ ...prev, [elementId]: false }));
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              processMediaFile(e.dataTransfer.files[0], `gallery-${slotIdx}` as `gallery-${number}`);
                            }
                          }}
                          onClick={() => document.getElementById(`picker-gallery-${slotIdx}`)?.click()}
                          className={`h-32 border border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                            dragActiveStates[elementId] 
                              ? "border-blue-500 bg-blue-50/10" 
                              : "border-slate-300 dark:border-slate-800 hover:border-blue-500/40"
                          }`}
                          style={{
                            backgroundImage: galItem.url ? `url(${galItem.url})` : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                          }}
                        >
                          <input
                            id={`picker-gallery-${slotIdx}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                processMediaFile(e.target.files[0], `gallery-${slotIdx}` as `gallery-${number}`);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] opacity-80 group-hover:opacity-90 transition-opacity flex flex-col items-center justify-center text-white p-2">
                            <ImageIcon size={18} className="text-blue-400 mb-1 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-wider">Ganti Foto Galeri #{slotIdx+1}</span>
                            <span className="text-[6px] font-bold text-slate-400 uppercase mt-0.5">Atau Klik Explorer</span>
                          </div>
                        </div>

                        <input
                          type="text"
                          maxLength={100}
                          value={galItem.caption}
                          onChange={(e) => {
                            const updatedGallery = [...(editingMajor.gallery || [])];
                            if (!updatedGallery[slotIdx]) updatedGallery[slotIdx] = { url: "", caption: "" };
                            updatedGallery[slotIdx] = { ...updatedGallery[slotIdx], caption: e.target.value };
                            setEditingMajor({ ...editingMajor, gallery: updatedGallery });
                          }}
                          placeholder={`Caption Foto #${slotIdx+1}`}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-lg text-slate-800 dark:text-white font-bold text-[10px] focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2.6 Interactive Careers */}
              <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
                  Peluang Kerja / Karir Lulusan (4 Item)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((idx) => {
                    const career = (editingMajor.careers && editingMajor.careers[idx]) || { title: "", desc: "" };

                    return (
                      <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0f172a] rounded-2xl space-y-2">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Karir Lulusan #{idx+1}</span>
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

              {/* 2.7 Interactive Laboratory Facilities */}
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
                          const updated = (editingMajor.facilities || []).filter((_, i) => i !== fIdx);
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
                      setEditingMajor({ ...editingMajor, facilities: [...(editingMajor.facilities || []), "Laboratorium / Sarana Baru"] });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[9px] uppercase tracking-wider font-black transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Tambah Baris Fasilitas</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 2.8 Control Footer */}
          <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-white/5 pt-4.5 mt-6">
            <button
              type="button"
              onClick={() => {
                setEditingMajor(null);
                setIsNewMajor(false);
              }}
              className="px-5 py-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-750 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
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
                  updated = majorsList.map(m => m.code === editingMajor.code ? editingMajor : m);
                }
                setMajorsList(updated);
                if (isNewMajor) setIsNewMajor(false);

                if (typeof window !== "undefined") {
                  const slug = window.location.pathname.split("/")[1];
                  if (slug) localStorage.setItem(`ppdb_majors_config_${slug}`, JSON.stringify(updated));
                  localStorage.setItem(`ppdb_majors_config`, JSON.stringify(updated));
                  try {
                    const token = localStorage.getItem("ppdb_admin_token");
                    fetch(`/api/config?school_slug=${encodeURIComponent(slug)}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                      },
                      body: JSON.stringify({
                        key: "ppdb_majors_config",
                        value: updated
                      })
                    }).catch(() => {});
                  } catch (_) {}
                }

                const savedCode = editingMajor.code;
                setEditingMajor(null);
                showToastMsg(`Program Studi ${savedCode} berhasil disimpan.`, "success");
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Check size={14} />
              <span>Simpan Detail</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
