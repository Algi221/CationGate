"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import NextImage from "next/image";
import { usePPDB } from "@/context/PPDBContext";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import Swal from "sweetalert2";
import {
  Camera,
  Edit,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  X,
  Save,
  Lock,
  User,
  Mail,
  Building2,
  Shield
} from "lucide-react";

// --- Utility Functions untuk Crop Gambar ---
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

export default function ProfilePage() {
  const { adminUser, setAdminUser, profilSekolah } = usePPDB();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // --- State Dialog / Modal ---
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);

  // --- State Profil (Temporary & Real) ---
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  // State form di dalam dialog
  const [tempNama, setTempNama] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [profileSaving, setProfileSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- State Password ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // --- Initialization Data dari Context ---
  useEffect(() => {
    if (adminUser) {
      const nama = adminUser.nama || adminUser.nama_lengkap || "";
      const uname = adminUser.username || "";
      const mail = adminUser.email || "";
      
      setNamaLengkap(nama);
      setUsername(uname);
      setEmail(mail);
      
      setTempNama(nama);
      setTempUsername(uname);
      setTempEmail(mail);

      setFotoProfil(adminUser.foto_profil || null);
      setPreviewPhoto(adminUser.foto_profil || null);
    }
  }, [adminUser]);

  // Buka dialog edit profil & sinkronkan state temp
  const handleOpenEditProfile = () => {
    setTempNama(namaLengkap);
    setTempUsername(username);
    setTempEmail(email);
    setIsEditProfileOpen(true);
  };

  // --- Handlers Profil ---
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Ukuran foto maksimal 5MB.", "error");
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
      Swal.fire("Error", "Gagal memotong foto.", "error");
    }
  };

  const handleSaveProfile = async () => {
    if (!tempNama.trim() || !tempUsername.trim()) {
      Swal.fire("Peringatan", "Nama dan Username tidak boleh kosong.", "warning");
      return;
    }

    setProfileSaving(true);
    
    setTimeout(() => {
      setNamaLengkap(tempNama);
      setUsername(tempUsername);
      setEmail(tempEmail);

      Swal.fire({ icon: "success", title: "Berhasil", text: "Biodata berhasil diperbarui!", confirmButtonColor: "#2563EB" });
      if (setAdminUser) {
        setAdminUser((prev: any) => ({ ...prev, nama: tempNama, username: tempUsername, email: tempEmail, foto_profil: fotoProfil }));
      }
      setProfileSaving(false);
      setIsEditProfileOpen(false);
    }, 1000);
  };

  // --- Handlers Password ---
  const handleChangePassword = async () => {
    if (!currentPassword) {
      Swal.fire("Peringatan", "Password saat ini wajib diisi.", "warning");
      return;
    }
    if (newPassword.length < 6) {
      Swal.fire("Peringatan", "Password baru minimal 6 karakter.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire("Peringatan", "Konfirmasi password baru tidak cocok.", "warning");
      return;
    }

    setIsChangingPassword(true);

    setTimeout(() => {
      setCurrentPassword(""); 
      setNewPassword(""); 
      setConfirmPassword("");
      Swal.fire({ icon: "success", title: "Berhasil", text: "Password berhasil diubah.", confirmButtonColor: "#2563EB" });
      setIsChangingPassword(false);
      setIsEditPasswordOpen(false);
    }, 1000);
  };

  if (!mounted) return null;

  const displayNama = namaLengkap || adminUser?.nama || "Admin Sekolah";
  const displayRole = adminUser?.role || "Superadmin";
  const displaySchool = profilSekolah?.nama_sekolah || "SMP Segar Cimanggis";

  const inputClass = "flex h-11 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all";
  const labelClass = "mb-2 block text-sm font-medium text-slate-800";

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-16 pt-4">
      
      {/* --- PAGE HEADER --- */}
      <h2 className="text-[26px] font-bold text-slate-800 mb-6">User Profile</h2>

      {/* --- CARD 1: PROFILE HEADER --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
            {previewPhoto ? (
              <NextImage src={previewPhoto} alt="Profil" width={80} height={80} unoptimized className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-slate-400">
                {displayNama.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
          >
            <Camera size={14} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
        
        <div className="flex-1 mt-1">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{displayNama}</h2>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-slate-500 mt-1">
            <span className="flex items-center gap-1.5">
              {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} <span className="hidden md:inline mx-1">|</span>
            </span>
            <span className="flex items-center gap-1.5">
              {displaySchool}
            </span>
          </div>
        </div>
      </div>

      {/* --- CARD 2: PERSONAL INFORMATION (TAMPILAN VIEW BIASA) --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">Profil Saya</h3>
          {/* Tombol pemicu Dialog Edit Biodata */}
          <button 
            onClick={handleOpenEditProfile}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors w-full md:w-auto shadow-sm"
          >
            <Edit size={16} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Nama Lengkap</span>
            <p className="text-base font-semibold text-slate-800">{displayNama}</p>
          </div>
          
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Username</span>
            <p className="text-base font-semibold text-slate-800">{username || "-"}</p>
          </div>

          <div className="md:col-span-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
            <p className="text-base font-semibold text-slate-800">{email || "-"}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Role Pengguna</span>
            <p className="text-base font-semibold text-slate-800">{displayRole}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Instansi</span>
            <p className="text-base font-semibold text-slate-800">{displaySchool}</p>
          </div>
        </div>
      </div>

      {/* --- CARD 3: SECURITY (TAMPILAN VIEW BIASA) --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">Security</h3>
          {/* Tombol pemicu Dialog Ganti Password */}
          <button 
            onClick={() => setIsEditPasswordOpen(true)}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors w-full md:w-auto shadow-sm"
          >
            <Lock size={16} /> Change Password
          </button>
        </div>
        <p className="text-sm text-slate-500">
          Amankan akun superadmin Anda dengan rutin memperbarui kata sandi secara berkala.
        </p>
      </div>


      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Edit Biodata Profil
              </h2>
              <button 
                onClick={() => setIsEditProfileOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal (Form Input) */}
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={tempNama} 
                  onChange={(e) => setTempNama(e.target.value)} 
                  className={inputClass} 
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className={labelClass}>Username</label>
                <input 
                  type="text" 
                  value={tempUsername} 
                  onChange={(e) => setTempUsername(e.target.value)} 
                  className={inputClass} 
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input 
                  type="email" 
                  value={tempEmail} 
                  onChange={(e) => setTempEmail(e.target.value)} 
                  className={inputClass} 
                  placeholder="contoh@sekolah.com"
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsEditProfileOpen(false)} 
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveProfile} 
                disabled={profileSaving} 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {profileSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                {profileSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </div>
        </div>
      )}

      {isEditPasswordOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Lock size={18} className="text-blue-600" /> Ganti Kata Sandi
              </h2>
              <button 
                onClick={() => setIsEditPasswordOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal (Form Password) */}
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Password Saat Ini</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className={inputClass} 
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className={labelClass}>Password Baru</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className={inputClass} 
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div>
                <label className={labelClass}>Konfirmasi Password Baru</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className={inputClass} 
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsEditPasswordOpen(false)} 
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleChangePassword} 
                disabled={isChangingPassword} 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isChangingPassword ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
                {isChangingPassword ? "Memperbarui..." : "Update Password"}
              </button>
            </div>

          </div>
        </div>
      )}

      {cropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Sesuaikan Foto</h2>
              <button onClick={() => { setCropModalOpen(false); setCropImageSrc(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="relative w-full h-80 bg-slate-900">
              <Cropper image={cropImageSrc} crop={crop} zoom={zoom} rotation={rotation} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onRotationChange={setRotation} onCropComplete={onCropComplete} />
            </div>

            <div className="px-6 py-4 space-y-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <ZoomOut size={16} className="text-slate-500" />
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                <ZoomIn size={16} className="text-slate-500" />
              </div>
              <div className="flex items-center gap-3">
                <RotateCw size={16} className="text-slate-500" />
                <input type="range" min={0} max={360} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                <span className="text-xs font-medium text-slate-500 w-10 text-right">{rotation}°</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button onClick={() => { setCropModalOpen(false); setCropImageSrc(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-colors">Batal</button>
              <button onClick={handleCropSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2"><Crop size={14} /> Terapkan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}