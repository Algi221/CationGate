"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { 
  Save, 
  School, 
  Target, 
  ListChecks, 
  Building2, 
  Upload, 
  Image as ImageIcon,
  UserCheck,
  Video
} from "lucide-react";
import Swal from "sweetalert2";
import { uploadFileDirect, base64ToFile } from "@/utils/storage";
import { compressImage } from "@/utils/mediaCompressor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function ProfilSekolahPage() {
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";
  const { adminToken, profilSekolah, fetchConfigs, schoolId, isDemoMode, ppdbTitle, ppdbLogo } = usePPDB();

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
    telepon: ""
  });
  const [sejarah, setSejarah] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [videoProfilUrl, setVideoProfilUrl] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [pimpinan, setPimpinan] = useState({
    nama: "",
    jabatan: "Kepala Sekolah",
    sambutan: "",
    foto: ""
  });
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [tujuan, setTujuan] = useState("");

  const [activeTab, setActiveTab] = useState("identitas");

  const loadConfigData = React.useCallback(async () => {
    const targetSlug = schoolSlug || schoolId;
    if (!targetSlug) return;
    try {
      const res = await fetch(`/api/config?school_slug=${encodeURIComponent(targetSlug)}&_t=${Date.now()}`);
      const json = await res.json();
      if (json.success && json.data) {
        const c = json.data;
        if (c.ppdb_title) setIdentitas(prev => ({ ...prev, nama: c.ppdb_title }));
        if (c.ppdb_logo_url) setLogoInput(c.ppdb_logo_url);
        if (c.ppdb_address) setIdentitas(prev => ({ ...prev, alamat: c.ppdb_address }));
        if (c.ppdb_phone) setIdentitas(prev => ({ ...prev, telepon: c.ppdb_phone }));
        if (c.ppdb_email) setIdentitas(prev => ({ ...prev, email: c.ppdb_email }));

        let p = c.ppdb_profil_sekolah;
        if (typeof p === "string" && (p.startsWith("{") || p.startsWith("["))) {
          try { p = JSON.parse(p); } catch (_e) {}
        }
        if (p && typeof p === "object") {
          if (p.identitas) setIdentitas(prev => ({ ...prev, ...p.identitas, nama: c.ppdb_title || p.identitas.nama || prev.nama }));
          if (p.sejarah) setSejarah(p.sejarah);
          if (p.ringkasan) setRingkasan(p.ringkasan);
          if (p.video_profil_url !== undefined && p.video_profil_url !== null) setVideoProfilUrl(p.video_profil_url);
          if (p.hero_image) setHeroImage(p.hero_image);
          if (p.pimpinan) setPimpinan(prev => ({ ...prev, ...p.pimpinan }));
          if (p.visi_misi) {
            setVisi(p.visi_misi.visi || "");
            setMisi(p.visi_misi.misi || "");
          }
          if (p.tujuan) setTujuan(p.tujuan);
        }
      }
    } catch (err) {
      console.warn("Gagal memuat konfigurasi profil sekolah:", err);
    }
  }, [schoolSlug, schoolId]);

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);

  useEffect(() => {
    if (ppdbTitle) {
      setIdentitas(prev => ({ ...prev, nama: ppdbTitle }));
    }
    if (ppdbLogo) setLogoInput(ppdbLogo);

    if (profilSekolah) {
      let p = profilSekolah;
      if (typeof p === "string" && (p.startsWith("{") || p.startsWith("["))) {
        try { p = JSON.parse(p); } catch (_e) {}
      }
      if (p && typeof p === "object") {
        if (p.identitas) {
          setIdentitas(prev => ({ ...prev, ...p.identitas }));
        }
        if (p.sejarah) setSejarah(p.sejarah);
        if (p.ringkasan) setRingkasan(p.ringkasan);
        if (p.video_profil_url !== undefined && p.video_profil_url !== null) setVideoProfilUrl(p.video_profil_url);
        if (p.hero_image) setHeroImage(p.hero_image);
        if (p.pimpinan) {
          setPimpinan(prev => ({ ...prev, ...p.pimpinan }));
        }
        if (p.visi_misi) {
          setVisi(p.visi_misi.visi || "");
          setMisi(p.visi_misi.misi || "");
        }
        if (p.tujuan) setTujuan(p.tujuan);
      }
    }
  }, [profilSekolah, ppdbTitle, ppdbLogo]);

  const handleSaveAll = async () => {
    if (isDemoMode) {
      Swal.fire({ icon: 'info', title: 'Mode Demo', text: 'Perubahan tidak disimpan permanen di mode demo.' });
      return;
    }

    setLoading(true);
    const targetSlug = schoolSlug || schoolId || "";
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);

    const payload = {
      identitas,
      sejarah,
      ringkasan,
      video_profil_url: videoProfilUrl,
      hero_image: heroImage,
      pimpinan,
      visi_misi: { visi, misi },
      tujuan
    };

    const configsPayload = {
      ppdb_profil_sekolah: payload,
      ppdb_title: identitas.nama,
      ppdb_logo_url: logoInput,
      ppdb_address: identitas.alamat,
      ppdb_phone: identitas.telepon,
      ppdb_email: identitas.email
    };

    try {
      const saveUrl = targetSlug
        ? `/api/config/save-all?school_slug=${encodeURIComponent(targetSlug)}`
        : `/api/config/save-all`;

      const res = await fetch(saveUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          configs: configsPayload,
          description: "Pembaruan Profil, Logo, dan Figur Pimpinan Sekolah"
        })
      });

      const json = await res.json();
      setLoading(false);

      if (json.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Disimpan!",
          text: "Profil Sekolah, Logo, dan Foto Pimpinan berhasil disimpan!",
          timer: 1800,
          showConfirmButton: false,
        });

        if (targetSlug) {
          await useSchoolStore.getState().fetchConfigs(targetSlug);
        }
        await fetchConfigs();
        await loadConfigData();
      } else {
        Swal.fire("Peringatan", json.message || "Gagal menyimpan perubahan. Coba lagi.", "warning");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      Swal.fire("Gagal", "Terjadi kesalahan jaringan saat menyimpan profil.", "error");
    }
  };

  const handleSchoolLogoChange = async (file: File) => {
    try {
      setLoading(true);
      const result = await compressImage(file, 400, 400, 0.85);
      const compressedFile = base64ToFile(result.base64, file.name);
      const publicUrl = await uploadFileDirect(compressedFile, 'school_logo');
      setLogoInput(publicUrl);
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
      const publicUrl = await uploadFileDirect(compressedFile, 'pimpinan_photo');
      setPimpinan(prev => ({ ...prev, foto: publicUrl }));
    } catch (e) {
      console.error(e);
      Swal.fire("Gagal", "Gagal mengunggah foto pimpinan.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleIdentitasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIdentitas(prev => ({ ...prev, [name]: value }));
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
            <p className="text-slate-500 dark:text-slate-400 mt-1">Atur identitas, nama sekolah, video profil, pimpinan, sejarah, dan visi-misi.</p>
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
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab("identitas")}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === "identitas"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <School className="w-4 h-4" />
              Identitas &amp; Logo
            </button>
            <button
              onClick={() => setActiveTab("sejarah")}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === "sejarah"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Video className="w-4 h-4" />
              Sejarah &amp; Video Profil
            </button>
            <button
              onClick={() => setActiveTab("pimpinan")}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === "pimpinan"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Pimpinan Sekolah
            </button>
            <button
              onClick={() => setActiveTab("visi_misi")}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === "visi_misi"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Target className="w-4 h-4" />
              Visi &amp; Misi
            </button>
            <button
              onClick={() => setActiveTab("tujuan")}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === "tujuan"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <ListChecks className="w-4 h-4" />
              Tujuan Institusi
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Tab: Identitas & Logo */}
            {activeTab === "identitas" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Identitas Utama Sekolah</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Informasi pokok sekolah yang digunakan di profil dan kop surat sistem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group">
                      {logoInput ? (
                        <Image src={logoInput} alt="Logo" width={128} height={128} className="w-full h-full object-contain p-2" unoptimized />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                      )}
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="w-6 h-6 text-white mb-1" />
                        <span className="text-white text-xs font-semibold">Ubah Logo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSchoolLogoChange(file);
                        }} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Logo Resmi Sekolah</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Logo ini akan digunakan pada seluruh halaman portal PPDB, formulir pendaftaran, dan dokumen kelulusan.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Sekolah</label>
                    <input type="text" name="nama" value={identitas.nama} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Contoh: SMK TARUNA BHAKTI" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">NPSN (10 Digit Angka)</label>
                    <input
                      type="text"
                      name="npsn"
                      inputMode="numeric"
                      maxLength={10}
                      value={identitas.npsn}
                      onChange={(e) => {
                        const numericVal = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setIdentitas((prev) => ({ ...prev, npsn: numericVal }));
                      }}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                      placeholder="Contoh: 2080701234"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Status Akreditasi</label>
                    <Select
                      value={identitas.akreditasi || "A (Unggul)"}
                      onValueChange={(val) => {
                        setIdentitas((prev) => ({ ...prev, akreditasi: val }));
                      }}
                    >
                      <SelectTrigger className="w-full h-11.5 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium">
                        <SelectValue placeholder="Pilih Status Akreditasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A (Unggul)">A (Unggul)</SelectItem>
                        <SelectItem value="B (Baik Sekali)">B (Baik Sekali)</SelectItem>
                        <SelectItem value="C (Baik)">C (Baik)</SelectItem>
                        <SelectItem value="Belum Terakreditasi">Belum Terakreditasi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tahun Berdiri</label>
                    <input
                      type="text"
                      name="tahun_berdiri"
                      inputMode="numeric"
                      maxLength={4}
                      value={identitas.tahun_berdiri}
                      onChange={(e) => {
                        const num = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setIdentitas((prev) => ({ ...prev, tahun_berdiri: num }));
                      }}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                      placeholder="Contoh: 2004"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Resmi</label>
                    <input type="email" name="email" value={identitas.email} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="admin@sekolah.sch.id" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">No. Telepon / WhatsApp</label>
                    <input
                      type="text"
                      name="telepon"
                      inputMode="numeric"
                      value={identitas.telepon}
                      onChange={(e) => {
                        const num = e.target.value.replace(/[^\d+]/g, "").slice(0, 15);
                        setIdentitas((prev) => ({ ...prev, telepon: num }));
                      }}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                      placeholder="081234567890"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Alamat Lengkap</label>
                    <textarea name="alamat" value={identitas.alamat} onChange={handleIdentitasChange} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Jl. Pekapuran No. 1..." />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Sejarah & Video Profil */}
            {activeTab === "sejarah" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sejarah &amp; Media Profil</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Atur deskripsi ringkas, video YouTube company profile, dan sejarah lengkap.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ringkasan / Tagline Profil (Hero)</label>
                    <textarea value={ringkasan} onChange={(e) => setRingkasan(e.target.value)} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Deskripsi ringkas yang tampil di bawah judul 'Tentang Sekolah'..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">URL Video YouTube Company Profile</label>
                    <input type="text" value={videoProfilUrl} onChange={(e) => setVideoProfilUrl(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Contoh: https://www.youtube.com/watch?v=GR5wYYT4PJ8" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sejarah Lengkap Sekolah</label>
                    <textarea value={sejarah} onChange={(e) => setSejarah(e.target.value)} rows={8} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="SMK Taruna Bhakti didirikan pada tahun..." />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Pimpinan Sekolah */}
            {activeTab === "pimpinan" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pimpinan / Kepala Sekolah</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Informasi figur kepala sekolah atau pimpinan institusi.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative w-28 h-28 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group">
                      {pimpinan.foto ? (
                        <Image src={pimpinan.foto} alt="Foto Pimpinan" width={112} height={112} className="w-full h-full object-cover object-top" unoptimized />
                      ) : (
                        <UserCheck className="w-8 h-8 text-slate-400 mb-1" />
                      )}
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="w-5 h-5 text-white mb-1" />
                        <span className="text-white text-[10px] font-semibold">Foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePimpinanPhotoChange(file);
                        }} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">Foto Kepala Sekolah</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Unggah foto resmi pimpinan sekolah (rasio 1:1, format PNG/JPG, maks 2MB).</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Lengkap &amp; Gelar</label>
                    <input type="text" value={pimpinan.nama} onChange={(e) => setPimpinan(p => ({ ...p, nama: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Dr. H. Ahmad Fauzi, M.Pd." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jabatan</label>
                    <input type="text" value={pimpinan.jabatan} onChange={(e) => setPimpinan(p => ({ ...p, jabatan: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Kepala Sekolah / Rektor" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sambutan / Pernyataan Pimpinan</label>
                    <textarea value={pimpinan.sambutan} onChange={(e) => setPimpinan(p => ({ ...p, sambutan: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Sambutan singkat mengenai visi kepemimpinan dan dedikasi mutu pendidikan..." />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Visi & Misi */}
            {activeTab === "visi_misi" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visi &amp; Misi Sekolah</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Gunakan baris baru atau nomor urut untuk poin-poin misi.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Visi Institusi</label>
                    <textarea value={visi} onChange={(e) => setVisi(e.target.value)} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Menjadi lembaga pendidikan unggul..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Misi Institusi</label>
                    <textarea value={misi} onChange={(e) => setMisi(e.target.value)} rows={6} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="1. Menyelenggarakan proses pembelajaran...&#10;2. Membentuk karakter peserta didik..." />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Tujuan */}
            {activeTab === "tujuan" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tujuan Pendidikan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Target dan sasaran mutu lulusan yang ingin dicapai.</p>
                </div>

                <div className="space-y-2">
                  <textarea value={tujuan} onChange={(e) => setTujuan(e.target.value)} rows={8} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="1. Menghasilkan lulusan yang kompeten...&#10;2. Mewujudkan tata kelola institusi transparan..." />
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
