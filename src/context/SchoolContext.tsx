"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SchoolContextType {
  schoolId: string;
  schoolSlug: string;
  schoolStatus: string;
  isDemoMode: boolean;
  isSchoolNotFound: boolean;
  isConfigLoaded: boolean;
  ppdbLogo: string;
  ppdbTitle: string;
  ppdbFooterDesc: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profilSekolah: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProfilSekolah: React.Dispatch<React.SetStateAction<any>>;
  fetchConfigs: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = (params?.school_slug as string) || "";
  const isDemoMode = slug === 'demo';

  const [schoolId, setSchoolId] = useState<string>("");
  const [schoolStatus, setSchoolStatus] = useState<string>("");
  const [isSchoolNotFound, setIsSchoolNotFound] = useState<boolean>(false);
  const [ppdbLogo, setPpdbLogo] = useState<string>("");
  const [ppdbTitle, setPpdbTitle] = useState<string>("PPDB SMK TB");
  const [isConfigLoaded, setIsConfigLoaded] = useState<boolean>(false);
  const [ppdbFooterDesc, setPpdbFooterDesc] = useState<string>("Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profilSekolah, setProfilSekolah] = useState<any>(null);

  // ── Fetch global config (logo, title, profil) ──────────────────────────────
  const fetchConfigs = useCallback(async () => {
    if (isDemoMode) return;
    try {
      const res = await fetch(`/api/config?school_slug=${slug}`);
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.ppdb_logo_url) setPpdbLogo(data.data.ppdb_logo_url);
        if (data.data.ppdb_title) setPpdbTitle(data.data.ppdb_title);
        if (data.data.ppdb_footer_desc) setPpdbFooterDesc(data.data.ppdb_footer_desc);
        if (data.data.ppdb_profil_sekolah) setProfilSekolah(data.data.ppdb_profil_sekolah);
      }
      setIsConfigLoaded(true);
    } catch (err) {
      console.error("Gagal mengambil config:", err);
      setIsConfigLoaded(true);
    }
  }, [slug]);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  // ── Fetch school theme color ───────────────────────────────────────────────
  useEffect(() => {
    if (schoolId) {
      fetch(`/api/config?school_id=${schoolId}`)
        .then((res) => {
          if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return null;
          return res.json();
        })
        .then((data) => {
          if (data && data.success && data.data && data.data.ppdb_school_theme_color) {
            const themeColor = data.data.ppdb_school_theme_color;
            // SECURITY: Validate color format to prevent XSS injection via malicious DB values
            const SAFE_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\))$/;
            if (!SAFE_COLOR_RE.test(themeColor)) {
              console.warn("Invalid theme color rejected:", themeColor);
              return;
            }
            const styleId = "ppdb-school-theme";
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
              styleEl = document.createElement("style");
              styleEl.id = styleId;
              document.head.appendChild(styleEl);
            }
            styleEl.textContent = `
              :where(:not(.dark *)):where(:not([data-dashboard] *)) .text-primary { color: ${themeColor} !important; }
              :where(:not(.dark *)):where(:not([data-dashboard] *)) .bg-primary { background-color: ${themeColor} !important; }
              :where(:not(.dark *)):where(:not([data-dashboard] *)) .border-primary { border-color: ${themeColor} !important; }
              [data-dashboard] .bg-blue-600 { background-color: ${themeColor} !important; }
              [data-dashboard] .text-blue-600 { color: ${themeColor} !important; }
              [data-dashboard] .border-blue-600 { border-color: ${themeColor} !important; }
            `;
          }
        })
        .catch((err) => console.error("Gagal mengambil config tema sekolah:", err));
    }
  }, [schoolId]);

  // ── Resolve school slug to school data ─────────────────────────────────────
  useEffect(() => {
    if (slug) {
      fetch(`/api/saas/school-by-slug/${slug}`)
        .then(async (res) => {
          if (!res.headers.get("content-type")?.includes("application/json")) return null;
          return res.json();
        })
        .then((data) => {
          if (data && data.notFound) {
            setIsSchoolNotFound(true);
          } else if (data && data.success && data.data) {
            setIsSchoolNotFound(false);
            setSchoolId(data.data.school_uuid || data.data.id);
            if (data.data.status) setSchoolStatus(data.data.status);
            if (data.data.logo_url) setPpdbLogo(data.data.logo_url);
            if (data.data.name) setPpdbTitle(data.data.name);
          } else if (slug !== 'smktarunabhakti' && slug !== 'demo') {
            setIsSchoolNotFound(true);
          } else {
            setIsSchoolNotFound(false);
            setSchoolId(slug);
            setPpdbTitle(slug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : slug);
          }
        })
        .catch((err) => {
          console.warn("Gagal mengambil data sekolah:", err?.message);
        });
    }
  }, [slug]);

  return (
    <SchoolContext.Provider
      value={{
        schoolId,
        schoolSlug: slug,
        schoolStatus,
        isDemoMode,
        isSchoolNotFound,
        isConfigLoaded,
        ppdbLogo,
        ppdbTitle,
        ppdbFooterDesc,
        profilSekolah,
        setProfilSekolah,
        fetchConfigs,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
}
