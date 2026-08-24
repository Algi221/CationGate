"use client";

import React from "react";
import { Megaphone, Plus, Clock } from "lucide-react";
import { useInformasiState } from "@/components/features/informasi/hooks/useInformasiState";
import { InformasiTable } from "@/components/features/informasi/components/InformasiTable";
import { InformasiModal } from "@/components/features/informasi/components/InformasiModal";
import { InformasiDetailModal } from "@/components/features/informasi/components/InformasiDetailModal";
import { InformasiDeleteModal } from "@/components/features/informasi/components/InformasiDeleteModal";
import { formatDate } from "@/components/features/informasi/utils/mediaHelper";

export default function KelolaInformasi() {
  const {
    informasiList,
    loading,
    submitting,
    isOpenModal,
    setIsOpenModal,
    isEditMode,
    judul,
    setJudul,
    konten,
    setKonten,
    tanggal,
    setTanggal,
    fotoUrl,
    setFotoUrl,
    videoUrl,
    setVideoUrl,
    videoName,
    setVideoName,
    dokumenUrl,
    setDokumenUrl,
    dokumenName,
    setDokumenName,
    dragActive,
    previewItem,
    setPreviewItem,
    loadingDetailId,
    deleteConfirmId,
    setDeleteConfirmId,
    fetchInformasi,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenPreview,
    handleDrag,
    handleDrop,
    handleFileChange,
    handleVideoFileChange,
    handleDokumenFileChange,
    handleSubmit,
    executeDelete
  } = useInformasiState();

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Banner Header & Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Banner Section */}
        <div className="lg:col-span-2 bg-linear-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-[0_10px_30px_rgba(37,99,235,0.2)]">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
            <Megaphone size={280} />
          </div>
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-black uppercase tracking-widest text-blue-200 inline-block">
              Pusat Informasi &amp; Berita Resmi
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Kelola Pengumuman Sekolah
            </h1>
            <p className="text-xs md:text-sm text-blue-100/80 font-medium leading-relaxed">
              Publikasikan pengumuman penting, jadwal seleksi, dan berita terkini agar dapat diakses oleh calon peserta didik baru dan wali murid secara real-time.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.35)] active:scale-[0.98] transition-all flex items-center gap-2 border border-blue-400/30 cursor-pointer"
            >
              <Plus size={16} />
              <span>Buat Informasi Baru</span>
            </button>
            <button
              onClick={() => fetchInformasi(true)}
              className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all border border-white/5 flex items-center gap-2 cursor-pointer"
            >
              Sinkronkan Ulang
            </button>
          </div>
        </div>

        {/* Informational Metric Display */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden transition-colors duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 dark:text-slate-500 font-extrabold text-[10px] uppercase tracking-widest block">
                Ringkasan Publikasi
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-center text-blue-500 dark:text-blue-400">
                <Megaphone size={16} />
              </div>
            </div>
            <div>
              <div className="text-5xl font-black tracking-tight text-slate-800 dark:text-white">
                {informasiList.length}
              </div>
              <span className="text-xs text-slate-400 font-bold block mt-1.5 uppercase tracking-wide">
                Total Informasi Aktif
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              Update terakhir
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-300">
              {informasiList.length > 0 ? formatDate(informasiList[0].tanggal) : "Belum Ada"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Table View */}
      <InformasiTable
        informasiList={informasiList}
        loading={loading}
        loadingDetailId={loadingDetailId}
        onOpenCreateModal={handleOpenCreateModal}
        onOpenEditModal={handleOpenEditModal}
        onOpenPreview={handleOpenPreview}
        onDeleteConfirm={(id) => setDeleteConfirmId(id)}
      />

      {/* CREATE & EDIT MODAL */}
      <InformasiModal
        isOpen={isOpenModal}
        isEditMode={isEditMode}
        judul={judul}
        setJudul={setJudul}
        konten={konten}
        setKonten={setKonten}
        tanggal={tanggal}
        setTanggal={setTanggal}
        fotoUrl={fotoUrl}
        setFotoUrl={setFotoUrl}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        videoName={videoName}
        setVideoName={setVideoName}
        dokumenUrl={dokumenUrl}
        setDokumenUrl={setDokumenUrl}
        dokumenName={dokumenName}
        setDokumenName={setDokumenName}
        dragActive={dragActive}
        submitting={submitting}
        onClose={() => setIsOpenModal(false)}
        onSubmit={handleSubmit}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        handleFileChange={handleFileChange}
        handleVideoFileChange={handleVideoFileChange}
        handleDokumenFileChange={handleDokumenFileChange}
      />

      {/* DETAIL PREVIEW MODAL */}
      <InformasiDetailModal
        previewItem={previewItem}
        onClose={() => setPreviewItem(null)}
        onOpenEditModal={handleOpenEditModal}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <InformasiDeleteModal
        deleteConfirmId={deleteConfirmId}
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={executeDelete}
      />
    </div>
  );
}
