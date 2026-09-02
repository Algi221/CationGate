"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { Save, Building2 } from "lucide-react";
import Swal from "sweetalert2";
import { uploadFileDirect, base64ToFile } from "@/utils/storage";
import { compressImage } from "@/utils/mediaCompressor";
import {
  ProfileTabNav,
  ProfileIdentitasForm,
  ProfileSejarahForm,
  ProfilePimpinanForm,
  ProfileVisiMisiForm,
  ProfileTujuanForm,
} from "@/components/features/school-profile/admin";

export default function ProfilSekolahPage() {
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";
  const { adminToken, fetchConfigs, schoolId, isDemoMode } = usePPDB();

  const [loading, setLoading] = useState(false);
  const [logoInput, setLogoInput] = useState("");
  const [identitas, setIdentitas] = useState({
    nama: "",
    akreditasi: "",
    alamat: "",
    npsn: "",
    status: "Swasta",
    kurikulum: "Kurikulum Merdeka",
    tahun_berdiri: "",
    email: "",
    telepon: "",
  });
  const [sejarah, setSejarah] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [videoProfilUrl, setVideoProfilUrl] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [pimpinan, setPimpinan] = useState({
    nama: "",
    jabatan: "Kepala Sekolah",
    sambutan: "",
    foto: "",
  });
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [tujuan, setTujuan] = useState("");

  const [activeTab, setActiveTab] = useState("identitas");

  const loadConfigData = React.useCallback(async () => {
    const targetSlug = schoolSlug || schoolId;
    if (!targetSlug) return;

    // 1. First load from localStorage cache if available for instant hydration
    if (typeof window !== "undefined") {
      try {
        const localSaved = localStorage.getItem(`ppdb_profil_sekolah_${targetSlug}`);
        if (localSaved) {
          const p = JSON.parse(localSaved);
          if (p && typeof p === "object") {
            if (p.identitas) setIdentitas((prev) => ({ ...prev, ...p.identitas }));
            if (p.sejarah) setSejarah(p.sejarah);
            if (p.ringkasan) setRingkasan(p.ringkasan);
            if (p.video_profil_url !== undefined && p.video_profil_url !== null)
              setVideoProfilUrl(p.video_profil_url);
            if (p.hero_image) setHeroImage(p.hero_image);
            if (p.pimpinan) setPimpinan((prev) => ({ ...prev, ...p.pimpinan }));
            if (p.visi_misi) {
              setVisi(p.visi_misi.visi || "");
              setMisi(p.visi_misi.misi || "");
            }
            if (p.tujuan) setTujuan(p.tujuan);
            if (p.logo_url) setLogoInput(p.logo_url);
          }
        }
      } catch (_e) {}
    }

    try {
      const token =
        adminToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem("ppdb_admin_token")
          : null);

      // Dedicated School Profile Fetch
      const profileRes = await fetch(
        `/api/school-profile?school_slug=${encodeURIComponent(targetSlug)}&_t=${Date.now()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        },
      );

      const json = await profileRes.json();

      if (json.success && json.data) {
        const p = json.data;
        if (p.logo_url) setLogoInput(p.logo_url);
        if (p.identitas) {
          setIdentitas((prev) => ({
            ...prev,
            ...p.identitas,
            nama: p.identitas.nama || p.nama || prev.nama,
            npsn: p.identitas.npsn || p.npsn || prev.npsn,
            akreditasi: p.identitas.akreditasi || p.akreditasi || prev.akreditasi,
            alamat: p.identitas.alamat || p.alamat || prev.alamat,
            telepon: p.identitas.telepon || p.telepon || prev.telepon,
            email: p.identitas.email || p.email || prev.email,
          }));
        } else if (p.nama) {
          setIdentitas((prev) => ({
            ...prev,
            nama: p.nama || prev.nama,
            npsn: p.npsn || prev.npsn,
            akreditasi: p.akreditasi || prev.akreditasi,
            alamat: p.alamat || prev.alamat,
            telepon: p.telepon || prev.telepon,
            email: p.email || prev.email,
          }));
        }

        if (p.sejarah) setSejarah(p.sejarah);
        if (p.ringkasan) setRingkasan(p.ringkasan);
        if (p.video_profil_url !== undefined && p.video_profil_url !== null)
          setVideoProfilUrl(p.video_profil_url);
        if (p.hero_image) setHeroImage(p.hero_image);
        if (p.pimpinan && typeof p.pimpinan === "object")
          setPimpinan((prev) => ({ ...prev, ...p.pimpinan }));
        if (p.visi_misi) {
          setVisi(p.visi_misi.visi || p.visi || "");
          setMisi(p.visi_misi.misi || p.misi || "");
        } else {
          if (p.visi) setVisi(p.visi);
          if (p.misi) setMisi(p.misi);
        }
        if (p.tujuan) setTujuan(p.tujuan);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            `ppdb_profil_sekolah_${targetSlug}`,
            JSON.stringify(p),
          );
        }
      }
    } catch (err) {
      console.warn("Gagal memuat profil sekolah dari API terdedikasi:", err);
    }
  }, [schoolSlug, schoolId, adminToken]);

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);

  // Real-time automatic draft persistence
  useEffect(() => {
    const targetSlug = schoolSlug || schoolId;
    if (!targetSlug || typeof window === "undefined") return;
    const payload = {
      identitas,
      sejarah,
      ringkasan,
      video_profil_url: videoProfilUrl,
      hero_image: heroImage,
      logo_url: logoInput,
      pimpinan,
      visi_misi: { visi, misi },
      tujuan,
    };
    const timer = setTimeout(() => {
      localStorage.setItem(
        `ppdb_profil_sekolah_${targetSlug}`,
        JSON.stringify(payload),
      );
      if (identitas.nama)
        localStorage.setItem(`ppdb_title_${targetSlug}`, identitas.nama);
      if (logoInput) localStorage.setItem(`ppdb_logo_${targetSlug}`, logoInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [
    identitas,
    sejarah,
    ringkasan,
    videoProfilUrl,
    heroImage,
    pimpinan,
    visi,
    misi,
    tujuan,
    logoInput,
    schoolSlug,
    schoolId,
  ]);

  const handleSaveAll = async () => {
    if (isDemoMode) {
      Swal.fire({
        icon: "info",
        title: "Mode Demo",
        text: "Perubahan tidak disimpan permanen di mode demo.",
      });
      return;
    }

    setLoading(true);
    const targetSlug = schoolSlug || schoolId || "";
    const token =
      adminToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("ppdb_admin_token")
        : null);

    const payload = {
      identitas,
      sejarah,
      ringkasan,
      video_profil_url: videoProfilUrl,
      hero_image: heroImage,
      logo_url: logoInput,
      pimpinan,
      visi_misi: { visi, misi },
      tujuan,
    };

    // Save to localStorage immediately
    if (typeof window !== "undefined" && targetSlug) {
      localStorage.setItem(
        `ppdb_profil_sekolah_${targetSlug}`,
        JSON.stringify(payload),
      );
      if (identitas.nama)
        localStorage.setItem(`ppdb_title_${targetSlug}`, identitas.nama);
      if (logoInput) localStorage.setItem(`ppdb_logo_${targetSlug}`, logoInput);
    }

    try {
      // 1. Direct Save to dedicated /api/school-profile table
      const profileSaveUrl = targetSlug
        ? `/api/school-profile?school_slug=${encodeURIComponent(targetSlug)}`
        : `/api/school-profile`;

      const res = await fetch(profileSaveUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setLoading(false);

      if (json.success) {
        Swal.fire({
          icon: "success",
          title: "Profil Berhasil Disimpan! 🎉",
          text: "Data Profil Sekolah, Identitas, dan Figur Pimpinan tersimpan di database sekolah.",
          timer: 2000,
          showConfirmButton: false,
        });

        if (targetSlug) {
          await useSchoolStore.getState().fetchConfigs(targetSlug);
        }
        await fetchConfigs();
      } else {
        Swal.fire(
          "Peringatan",
          json.message || "Gagal menyimpan perubahan profil.",
          "warning",
        );
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan jaringan saat menyimpan profil sekolah.",
        "error",
      );
    }
  };

  const handleSchoolLogoChange = async (file: File) => {
    try {
      setLoading(true);
      const result = await compressImage(file, 400, 400, 0.85);
      const compressedFile = base64ToFile(result.base64, file.name);
      const publicUrl = await uploadFileDirect(compressedFile, "school_logo");
      setLogoInput(publicUrl);
      if (typeof window !== "undefined" && (schoolSlug || schoolId)) {
        localStorage.setItem(`ppdb_logo_${schoolSlug || schoolId}`, publicUrl);
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Gagal", "Gagal mengunggah logo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePimpinanPhotoChange = async (file: File) => {
    try {
      setLoading(true);
      const result = await compressImage(file, 600, 600, 0.85);
      const compressedFile = base64ToFile(result.base64, file.name);
      const publicUrl = await uploadFileDirect(compressedFile, "pimpinan_photo");
      setPimpinan((prev) => ({ ...prev, foto: publicUrl }));
    } catch (e) {
      console.error(e);
      Swal.fire("Gagal", "Gagal mengunggah foto pimpinan.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleIdentitasChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setIdentitas((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Kelola Profil Sekolah
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Atur identitas, nama sekolah, video profil, pimpinan, sejarah, dan visi-misi.
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            {loading ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </div>

        {/* Content Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Navigation Bar */}
          <ProfileTabNav activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6 md:p-8">
            {activeTab === "identitas" && (
              <ProfileIdentitasForm
                identitas={identitas}
                setIdentitas={setIdentitas}
                logoInput={logoInput}
                handleSchoolLogoChange={handleSchoolLogoChange}
                handleIdentitasChange={handleIdentitasChange}
              />
            )}

            {activeTab === "sejarah" && (
              <ProfileSejarahForm
                ringkasan={ringkasan}
                setRingkasan={setRingkasan}
                videoProfilUrl={videoProfilUrl}
                setVideoProfilUrl={setVideoProfilUrl}
                sejarah={sejarah}
                setSejarah={setSejarah}
              />
            )}

            {activeTab === "pimpinan" && (
              <ProfilePimpinanForm
                pimpinan={pimpinan}
                setPimpinan={setPimpinan}
                handlePimpinanPhotoChange={handlePimpinanPhotoChange}
              />
            )}

            {activeTab === "visi_misi" && (
              <ProfileVisiMisiForm
                visi={visi}
                setVisi={setVisi}
                misi={misi}
                setMisi={setMisi}
              />
            )}

            {activeTab === "tujuan" && (
              <ProfileTujuanForm tujuan={tujuan} setTujuan={setTujuan} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
