"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { Informasi } from "../types";
import { parseMedia, formatInputDate } from "../utils/mediaHelper";

const DEMO_INFORMASI_SEED: Informasi[] = [
  {
    id: 1,
    judul: "Pengumuman Pembukaan SPMB Online SMK Demo Indonesia 2026/2027",
    konten:
      "Selamat datang di Portal Simulasi SPMB SMK Demo Indonesia. Seluruh alur pendaftaran, tes seleksi, verifikasi berkas hingga pembagian rombel dapat Anda uji coba secara interaktif dan real-time di sini.",
    tanggal: "2026-06-01",
    foto_url: "",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    judul: "Panduan Registrasi Akun & Unggah Berkas Persyaratan Siswa Baru",
    konten:
      "Calon peserta didik baru dapat mengisi formulir 14 langkah dan mengunggah dokumen digital (Kartu Keluarga, Akta Kelahiran, Rapor SMP). Petugas administrasi akan memvalidasi data dalam waktu 1x24 jam.",
    tanggal: "2026-06-10",
    foto_url: "",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    judul: "Jadwal Wawancara & Tes Minat Bakat Program Keahlian Unggulan",
    konten:
      "Tes peminatan kejuruan dan wawancara calon siswa gelombang 1 akan dilaksanakan secara daring/luring. Pastikan nomor WhatsApp siswa dan orang tua aktif untuk menerima jadwal sesi.",
    tanggal: "2026-06-15",
    foto_url: "",
    created_at: new Date().toISOString()
  }
];

export function useInformasiState() {
  const { adminToken: ctxToken, addToast, isDemoMode } = usePPDB();
  const params = useParams();
  const schoolSlug =
    (params?.school_slug as string) ||
    (typeof window !== "undefined" && window.location.hostname.includes(".") && !window.location.hostname.startsWith("www.") && !window.location.hostname.startsWith("gatekeeper.")
      ? window.location.hostname.split(".")[0]
      : "") ||
    "";
  const isDemo = isDemoMode || schoolSlug === "demo";
  const getAuthToken = () => ctxToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null);

  const [informasiList, setInformasiList] = useState<Informasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [judul, setJudul] = useState<string>("");
  const [konten, setKonten] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [dokumenUrl, setDokumenUrl] = useState<string>("");
  const [dokumenName, setDokumenName] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);

  const [previewItem, setPreviewItem] = useState<Informasi | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const BACKEND_URL = "/api";

  const fetchDetailItem = async (id: number): Promise<Informasi | null> => {
    if (isDemo) {
      const found = informasiList.find((item) => item.id === id);
      return found || null;
    }

    try {
      setLoadingDetailId(id);
      const token = getAuthToken();
      const res = await fetch(`${BACKEND_URL}/informasi/${id}?school_id=${schoolSlug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal Memuat Detail", "Gagal memuat detail informasi dari server.", "danger");
        }
        return null;
      }
    } catch (err: unknown) {
      console.error("Error fetching detail:", err);
      if (typeof addToast === "function") {
        addToast("Koneksi Error", "Gagal menghubungi server.", "danger");
      }
      return null;
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handleOpenPreview = async (item: Informasi) => {
    if (loadingDetailId !== null) return;
    const fullItem = await fetchDetailItem(item.id);
    if (fullItem) {
      setPreviewItem(fullItem);
    }
  };

  const fetchInformasi = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setLoading(true);

      // Demo Mode Isolation
      if (isDemo || (typeof window !== "undefined" && window.location.pathname.includes("/demo"))) {
        setLoading(false);
        try {
          const stored = typeof window !== "undefined" ? localStorage.getItem("demo_informasi_list") : null;
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setInformasiList(parsed);
              return;
            }
          }
          setInformasiList(DEMO_INFORMASI_SEED);
          if (typeof window !== "undefined") {
            localStorage.setItem("demo_informasi_list", JSON.stringify(DEMO_INFORMASI_SEED));
          }
        } catch (_e) {
          setInformasiList(DEMO_INFORMASI_SEED);
        }
        return;
      }

      try {
        const token = getAuthToken();
        const queryParams = schoolSlug ? `?school_id=${encodeURIComponent(schoolSlug)}&school_slug=${encodeURIComponent(schoolSlug)}` : "";
        const res = await fetch(`${BACKEND_URL}/informasi${queryParams}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (data.success) {
          setInformasiList(data.data);
        } else {
          if (typeof addToast === "function") {
            addToast("Error", "Gagal memuat informasi dari server.", "danger");
          }
        }
      } catch (err: unknown) {
        console.warn("Backend offline, using fallback seeded data:", err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addToast, isDemo, schoolSlug]
  );

  useEffect(() => {
    fetchInformasi();
  }, [fetchInformasi]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setJudul("");
    setKonten("");

    const today = new Date().toISOString().split("T")[0];
    setTanggal(today);
    setFotoUrl("");
    setVideoUrl("");
    setVideoName("");
    setDokumenUrl("");
    setDokumenName("");
    setIsOpenModal(true);
  };

  const handleOpenEditModal = async (item: Informasi) => {
    if (loadingDetailId !== null) return;
    const fullItem = await fetchDetailItem(item.id);
    if (!fullItem) return;

    setIsEditMode(true);
    setSelectedId(fullItem.id);
    setJudul(fullItem.judul);
    setKonten(fullItem.konten);
    setTanggal(formatInputDate(fullItem.tanggal));

    const media = parseMedia(fullItem.foto_url);
    setFotoUrl(media.foto);
    setVideoUrl(media.video);
    setVideoName(media.videoName);
    setDokumenUrl(media.dokumen);
    setDokumenName(media.dokumenName);

    setIsOpenModal(true);
  };

  const processFile = (file: File) => {
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran File Terlalu Besar", "Harap pilih foto dengan ukuran di bawah 3 MB.", "warning");
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya berkas gambar/foto yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFotoUrl(reader.result);
        if (typeof addToast === "function") {
          addToast("Foto Siap", "Foto berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processVideoFile = (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran Video Terlalu Besar", "Harap pilih video dengan ukuran di bawah 10 MB.", "warning");
      }
      return;
    }

    if (!file.type.startsWith("video/")) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya berkas video (MP4/WebM) yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setVideoUrl(reader.result);
        setVideoName(file.name);
        if (typeof addToast === "function") {
          addToast("Video Siap", "Video berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const processDokumenFile = (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (typeof addToast === "function") {
        addToast("Ukuran Dokumen Terlalu Besar", "Harap pilih dokumen dengan ukuran di bawah 5 MB.", "warning");
      }
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain"
    ];

    const ext = file.name.split(".").pop()?.toLowerCase();
    const isAllowedExt = ["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(ext || "");

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      if (typeof addToast === "function") {
        addToast("Format Tidak Valid", "Hanya dokumen PDF, Word, Excel, atau Text yang diperbolehkan.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setDokumenUrl(reader.result);
        setDokumenName(file.name);
        if (typeof addToast === "function") {
          addToast("Dokumen Siap", "Dokumen berhasil diproses untuk diunggah.", "success");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDokumenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processDokumenFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!judul.trim() || !konten.trim() || !tanggal) {
      if (typeof addToast === "function") {
        addToast("Gagal", "Harap lengkapi semua kolom wajib (Judul, Konten, Tanggal).", "warning");
      }
      return;
    }

    setSubmitting(true);
    const mediaObj = {
      foto: fotoUrl || "",
      video: videoUrl || "",
      video_name: videoName || "",
      dokumen: dokumenUrl || "",
      dokumen_name: dokumenName || ""
    };
    const hasMedia = fotoUrl || videoUrl || dokumenUrl;
    const payload = {
      judul: judul.trim(),
      konten: konten.trim(),
      tanggal,
      foto_url: hasMedia ? JSON.stringify(mediaObj) : null
    };

    // Demo Mode CRUD isolation
    if (isDemo) {
      setTimeout(() => {
        if (isEditMode) {
          const next = informasiList.map((item) =>
            item.id === selectedId ? { ...item, ...payload } : item
          );
          setInformasiList(next);
          localStorage.setItem("demo_informasi_list", JSON.stringify(next));
          addToast?.("Berhasil Diperbarui (Demo)", "Informasi demo berhasil diperbarui.", "success");
        } else {
          const newId = Date.now();
          const newItem: Informasi = {
            id: newId,
            ...payload,
            created_at: new Date().toISOString()
          };
          const next = [newItem, ...informasiList];
          setInformasiList(next);
          localStorage.setItem("demo_informasi_list", JSON.stringify(next));
          addToast?.("Berhasil Ditambahkan (Demo)", "Informasi baru berhasil dibuat di sesi demo.", "success");
        }
        setSubmitting(false);
        setIsOpenModal(false);
      }, 300);
      return;
    }

    try {
      const token = getAuthToken();
      const slugQuery = schoolSlug ? `?school_slug=${encodeURIComponent(schoolSlug)}&school_id=${encodeURIComponent(schoolSlug)}` : "";
      const url = isEditMode ? `${BACKEND_URL}/informasi/${selectedId}${slugQuery}` : `${BACKEND_URL}/informasi${slugQuery}`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await res.json();
      } catch (_jsonErr) {
        if (res.status === 413) {
          throw new Error("Ukuran berkas/lampiran melebihi batas upload server (maksimal 10MB). Harap kurangi ukuran media.");
        }
        throw new Error(`Server response error (${res.status})`);
      }

      if (data && data.success) {
        if (typeof addToast === "function") {
          addToast(
            isEditMode ? "Berhasil Diperbarui" : "Berhasil Ditambahkan",
            isEditMode ? "Informasi berhasil diperbarui di sistem." : "Informasi baru berhasil dipublikasikan.",
            "success"
          );
        }
        setIsOpenModal(false);
        fetchInformasi();
      } else {
        if (typeof addToast === "function") {
          addToast("Error", data?.message || "Gagal memproses data.", "danger");
        }
      }
    } catch (err) {
      console.error("API error:", err);
      if (typeof addToast === "function") {
        const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan informasi ke server.";
        addToast("Gagal Menyimpan", errorMsg, "danger");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleCloseDeleteModal = () => {
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setSubmitting(true);

    if (isDemo) {
      const next = informasiList.filter((item) => item.id !== deleteConfirmId);
      setInformasiList(next);
      localStorage.setItem("demo_informasi_list", JSON.stringify(next));
      addToast?.("Berhasil Dihapus (Demo)", "Informasi demo berhasil dihapus.", "success");
      setSubmitting(false);
      setDeleteConfirmId(null);
      return;
    }

    try {
      const token = getAuthToken();
      const slugQuery = schoolSlug ? `?school_slug=${encodeURIComponent(schoolSlug)}&school_id=${encodeURIComponent(schoolSlug)}` : "";
      const res = await fetch(`${BACKEND_URL}/informasi/${deleteConfirmId}${slugQuery}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        if (typeof addToast === "function") {
          addToast("Berhasil Dihapus", "Informasi telah dihapus dari sistem.", "success");
        }
        setDeleteConfirmId(null);
        fetchInformasi();
      } else {
        if (typeof addToast === "function") {
          addToast("Error", data.message || "Gagal menghapus data.", "danger");
        }
      }
    } catch (err) {
      console.error("API delete error:", err);
      if (typeof addToast === "function") {
        addToast("Error", "Gagal menghubungi server untuk menghapus.", "danger");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    informasiList,
    loading,
    submitting,
    isOpenModal,
    setIsOpenModal,
    isEditMode,
    judul,
    setJudul,
    konten,
    setKonten,
    tanggal,
    setTanggal,
    fotoUrl,
    setFotoUrl,
    videoUrl,
    setVideoUrl,
    videoName,
    setVideoName,
    dokumenUrl,
    setDokumenUrl,
    dokumenName,
    setDokumenName,
    dragActive,
    previewItem,
    setPreviewItem,
    loadingDetailId,
    deleteConfirmId,
    fetchInformasi,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleFileChange,
    handleVideoFileChange,
    handleDokumenFileChange,
    handleDrag,
    handleDrop,
    handleSubmit,
    handleOpenPreview,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    executeDelete: handleConfirmDelete,
    setDeleteConfirmId,
    processFile
  };
}
