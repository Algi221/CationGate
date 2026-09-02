"use client";

import { useParams } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import type { Area } from "react-easy-crop";
import Swal from "sweetalert2";
import {
  ProfileHeader,
  EditProfileModal,
  EditPasswordModal,
  CropPhotoModal,
  ProfileInfoCards,
  getCroppedImg,
} from "@/components/profile";

export default function ProfilePage() {
  const { adminUser, setAdminUser, profilSekolah, ppdbTitle } = usePPDB();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
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
      const croppedBase64 = await getCroppedImg(
        cropImageSrc,
        croppedAreaPixels,
      );
      setPreviewPhoto(croppedBase64);
      setFotoProfil(croppedBase64);
      setCropModalOpen(false);
      setCropImageSrc(null);

      // Auto save cropped photo to server
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("ppdb_admin_token")
          : null;
      const res = await fetch(`/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(schoolSlug ? { "x-school-slug": schoolSlug } : {}),
        },
        body: JSON.stringify({
          foto_profil: croppedBase64,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (setAdminUser) {
          setAdminUser((prev) =>
            prev ? { ...prev, foto_profil: croppedBase64 } : null,
          );
        }
        Swal.fire({
          icon: "success",
          title: "Foto Profil Disimpan",
          text: "Foto profil berhasil diperbarui!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire(
          "Gagal",
          data.message || "Gagal menyimpan foto profil.",
          "error",
        );
      }
    } catch (_err) {
      Swal.fire("Error", "Gagal memotong foto profil.", "error");
    }
  };

  const handleSaveProfile = async () => {
    if (!tempNama.trim() || !tempUsername.trim()) {
      Swal.fire(
        "Peringatan",
        "Nama dan Username tidak boleh kosong.",
        "warning",
      );
      return;
    }

    setProfileSaving(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("ppdb_admin_token")
          : null;
      const res = await fetch(`/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(schoolSlug ? { "x-school-slug": schoolSlug } : {}),
        },
        body: JSON.stringify({
          nama_lengkap: tempNama.trim(),
          username: tempUsername.trim(),
          foto_profil: fotoProfil,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setNamaLengkap(tempNama);
        setUsername(tempUsername);
        setEmail(tempEmail);

        if (setAdminUser) {
          setAdminUser((prev) =>
            prev
              ? {
                  ...prev,
                  nama: tempNama,
                  nama_lengkap: tempNama,
                  username: tempUsername,
                  email: tempEmail,
                  foto_profil: fotoProfil,
                }
              : null,
          );
        }

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Biodata berhasil diperbarui!",
          confirmButtonColor: "#2563EB",
        });
        setIsEditProfileOpen(false);
      } else {
        Swal.fire(
          "Gagal",
          data.message || "Gagal memperbarui profil.",
          "error",
        );
      }
    } catch (_err) {
      Swal.fire("Error", "Terjadi kesalahan saat memperbarui profil.", "error");
    } finally {
      setProfileSaving(false);
    }
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
      Swal.fire(
        "Peringatan",
        "Konfirmasi password baru tidak cocok.",
        "warning",
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("ppdb_admin_token")
          : null;
      const res = await fetch(`/api/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(schoolSlug ? { "x-school-slug": schoolSlug } : {}),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Password berhasil diubah.",
          confirmButtonColor: "#2563EB",
        });
        setIsEditPasswordOpen(false);
      } else {
        Swal.fire("Gagal", data.message || "Gagal mengubah password.", "error");
      }
    } catch (_err) {
      Swal.fire("Error", "Terjadi kesalahan saat mengubah password.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!mounted) return null;

  const displayNama = namaLengkap || adminUser?.nama || "Admin Sekolah";
  const displayRole = adminUser?.role || "Superadmin";
  const displaySchool = profilSekolah?.nama_sekolah || ppdbTitle || "-";

  const inputClass =
    "flex h-11 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all";
  const labelClass = "mb-2 block text-sm font-medium text-slate-800";

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-16 pt-4">
      {/* PAGE HEADER */}
      <h2 className="text-[26px] font-bold text-slate-800 mb-6">User Profile</h2>

      {/* CARD 1: PROFILE HEADER */}
      <ProfileHeader
        displayNama={displayNama}
        displayRole={displayRole}
        displaySchool={displaySchool}
        previewPhoto={previewPhoto}
        onPhotoChange={handlePhotoChange}
      />

      {/* CARD 2 & 3: PERSONAL INFORMATION & SECURITY */}
      <ProfileInfoCards
        displayNama={displayNama}
        username={username}
        email={email}
        displayRole={displayRole}
        displaySchool={displaySchool}
        onOpenEditProfile={handleOpenEditProfile}
        onOpenEditPassword={() => setIsEditPasswordOpen(true)}
      />

      {/* MODAL: EDIT PROFILE */}
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

      {/* MODAL: EDIT PASSWORD */}
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

      {/* MODAL: CROP PHOTO */}
      <CropPhotoModal
        isOpen={cropModalOpen}
        cropImageSrc={cropImageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        rotation={rotation}
        setRotation={setRotation}
        onCropComplete={onCropComplete}
        onClose={() => {
          setCropModalOpen(false);
          setCropImageSrc(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
        onSave={handleCropSave}
      />
    </div>
  );
}