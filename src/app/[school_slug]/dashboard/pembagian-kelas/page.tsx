"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePPDB } from "@/context/PPDBContext";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { generateNipdMap } from "@/utils/nipd";
import Swal from 'sweetalert2';
import { 
  Users, 
  Layers, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  Info, 
  GraduationCap, 
  CheckSquare, 
  MinusSquare, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw, 
  HelpCircle,
  FolderPlus,
  ArrowRight,
  ShieldAlert,
  Sliders,
  ChevronRight,
  Eye,
  Download,
  School
} from "lucide-react";

const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (e) {
    return `2627${10000 + id}`;
  }
};

interface Applicant {
  id: number;
  nama: string;
  nisn: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  jurusan_1?: string;
  jurusan1?: string;
  diterima_kelas?: string | null;
  diterimaKelas?: string | null;
  status?: string;
  periode?: string;
  [key: string]: any;
}

interface ClassItem {
  id: string;
  name: string;
  majorCode: string;
  maxCapacity: number;
}

export default function ClassDivisionManagement() {
  const { applicants, activeStudents, updateActiveStudent, fetchActiveStudents, fetchAdminApplicants } = usePPDB();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof fetchActiveStudents === "function") {
      fetchActiveStudents();
    }
    if (typeof fetchAdminApplicants === "function") {
      fetchAdminApplicants();
    }
  }, [fetchActiveStudents, fetchAdminApplicants]);

  const getMajorLogoUrl = (code: string) => {
    switch (code.toUpperCase()) {
      case "RPL":
        return "/assets/jurusan/pplg.png";
      case "TJKT":
        return "/assets/jurusan/tjkt.png";
      case "DKV":
        return "/assets/jurusan/dkv.png";
      case "BC":
        return "/assets/jurusan/bc.png";
      case "ANM":
        return "/assets/jurusan/animasi.png";
      case "TE":
        return "/assets/jurusan/te.png";
      default:
        return "/logo_smktb.png";
    }
  };

  const getMajorLogo = (code: string, size = "w-5 h-5") => {
    const url = getMajorLogoUrl(code);
    return (
      <img
        src={url}
        alt={`Logo ${code}`}
        className={`${size} rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-800/80 dark:border-white/10`}
      />
    );
  };

  const [selectedMajor, setSelectedMajor] = useState<string>("RPL");
  const [selectedGrade, setSelectedGrade] = useState<10 | 11 | 12>(10);
  const [schoolPeriod, setSchoolPeriod] = useState("2026-2027");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"ALL" | "UNASSIGNED" | "ASSIGNED">("ALL");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "L" | "P">("ALL");

  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [targetClass, setTargetClass] = useState<string>("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem("ppdb_admin_token");
        const res = await fetch(`/api/config?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (json.success && json.data && json.data.ppdb_school_period) {
          setSchoolPeriod(json.data.ppdb_school_period);
        }
      } catch (e) {
        console.error("Gagal mengambil periode akademik:", e);
      }
    };
    fetchConfig();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCapacity, setNewClassCapacity] = useState(40);
  const [isAddingClass, setIsAddingClass] = useState(false);

  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassItem | null>(null);
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [activeDropClass, setActiveDropClass] = useState<string | null>(null);

  const majors = [
    { code: "RPL", name: "Rekayasa Perangkat Lunak" },
    { code: "TJKT", name: "Teknik Jaringan Komputer & Telekomunikasi" },
    { code: "DKV", name: "Desain Komunikasi Visual" },
    { code: "BC", name: "Broadcasting & Perfilman" },
    { code: "ANM", name: "Animasi" },
    { code: "TE", name: "Teknik Elektronika" }
  ];

  const activeMajors = useMemo(() => {
    if (!mounted) return majors;
    const saved = localStorage.getItem("ppdb_majors_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any) => ({ code: m.code, name: m.title }));
        }
      } catch (e) {
        return majors;
      }
    }
    return majors;
  }, [mounted]);

  useEffect(() => {
    if (activeMajors.length > 0) {
      setSelectedMajor(activeMajors[0].code);
    }
  }, [activeMajors]);

  function generateDefaultClasses(): ClassItem[] {
    const defaultList: ClassItem[] = [];
    majors.forEach(m => {
      
      defaultList.push({ id: `X-${m.code}-1`, name: `X ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
      defaultList.push({ id: `X-${m.code}-2`, name: `X ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });
      
      defaultList.push({ id: `XI-${m.code}-1`, name: `XI ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
      defaultList.push({ id: `XI-${m.code}-2`, name: `XI ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });
      
      defaultList.push({ id: `XII-${m.code}-1`, name: `XII ${m.code} 1`, majorCode: m.code, maxCapacity: 100 });
      defaultList.push({ id: `XII-${m.code}-2`, name: `XII ${m.code} 2`, majorCode: m.code, maxCapacity: 100 });
    });
    return defaultList;
  }

  useEffect(() => {
    setMounted(true);
    const fetchClassesConfig = async () => {
      try {
        const token = localStorage.getItem("ppdb_admin_token");
        const res = await fetch(`/api/config?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
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
        } catch (e) {
          setClasses(generateDefaultClasses());
        }
      } else {
        const defaults = generateDefaultClasses();
        setClasses(defaults);
        localStorage.setItem("ppdb_classes_config", JSON.stringify(defaults));
      }
    };
    fetchClassesConfig();
  }, []);

  const getClassGrade = (className: string): number => {
    if (!className) return 10;
    const upper = className.toUpperCase().trim();
    
    // Check using regex for exact start pattern (Roman or number) with boundary or simple prefixes
    const match = upper.match(/^(XII|XI|X|12|11|10)\b/) || upper.match(/^(XII|XI|X|12|11|10)/);
    if (match) {
      const val = match[1];
      if (val === "XII" || val === "12") return 12;
      if (val === "XI" || val === "11") return 11;
      if (val === "X" || val === "10") return 10;
    }
    
    return 10;
  };

  const getStudentGrade = (student: Applicant): number => {
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
    } catch (e) {
      return 10;
    }
  };

  const getStudentCurrentClass = (student: Applicant): string | null => {
    return student.diterima_kelas || student.diterimaKelas || null;
  };



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
            "Authorization": `Bearer ${token}`
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
      if (a.status === 'Rejected') return false;
      const maj1 = (a.jurusan || a.jurusan_1 || a.jurusan1 || "").toUpperCase();
      
      const majorNameMap: Record<string, string> = {
        RPL: "REKAYASA PERANGKAT LUNAK",
        TJKT: "TEKNIK JARINGAN KOMPUTER & TELEKOMUNIKASI",
        DKV: "DESAIN KOMUNIKASI VISUAL",
        BC: "BROADCASTING & PERFILMAN",
        ANM: "ANIMASI",
        TE: "TEKNIK ELEKTRONIKA"
      };

      const selectedMajorName = majorNameMap[selectedMajor] || selectedMajor;
      
      let isMajorMatch = false;
      if (selectedMajor === "RPL") {
        isMajorMatch = 
          maj1 === "RPL" || 
          maj1 === "PPLG" || 
          maj1.includes("REKAYASA PERANGKAT LUNAK") || 
          maj1.includes("PENGEMBANGAN PERANGKAT LUNAK");
      } else if (selectedMajor === "TJKT") {
        isMajorMatch = 
          maj1 === "TJKT" || 
          maj1 === "TKJ" || 
          maj1.includes("JARINGAN") || 
          maj1.includes("TELEKOMUNIKASI") || 
          maj1.includes("TJKT");
      } else if (selectedMajor === "DKV") {
        isMajorMatch = 
          maj1 === "DKV" || 
          maj1.includes("DESAIN KOMUNIKASI VISUAL");
      } else if (selectedMajor === "BC") {
        isMajorMatch = 
          maj1 === "BC" || 
          maj1.includes("BROADCASTING") || 
          maj1.includes("PERFILMAN");
      } else if (selectedMajor === "ANM") {
        isMajorMatch = 
          maj1 === "ANM" || 
          maj1.includes("ANIMASI");
      } else if (selectedMajor === "TE") {
        isMajorMatch = 
          maj1 === "TE" || 
          maj1 === "TEI" || 
          maj1 === "TEKNIK ELEKTRONIKA" || 
          maj1.includes("ELEKTRONIKA") || 
          maj1.includes("TEI");
      } else {
        isMajorMatch = maj1 === selectedMajor || maj1 === selectedMajorName;
      }

      return isMajorMatch;
    });
  }, [applicants, selectedMajor]);

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
  }, [approvedApplicantsOfMajor, searchTerm, assignmentFilter, genderFilter, selectedGrade, schoolPeriod]);

  const classesOfSelectedMajor = useMemo(() => {
    return classes.filter(c => c.majorCode === selectedMajor && getClassGrade(c.name) === selectedGrade);
  }, [classes, selectedMajor, selectedGrade]);

  const classEnrollments = useMemo(() => {
    const enrollmentCounts: Record<string, { total: number, L: number, P: number }> = {};

    classesOfSelectedMajor.forEach(c => {
      enrollmentCounts[c.name] = { total: 0, L: 0, P: 0 };
    });

    applicants.forEach((a: Applicant) => {
      if (a.status === 'Rejected') return;
      const cls = getStudentCurrentClass(a);
      if (cls && enrollmentCounts[cls] !== undefined) {
        enrollmentCounts[cls].total++;
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (jk.startsWith("l")) enrollmentCounts[cls].L++;
        else if (jk.startsWith("p")) enrollmentCounts[cls].P++;
      }
    });

    return enrollmentCounts;
  }, [applicants, classesOfSelectedMajor, schoolPeriod]);

  const nipdMap = useMemo(() => generateNipdMap(applicants), [applicants]);

  const totalClassesFilled = useMemo(() => {
    return classesOfSelectedMajor.filter(c => (classEnrollments[c.name]?.total || 0) > 0).length;
  }, [classesOfSelectedMajor, classEnrollments]);

  const enrolledStudentsInDetail = useMemo(() => {
    if (!selectedClassDetail) return [];
    const filtered = applicants.filter((a: Applicant) => {
      if (a.status === 'Rejected') return false;
      const cls = getStudentCurrentClass(a);
      const isClassMatch = cls === selectedClassDetail.name;
      if (!isClassMatch) return false;

      const matchesSearch = (a.nama || "").toLowerCase().includes(classSearchTerm.toLowerCase()) || 
                            (a.nisn || "").includes(classSearchTerm);
      return matchesSearch;
    });

    return filtered.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
  }, [applicants, selectedClassDetail, classSearchTerm, schoolPeriod]);

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAssignSelectedToClass = async (className: string) => {
    if (selectedStudentIds.length === 0) return;
    
    const total = selectedStudentIds.length;
    let successCount = 0;

    showToast(`Memindahkan ${total} siswa ke kelas ${className || "Belum Ditentukan"}...`, "info");

    for (let i = 0; i < total; i++) {
      const id = selectedStudentIds[i];
      const student = applicants.find((a: Applicant) => a.id === id);
      
      const payload = {
        diterima_kelas: className || null,
        diterima_tanggal: className ? new Date().toISOString().split("T")[0] : null
      };

      const result = await updateActiveStudent(id, payload);
      
      if (result?.success) {
        successCount++;
      }
    }

    setSelectedStudentIds([]);
    // await fetchActiveStudents(); (Already handled in background by context)
    if (successCount === total && total > 0) {
      showToast(`Sukses memindahkan ${successCount} siswa ke kelas ${className || "Belum Ditentukan"}!`, "success");
    } else if (successCount > 0) {
      showToast(`Sebagian berhasil: memindahkan ${successCount} dari ${total} siswa ke kelas ${className || "Belum Ditentukan"}.`, "info");
    } else {
      showToast(`Gagal memindahkan siswa. Pastikan Anda tidak dalam mode demo atau offline.`, "error");
    }
  };

  const handleDragStart = (e: React.DragEvent, studentId: number) => {
    
    const dragIds = selectedStudentIds.includes(studentId)
      ? selectedStudentIds
      : [studentId];
    e.dataTransfer.setData("application/json", JSON.stringify(dragIds));
    e.dataTransfer.effectAllowed = "move";

    const dragGhost = document.createElement("div");
    dragGhost.style.padding = "10px 20px";
    dragGhost.style.background = "linear-gradient(135deg, #3b82f6, #4f46e5)";
    dragGhost.style.color = "white";
    dragGhost.style.fontSize = "11px";
    dragGhost.style.fontWeight = "900";
    dragGhost.style.textTransform = "uppercase";
    dragGhost.style.letterSpacing = "0.05em";
    dragGhost.style.borderRadius = "14px";
    dragGhost.style.position = "absolute";
    dragGhost.style.top = "-1000px";
    dragGhost.style.boxShadow = "0 8px 30px rgba(59, 130, 246, 0.4)";
    dragGhost.textContent = `📦 Memindahkan ${Number(dragIds.length)} Siswa TB`;
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 0, 0);
    setTimeout(() => {
      document.body.removeChild(dragGhost);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, classId: string) => {
    e.preventDefault();
    setActiveDropClass(classId);
  };

  const handleDragLeave = () => {
    setActiveDropClass(null);
  };

  const handleDrop = async (e: React.DragEvent, className: string) => {
    e.preventDefault();
    setActiveDropClass(null);
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const ids: number[] = JSON.parse(dataStr);
      if (!Array.isArray(ids) || ids.length === 0) return;

      const total = ids.length;
      let successCount = 0;

      // Hapus loading bar buat 1 siswa, tetep tampilkan kalau > 10 siswa sekalian (biar gak nge-spam)
      if (total > 5) showToast(`Memindahkan ${total} siswa ke kelas ${className}...`, "info");

      for (let i = 0; i < total; i++) {
        const id = ids[i];
        const payload = {
          diterima_kelas: className,
          diterima_tanggal: new Date().toISOString().split("T")[0]
        };
        const result = await updateActiveStudent(id, payload);
        if (result?.success) {
          successCount++;
        }
      }

      setSelectedStudentIds([]);
      // await fetchActiveStudents(); (Already handled in background by context)
      if (successCount === total && total > 0) {
        showToast(`Sukses memindahkan ${successCount} siswa ke kelas ${className}!`, "success");
      } else if (successCount > 0) {
        showToast(`Sebagian berhasil: memindahkan ${successCount} dari ${total} siswa ke kelas ${className}.`, "info");
      } else {
        showToast(`Gagal memindahkan siswa. Pastikan Anda tidak dalam mode demo atau offline.`, "error");
      }
    } catch (err) {
      console.error("Drop error:", err);
      setIsLoading(false);
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

    if (classes.some(c => c.name === cleanName)) {
      showToast(`Kelas "${cleanName}" sudah terdaftar!`, "error");
      return;
    }

    const newClass: ClassItem = {
      id: `${selectedMajor}-${Date.now()}`,
      name: cleanName,
      majorCode: selectedMajor,
      maxCapacity: Number(newClassCapacity) || 100
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
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus kelas ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (result.isConfirmed) {
      const updated = classes.filter(c => c.id !== id);
      saveClassesToStorage(updated);
      showToast(`Kelas ${name} berhasil dihapus.`);
    }
  };

  const handleRemoveStudentFromClassDetail = async (studentId: number, studentNama: string) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: `Keluarkan ${studentNama} dari kelas ${selectedClassDetail?.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (result.isConfirmed) {
      const result = await updateActiveStudent(studentId, {
        diterima_kelas: null,
        diterima_tanggal: null
      });

      if (result?.success) {
        showToast(`${studentNama} berhasil dikeluarkan dari kelas.`);
      } else {
        showToast("Gagal mengeluarkan siswa.", "error");
      }
    }
  };

  const handleExportClassCSV = async (className: string) => {
    const classStudents = applicants.filter((a: Applicant) => {
      if (a.status === 'Rejected') return false;
      const cls = getStudentCurrentClass(a);
      return cls === className;
    }).sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    if (classStudents.length === 0) {
      showToast("Kelas kosong, tidak ada data untuk diekspor.", "error");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Kelas_${className}`);

    worksheet.columns = [
      { header: 'No.', key: 'no', width: 10 },
      { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 25 },
      { header: 'NIPD', key: 'nipd', width: 20 },
      { header: 'Nama Siswa', key: 'nama', width: 35 },
      { header: 'L/P', key: 'jk', width: 10 },
      { header: 'NISN', key: 'nisn', width: 25 },
      { header: 'Asal Sekolah', key: 'sekolah', width: 35 },
      { header: 'No. WhatsApp', key: 'whatsapp', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Tanggal Diterima', key: 'tanggal', width: 25 }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.height = 35;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FF000000' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF9BC2E6' } 
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    classStudents.forEach((s: Applicant, index: number) => {
      worksheet.addRow({
        no: index + 1,
        no_pendaftaran: s.no_pendaftaran || "-",
        nipd: nipdMap.get(s.id) || "-",
        nama: s.nama || "",
        jk: (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p") ? "P" : "-",
        nisn: s.nisn || "",
        sekolah: s.sekolah_asal || s.sekolahAsal || "",
        whatsapp: s.whatsapp || "",
        email: s.email || "",
        tanggal: s.diterima_tanggal || s.diterimaTanggal || ""
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.height = 25;
      }
      row.eachCell((cell, colNumber) => {
        if (rowNumber > 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' }
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          if ([1, 3, 5, 7].includes(colNumber)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
          }
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Daftar_Kelas_${className.replace(/\s+/g, "_")}_${Date.now()}.xlsx`);
  };

  const handleExportAllClasses = async () => {
    const classesToExport = classesOfSelectedMajor;
    if (classesToExport.length === 0) {
      showToast("Tidak ada kelas untuk diekspor.", "error");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    let totalStudentsExported = 0;

    classesToExport.forEach((c) => {
      const classStudents = applicants.filter((a: Applicant) => {
        if (a.status === 'Rejected') return false;
        return getStudentCurrentClass(a) === c.name;
      }).sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

      const sheetName = c.name.replace(/\s+/g, "_").substring(0, 30);
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.mergeCells('A1:G1');
      worksheet.mergeCells('A2:G2');
      worksheet.mergeCells('A3:G3');
      worksheet.mergeCells('A4:G4');

      worksheet.getCell('A1').value = 'DAFTAR PESERTA DIDIK';
      worksheet.getCell('A2').value = `JURUSAN: ${activeMajors.find(m => m.code === selectedMajor)?.name.toUpperCase() || selectedMajor}`;
      worksheet.getCell('A3').value = `PERIODE AKADEMIK: ${schoolPeriod || '2026-2027'}`;
      worksheet.getCell('A4').value = `KELAS: ${c.name}`;

      ['A1', 'A2', 'A3', 'A4'].forEach((cellId, idx) => {
        const cell = worksheet.getCell(cellId);
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = {
          bold: true,
          name: 'Arial',
          size: idx === 0 ? 14 : 11,
          color: { argb: 'FF1F497D' } 
        };
      });

      worksheet.getRow(1).height = 25;
      worksheet.getRow(2).height = 20;
      worksheet.getRow(3).height = 20;
      worksheet.getRow(4).height = 20;
      worksheet.getRow(5).height = 10; 

      const headerRowIndex = 6;
      const headerRow = worksheet.getRow(headerRowIndex);
      headerRow.height = 28;

      const columns = [
        { header: 'No.', key: 'no', width: 8 },
        { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 20 },
        { header: 'NIPD', key: 'nipd', width: 20 },
        { header: 'Nama Lengkap', key: 'nama', width: 35 },
        { header: 'L/P', key: 'jk', width: 10 },
        { header: 'NISN', key: 'nisn', width: 18 },
        { header: 'Sekolah Asal', key: 'sekolah', width: 30 },
        { header: 'No. WhatsApp', key: 'whatsapp', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Tanggal Masuk Kelas', key: 'tanggal', width: 22 }
      ];

      worksheet.columns = columns;

      columns.forEach((col, colIdx) => {
        const cell = worksheet.getCell(headerRowIndex, colIdx + 1);
        cell.value = col.header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF366092' } 
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'medium' },
          bottom: { style: 'medium' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      classStudents.forEach((s: Applicant, index: number) => {
        worksheet.addRow({
          no: index + 1,
          no_pendaftaran: s.no_pendaftaran || "-",
          nipd: nipdMap.get(s.id) || "-",
          nama: s.nama || "",
          jk: (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p") ? "P" : "-",
          nisn: s.nisn || "",
          sekolah: s.sekolah_asal || s.sekolahAsal || "",
          whatsapp: s.whatsapp || "",
          email: s.email || "",
          tanggal: s.diterima_tanggal || s.diterimaTanggal || ""
        });
        totalStudentsExported++;
      });

      const totalRows = classStudents.length;
      for (let r = 7; r < 7 + totalRows; r++) {
        const row = worksheet.getRow(r);
        row.height = 22;
        row.eachCell((cell, colIdx) => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.font = { name: 'Arial', size: 10 };

          if (r % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF2F5F9' } 
            };
          }

          if ([1, 3, 5, 7].includes(colIdx)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
          }
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Daftar_Semua_Kelas_${selectedMajor}_${schoolPeriod || '2026-2027'}.xlsx`);
    showToast(`Berhasil mengekspor semua kelas jurusan ${selectedMajor} (${totalStudentsExported} siswa)!`, "success");
  };

  const handleExportAllMajors = async () => {
    const workbook = new ExcelJS.Workbook();
    let totalStudentsExported = 0;

    activeMajors.forEach((m) => {
      const majorClasses = classes.filter(c => c.majorCode === m.code);
      const sheetName = m.code.toUpperCase().substring(0, 30);
      const worksheet = workbook.addWorksheet(sheetName);

      // Sheet title
      worksheet.mergeCells('A1:G1');
      worksheet.getCell('A1').value = `LAPORAN DAFTAR KELAS - JURUSAN ${m.name.toUpperCase()}`;
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').font = {
        bold: true,
        name: 'Arial',
        size: 14,
        color: { argb: 'FF1F497D' }
      };
      worksheet.getRow(1).height = 30;

      let currentRowIndex = 3;

      majorClasses.forEach((c) => {
        const classStudents = applicants.filter((a: Applicant) => {
          if (a.status === 'Rejected') return false;
          return getStudentCurrentClass(a) === c.name;
        }).sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

        worksheet.mergeCells(`A${currentRowIndex}:G${currentRowIndex}`);
        const classHeaderCell = worksheet.getCell(`A${currentRowIndex}`);
        classHeaderCell.value = `KELAS: ${c.name.toUpperCase()} (Total: ${classStudents.length} Siswa)`;
        classHeaderCell.font = { bold: true, name: 'Arial', size: 11, color: { argb: 'FF366092' } };
        classHeaderCell.alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getRow(currentRowIndex).height = 24;

        currentRowIndex++;

        const columns = [
          { header: 'No.', key: 'no', width: 8 },
          { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 20 },
          { header: 'NIPD', key: 'nipd', width: 20 },
          { header: 'Nama Lengkap', key: 'nama', width: 35 },
          { header: 'L/P', key: 'jk', width: 10 },
          { header: 'NISN', key: 'nisn', width: 18 },
          { header: 'Sekolah Asal', key: 'sekolah', width: 30 },
          { header: 'No. WhatsApp', key: 'whatsapp', width: 20 },
          { header: 'Email', key: 'email', width: 30 }
        ];

        columns.forEach((col, colIdx) => {
          const cell = worksheet.getCell(currentRowIndex, colIdx + 1);
          cell.value = col.header;
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        worksheet.getRow(currentRowIndex).height = 22;

        currentRowIndex++;

        if (classStudents.length > 0) {
          classStudents.forEach((s: Applicant, index: number) => {
            const dataRow = worksheet.getRow(currentRowIndex);
            dataRow.height = 20;

            const values = {
              no: index + 1,
              no_pendaftaran: formatNoPendaftaran(s.periode, s.id),
              nipd: nipdMap.get(s.id) || "-",
              nama: s.nama || "",
              jk: (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p") ? "P" : "-",
              nisn: s.nisn || "",
              sekolah: s.sekolah_asal || s.sekolahAsal || "",
              whatsapp: s.whatsapp || "",
              email: s.email || ""
            };

            columns.forEach((col, colIdx) => {
              const cell = dataRow.getCell(colIdx + 1);
              cell.value = (values as any)[col.key];
              cell.font = { name: 'Arial', size: 9 };
              cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
              };

              if (index % 2 === 1) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFF2F5F9' }
                };
              }

              if ([1, 2, 4, 6].includes(colIdx + 1)) {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              } else {
                cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
              }
            });

            totalStudentsExported++;
            currentRowIndex++;
          });
        } else {
          worksheet.mergeCells(`A${currentRowIndex}:G${currentRowIndex}`);
          const emptyCell = worksheet.getCell(`A${currentRowIndex}`);
          emptyCell.value = "TIDAK ADA SISWA TERDAFTAR DI KELAS INI";
          emptyCell.font = { italic: true, name: 'Arial', size: 9, color: { argb: 'FF7F7F7F' } };
          emptyCell.alignment = { vertical: 'middle', horizontal: 'center' };
          emptyCell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          };
          worksheet.getRow(currentRowIndex).height = 20;
          currentRowIndex++;
        }

        currentRowIndex += 2;
      });

      worksheet.columns = [
        { width: 8 },
        { width: 22 },
        { width: 38 },
        { width: 20 },
        { width: 32 },
        { width: 22 },
        { width: 32 }
      ];
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Daftar_Semua_Jurusan_PPDB_${schoolPeriod || '2026-2027'}.xlsx`);
    showToast(`Berhasil mengekspor semua jurusan (${totalStudentsExported} siswa)!`, "success");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500 relative">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" 
            : toast.type === "error"
            ? "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900"
            : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900"
        }`}>
          {toast.type === "success" ? <Check size={16} /> : toast.type === "error" ? <ShieldAlert size={16} /> : <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full mx-4">
            <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Memproses Kelas...</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Mengupdate Data Calon Siswa ({loadingProgress}%)</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#1e293b] h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Header Info & Metrics Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Info Box */}
        <div className="xl:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-colors duration-300">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-indigo-900/40 shrink-0 shadow-sm">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Manajemen Pembagian Kelas</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-0.5">SMK Taruna Bhakti · PPDB Portal Kelas</p>
          </div>
        </div>

        {/* Metric 1: Total Classes */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-colors duration-300 text-left">
          <span className="text-[9px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-widest">Kelas Terbentuk (Kelas {selectedGrade} {selectedMajor})</span>
          <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">{classesOfSelectedMajor.length} <span className="text-xs text-slate-455 font-bold">Kelas</span></span>
        </div>

        {/* Metric 2: Filled Classes */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-colors duration-300 text-left">
          <span className="text-[9px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-widest">Jumlah Kelas Terisi Siswa</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalClassesFilled} <span className="text-xs text-slate-455 font-bold">Terisi</span></span>
        </div>

      </div>

      {/* Selected Major Selector Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800/40 pb-6">
        {activeMajors.map((m) => (
          <button
            key={m.code}
            onClick={() => {
              setSelectedMajor(m.code);
              setSelectedStudentIds([]);
              setAssignmentFilter("ALL");
            }}
            className={`flex flex-col items-center justify-center text-center p-6 rounded-3xl transition-all border duration-300 hover:scale-[1.03] group cursor-pointer ${
              selectedMajor === m.code
                ? "bg-gradient-to-tr from-indigo-600 to-blue-600 border-indigo-600/85 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]"
                : "bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:bg-slate-50 dark:bg-slate-950/15 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white shadow-sm"
            }`}
          >
            {getMajorLogo(m.code, "w-12 h-12 shadow-md")}
            <span className={`mt-3 text-[9px] font-black uppercase tracking-widest leading-normal ${
              selectedMajor === m.code ? "text-white" : "text-slate-700 dark:text-slate-400"
            }`}>
              {m.name}
            </span>
            <span className={`text-[8px] font-bold uppercase tracking-wider mt-1 ${
              selectedMajor === m.code ? "text-blue-100" : "text-slate-400"
            }`}>
              ({m.code})
            </span>
          </button>
        ))}
      </div>

      {/* Pilihan Tingkat Kelas (Grade Tabs) */}
      <div className="flex bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 p-1.5 rounded-2xl shadow-sm justify-start gap-2 max-w-lg transition-colors duration-300">
        {([10, 11, 12] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setSelectedGrade(g);
              setSelectedStudentIds([]);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedGrade === g
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50"
            }`}
          >
            Kelas {g} {g === 10 ? "(Baru Masuk)" : ""}
          </button>
        ))}
      </div>

      {/* Classes capacity indicators and list */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Daftar Kelas Aktif (Tingkat {selectedGrade} Jurusan {selectedMajor})</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllClasses}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-white/5 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 transition-all shadow-sm cursor-pointer"
            >
              <Download size={12} />
              <span>Ekspor Semua Kelas ({selectedMajor})</span>
            </button>
            <button
              onClick={handleExportAllMajors}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-white/5 text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 transition-all shadow-sm cursor-pointer"
            >
              <Download size={12} />
              <span>Ekspor Semua Jurusan</span>
            </button>
            <button
              onClick={() => setIsAddingClass(!isAddingClass)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            >
              {isAddingClass ? <X size={12} /> : <Plus size={12} />}
              <span>{isAddingClass ? "Tutup Form" : "Buat Kelas Baru"}</span>
            </button>
          </div>
        </div>

        {/* Create Class Inline Form */}
        {isAddingClass && (
          <form onSubmit={handleCreateClass} className="bg-slate-50 dark:bg-[#020617] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 dark:border-white/5 mb-6 flex flex-wrap gap-4 items-end animate-in zoom-in-95 duration-200">
            <div className="space-y-1.5 shrink-0 w-full sm:w-auto sm:flex-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Kelas Baru</label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={`Contoh: X ${selectedMajor} 3`}
                className="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm shadow-indigo-500/10 w-full sm:w-auto cursor-pointer"
            >
              Simpan Kelas
            </button>
          </form>
        )}

        {/* Classes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {classesOfSelectedMajor.map((c) => {
            const enroll = classEnrollments[c.name] || { total: 0, L: 0, P: 0 };
            
            return (
              <div 
                key={c.id}
                onClick={() => setSelectedClassDetail(c)}
                onDragOver={(e) => handleDragOver(e, c.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, c.name)}
                className={`p-5 border rounded-3xl flex flex-col justify-between hover:shadow-md cursor-pointer transition-all relative group overflow-hidden ${
                  activeDropClass === c.id
                    ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 ring-2 ring-blue-500 scale-[1.02] shadow-lg shadow-blue-500/10"
                    : "bg-slate-50 dark:bg-[#020617]/40 border-slate-200 dark:border-slate-800/60 dark:border-white/5 hover:border-blue-500/40"
                }`}
              >
                {/* Decorative border line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-sm group-hover:text-blue-500 transition-colors">{c.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Terdaftar: {enroll.total} Siswa</span>
                    {enroll.total > 0 && (
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        (L: {enroll.L}, P: {enroll.P})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedClassDetail(c)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-lg transition-all"
                      title="Lihat Detail Kelas"
                    >
                      <Eye size={13} />
                    </button>
                    {enroll.total === 0 && (
                      <button
                        onClick={() => handleDeleteClass(c.id, c.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Hapus Kelas Kosong"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-blue-500">
                  <span>Lihat Daftar Kelas</span>
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {classesOfSelectedMajor.length === 0 && (
            <div className="sm:col-span-2 md:col-span-3 xl:col-span-4 text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Belum ada kelas yang terdaftar untuk jurusan {selectedMajor}. Klik "+ Buat Kelas Baru" untuk mendaftar.
            </div>
          )}
        </div>
      </div>

      {/* Main Student Directory Grid & Checklist Panel */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300 space-y-6">
        
        {/* Filtering Toolbar */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between border-b border-slate-100 dark:border-white/5 pb-5">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={13} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama / NISN..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Assignment Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Filter size={11} />
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider font-extrabold text-[9px]"
              >
                <option value="ALL">Semua Calon Kelas</option>
                <option value="UNASSIGNED">Belum Dapat Kelas</option>
                <option value="ASSIGNED">Sudah Ada Kelas</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Filter size={11} />
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider font-extrabold text-[9px]"
              >
                <option value="ALL">Semua Gender</option>
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Student Table Checklist */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-slate-600 dark:text-slate-400">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-50 dark:bg-slate-950/15 dark:bg-slate-950/15">
                <th className="py-3.5 px-4 text-center w-12 pl-6">
                  <button 
                    onClick={handleSelectAll}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all text-slate-500 dark:text-slate-400 flex items-center justify-center"
                    title={selectedStudentIds.length === filteredStudents.length ? "Clear Selection" : "Select All"}
                  >
                    {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                      <CheckSquare size={14} className="text-blue-500" />
                    ) : (
                      <MinusSquare size={14} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 text-center">NIPD</th>
                <th className="py-3.5 px-4">Nama Lengkap Siswa</th>
                <th className="py-3.5 px-4 text-center w-16">L/P</th>
                <th className="py-3.5 px-4 text-center">NISN</th>
                <th className="py-3.5 px-4">Asal Sekolah SMP</th>
                <th className="py-3.5 px-4 text-center">Pilihan Keahlian</th>
                <th className="py-3.5 px-4 text-center">Kelas Sekarang</th>
                <th className="py-3.5 px-4 text-right pr-6">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                const assignedClass = getStudentCurrentClass(student);

                return (
                  <tr
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, student.id)}
                    className={`hover:bg-slate-50 dark:bg-slate-800/60 dark:hover:bg-white dark:bg-[#0f172a]/10 transition-all cursor-grab active:cursor-grabbing select-none ${
                      isSelected ? "bg-blue-500/10 dark:bg-blue-500/15 border-l-2 border-blue-500" : ""
                    }`}
                  >
                    <td className="py-3 px-4 pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-slate-400 dark:border-white/10 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                      {nipdMap.get(student.id) || "-"}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-800 dark:text-white text-sm">{student.nama}</div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"} · Periode Daftar: {student.periode || "2026-2027"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {(student.jenis_kelamin || student.jenisKelamin) ? (
                        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                          (student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l")
                            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                            : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                        }`}>
                          {(student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {student.nisn}
                    </td>

                    <td className="py-3 px-4 text-slate-550 dark:text-slate-400 font-semibold uppercase">
                      {student.sekolah_asal || student.sekolahAsal}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[9px] uppercase tracking-wide">
                        {student.jurusan_1 || student.jurusan1}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {assignedClass ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                          {assignedClass}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-50 dark:bg-[#020617]/30 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                          Belum Diatur
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={assignedClass || ""}
                          onChange={(e) => {
                            setSelectedStudentIds([student.id]);
                            handleAssignSelectedToClass(e.target.value);
                          }}
                          className="px-2.5 py-1 text-[9px] uppercase font-black bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-950/40 dark:text-white border border-slate-200 dark:border-white/5 rounded-lg focus:outline-none cursor-pointer"
                        >
                          <option value="">Belum Diatur</option>
                          {classesOfSelectedMajor.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                    Tidak ditemukan data siswa aktif untuk kriteria filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Class Detail Modal Overlay */}
      {selectedClassDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-950/15 dark:bg-slate-950/15">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                  <span>Daftar Kelas: {selectedClassDetail.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {enrolledStudentsInDetail.length} Siswa Terdaftar
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Daftar nama siswa resmi yang telah dimasukkan ke kelas ini</p>
              </div>
              <button
                onClick={() => { setSelectedClassDetail(null); setClassSearchTerm(""); }}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Actions & Filter */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/5 dark:bg-slate-950/5 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  value={classSearchTerm}
                  onChange={(e) => setClassSearchTerm(e.target.value)}
                  placeholder="Cari siswa di kelas..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <button
                onClick={() => handleExportClassCSV(selectedClassDetail.name)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Download size={14} />
                <span>Cetak Daftar Kelas (XLS)</span>
              </button>
            </div>

            {/* Modal Student Table */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[45vh]">
              <table className="w-full text-left text-xs font-bold text-slate-600 dark:text-slate-400">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest">
                    <th className="py-2.5 px-3 text-left w-12">No</th>
                    <th className="py-2.5 px-4 text-center">NIPD</th>
                    <th className="py-2.5 px-4">Nama Lengkap</th>
                    <th className="py-2.5 px-4 text-center w-16">L/P</th>
                    <th className="py-2.5 px-4 text-center">NISN</th>
                    <th className="py-2.5 px-4">Asal Sekolah</th>
                    <th className="py-2.5 px-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {enrolledStudentsInDetail.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:bg-slate-950/15 dark:hover:bg-white dark:bg-[#0f172a]/5 transition-all">
                      <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 text-center font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{nipdMap.get(student.id) || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{student.nama}</div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                          Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {(student.jenis_kelamin || student.jenisKelamin) ? (
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                            (student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l")
                              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                          }`}>
                            {(student.jenis_kelamin || student.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px]">{student.nisn}</td>
                      <td className="py-3 px-4 uppercase">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleRemoveStudentFromClassDetail(student.id, student.nama)}
                          className="px-2.5 py-1 text-[9px] uppercase font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 transition-all"
                        >
                          Keluarkan
                        </button>
                      </td>
                    </tr>
                  ))}

                  {enrolledStudentsInDetail.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        Tidak ada data siswa yang cocok di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/15 dark:bg-slate-950/15 flex justify-end shrink-0">
              <button
                onClick={() => { setSelectedClassDetail(null); setClassSearchTerm(""); }}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Sticky Mass Action Floating Bar (shown only when 1 or more students are checked) */}
      {selectedStudentIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] w-full max-w-3xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
              {selectedStudentIds.length}
            </span>
            <div className="text-left">
              <h5 className="text-[11px] font-black uppercase tracking-wider">Siswa Terpilih</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">Tentukan kelas secara massal untuk pendaftar aktif.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Tentukan Kelas:</span>
            {classesOfSelectedMajor.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAssignSelectedToClass(c.name)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-indigo-600 shadow-sm cursor-pointer"
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={() => handleAssignSelectedToClass("")}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
              title="Keluarkan Siswa dari Kelas"
            >
              Keluarkan
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
