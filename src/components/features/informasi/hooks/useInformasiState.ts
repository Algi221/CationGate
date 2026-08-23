"use client";

import { useState, useEffect, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { Informasi } from "../types";
import { parseMedia, formatInputDate } from "../utils/mediaHelper";

export function useInformasiState() {
  const { adminToken, addToast } = usePPDB();
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
    try {
      setLoadingDetailId(id);
      const res = await fetch(`${BACKEND_URL}/informasi/${id}`);
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
      try {
        const res = await fetch(`${BACKEND_URL}/informasi`);
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
        const fallbackData: Informasi[] = [
          {
            id: 101,
            judul: "Pendaftaran Peserta Didik Baru (PPDB) SMK Taruna Bhakti 2026/2027 Resmi Dibuka!",
            konten:
              "SMK Taruna Bhakti Depok resmi membuka pendaftaran bagi calon peserta didik baru untuk tahun ajaran 2026/2027. Tersedia 6 Program Keahlian unggulan yaitu Rekayasa Perangkat Lunak, Teknik Jaringan Komputer, Desain Komunikasi Visual, Broadcasting & Perfilman, Teknik Elektronika, dan Animasi. Segera lakukan registrasi online dan unggah berkas Anda sebelum kuota penuh!",
            tanggal: "2026-05-15",
            foto_url: "",
            created_at: new Date().toISOString()
          },
          {
            id: 102,
            judul: "Sosialisasi Jurusan Baru: Teknik Elektronika (TE) dengan Fokus Robotika Industri",
            konten:
              "Menjawab tantangan revolusi industri 4.0, SMK Taruna Bhakti menghadirkan inovasi di jurusan Teknik Elektronika. Kurikulum diperkuat dengan pemelajaran mikrokontroler, IoT, PLC, dan Robotika Industri modern. Lulusan TE siap diserap oleh industri manufaktur dan teknologi terkemuka.",
            tanggal: "2026-05-20",
            foto_url: "",
            created_at: new Date().toISOString()
          }
        ];
        setInformasiList(fallbackData);
      } finally {
        setLoading(false);
      }
    },
    [addToast]
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
        addToast("Format Tidak Valid", "Hanya berkas video yang diperbolehkan.", "warning");
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

    try {
      const url = isEditMode ? `${BACKEND_URL}/informasi/${selectedId}` : `${BACKEND_URL}/informasi`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
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
          addToast("Error", data.message || "Gagal memproses data.", "danger");
        }
      }
    } catch (err) {
      console.error("API error, executing offline fallback operations:", err);
      if (isEditMode) {
        setInformasiList((prev) => prev.map((item) => (item.id === selectedId ? { ...item, ...payload } : item)));
        if (typeof addToast === "function") {
          addToast("Diperbarui (Offline)", "Perubahan disimpan secara lokal di memori.", "success");
        }
      } else {
        const mockNew: Informasi = {
          id: Date.now(),
          ...payload,
          created_at: new Date().toISOString()
        };
        setInformasiList((prev) => [mockNew, ...prev]);
        if (typeof addToast === "function") {
          addToast("Ditambahkan (Offline)", "Informasi ditambahkan secara lokal di memori.", "success");
        }
      }
      setIsOpenModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);

    try {
      const res = await fetch(`${BACKEND_URL}/informasi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        if (typeof addToast === "function") {
          addToast("Berhasil Dihapus", "Pengumuman informasi berhasil dihapus dari sistem.", "success");
        }
        fetchInformasi();
      } else {
        if (typeof addToast === "function") {
          addToast("Gagal Hapus", data.message || "Gagal menghapus informasi dari database.", "danger");
        }
      }
    } catch (err) {
      console.error("API error, executing offline fallback deletion:", err);
      setInformasiList((prev) => prev.filter((item) => item.id !== id));
      if (typeof addToast === "function") {
        addToast("Dihapus (Offline)", "Informasi dihapus dari memori lokal.", "success");
      }
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
    setDeleteConfirmId,
    fetchInformasi,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenPreview,
    handleDrag,
    handleDrop,
    handleFileChange,
    handleVideoFileChange,
    handleDokumenFileChange,
    handleSubmit,
    executeDelete
  };
}
