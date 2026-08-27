"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { InformasiItem } from "../types";

export function useForumState() {
  const params = useParams();
  const schoolSlug =
    (params?.school_slug as string) ||
    (typeof window !== "undefined" && window.location.hostname.includes(".") && !window.location.hostname.startsWith("www.") && !window.location.hostname.startsWith("gatekeeper.")
      ? window.location.hostname.split(".")[0]
      : "");
  const { ppdbLogo, ppdbTitle, profilSekolah } = usePPDB();

  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [informasi, setInformasi] = useState<InformasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<InformasiItem | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    const fetchInformasi = async () => {
      if (!schoolSlug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/informasi?school_slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setInformasi(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat informasi forum:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInformasi();
  }, [schoolSlug]);

  const handleOpenDetail = async (item: InformasiItem) => {
    setLoadingDetailId(item.id);
    try {
      const res = await fetch(`/api/informasi/${item.id}?school_slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedPost(json.data);
      } else {
        setSelectedPost(item);
      }
    } catch (e) {
      console.error("Gagal mengambil detail pengumuman:", e);
      setSelectedPost(item);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const filteredInformasi = informasi.filter((item) => {
    const query = searchQuery.toLowerCase();
    return item.judul.toLowerCase().includes(query) || item.konten.toLowerCase().includes(query);
  });

  return {
    schoolSlug,
    ppdbLogo,
    ppdbTitle,
    profilSekolah,
    isNavbarScrolled,
    isDark,
    searchQuery,
    setSearchQuery,
    informasi,
    filteredInformasi,
    loading,
    selectedPost,
    setSelectedPost,
    loadingDetailId,
    handleOpenDetail
  };
}
