"use client";

import React, { createContext, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { useSchoolStore, type ProfilSekolah } from "@/stores/useSchoolStore";

export type { ProfilSekolah } from "@/stores/useSchoolStore";

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
  schoolPeriod: string;
  profilSekolah: ProfilSekolah | null;
  setProfilSekolah: React.Dispatch<React.SetStateAction<ProfilSekolah | null>>;
  fetchConfigs: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | null>(null);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();

  const getSubdomainFromWindow = () => {
    if (typeof window === "undefined") return "";
    const host = window.location.host.split(":")[0].toLowerCase();
    if (host.endsWith(".cationgate.site")) {
      const sub = host.replace(".cationgate.site", "");
      if (!["www", "api", "admin", "app", "mail"].includes(sub)) return sub;
    } else if (host.endsWith(".localhost")) {
      const sub = host.replace(".localhost", "");
      if (!["www", "api", "admin", "app", "mail"].includes(sub)) return sub;
    }
    return "";
  };

  const rawSlug =
    (params?.school_slug as string) ||
    (pathname?.startsWith("/demo") ? "demo" : "") ||
    getSubdomainFromWindow();

  const schoolId = useSchoolStore((s) => s.schoolId);
  const schoolSlug = useSchoolStore((s) => s.schoolSlug);
  const schoolStatus = useSchoolStore((s) => s.schoolStatus);
  const isDemoMode = useSchoolStore((s) => s.isDemoMode);
  const isSchoolNotFound = useSchoolStore((s) => s.isSchoolNotFound);
  const isConfigLoaded = useSchoolStore((s) => s.isConfigLoaded);
  const ppdbLogo = useSchoolStore((s) => s.ppdbLogo);
  const ppdbTitle = useSchoolStore((s) => s.ppdbTitle);
  const ppdbFooterDesc = useSchoolStore((s) => s.ppdbFooterDesc);
  const schoolPeriod = useSchoolStore((s) => s.schoolPeriod);
  const profilSekolah = useSchoolStore((s) => s.profilSekolah);
  const setProfilSekolah = useSchoolStore((s) => s.setProfilSekolah);
  const setSchoolSlug = useSchoolStore((s) => s.setSchoolSlug);
  const fetchConfigs = useSchoolStore((s) => s.fetchConfigs);

  useEffect(() => {
    if (rawSlug !== undefined) {
      setSchoolSlug(rawSlug);
    }
  }, [rawSlug, setSchoolSlug]);

  const value: SchoolContextType = {
    schoolId,
    schoolSlug: schoolSlug || rawSlug,
    schoolStatus,
    isDemoMode,
    isSchoolNotFound,
    isConfigLoaded,
    ppdbLogo,
    ppdbTitle,
    ppdbFooterDesc,
    schoolPeriod,
    profilSekolah,
    setProfilSekolah: setProfilSekolah as React.Dispatch<React.SetStateAction<ProfilSekolah | null>>,
    fetchConfigs,
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}

export function useSchool(): SchoolContextType {
  const schoolId = useSchoolStore((s) => s.schoolId);
  const schoolSlug = useSchoolStore((s) => s.schoolSlug);
  const schoolStatus = useSchoolStore((s) => s.schoolStatus);
  const isDemoMode = useSchoolStore((s) => s.isDemoMode);
  const isSchoolNotFound = useSchoolStore((s) => s.isSchoolNotFound);
  const isConfigLoaded = useSchoolStore((s) => s.isConfigLoaded);
  const ppdbLogo = useSchoolStore((s) => s.ppdbLogo);
  const ppdbTitle = useSchoolStore((s) => s.ppdbTitle);
  const ppdbFooterDesc = useSchoolStore((s) => s.ppdbFooterDesc);
  const schoolPeriod = useSchoolStore((s) => s.schoolPeriod);
  const profilSekolah = useSchoolStore((s) => s.profilSekolah);
  const setProfilSekolah = useSchoolStore((s) => s.setProfilSekolah);
  const fetchConfigs = useSchoolStore((s) => s.fetchConfigs);

  return {
    schoolId,
    schoolSlug,
    schoolStatus,
    isDemoMode,
    isSchoolNotFound,
    isConfigLoaded,
    ppdbLogo,
    ppdbTitle,
    ppdbFooterDesc,
    schoolPeriod,
    profilSekolah,
    setProfilSekolah: setProfilSekolah as React.Dispatch<React.SetStateAction<ProfilSekolah | null>>,
    fetchConfigs,
  };
}
