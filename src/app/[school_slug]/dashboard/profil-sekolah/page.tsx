"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { Save, HelpCircle, FileText, School, Target, ListChecks, Check, X, Building2 } from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilSekolahPage() {
  const { adminToken, profilSekolah, setProfilSekolah, fetchConfigs, schoolId, isDemoMode } = usePPDB();

  const [loading, setLoading] = useState(false);
  const [identitas, setIdentitas] = useState({
    nama: "",
    akreditasi: "",
    alamat: "",
    npsn: "",
    nis: "",
    nss: "",
    tahun_berdiri: "",
    email: ""
  });
  const [sejarah, setSejarah] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [tujuan, setTujuan] = useState("");
  
  const [activeTab, setActiveTab] = useState("identitas");

  useEffect(() => {
    if (profilSekolah) {
      if (profilSekolah.identitas) setIdentitas(profilSekolah.identitas);
      if (profilSekolah.sejarah) setSejarah(profilSekolah.sejarah);
      if (profilSekolah.visi_misi) {
        setVisi(profilSekolah.visi_misi.visi || "");
        setMisi(profilSekolah.visi_misi.misi || "");
      }
      if (profilSekolah.tujuan) setTujuan(profilSekolah.tujuan);
    }
  }, [profilSekolah]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveConfig = async (key: string, value: any, label: string) => {
    if (isDemoMode) {
      Swal.fire({ icon: 'info', title: 'Mode Demo', text: 'Perubahan tidak disimpan permanen di mode demo.' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/config?school_id=${schoolId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ key, value })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `${label} berhasil diperbarui!`,
          timer: 1500,
          showConfirmButton: false,
        });
        await fetchConfigs(); // Refresh context
      } else {
        Swal.fire("Gagal", data.message || `Gagal menyimpan ${label}`, "error");
      }
    } catch (err: unknown) {
      Swal.fire("Error", (err as any).message || "Terjadi kesalahan sistem.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = () => {
    const payload = {
      identitas,
      sejarah,
      visi_misi: { visi, misi },
      tujuan
    };
    saveConfig("ppdb_profil_sekolah", payload, "Profil Sekolah");
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
            <p className="text-slate-500 dark:text-slate-400 mt-1">Atur identitas, sejarah, visi-misi, dan tujuan sekolah yang akan ditampilkan di landing page.</p>
          </div>
          
          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Simpan Perubahan
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 shrink-0">
            <div className="p-4 space-y-1">
              {[
                { id: "identitas", label: "Identitas Sekolah", icon: <School className="w-5 h-5" /> },
                { id: "sejarah", label: "Sejarah", icon: <FileText className="w-5 h-5" /> },
                { id: "visimisi", label: "Visi & Misi", icon: <Target className="w-5 h-5" /> },
                { id: "tujuan", label: "Tujuan", icon: <ListChecks className="w-5 h-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-8">
            
            {activeTab === "identitas" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <School className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Identitas Sekolah</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Sekolah</label>
                    <input type="text" name="nama" value={identitas.nama} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Contoh: SMK TARUNA BHAKTI" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Status Akreditasi</label>
                    <input type="text" name="akreditasi" value={identitas.akreditasi} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Contoh: A / Nomor: ..." />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Alamat Lengkap</label>
                    <textarea name="alamat" rows={3} value={identitas.alamat} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none" placeholder="Alamat jalan, kelurahan, kecamatan, kota, provinsi, dsb." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">NPSN</label>
                    <input type="text" name="npsn" value={identitas.npsn} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Nomor Pokok Sekolah Nasional" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">NIS</label>
                    <input type="text" name="nis" value={identitas.nis} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Nomor Induk Sekolah" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">NSS</label>
                    <input type="text" name="nss" value={identitas.nss} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Nomor Statistik Sekolah" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tahun Berdiri</label>
                    <input type="text" name="tahun_berdiri" value={identitas.tahun_berdiri} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Tahun" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Utama</label>
                    <input type="email" name="email" value={identitas.email} onChange={handleIdentitasChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="email@sekolah.com" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sejarah" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sejarah Singkat</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ceritakan awal mula berdiri dan perkembangan sekolah.</p>
                <textarea
                  rows={15}
                  value={sejarah}
                  onChange={(e) => setSejarah(e.target.value)}
                  className="w-full flex-1 px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none"
                  placeholder="Tuliskan sejarah sekolah di sini..."
                />
              </div>
            )}

            {activeTab === "visimisi" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Target className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Visi & Misi</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Visi Sekolah</label>
                  <textarea
                    rows={4}
                    value={visi}
                    onChange={(e) => setVisi(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none"
                    placeholder="Contoh: Menghasilkan Lulusan Yang Kompeten Dalam Ilmu Pengetahuan dan Teknologi..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Misi Sekolah</label>
                  <textarea
                    rows={8}
                    value={misi}
                    onChange={(e) => setMisi(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none"
                    placeholder="Contoh:
1. Menumbuhkan Semangat Kreatifitas...
2. Melaksanakan Kurikulum...
3. Meningkatkan kualitas sumber daya..."
                  />
                </div>
              </div>
            )}

            {activeTab === "tujuan" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tujuan Sekolah</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Jabarkan tujuan utama yang ingin dicapai sekolah. Anda dapat menggunakan format daftar (list).</p>
                <textarea
                  rows={15}
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  className="w-full flex-1 px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none"
                  placeholder="Dalam mewujudkan visi dan misi, sekolah mempunyai tujuan sebagai berikut:
- Menghasilkan lulusan yang kompeten
- Meningkatkan kualitas pembelajaran..."
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
