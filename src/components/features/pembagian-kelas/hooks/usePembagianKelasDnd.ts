"use client";

import { useState } from "react";

interface UsePembagianKelasDndProps {
  selectedStudentIds: number[];
  setSelectedStudentIds: React.Dispatch<React.SetStateAction<number[]>>;
  updateActiveStudent: (
    id: number,
    data: { diterima_kelas: string | null; diterima_tanggal: string | null },
  ) => Promise<{ success: boolean; message?: string } | undefined>;
  showToast: (
    message: string,
    type?: "success" | "error" | "info",
  ) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function usePembagianKelasDnd({
  selectedStudentIds,
  setSelectedStudentIds,
  updateActiveStudent,
  showToast,
  setIsLoading,
}: UsePembagianKelasDndProps) {
  const [activeDropClass, setActiveDropClass] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, studentId: number) => {
    const dragIds = selectedStudentIds.includes(studentId)
      ? selectedStudentIds
      : [studentId];
    e.dataTransfer.setData("application/json", JSON.stringify(dragIds));
    e.dataTransfer.effectAllowed = "move";

    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    }
  };

  const handleDragOver = (e: React.DragEvent, className: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDropClass !== className) {
      setActiveDropClass(className);
    }
  };

  const handleDragLeave = (e?: React.DragEvent) => {
    if (e && e.currentTarget && e.relatedTarget) {
      const currentTarget = e.currentTarget as HTMLElement;
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && currentTarget.contains(relatedTarget)) {
        return;
      }
    }
    setActiveDropClass(null);
  };

  const handleDrop = async (e: React.DragEvent, targetClassName: string) => {
    e.preventDefault();
    setActiveDropClass(null);
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      const ids: number[] = JSON.parse(data);
      if (Array.isArray(ids) && ids.length > 0) {
        setIsLoading(true);
        showToast(
          `Memindahkan ${ids.length} siswa ke kelas ${targetClassName}...`,
          "info",
        );
        let count = 0;
        for (const id of ids) {
          const res = await updateActiveStudent(id, {
            diterima_kelas: targetClassName,
            diterima_tanggal: new Date().toISOString().split("T")[0],
          });
          if (res?.success) count++;
        }
        setSelectedStudentIds([]);
        setIsLoading(false);
        if (count === ids.length) {
          showToast(
            `Sukses memindahkan ${count} siswa ke kelas ${targetClassName}!`,
            "success",
          );
        } else if (count > 0) {
          showToast(
            `Sebagian berhasil: memindahkan ${count} dari ${ids.length} siswa ke kelas ${targetClassName}.`,
            "info",
          );
        } else {
          showToast(
            `Gagal memindahkan siswa ke kelas ${targetClassName}.`,
            "error",
          );
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Drop error:", err);
    }
  };

  const handleAssignSelectedToClass = async (className: string) => {
    if (selectedStudentIds.length === 0) return;

    const total = selectedStudentIds.length;
    let successCount = 0;

    showToast(
      `Memindahkan ${total} siswa ke kelas ${className || "Belum Ditentukan"}...`,
      "info",
    );
    setIsLoading(true);

    try {
      for (let i = 0; i < total; i++) {
        const id = selectedStudentIds[i];
        const payload = {
          diterima_kelas: className || null,
          diterima_tanggal: className
            ? new Date().toISOString().split("T")[0]
            : null,
        };
        const result = await updateActiveStudent(id, payload);
        if (result?.success) {
          successCount++;
        }
      }
    } finally {
      setIsLoading(false);
    }

    setSelectedStudentIds([]);
    if (successCount === total && total > 0) {
      showToast(
        `Sukses memindahkan ${successCount} siswa ke kelas ${className || "Belum Ditentukan"}!`,
        "success",
      );
    } else if (successCount > 0) {
      showToast(
        `Sebagian berhasil: memindahkan ${successCount} dari ${total} siswa ke kelas ${className || "Belum Ditentukan"}.`,
        "info",
      );
    } else {
      showToast(
        `Gagal memindahkan siswa. Pastikan Anda tidak dalam mode demo atau offline.`,
        "error",
      );
    }
  };

  const handleAssignSingleStudent = async (
    studentId: number,
    className: string,
  ) => {
    setIsLoading(true);
    showToast(
      `Memindahkan siswa ke kelas ${className || "Belum Ditentukan"}...`,
      "info",
    );
    try {
      const payload = {
        diterima_kelas: className || null,
        diterima_tanggal: className
          ? new Date().toISOString().split("T")[0]
          : null,
      };
      const result = await updateActiveStudent(studentId, payload);
      if (result?.success) {
        showToast(
          `Siswa berhasil dipindahkan ke kelas ${className || "Belum Ditentukan"}!`,
          "success",
        );
      } else {
        showToast("Gagal memindahkan siswa.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Terjadi kesalahan saat memindahkan siswa.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeDropClass,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleAssignSelectedToClass,
    handleAssignSingleStudent,
  };
}
