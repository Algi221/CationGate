"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Camera, User, Save, CheckCircle2,
  AlertCircle, Shield, Calendar, Trash2, ZoomIn, ZoomOut, RotateCw, Crop
} from "lucide-react";

// ── Crop helper ──────────────────────────────────────────────────────────────
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.9);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function ProfilePage() {
  const { adminUser, adminToken, setAdminUser } = usePPDB();

  // ── Profile form state ───────────────────────────────────────────────────
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // ── Crop modal state ──────────────────────────────────────────────────────
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // ── Status ───────────────────────────────────────────────────────────────
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Init from context ─────────────────────────────────────────────────────
  useEffect(() => {
    if (adminUser) {
      setNamaLengkap(adminUser.nama || "");
      setUsername(adminUser.username || "");
      setFotoProfil(adminUser.foto_profil || null);
      setPreviewPhoto(adminUser.foto_profil || null);
    }
  }, [adminUser]);

  // ── Photo upload → open crop modal ────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ type: "error", text: "Ukuran foto maksimal 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    try {
      const croppedBase64 = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      setPreviewPhoto(croppedBase64);
      setFotoProfil(croppedBase64);
      setCropModalOpen(false);
      setCropImageSrc(null);
    } catch (err) {
      console.error("Crop failed", err);
      setProfileMsg({ type: "error", text: "Gagal memotong foto." });
    }
  };

  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    setFotoProfil("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      setProfileMsg({ type: "error", text: "Nama lengkap tidak boleh kosong." });
      return;
    }
    if (!username.trim()) {
      setProfileMsg({ type: "error", text: "Username tidak boleh kosong." });
      return;
    }

    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          nama_lengkap: namaLengkap,
          username,
          foto_profil: fotoProfil,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfileMsg({ type: "success", text: "Profil berhasil diperbarui!" });
        // Update context
        if (setAdminUser && data.admin) {
          const updated = {
            ...adminUser,
            nama: data.admin.nama,
            username: data.admin.username,
            foto_profil: data.admin.foto_profil,
          };
          setAdminUser(updated);
          if (typeof window !== "undefined") {
            localStorage.setItem("ppdb_admin_user", JSON.stringify(updated));
          }
        }
      } else {
        setProfileMsg({ type: "error", text: data.message || "Gagal memperbarui profil." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Gagal terhubung ke server." });
    } finally {
      setProfileSaving(false);
    }
  };



  const userInitial = adminUser?.nama ? adminUser.nama.charAt(0).toUpperCase() : "A";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Profil Saya</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Kelola informasi akun dan keamanan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Photo + Info Card ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-4 text-center">

            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                {previewPhoto ? (
                  <img src={previewPhoto} alt="Foto Profil" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-400 dark:text-slate-500" />
                )}
              </div>

              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Photo actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
              >
                <Camera size={12} />
                Ganti Foto
              </button>
              {previewPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">
              JPG, PNG atau WebP. Maks. 2MB.
            </p>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            {/* Info */}
            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                  <User size={14} className="text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{adminUser?.nama || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                  <Shield size={14} className="text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role & Status Akun</p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 size={12} /> Akun Official Sekolah (Verified Superadmin)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Username</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">@{adminUser?.username || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Forms ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Edit Profile Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                <User size={16} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Informasi Profil</h2>
                <p className="text-[10px] text-slate-400 font-semibold">Perbarui nama dan username akun Anda</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Hanya huruf, angka, dan underscore.</p>
              </div>

              {/* Status Message */}
              {profileMsg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                }`}>
                  {profileMsg.type === "success"
                    ? <CheckCircle2 size={14} className="shrink-0" />
                    : <AlertCircle size={14} className="shrink-0" />}
                  {profileMsg.text}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
                >
                  {profileSaving ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>



        </div>
      </div>

      {/* ── Crop Modal ─────────────────────────────────────────────────────── */}
      {cropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                  <Crop size={16} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Sesuaikan Foto</h2>
                  <p className="text-[10px] text-slate-400 font-semibold">Geser dan zoom untuk menyesuaikan</p>
                </div>
              </div>
              <button
                onClick={() => { setCropModalOpen(false); setCropImageSrc(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative w-full h-80 bg-slate-950">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="px-6 py-4 space-y-3 border-t border-slate-100 dark:border-white/5">
              {/* Zoom slider */}
              <div className="flex items-center gap-3">
                <ZoomOut size={14} className="text-slate-400 shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <ZoomIn size={14} className="text-slate-400 shrink-0" />
              </div>

              {/* Rotation */}
              <div className="flex items-center gap-3">
                <RotateCw size={14} className="text-slate-400 shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{rotation}°</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
              <button
                onClick={() => { setCropModalOpen(false); setCropImageSrc(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleCropSave}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                <Crop size={14} />
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
