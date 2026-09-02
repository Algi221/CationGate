"use client";

import { useState } from "react";
import { uploadFileDirect, base64ToFile } from "@/utils/storage";
import { compressImage } from "@/utils/mediaCompressor";
import { MajorItem } from "../types";

interface UseKelolaUIMediaProps {
  setSchoolLogo: React.Dispatch<React.SetStateAction<string>>;
  setHeroBgImage: React.Dispatch<React.SetStateAction<string>>;
  editingMajor: MajorItem | null;
  setEditingMajor: React.Dispatch<React.SetStateAction<MajorItem | null>>;
  showToastMsg: (message: string, type?: "success" | "error" | "info") => void;
}

export function useKelolaUIMedia({
  setSchoolLogo,
  setHeroBgImage,
  editingMajor,
  setEditingMajor,
  showToastMsg,
}: UseKelolaUIMediaProps) {
  const [dragActiveStates, setDragActiveStates] = useState<
    Record<string, boolean>
  >({});

  const handleDragState = (
    e: React.DragEvent,
    elementId: string,
    active: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates((prev) => ({ ...prev, [elementId]: active }));
  };

  const handleSchoolLogoChange = async (file: File) => {
    try {
      showToastMsg("Mengompresi logo...");
      const result = await compressImage(file, 400, 400, 0.85);

      showToastMsg("Mengunggah logo ke cloud...", "info");
      const compressedFile = base64ToFile(result.base64, file.name);
      const publicUrl = await uploadFileDirect(compressedFile, "school_logo");

      setSchoolLogo(publicUrl);
      showToastMsg(
        `✨ Logo berhasil diunggah! (Ukuran berkurang ${result.reductionPercentage}%)`,
        "success",
      );
    } catch (_e) {
      showToastMsg("Gagal memproses logo.", "error");
    }
  };

  const handleHeroBgImageChange = async (file: File) => {
    try {
      showToastMsg("Mengompresi foto background hero...");
      const result = await compressImage(file, 1920, 1080, 0.85);

      showToastMsg("Mengunggah background hero...", "info");
      const compressedFile = base64ToFile(result.base64, file.name);
      const publicUrl = await uploadFileDirect(compressedFile, "hero_bg");

      setHeroBgImage(publicUrl);
      showToastMsg(
        `✨ Background hero berhasil diunggah! (Ukuran berkurang ${result.reductionPercentage}%)`,
        "success",
      );
    } catch (_e) {
      showToastMsg("Gagal memproses foto background.", "error");
    }
  };

  const processMediaFile = async (
    file: File,
    type: "logo" | "banner" | "video" | `gallery-${number}`,
  ) => {
    const isVideo = type === "video";
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    if (isVideo) {
      const allowedVideoExts = ["mp4", "webm", "ogg", "mov", "mkv", "avi"];
      if (
        !file.type.startsWith("video/") &&
        !allowedVideoExts.includes(fileExt)
      ) {
        showToastMsg(
          "Hanya berkas video (MP4/WebM/MOV/MKV) yang diperbolehkan.",
          "error",
        );
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        showToastMsg("Ukuran file video maksimal adalah 15MB.", "error");
        return;
      }
    } else {
      if (file.type === "image/svg+xml" || fileExt === "svg") {
        showToastMsg(
          "Format SVG tidak diizinkan demi keamanan. Harap gunakan format PNG, JPEG, atau WebP.",
          "error",
        );
        return;
      }
      const allowedImgExts = ["jpg", "jpeg", "png", "webp"];
      if (!file.type.startsWith("image/") && !allowedImgExts.includes(fileExt)) {
        showToastMsg(
          "Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan.",
          "error",
        );
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        showToastMsg("Ukuran file gambar maksimal adalah 4MB.", "error");
        return;
      }
    }

    try {
      showToastMsg("Mengunggah media ke cloud...", "info");
      const publicUrl = await uploadFileDirect(file, `major_${type}`);

      if (editingMajor) {
        setEditingMajor((prev) => {
          if (!prev) return null;
          if (type === "logo") return { ...prev, logo: publicUrl };
          if (type === "banner") return { ...prev, banner: publicUrl };
          if (type === "video") return { ...prev, video: publicUrl };
          if (type.startsWith("gallery-")) {
            const slotIdx = parseInt(type.split("-")[1]);
            const updatedGallery = [...prev.gallery];
            if (!updatedGallery[slotIdx])
              updatedGallery[slotIdx] = { url: "", caption: "" };
            updatedGallery[slotIdx] = {
              ...updatedGallery[slotIdx],
              url: publicUrl,
            };
            return { ...prev, gallery: updatedGallery };
          }
          return prev;
        });
      }
      showToastMsg("Media berhasil diunggah!", "success");
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal mengunggah media.", "error");
    }
  };

  return {
    dragActiveStates,
    setDragActiveStates,
    handleDragState,
    handleSchoolLogoChange,
    handleHeroBgImageChange,
    processMediaFile,
  };
}
