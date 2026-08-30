"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { generateNipdMap } from "@/utils/nipd";
import Swal from "sweetalert2";
import { 
  Applicant, 
  ClassItem, 
  MajorConfigItem, 
  GradeLevel 
} from "../types";
import { 
  DEFAULT_MAJORS, 
  getClassGrade, 
  getMajorLogoUrl, 
  exportClassToExcel, 
  exportAllClassesToExcel 
} from "../utils/classDistribution";

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

export function usePembagianKelasState() {
  const { applicants, updateActiveStudent, fetchActiveStudents, fetchAdminApplicants } = usePPDB();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";

  const isDemo = schoolSlug === "demo" || (typeof window !== "undefined" && (window.location.pathname.startsWith("/demo") || window.location.host.startsWith("demo.")));

  const [dynamicMajorsList, setDynamicMajorsList] = useState<MajorConfigItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_majors_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (_) {}
      }
    }
    return isDemo ? DEFAULT_MAJORS : [];
  });
  const [selectedMajor, setSelectedMajor] = useState<string>(() => isDemo ? "RPL" : "");
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(10);
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"ALL" | "UNASSIGNED" | "ASSIGNED">("ALL");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "L" | "P">("ALL");

  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [isAddingClass, setIsAddingClass] = useState(false);

  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassItem | null>(null);
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [activeDropClass, setActiveDropClass] = useState<string | null>(null);

  useEffect(() => {
    if (typeof fetchActiveStudents === "function") {
      fetchActiveStudents();
    }
    if (typeof fetchAdminApplicants === "function") {
      fetchAdminApplicants();
    }
  }, [fetchActiveStudents, fetchAdminApplicants]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem("ppdb_admin_token");
        const url = schoolSlug
          ? `/api/config?school_slug=${schoolSlug}&_t=${Date.now()}`
          : `/api/config?_t=${Date.now()}`;
        const res = await fetch(url, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.ppdb_school_period) {
            setSchoolPeriod(json.data.ppdb_school_period);
          }
          const parsedMajors = parseConfigArray<MajorConfigItem>(json.data.ppdb_majors_config);
          if (parsedMajors && parsedMajors.length > 0) {
            setDynamicMajorsList(parsedMajors);
            try {
              localStorage.setItem("ppdb_majors_config", JSON.stringify(parsedMajors));
            } catch (_) {}
            setSelectedMajor(prev => {
              if (prev && parsedMajors.some(m => (m.code || m.name || m.title) === prev)) return prev;
              return parsedMajors[0].code || parsedMajors[0].title || parsedMajors[0].name || "";
            });
          }
        }
      } catch (e) {
        console.error("Gagal mengambil konfigurasi sekolah:", e);
      }
    };
    fetchConfig();
  }, [schoolSlug, isDemo]);

  const activeMajors = useMemo(() => {
    let list: MajorConfigItem[] = [];
    if (dynamicMajorsList && dynamicMajorsList.length > 0) {
      list = dynamicMajorsList;
    } else if (isDemo) {
      list = DEFAULT_MAJORS;
    } else {
      // Fallback: derive from applicants if config hasn't loaded
      const unique = new Map<string, string>();
      applicants.forEach((a: Applicant) => {
        const m = (a.jurusan || a.jurusan_1 || a.jurusan1 || "").trim();
        if (m) {
          const match = m.match(/\(([A-Z0-9_-]+)\)/i);
          const code = (match ? match[1] : m.split(" ")[0] || m).toUpperCase();
          if (!unique.has(code)) {
            unique.set(code, m);
          }
        }
      });
      if (unique.size > 0) {
        list = Array.from(unique.entries()).map(([code, name]) => ({
          code,
          name,
          title: name
        }));
      }
    }

    return list.map((m) => {
      let logo = m.logo || getMajorLogoUrl(m.code);
      if (logo && logo.startsWith("/jurusan/")) {
        logo = `/assets${logo}`;
      }
      return {
        ...m,
        logo
      };
    });
  }, [dynamicMajorsList, isDemo, applicants]);

  useEffect(() => {
    if (activeMajors.length > 0) {
      if (!selectedMajor || !activeMajors.some(m => (m.code || m.title || m.name) === selectedMajor)) {
        setSelectedMajor(activeMajors[0].code || activeMajors[0].title || activeMajors[0].name || "");
      }
    }
  }, [activeMajors, selectedMajor]);

  const generateDefaultClasses = useCallback((): ClassItem[] => {
    const defaultList: ClassItem[] = [];
    const sourceMajors = activeMajors.length > 0 ? activeMajors : DEFAULT_MAJORS;
    sourceMajors.forEach((m) => {
      defaultList.push({ id: `X-${m.code}-1`, name: `X ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
      defaultList.push({ id: `X-${m.code}-2`, name: `X ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });

      defaultList.push({ id: `XI-${m.code}-1`, name: `XI ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
      defaultList.push({ id: `XI-${m.code}-2`, name: `XI ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });

      defaultList.push({ id: `XII-${m.code}-1`, name: `XII ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
      defaultList.push({ id: `XII-${m.code}-2`, name: `XII ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });
    });
    return defaultList;
  }, [activeMajors]);

  useEffect(() => {
    const fetchClassesConfig = async () => {
      try {
        const token = localStorage.getItem("ppdb_admin_token");
        const res = await fetch(`/api/config?_t=${Date.now()}`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_classes_config) {
          setClasses(json.data.ppdb_classes_config);
          localStorage.setItem("ppdb_classes_config", JSON.stringify(json.data.ppdb_classes_config));
          return;
        }
      } catch (e) {
        console.error("Gagal mengambil konfigurasi kelas dari API:", e);
      }

      const savedClasses = localStorage.getItem("ppdb_classes_config");
      if (savedClasses) {
        try {
          setClasses(JSON.parse(savedClasses));
        } catch (_e) {
          setClasses(generateDefaultClasses());
        }
      } else {
        const defaults = generateDefaultClasses();
        setClasses(defaults);
        localStorage.setItem("ppdb_classes_config", JSON.stringify(defaults));
      }
    };
    fetchClassesConfig();
  }, [generateDefaultClasses]);

  const getStudentGrade = useCallback(
    (student: Applicant): number => {
      const baseClass = student.diterima_kelas || student.diterimaKelas;
      if (baseClass) {
        const classGrade = getClassGrade(baseClass);
        if (classGrade) return classGrade;
      }

      const studentPeriod = student.periode || "2026-2027";
      const currentPeriod = schoolPeriod || "2026-2027";

      try {
        const studentStart = parseInt(studentPeriod.split("-")[0]);
        const currentStart = parseInt(currentPeriod.split("-")[0]);
        if (isNaN(studentStart) || isNaN(currentStart)) return 10;

        const diff = currentStart - studentStart;
        if (diff === 0) return 10;
        if (diff === 1) return 11;
        if (diff === 2) return 12;
        if (diff >= 3) return 99;
        return 10;
      } catch (_e) {
        return 10;
      }
    },
    [schoolPeriod]
  );

  const getStudentCurrentClass = useCallback((student: Applicant): string | null => {
    const cls = student.diterima_kelas || student.diterimaKelas;
    if (!cls) return null;
    const clean = String(cls).trim();
    if (
      clean === "X (Sepuluh)" ||
      clean === "XI (Sebelas)" ||
      clean === "XII (Dua Belas)" ||
      clean === "X" ||
      clean === "XI" ||
      clean === "XII" ||
      clean === "-" ||
      clean.toLowerCase() === "belum ada kelas" ||
      clean.toLowerCase() === "belum diatur"
    ) {
      return null;
    }
    return clean;
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const saveClassesToStorage = async (updatedClasses: ClassItem[]) => {
    setClasses(updatedClasses);
    localStorage.setItem("ppdb_classes_config", JSON.stringify(updatedClasses));

    const token = localStorage.getItem("ppdb_admin_token");
    if (token) {
      try {
        await fetch("/api/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            key: "ppdb_classes_config",
            value: updatedClasses
          })
        });
      } catch (e) {
        console.error("Gagal menyimpan konfigurasi kelas ke backend:", e);
      }
    }
  };

  const approvedApplicantsOfMajor = useMemo(() => {
    return applicants.filter((a: Applicant) => {
      const statusUpper = (a.status || "").toUpperCase();
      const isApproved = statusUpper === "APPROVED" || statusUpper === "TERVERIFIKASI";
      if (!isApproved) return false;

      const maj1 = (a.jurusan || a.jurusan_1 || a.jurusan1 || "").toUpperCase().trim();
      const selCode = (selectedMajor || "").toUpperCase().trim();

      const foundMajor = dynamicMajorsList.find(
        (m) => (m.code || "").toUpperCase() === selCode || (m.name || m.title || "").toUpperCase() === selCode
      );
      const selName = (foundMajor?.name || foundMajor?.title || selectedMajor || "").toUpperCase().trim();

      if (!selCode) return true;

      if (selCode === "RPL") {
        return (
          maj1 === "RPL" ||
          maj1 === "PPLG" ||
          maj1.includes("REKAYASA PERANGKAT LUNAK") ||
          maj1.includes("PENGEMBANGAN PERANGKAT LUNAK") ||
          maj1.includes("RPL") ||
          maj1.includes("PPLG")
        );
      }
      if (selCode === "TJKT") {
        return (
          maj1 === "TJKT" ||
          maj1 === "TKJ" ||
          maj1.includes("JARINGAN") ||
          maj1.includes("TELEKOMUNIKASI") ||
          maj1.includes("TJKT") ||
          maj1.includes("TKJ")
        );
      }
      if (selCode === "DKV") {
        return maj1 === "DKV" || maj1.includes("DESAIN KOMUNIKASI VISUAL") || maj1.includes("DKV");
      }
      if (selCode === "BC") {
        return maj1 === "BC" || maj1.includes("BROADCASTING") || maj1.includes("PERFILMAN") || maj1.includes("BC");
      }
      if (selCode === "ANM") {
        return maj1 === "ANM" || maj1.includes("ANIMASI") || maj1.includes("ANM");
      }
      if (selCode === "TE") {
        return (
          maj1 === "TE" ||
          maj1 === "TEI" ||
          maj1 === "TEKNIK ELEKTRONIKA" ||
          maj1.includes("ELEKTRONIKA") ||
          maj1.includes("TEI") ||
          maj1.includes("TE")
        );
      }

      // Dynamic / custom school majors (e.g. DSA, TKRO, TBSM, AKL, OTKP, etc.)
      return (
        maj1 === selCode ||
        maj1 === selName ||
        maj1.includes(selCode) ||
        (selName && maj1.includes(selName)) ||
        selCode.includes(maj1) ||
        (selName && selName.includes(maj1))
      );
    });
  }, [applicants, selectedMajor, dynamicMajorsList]);

  const filteredStudents = useMemo(() => {
    return approvedApplicantsOfMajor.filter((a: Applicant) => {
      const grade = getStudentGrade(a);
      if (grade !== selectedGrade) return false;

      const nameMatch = (a.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nisnMatch = (a.nisn || "").includes(searchTerm);
      const searchMatch = nameMatch || nisnMatch;

      const currentClass = getStudentCurrentClass(a);

      if (genderFilter !== "ALL") {
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (genderFilter === "L" && !jk.startsWith("l")) return false;
        if (genderFilter === "P" && !jk.startsWith("p")) return false;
      }

      if (assignmentFilter === "UNASSIGNED") {
        return searchMatch && !currentClass;
      }
      if (assignmentFilter === "ASSIGNED") {
        return searchMatch && !!currentClass;
      }
      return searchMatch;
    });
  }, [approvedApplicantsOfMajor, searchTerm, assignmentFilter, genderFilter, selectedGrade, getStudentGrade, getStudentCurrentClass]);

  const classesOfSelectedMajor = useMemo(() => {
    return classes.filter((c) => {
      const matchMajor = (c.majorCode || "").toUpperCase() === (selectedMajor || "").toUpperCase();
      const matchGrade = getClassGrade(c.name) === selectedGrade;
      return matchMajor && matchGrade;
    });
  }, [classes, selectedMajor, selectedGrade]);

  const classEnrollments = useMemo(() => {
    const enrollmentCounts: Record<string, { total: number; L: number; P: number }> = {};

    classesOfSelectedMajor.forEach((c) => {
      enrollmentCounts[c.name] = { total: 0, L: 0, P: 0 };
    });

    applicants.forEach((a: Applicant) => {
      if (a.status === "Rejected") return;
      const cls = getStudentCurrentClass(a);
      if (cls && enrollmentCounts[cls] !== undefined) {
        enrollmentCounts[cls].total++;
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (jk.startsWith("l")) enrollmentCounts[cls].L++;
        else if (jk.startsWith("p")) enrollmentCounts[cls].P++;
      }
    });

    return enrollmentCounts;
  }, [applicants, classesOfSelectedMajor, getStudentCurrentClass]);

  const nipdMap = useMemo(() => generateNipdMap(applicants), [applicants]);

  const enrolledStudentsInDetail = useMemo(() => {
    if (!selectedClassDetail) return [];
    const filtered = applicants.filter((a: Applicant) => {
      if (a.status === "Rejected") return false;
      const cls = getStudentCurrentClass(a);
      const isClassMatch = cls === selectedClassDetail.name;
      if (!isClassMatch) return false;

      const matchesSearch =
        (a.nama || "").toLowerCase().includes(classSearchTerm.toLowerCase()) ||
        (a.nisn || "").includes(classSearchTerm);
      return matchesSearch;
    });

    return filtered.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
  }, [applicants, selectedClassDetail, classSearchTerm, getStudentCurrentClass]);

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssignSelectedToClass = async (className: string) => {
    if (selectedStudentIds.length === 0) return;

    const total = selectedStudentIds.length;
    let successCount = 0;

    showToast(`Memindahkan ${total} siswa ke kelas ${className || "Belum Ditentukan"}...`, "info");
    setIsLoading(true);

    try {
      for (let i = 0; i < total; i++) {
        const id = selectedStudentIds[i];
        const payload = {
          diterima_kelas: className || null,
          diterima_tanggal: className ? new Date().toISOString().split("T")[0] : null
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
      showToast(`Sukses memindahkan ${successCount} siswa ke kelas ${className || "Belum Ditentukan"}!`, "success");
    } else if (successCount > 0) {
      showToast(`Sebagian berhasil: memindahkan ${successCount} dari ${total} siswa ke kelas ${className || "Belum Ditentukan"}.`, "info");
    } else {
      showToast(`Gagal memindahkan siswa. Pastikan Anda tidak dalam mode demo atau offline.`, "error");
    }
  };

  const handleDragStart = (e: React.DragEvent, studentId: number) => {
    const dragIds = selectedStudentIds.includes(studentId) ? selectedStudentIds : [studentId];
    e.dataTransfer.setData("application/json", JSON.stringify(dragIds));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, className: string) => {
    e.preventDefault();
    setActiveDropClass(className);
  };

  const handleDragLeave = () => {
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
        showToast(`Memindahkan ${ids.length} siswa ke kelas ${targetClassName}...`, "info");
        let count = 0;
        for (const id of ids) {
          const res = await updateActiveStudent(id, {
            diterima_kelas: targetClassName,
            diterima_tanggal: new Date().toISOString().split("T")[0]
          });
          if (res?.success) count++;
        }
        setIsLoading(false);
        showToast(`Berhasil memindahkan ${count} siswa ke kelas ${targetClassName}!`, "success");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Drop error:", err);
    }
  };

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
      maxCapacity: 100
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
      showToast(`Gagal menghapus: Masih ada ${count} siswa terdaftar di dalam kelas ${name}.`, "error");
      return;
    }

    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin menghapus kelas ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal"
    });
    if (result.isConfirmed) {
      const updated = classes.filter((c) => c.id !== id);
      saveClassesToStorage(updated);
      showToast(`Kelas ${name} berhasil dihapus.`);
    }
  };

  const handleRemoveStudentFromClassDetail = async (studentId: number, studentNama: string) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Keluarkan ${studentNama} dari kelas ${selectedClassDetail?.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal"
    });
    if (result.isConfirmed) {
      const res = await updateActiveStudent(studentId, {
        diterima_kelas: null,
        diterima_tanggal: null
      });

      if (res?.success) {
        showToast(`${studentNama} berhasil dikeluarkan dari kelas.`);
      } else {
        showToast("Gagal mengeluarkan siswa.", "error");
      }
    }
  };

  const handleExportClassCSV = async (className: string) => {
    const classStudents = applicants
      .filter((a: Applicant) => {
        if (a.status === "Rejected") return false;
        const cls = getStudentCurrentClass(a);
        return cls === className;
      })
      .sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    const success = await exportClassToExcel(className, classStudents, nipdMap);
    if (!success) {
      showToast("Kelas kosong, tidak ada data untuk diekspor.", "error");
    }
  };

  const handleExportAllClasses = async () => {
    const exportedCount = await exportAllClassesToExcel(
      classesOfSelectedMajor,
      applicants,
      activeMajors,
      selectedMajor,
      schoolPeriod,
      nipdMap
    );
    if (!exportedCount) {
      showToast("Tidak ada kelas atau data siswa untuk diekspor.", "error");
    } else {
      showToast(`Berhasil mengekspor ${exportedCount} siswa ke Excel!`);
    }
  };

  const filledClassesCount = useMemo(() => {
    return Object.values(classEnrollments).filter((s) => s.total > 0).length;
  }, [classEnrollments]);

  const handleAssignSingleStudent = async (studentId: number, className: string) => {
    setIsLoading(true);
    showToast(`Memindahkan siswa ke kelas ${className || "Belum Ditentukan"}...`, "info");
    try {
      const payload = {
        diterima_kelas: className || null,
        diterima_tanggal: className ? new Date().toISOString().split("T")[0] : null
      };
      const result = await updateActiveStudent(studentId, payload);
      if (result?.success) {
        showToast(`Siswa berhasil dipindahkan ke kelas ${className || "Belum Ditentukan"}!`, "success");
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

  const handleExportAllMajors = async () => {
    const classesInGrade = classes.filter((c) => getClassGrade(c.name) === selectedGrade);
    const exportedCount = await exportAllClassesToExcel(
      classesInGrade,
      applicants,
      activeMajors,
      `SEMUA_JURUSAN_KELAS_${selectedGrade}`,
      schoolPeriod,
      nipdMap
    );
    if (!exportedCount) {
      showToast("Tidak ada kelas atau data siswa untuk diekspor.", "error");
    } else {
      showToast(`Berhasil mengekspor seluruh kelas tingkat ${selectedGrade} ke Excel!`);
    }
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [selectedMajor, selectedGrade, searchTerm, assignmentFilter, genderFilter]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  }, [filteredStudents.length, pageSize]);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page, pageSize]);

  return {
    selectedMajor,
    setSelectedMajor,
    selectedGrade,
    setSelectedGrade,
    activeMajors,
    classesOfSelectedMajor,
    filteredStudents,
    paginatedStudents,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    classEnrollments,
    filledClassesCount,
    selectedStudentIds,
    searchTerm,
    setSearchTerm,
    assignmentFilter,
    setAssignmentFilter,
    genderFilter,
    setGenderFilter,
    isLoading,
    toast,
    isAddingClass,
    setIsAddingClass,
    newClassName,
    setNewClassName,
    selectedClassDetail,
    setSelectedClassDetail,
    enrolledStudentsInDetail,
    classSearchTerm,
    setClassSearchTerm,
    activeDropClass,
    nipdMap,
    handleSelectAll,
    handleSelectStudent,
    handleAssignSelectedToClass,
    handleAssignSingleStudent,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCreateClass,
    handleDeleteClass,
    handleRemoveStudentFromClassDetail,
    handleExportClassCSV,
    handleExportAllClasses,
    handleExportAllMajors
  };
}
