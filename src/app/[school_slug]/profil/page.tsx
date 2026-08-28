"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import Swal from "sweetalert2";
import { Edit, Lock, Crop, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import EditProfileModal from "@/components/profile/EditProfileModal";
import EditPasswordModal from "@/components/profile/EditPasswordModal";

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
 const { adminUser, setAdminUser, profilSekolah, adminToken } = usePPDB();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // --- State Dialog / Modal ---
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);

  // --- State Profil ---
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
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
    try {
      // ✅ 2. Langsung pakai variabel adminToken di fetch kamu
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setCurrentPassword(""); 
        setNewPassword(""); 
        setConfirmPassword("");
        Swal.fire({ icon: "success", title: "Berhasil", text: "Password berhasil diubah.", confirmButtonColor: "#2563EB" });
        setIsEditPasswordOpen(false);
      } else {
        Swal.fire("Error", data.message || "Gagal merubah password.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Gagal menghubungi server.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!mounted) return null;

  const displayNama = namaLengkap || adminUser?.nama || "Admin Sekolah";
  const displayRole = adminUser?.role || "Superadmin";
  const displaySchool = profilSekolah?.nama_sekolah || "SMP Segar Cimanggis";

  const inputClass = "flex h-11 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all";
  const labelClass = "mb-2 block text-sm font-medium text-slate-800";

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-16 pt-4">
      
      <h2 className="text-[26px] font-bold text-slate-800 mb-6">User Profile</h2>

      {/* Komponen 1: Header Profile */}
      <ProfileHeader
        displayNama={displayNama}
        displayRole={displayRole}
        displaySchool={displaySchool}
        previewPhoto={previewPhoto}
        onPhotoChange={handlePhotoChange}
      />

      {/* Card Biodata Utama (View Mode) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">My Profile</h3>
          <button 
            onClick={() => {
              setTempNama(namaLengkap);
              setTempUsername(username);
              setTempEmail(email);
              setIsEditProfileOpen(true);
            }}
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

      {/* Card Security Utama (View Mode) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">Security</h3>
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

      {/* Komponen 2: Modal Edit Biodata */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        tempNama={tempNama}
        setTempNama={setTempNama}
        tempUsername={tempUsername}
        setTempUsername={setTempUsername}
        tempEmail={tempEmail}
        setTempEmail={setTempEmail}
        onSave={handleSaveProfile}
        saving={profileSaving}
        inputClass={inputClass}
        labelClass={labelClass}
      />

      {/* Komponen 3: Modal Ganti Password */}
      <EditPasswordModal
        isOpen={isEditPasswordOpen}
        onClose={() => setIsEditPasswordOpen(false)}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onChangePassword={handleChangePassword}
        isChanging={isChangingPassword}
        inputClass={inputClass}
        labelClass={labelClass}
      />

      {/* Modal Crop Foto */}
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