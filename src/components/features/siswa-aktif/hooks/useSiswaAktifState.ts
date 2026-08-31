"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { generateNipdMap } from "@/utils/nipd";
import { exportActiveStudentsToExcel } from "../utils/excelHelper";
import { ActiveStudent } from "../types";

function parseConfigArray<T>(val: unknown): T[] | null {
  if (!val) return null;
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed as T[];
      if (typeof parsed === "string") {
        const doubleParsed = JSON.parse(parsed);
        if (Array.isArray(doubleParsed)) return doubleParsed as T[];
      }
    } catch (_e) {}
  }
  return null;
}

export function useSiswaAktifState() {
  const { 
    activeStudents, 
    addToast, 
    fetchActiveStudents, 
    updateActiveStudent, 
    isDemoMode 
  } = usePPDB();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState<boolean>(false);
  const [newPeriodValue, setNewPeriodValue] = useState<string>("");

  const [selectedApplicant, setSelectedApplicant] = useState<ActiveStudent | null>(null);
  const [editApplicant, setEditApplicant] = useState<ActiveStudent | null>(null);
  const [editForm, setEditForm] = useState<Partial<ActiveStudent>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [majorsList, setMajorsList] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_majors_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((m: { title?: string; name?: string; code?: string }) => m.title || m.name || m.code || "").filter(Boolean);
          }
        } catch (_) {}
      }
    }
    return isDemoMode ? [
      "Rekayasa Perangkat Lunak",
      "Teknik Jaringan Komputer & Telekomunikasi",
      "Desain Komunikasi Visual",
      "Broadcasting & Perfilman",
      "Teknik Elektronika",
      "Animasi",
    ] : [];
  });

  useEffect(() => {
    if (typeof fetchActiveStudents === "function") {
      fetchActiveStudents();
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
    fetch("/api/config", {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.ppdb_majors_config) {
          const parsed = parseConfigArray<{ title?: string; name?: string; code?: string }>(json.data.ppdb_majors_config);
          if (parsed && parsed.length > 0) {
            const list = parsed
              .map((m) => m.title || m.name || m.code || "")
              .filter(Boolean);
            setMajorsList(list);
            try {
              localStorage.setItem("ppdb_majors_config", JSON.stringify(parsed));
            } catch (_) {}
          }
        }
      })
      .catch(() => {});
  }, [fetchActiveStudents, isDemoMode]);

  const [customPeriods, setCustomPeriods] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_custom_periods");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_e) {
          console.error("Invalid JSON in ppdb_custom_periods:", saved);
        }
      }
    }
    return [];
  });

  const activeApplicants = useMemo(() => {
    return activeStudents;
  }, [activeStudents]);

  const filteredApplicants = useMemo(() => {
    return activeApplicants.filter((a: ActiveStudent) => {
      const nameMatch = (a.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nisnMatch = (a.nisn || "").toLowerCase().includes(searchTerm.toLowerCase());
      const schoolMatch = (a.sekolah_asal || a.sekolahAsal || "").toLowerCase().includes(searchTerm.toLowerCase());

      const searchMatch = nameMatch || nisnMatch || schoolMatch;
      if (!searchMatch) return false;

      if (majorFilter !== "ALL") {
        const maj = (a.jurusan || a.jurusan_1 || a.jurusan1 || "").toLowerCase();
        if (!maj.includes(majorFilter.toLowerCase())) return false;
      }

      if (classFilter !== "ALL") {
        const kls = a.diterima_kelas || a.diterimaKelas || "";
        if (kls !== classFilter) return false;
      }

      if (genderFilter !== "ALL") {
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (genderFilter === "L" && !jk.startsWith("l")) return false;
        if (genderFilter === "P" && !jk.startsWith("p")) return false;
      }

      return true;
    });
  }, [activeApplicants, searchTerm, majorFilter, classFilter, genderFilter]);

  const nipdMap = useMemo(() => generateNipdMap(activeApplicants), [activeApplicants]);

  const classStats = useMemo(() => {
    const statsMap: Record<string, { L: number; P: number; total: number }> = {};
    activeApplicants.forEach((a: ActiveStudent) => {
      const k = a.diterima_kelas || a.diterimaKelas;
      if (k) {
        if (!statsMap[k]) statsMap[k] = { L: 0, P: 0, total: 0 };
        statsMap[k].total += 1;
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (jk.startsWith("l")) statsMap[k].L += 1;
        else if (jk.startsWith("p")) statsMap[k].P += 1;
      }
    });
    return statsMap;
  }, [activeApplicants]);

  const uniqueClasses = useMemo(() => {
    return Object.keys(classStats).sort();
  }, [classStats]);

  const groupedByPeriod = useMemo(() => {
    const groups: Record<string, ActiveStudent[]> = {};

    customPeriods.forEach((p) => {
      groups[p] = [];
    });

    filteredApplicants.forEach((a: ActiveStudent) => {
      const period = a.periode || "2026-2027";
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(a);
    });

    Object.keys(groups).forEach((p) => {
      groups[p].sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
    });

    return groups;
  }, [customPeriods, filteredApplicants]);

  const sortedPeriods = useMemo(() => {
    return Object.keys(groupedByPeriod).sort((a, b) => b.localeCompare(a));
  }, [groupedByPeriod]);

  useEffect(() => {
    if (sortedPeriods.length > 0) {
      const timer = setTimeout(() => {
        setExpandedPeriods((prev) => {
          if (Object.keys(prev).length === 0) {
            const defaults: Record<string, boolean> = {};
            sortedPeriods.forEach((p, idx) => {
              defaults[p] = idx === 0;
            });
            return defaults;
          }
          return prev;
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [sortedPeriods]);

  const togglePeriod = (period: string) => {
    setExpandedPeriods((prev) => ({
      ...prev,
      [period]: !prev[period]
    }));
  };

  const getNextPeriod = useCallback(() => {
    const allPeriods = [...Object.keys(groupedByPeriod), ...customPeriods];
    if (allPeriods.length === 0) {
      const y = new Date().getFullYear();
      return `${y}-${y + 1}`;
    }

    const maxStartYear = Math.max(
      ...allPeriods.map((p) => parseInt(p.split("-")[0]) || 0)
    );
    return `${maxStartYear + 1}-${maxStartYear + 2}`;
  }, [groupedByPeriod, customPeriods]);

  const stats = useMemo(() => {
    const total = activeApplicants.length;
    const currentBatch = activeApplicants.filter((a) => (a.periode || "2026-2027") === "2026-2027").length;

    const majors: Record<string, number> = {};
    activeApplicants.forEach((a) => {
      const choice = a.jurusan || a.jurusan_1 || a.jurusan1 || "Lainnya";
      majors[choice] = (majors[choice] || 0) + 1;
    });

    let popular = "Belum Ada";
    let max = 0;
    Object.entries(majors).forEach(([name, count]) => {
      if (count > max) {
        max = count;
        popular = name;
      }
    });

    return { total, currentBatch, popular };
  }, [activeApplicants]);

  const handleViewDetail = async (student: ActiveStudent) => {
    setSelectedApplicant(student);
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/siswa-aktif/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedApplicant(data.data);
      }
    } catch (err) {
      console.warn("Failed to lazy load active student detail:", err);
    }
  };

  const handleBatalVerifikasi = async (id: number, nama: string) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin membatalkan verifikasi untuk "${nama}"? Siswa ini akan dikembalikan ke daftar pendaftar dengan status Pending.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/siswa-aktif/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast("Berhasil", `${nama} berhasil dikembalikan ke pendaftar.`, "success");
        if (typeof fetchActiveStudents === "function") fetchActiveStudents();
      } else {
        addToast("Gagal", data.message || "Terjadi kesalahan.", "error");
      }
    } catch (_err) {
      addToast("Error", "Gagal terhubung ke server", "error");
    }
  };

  const handleSaveEdit = async () => {
    if (!editApplicant) return;
    if (!editForm.nama?.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }
    if (editForm.nisn && editForm.nisn.length !== 10) {
      alert("NISN harus 10 digit!");
      return;
    }

    try {
      setIsSaving(true);
      const currentMajor = editApplicant.jurusan || editApplicant.jurusan_1 || editApplicant.jurusan1;
      const majorChanged = editForm.jurusan_1 !== currentMajor;

      const sanitizedForm: Record<string, unknown> = {};
      for (const key in editForm) {
        if (editForm[key] !== null) {
          sanitizedForm[key] = editForm[key];
        }
      }

      const updatedPayload: Record<string, unknown> = {
        ...sanitizedForm,
        jurusan1: sanitizedForm.jurusan_1 || sanitizedForm.jurusan
      };

      if (majorChanged) {
        updatedPayload.diterimaKelas = null;
        updatedPayload.diterima_kelas = null;
      }

      const res = await updateActiveStudent(editApplicant.id, updatedPayload);
      setIsSaving(false);
      if (res && res.success) {
        setEditApplicant(null);
        if (selectedApplicant?.id === editApplicant.id) {
          setSelectedApplicant(null);
        }
        if (typeof fetchActiveStudents === "function") {
          await fetchActiveStudents();
        }
      } else {
        alert(res?.message || "Gagal menyimpan perubahan.");
      }
    } catch (e: unknown) {
      setIsSaving(false);
      const errorMsg = e instanceof Error ? e.message : "Terjadi kesalahan";
      alert("Terjadi kesalahan: " + errorMsg);
    }
  };

  const handleAddPeriod = () => {
    if (!newPeriodValue.trim()) return;
    const val = newPeriodValue.trim();
    const added = [...customPeriods, val];
    setCustomPeriods(added);
    if (typeof window !== "undefined") {
      localStorage.setItem("ppdb_custom_periods", JSON.stringify(added));
    }
    setNewPeriodValue("");
    setIsAddPeriodModalOpen(false);
    addToast("Periode Ditambahkan", `Angkatan ${val} berhasil dibuat!`, "success");
  };

  const handleExportAll = () => {
    exportActiveStudentsToExcel(filteredApplicants, nipdMap);
  };

  const handleExportPeriod = (students: ActiveStudent[], _periodSuffix: string) => {
    exportActiveStudentsToExcel(students, nipdMap);
  };

  return {
    activeStudents,
    filteredApplicants,
    searchTerm,
    setSearchTerm,
    majorFilter,
    setMajorFilter,
    majorsList,
    classFilter,
    setClassFilter,
    genderFilter,
    setGenderFilter,
    expandedPeriods,
    togglePeriod,
    sortedPeriods,
    groupedByPeriod,
    stats,
    classStats,
    uniqueClasses,
    nipdMap,
    isImportModalOpen,
    setIsImportModalOpen,
    isAddPeriodModalOpen,
    setIsAddPeriodModalOpen,
    newPeriodValue,
    setNewPeriodValue,
    getNextPeriod,
    handleAddPeriod,
    selectedApplicant,
    setSelectedApplicant,
    handleViewDetail,
    handleBatalVerifikasi,
    editApplicant,
    setEditApplicant,
    editForm,
    setEditForm,
    isSaving,
    handleSaveEdit,
    handleExportAll,
    handleExportPeriod,
    fetchActiveStudents,
    addToast,
    isDemoMode
  };
}
