"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { ClassItem, GradeLevel } from "../types";

interface UsePembagianKelasCrudProps {
  classes: ClassItem[];
  saveClassesToStorage: (updatedClasses: ClassItem[]) => Promise<void>;
  classEnrollments: Record<string, { total: number; L: number; P: number }>;
  selectedGrade: GradeLevel;
  selectedMajor: string;
  selectedClassDetail: ClassItem | null;
  updateActiveStudent: (
    id: number,
    data: { diterima_kelas: string | null; diterima_tanggal: string | null },
  ) => Promise<{ success: boolean; message?: string } | undefined>;
  showToast: (
    message: string,
    type?: "success" | "error" | "info",
  ) => void;
}

export function usePembagianKelasCrud({
  classes,
  saveClassesToStorage,
  classEnrollments,
  selectedGrade,
  selectedMajor,
  selectedClassDetail,
  updateActiveStudent,
  showToast,
}: UsePembagianKelasCrudProps) {
  const [newClassName, setNewClassName] = useState("");
  const [isAddingClass, setIsAddingClass] = useState(false);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast("Nama kelas tidak boleh kosong!", "error");
      return;
    }

    let prefix = "X";
    if (selectedGrade === 11) prefix = "XI";
    if (selectedGrade === 12) prefix = "XII";

    let cleanName = newClassName.trim().toUpperCase();
    if (!cleanName.startsWith(prefix + " ")) {
      cleanName = `${prefix} ${cleanName}`;
    }

    if (classes.some((c) => c.name === cleanName)) {
      showToast(`Kelas "${cleanName}" sudah terdaftar!`, "error");
      return;
    }

    const newClass: ClassItem = {
      id: `${selectedMajor}-${Date.now()}`,
      name: cleanName,
      majorCode: selectedMajor,
      maxCapacity: 100,
    };

    const updated = [...classes, newClass];
    saveClassesToStorage(updated);

    setNewClassName("");
    setIsAddingClass(false);
    showToast(`Kelas ${cleanName} berhasil dibuat!`);
  };

  const handleDeleteClass = async (id: string, name: string) => {
    const count = classEnrollments[name]?.total || 0;
    if (count > 0) {
      showToast(
        `Gagal menghapus: Masih ada ${count} siswa terdaftar di dalam kelas ${name}.`,
        "error",
      );
      return;
    }

    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin menghapus kelas ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      const updated = classes.filter((c) => c.id !== id);
      saveClassesToStorage(updated);
      showToast(`Kelas ${name} berhasil dihapus.`);
    }
  };

  const handleRemoveStudentFromClassDetail = async (
    studentId: number,
    studentNama: string,
  ) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Keluarkan ${studentNama} dari kelas ${selectedClassDetail?.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      const res = await updateActiveStudent(studentId, {
        diterima_kelas: null,
        diterima_tanggal: null,
      });

      if (res?.success) {
        showToast(`${studentNama} berhasil dikeluarkan dari kelas.`);
      } else {
        showToast("Gagal mengeluarkan siswa.", "error");
      }
    }
  };

  return {
    newClassName,
    setNewClassName,
    isAddingClass,
    setIsAddingClass,
    handleCreateClass,
    handleDeleteClass,
    handleRemoveStudentFromClassDetail,
  };
}
