"use client";

import React, { useState, useEffect } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { Palette, Save, RefreshCw, Check } from "lucide-react";
import Swal from 'sweetalert2';
import { useRouter, useParams } from "next/navigation";

const PRESET_COLORS = [
  { name: "Ocean Blue", hex: "#2563EB" },
  { name: "Emerald Green", hex: "#10B981" },
  { name: "Rose Red", hex: "#E11D48" },
  { name: "Amber Gold", hex: "#F59E0B" }
];

export default function AppearanceSettingsPage() {
  const { adminToken, addToast, schoolId } = usePPDB();
  const [mounted, setMounted] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState("#2563EB"); // Default blue
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const schoolSlug = params?.school_slug as string || "";

  useEffect(() => {
    setMounted(true);
    fetchCurrentTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, adminToken]);

  const fetchCurrentTheme = async () => {
    if (!adminToken) return;
    try {
      setIsLoading(true);
      const url = schoolId ? `/api/config?school_id=${schoolId}` : `/api/config`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success && data.data && data.data.ppdb_school_theme_color) {
        setThemeColor(data.data.ppdb_school_theme_color);
      }
    } catch (err) {
      console.error("Gagal memuat tema:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    if (!adminToken) return;
    try {
      setIsSaving(true);
      const url = schoolId ? `/api/config?school_id=${schoolId}` : `/api/config`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          key: 'ppdb_school_theme_color',
          value: themeColor
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          title: "Tersimpan!",
          text: "Tema sekolah berhasil diperbarui.",
          icon: "success",
          confirmButtonColor: themeColor,
        }).then(() => {
          window.location.reload();
        });
      } else {
        throw new Error(data.message || "Gagal menyimpan tema.");
      }
    } catch (err: any) {
      if (typeof addToast === "function") {
        addToast("Error", err.message || "Terjadi kesalahan saat menyimpan tema.", "danger");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500 dark:text-blue-400" size={32} />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-455">Memuat konfigurasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500 text-left pb-16">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
          <Palette className="text-blue-500 dark:text-blue-400" size={24} />
          <span>Pengaturan Tampilan</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-455 mt-1">
          Sesuaikan tema warna utama aplikasi untuk menyesuaikan dengan identitas (branding) sekolah Anda.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full blur-[80px] pointer-events-none opacity-20" style={{ backgroundColor: themeColor }}></div>

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
              <Palette size={20} style={{ color: themeColor }} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white tracking-tight">
                Warna Tema Utama
              </h3>
              <p className="text-xs text-slate-455 font-semibold mt-0.5">
                Pilih warna utama yang akan digunakan pada tombol, aksen, dan grafik.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              
              {/* Presets */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                  Warna Preset
                </label>
                <div className="flex flex-wrap gap-4">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setThemeColor(c.hex)}
                      title={c.name}
                      className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm ${
                        themeColor.toUpperCase() === c.hex.toUpperCase() 
                          ? "ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110 shadow-lg" 
                          : "hover:scale-110 hover:shadow-md"
                      }`}
                      style={{ 
                        backgroundColor: c.hex, 
                        borderColor: c.hex,
                        boxShadow: themeColor.toUpperCase() === c.hex.toUpperCase() ? `0 4px 14px ${c.hex}60` : undefined
                      }}
                    >
                      {themeColor.toUpperCase() === c.hex.toUpperCase() && <Check size={20} className="text-white drop-shadow-md animate-in zoom-in" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                  Atau Pilih Warna Custom (RGB/Hex)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-14 h-14 rounded-2xl cursor-pointer border-0 bg-transparent p-0 overflow-hidden shadow-sm hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <input
                      type="text"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 transition-all uppercase focus:outline-none"
                      maxLength={7}
                      style={{ "--tw-ring-color": themeColor } as React.CSSProperties}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Preview Box */}
            <div className="w-full md:w-auto p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm min-w-[220px]">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Preview Tombol</span>
              <button 
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 w-full"
                style={{ backgroundColor: themeColor, boxShadow: `0 8px 24px ${themeColor}40` }}
              >
                Tombol Contoh
              </button>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColor }}></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" style={{ color: themeColor }}>Aksen Teks</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
            <button
              onClick={handleSaveTheme}
              disabled={isSaving}
              className="px-6 py-3 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 disabled:opacity-50 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: themeColor, boxShadow: `0 8px 24px ${themeColor}40` }}
            >
              {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? "Menyimpan..." : "Simpan Tema"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

