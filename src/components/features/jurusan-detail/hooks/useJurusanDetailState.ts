"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MajorDetail, KuotaItem, CareerItem, GalleryItem } from "../types";
import { majorsData, hexToRgb, getDarkerColor } from "../defaultMajorsData";

export function useJurusanDetailState() {
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "sekolah";
  const rawCode = (params?.code as string) || "";
  const code = rawCode.toLowerCase();

  const [nextCode, setNextCode] = useState<string>("");
  const [major, setMajor] = useState<MajorDetail | null>(null);
  const [nextMajor, setNextMajor] = useState<MajorDetail | null>(null);
  const [kuotaData, setKuotaData] = useState<KuotaItem[] | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const isDarkStored = localStorage.getItem("ppdb-theme") === "dark";
    setIsDark(isDarkStored || document.documentElement.classList.contains("dark"));
  }, []);

  const isDemo = schoolSlug === "demo" || (typeof window !== "undefined" && (window.location.pathname.startsWith("/demo") || window.location.host.startsWith("demo.")));

  useEffect(() => {
    if (isDemo && code && majorsData[code]) {
      setMajor({ ...majorsData[code] });
      const demoKeys = ["rpl", "tjkt", "dkv", "bc", "animasi", "te"];
      const currentIndex = demoKeys.indexOf(code);
      const nIdx = currentIndex !== -1 ? (currentIndex + 1) % demoKeys.length : 0;
      const nCode = demoKeys[nIdx];
      setNextCode(nCode);
      if (majorsData[nCode]) {
        setNextMajor({ ...majorsData[nCode] });
      }
    } else if (code) {
      setMajor({
        code: code.toUpperCase(),
        title: code.toUpperCase(),
        alias: code.toUpperCase(),
        subtitle: "Program Keahlian",
        tagline: "Mendidik talenta unggul dan kompeten berstandar industri.",
        desc: "",
        color: "from-blue-600 to-indigo-600",
        accentColor: "#0066ff",
        bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
        textAccent: "text-blue-600 dark:text-blue-400",
        glowColor: "rgba(0,102,255,0.15)",
        logo: "/icon.png",
        banner: "",
        syllabus: [],
        careers: [],
        facilities: [],
        gallery: [],
        partners: ""
      });
      setNextMajor(null);
      setNextCode("");
    }
  }, [code, isDemo]);

  useEffect(() => {
    const loadDynamicConfig = async () => {
      try {
        const res = await fetch(`/api/config?school_slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`);
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          let majorsList = config.ppdb_majors_config;
          if (typeof majorsList === "string" && (majorsList.startsWith("[") || majorsList.startsWith("{"))) {
            try { majorsList = JSON.parse(majorsList); } catch (_e) {}
          }
          if (majorsList && Array.isArray(majorsList)) {
            const currentIdx = majorsList.findIndex(
              (m: Record<string, unknown>) => {
                const mCode = ((m.code as string) || "").toLowerCase().trim();
                const mTitle = ((m.title as string) || "").toLowerCase().trim();
                const mAlias = ((m.alias as string) || "").toLowerCase().trim();
                return (
                  mCode === code ||
                  mCode === rawCode.toLowerCase() ||
                  mTitle === code ||
                  mAlias === code ||
                  (mCode === "anm" && (code === "an" || code === "animasi")) ||
                  (mCode === "animasi" && (code === "anm" || code === "an")) ||
                  (mCode === "tjkt" && (code === "tkj" || code === "tjkt")) ||
                  (mCode === "tkj" && (code === "tjkt" || code === "tkj"))
                );
              }
            );

            if (currentIdx !== -1) {
              const found = majorsList[currentIdx];
              setMajor((prev: MajorDetail | null) => {
                const base: MajorDetail = prev || {
                  code: (found.code as string) || code.toUpperCase(),
                  title: (found.title as string) || (found.code as string),
                  alias: (found.code as string) || code.toUpperCase(),
                  subtitle: (found.title as string) || (found.code as string),
                  tagline: "Mendidik talenta unggul dan kompeten berstandar industri.",
                  desc: (found.desc as string) || "",
                  color: "from-blue-600 to-indigo-600",
                  accentColor: (found.color as string) || "#0066ff",
                  bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
                  textAccent: "text-blue-600 dark:text-blue-400",
                  glowColor: "rgba(0,102,255,0.15)",
                  logo: (found.logo as string) || "/icon.png",
                  banner: (found.banner as string) || "",
                  video: (found.video as string) || undefined,
                  syllabus: Array.isArray(found.syllabus) ? (found.syllabus as { subject: string; desc: string }[]) : [],
                  careers: Array.isArray(found.careers) ? (found.careers as CareerItem[]) : [],
                  facilities: Array.isArray(found.facilities) ? (found.facilities as string[]) : [],
                  gallery: Array.isArray(found.gallery) ? (found.gallery as GalleryItem[]) : [],
                  partners: ""
                };
                return {
                  ...base,
                  title: (found.title as string) || base.title,
                  desc: (found.desc as string) || base.desc,
                  accentColor: (found.color as string) || base.accentColor,
                  logo: (found.logo as string) || base.logo,
                  banner: (found.banner as string) || "",
                  video: (found.video as string) || base.video,
                  syllabus: Array.isArray(found.syllabus) ? (found.syllabus as { subject: string; desc: string }[]) : base.syllabus,
                  careers: Array.isArray(found.careers) ? (found.careers as CareerItem[]) : base.careers,
                  facilities: Array.isArray(found.facilities) ? (found.facilities as string[]) : base.facilities,
                  gallery: Array.isArray(found.gallery) ? (found.gallery as GalleryItem[]) : base.gallery
                };
              });

              // Compute next major ONLY from school's actual majors list
              if (majorsList.length > 1) {
                const nextIdx = (currentIdx + 1) % majorsList.length;
                const foundNext = majorsList[nextIdx];
                if (foundNext && ((foundNext.code as string) || "").toLowerCase() !== code) {
                  const nCode = ((foundNext.code as string) || "").toLowerCase();
                  setNextCode(nCode);
                  const nextDefault = majorsData[nCode];
                  setNextMajor({
                    code: (foundNext.code as string) || nCode.toUpperCase(),
                    title: (foundNext.title as string) || (foundNext.code as string) || nCode.toUpperCase(),
                    alias: (foundNext.code as string) || nCode.toUpperCase(),
                    subtitle: (foundNext.title as string) || (foundNext.code as string),
                    tagline: nextDefault?.tagline || "Mendidik talenta unggul dan kompeten.",
                    desc: (foundNext.desc as string) || nextDefault?.desc || "Pelajari kurikulum dan prospek keahlian ini.",
                    color: nextDefault?.color || "from-blue-600 to-indigo-600",
                    accentColor: (foundNext.color as string) || nextDefault?.accentColor || "#0066ff",
                    bgAccent: nextDefault?.bgAccent || "bg-blue-500/10 dark:bg-blue-500/20",
                    textAccent: nextDefault?.textAccent || "text-blue-600 dark:text-blue-400",
                    glowColor: nextDefault?.glowColor || "rgba(0,102,255,0.15)",
                    logo: (foundNext.logo as string) || nextDefault?.logo || "/icon.png",
                    banner: (foundNext.banner as string) || nextDefault?.banner || "",
                    syllabus: nextDefault?.syllabus || [],
                    careers: Array.isArray(foundNext.careers) ? (foundNext.careers as CareerItem[]) : (nextDefault?.careers || []),
                    facilities: Array.isArray(foundNext.facilities) ? (foundNext.facilities as string[]) : (nextDefault?.facilities || []),
                    gallery: Array.isArray(foundNext.gallery) ? (foundNext.gallery as GalleryItem[]) : [],
                    partners: "Mitra Industri Sekolah"
                  });
                } else {
                  setNextMajor(null);
                  setNextCode("");
                }
              } else {
                setNextMajor(null);
                setNextCode("");
              }
            }
          }
        }
      } catch (err) {
        console.error("Gagal mengambil konfigurasi dinamis jurusan:", err);
      }
    };
    if (code) {
      loadDynamicConfig();
    }
  }, [code, rawCode, schoolSlug]);

  useEffect(() => {
    if (schoolSlug === "demo") {
      setKuotaData([
        { no: 1, key: "Rekayasa Perangkat Lunak", konsentrasi_keahlian: "Rekayasa Perangkat Lunak (RPL)", jumlah: 120, target: 144, presentase: "83%" },
        { no: 2, key: "Teknik Komputer dan Jaringan", konsentrasi_keahlian: "Teknik Komputer dan Jaringan (TKJ)", jumlah: 85, target: 108, presentase: "78%" },
        { no: 3, key: "Desain Komunikasi Visual", konsentrasi_keahlian: "Desain Komunikasi Visual (DKV)", jumlah: 90, target: 108, presentase: "83%" },
        { no: 4, key: "Broadcasting dan Perfilman", konsentrasi_keahlian: "Broadcasting dan Perfilman (BC)", jumlah: 60, target: 72, presentase: "83%" },
        { no: 5, key: "Animasi", konsentrasi_keahlian: "Animasi (ANIMASI)", jumlah: 55, target: 72, presentase: "76%" },
        { no: 6, key: "Teknik Elektronika", konsentrasi_keahlian: "Teknik Elektronika (TE)", jumlah: 40, target: 72, presentase: "55%" }
      ]);
      return;
    }

    const loadKuota = async () => {
      try {
        const res = await fetch(`/api/kuota?school_slug=${schoolSlug}`);
        const json = await res.json();
        if (json.success && json.data && Array.isArray(json.data.pendaftar)) {
          setKuotaData(json.data.pendaftar);
        } else {
          setKuotaData([]);
        }
      } catch (err) {
        console.log("Failed to fetch kuota data:", err);
        setKuotaData([]);
      }
    };
    loadKuota();
  }, [schoolSlug]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
  };

  const accentColor = major?.accentColor || "#0066ff";
  const accentRgb = hexToRgb(accentColor);
  const darkerColor = getDarkerColor(accentColor, 15);
  const glowColor = `rgba(${accentRgb}, 0.15)`;

  const nextAccentColor = nextMajor?.accentColor || "#0066ff";
  const nextAccentRgb = hexToRgb(nextAccentColor);
  const nextDarkerColor = getDarkerColor(nextAccentColor, 15);

  return {
    schoolSlug,
    code,
    nextCode,
    major,
    nextMajor,
    kuotaData,
    isDark,
    toggleDark,
    accentColor,
    accentRgb,
    darkerColor,
    glowColor,
    nextAccentColor,
    nextAccentRgb,
    nextDarkerColor
  };
}
