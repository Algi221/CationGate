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

  const majorKeys = ["rpl", "tjkt", "dkv", "bc", "animasi", "te"];
  const currentIndex = majorKeys.indexOf(code);
  const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % majorKeys.length : 0;
  const nextCode = majorKeys[nextIndex];

  const [major, setMajor] = useState<MajorDetail | null>(null);
  const [nextMajor, setNextMajor] = useState<MajorDetail | null>(null);
  const [kuotaData, setKuotaData] = useState<KuotaItem[] | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const isDarkStored = localStorage.getItem("ppdb-theme") === "dark";
    setIsDark(isDarkStored || document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (code && majorsData[code]) {
      setMajor({ ...majorsData[code] });
    } else if (code) {
      setMajor({
        code: code.toUpperCase(),
        title: code.toUpperCase(),
        alias: code.toUpperCase(),
        subtitle: "Program Keahlian Baru",
        tagline: "Coding the Future, Building Creative Solutions.",
        desc: "",
        color: "from-blue-600 to-indigo-600",
        accentColor: "#0066ff",
        bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
        textAccent: "text-blue-600 dark:text-blue-400",
        glowColor: "rgba(0,102,255,0.15)",
        logo: "/icon.png",
        banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
        syllabus: [{ subject: "Dasar Kompetensi", desc: "Mempelajari dasar-dasar keahlian program studi baru." }],
        careers: [{ title: "Tenaga Ahli", desc: "Menjadi profesional kompeten di bidangnya." }],
        facilities: ["Laboratorium Praktikum Baru"],
        gallery: [],
        partners: "Mitra Industri Sekolah"
      });
    }

    if (nextCode && majorsData[nextCode]) {
      setNextMajor({ ...majorsData[nextCode] });
    }
  }, [code, nextCode]);

  useEffect(() => {
    const loadDynamicConfig = async () => {
      try {
        const res = await fetch(`/api/config?school_slug=${schoolSlug}&_t=${Date.now()}`);
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          if (config.ppdb_majors_config && Array.isArray(config.ppdb_majors_config)) {
            const found = config.ppdb_majors_config.find(
              (m: Record<string, unknown>) =>
                (m.code as string).toLowerCase() === code ||
                ((m.code as string).toLowerCase() === "anm" && code === "an")
            );
            if (found) {
              setMajor((prev: MajorDetail | null) => {
                const base: MajorDetail = prev || {
                  code: found.code as string,
                  title: (found.title as string) || (found.code as string),
                  alias: found.code as string,
                  subtitle: (found.title as string) || (found.code as string),
                  tagline: "Coding the Future, Building Creative Solutions.",
                  desc: (found.desc as string) || "",
                  color: "from-blue-600 to-indigo-600",
                  accentColor: (found.color as string) || "#0066ff",
                  bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
                  textAccent: "text-blue-600 dark:text-blue-400",
                  glowColor: "rgba(0,102,255,0.15)",
                  logo: (found.logo as string) || "/icon.png",
                  banner:
                    (found.banner as string) ||
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
                  video: (found.video as string) || undefined,
                  syllabus: [
                    { subject: "Dasar Kompetensi", desc: "Mempelajari dasar-dasar keahlian program studi." }
                  ],
                  careers: Array.isArray(found.careers)
                    ? (found.careers as CareerItem[])
                    : [{ title: "Tenaga Ahli", desc: "Menjadi profesional kompeten di bidangnya." }],
                  facilities: Array.isArray(found.facilities)
                    ? (found.facilities as string[])
                    : ["Laboratorium Praktikum Baru"],
                  gallery: Array.isArray(found.gallery) ? (found.gallery as GalleryItem[]) : [],
                  partners: "Mitra Industri Sekolah"
                };
                return {
                  ...base,
                  title: (found.title as string) || base.title,
                  desc: (found.desc as string) || base.desc,
                  accentColor: (found.color as string) || base.accentColor,
                  logo: (found.logo as string) || base.logo,
                  banner: (found.banner as string) || base.banner,
                  video: (found.video as string) || base.video,
                  careers: Array.isArray(found.careers) ? (found.careers as CareerItem[]) : base.careers,
                  facilities: Array.isArray(found.facilities) ? (found.facilities as string[]) : base.facilities,
                  gallery: Array.isArray(found.gallery) ? (found.gallery as GalleryItem[]) : base.gallery
                };
              });
            }

            const foundNext = config.ppdb_majors_config.find(
              (m: Record<string, unknown>) =>
                (m.code as string).toLowerCase() === nextCode ||
                ((m.code as string).toLowerCase() === "anm" && nextCode === "an")
            );
            if (foundNext) {
              setNextMajor((prev: MajorDetail | null) => {
                if (!prev) return null;
                return {
                  ...prev,
                  title: foundNext.title || prev.title,
                  desc: foundNext.desc || prev.desc,
                  accentColor: foundNext.color || prev.accentColor,
                  logo: foundNext.logo || prev.logo
                };
              });
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
  }, [code, nextCode, schoolSlug]);

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
