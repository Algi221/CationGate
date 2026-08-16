"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { usePPDB } from "@/context/PPDBContext";
import dompurify from "dompurify";

const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (e) {
    return "";
  }
};

const sanitizeSrc = (src: string | undefined | null): string => sanitizeUrl(src);
import { generateNipdMap } from "@/utils/nipd";
import { motion, AnimatePresence } from "framer-motion";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { 
  Search, 
  Download, 
  GraduationCap, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  User, 
  Info, 
  Heart, 
  Layers, 
  HelpCircle, 
  FileCheck, 
  FileText, 
  FileImage, 
  FileWarning, 
  Eye, 
  X, 
  Filter, 
  BookOpen, 
  School,
  Sparkles,
  Trash2,
  Pencil,
  PieChart,
  Upload,
  FileSpreadsheet
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import KuotaTab from "@/components/KuotaTab";
import Swal from 'sweetalert2';


export const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
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
  nik?: string;
  tempat_lahir?: string;
  tempatLahir?: string;
  tgl_lahir?: string;
  tglLahir?: string;
  jenis_kelamin?: string;
  jenisKelamin?: string;
  agama?: string;
  alamat?: string;
  rt_rw?: string;
  rtRw?: string;
  kelurahan?: string;
  kecamatan?: string;
  kode_pos?: string;
  kodePos?: string;
  whatsapp?: string;
  email?: string;
  tinggal_dengan?: string;
  tinggalDengan?: string;
  transportasi?: string;
  tinggi_badan?: string | number;
  tinggiBadan?: string | number;
  berat_badan?: string | number;
  beratBadan?: string | number;
  golongan_darah?: string;
  golonganDarah?: string;
  sekolah_asal?: string;
  sekolahAsal?: string;
  tgl_lulus?: string;
  tglLulus?: string;
  jurusan_1?: string;
  jurusan1?: string;
  nama_ayah?: string;
  namaAyah?: string;
  pekerjaan_ayah?: string;
  pekerjaanAyah?: string;
  penghasilan_ayah?: string;
  penghasilanAyah?: string;
  nama_ibu?: string;
  namaIbu?: string;
  pendidikan_ibu?: string;
  pendidikanIbu?: string;
  pekerjaan_ibu?: string;
  pekerjaanIbu?: string;
  penghasilan_ibu?: string;
  penghasilanIbu?: string;
  telepon_ortu?: string;
  teleponOrtu?: string;
  cita_cita?: string;
  citaCita?: string;
  alasan_memilih?: string;
  alasanMemilih?: string;
  status?: string;
  tgl_daftar?: string;
  createdAt?: string;
  nama_wali?: string;
  namaWali?: string;
  no_ijazah?: string;
  noIjazah?: string;
  no_skhun?: string;
  noSkhun?: string;
  lama_belajar?: string | number;
  lamaBelajar?: string | number;
  jarak_sekolah?: string | number;
  jarakSekolah?: string | number;
  waktu_jam?: number;
  waktuJam?: number;
  waktu_menit?: number;
  waktuMenit?: number;
  jumlah_saudara?: number;
  jumlahSaudara?: number;
  penyakit_diderita?: string;
  penyakitDiderita?: string;
  kebutuhan_khusus?: string[];
  punya_kps?: string;
  punyaKps?: string;
  no_kps?: string;
  noKps?: string;
  punya_kip?: string;
  punyaKip?: string;
  no_kip?: string;
  noKip?: string;
  uraian_prestasi?: string;
  uraianPrestasi?: string;
  uraian_beasiswa?: string;
  uraianBeasiswa?: string;
  perkelahian?: string;
  narkoba?: string;
  pelanggaran_lain?: string;
  periode?: string;
  berkas_foto?: string;
  [key: string]: any;
}

function ActiveStudentsDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePageTab = searchParams.get("tab") || "active";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleTabChange = (tab: "active" | "kuota") => {
    router.push(`/dashboard/siswa-aktif?tab=${tab}`);
  };

  const { activeStudents, addToast, fetchActiveStudents, updateActiveStudent, isDemoMode } = usePPDB();

  useEffect(() => {
    if (typeof fetchActiveStudents === "function") {
      fetchActiveStudents();
    }
  }, [fetchActiveStudents]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  const [customPeriods, setCustomPeriods] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("ppdb_custom_periods");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Invalid JSON in ppdb_custom_periods:", saved);
        }
      }
    }
    return [];
  });
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [newPeriodValue, setNewPeriodValue] = useState("");

  const getNextPeriod = () => {
    const allPeriods = [
      ...Object.keys(groupedByPeriod),
      ...customPeriods
    ];
    if (allPeriods.length === 0) {
      const y = new Date().getFullYear();
      return `${y}-${y + 1}`;
    }
    
    const maxStartYear = Math.max(
      ...allPeriods.map(p => parseInt(p.split("-")[0]) || 0)
    );
    return `${maxStartYear + 1}-${maxStartYear + 2}`;
  };

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [editApplicant, setEditApplicant] = useState<Applicant | null>(null);
  const [editForm, setEditForm] = useState<Partial<Applicant>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const handleViewDetail = async (student: Applicant) => {
    setSelectedApplicant(student);
    setEditForm({
      nama: student.nama || "",
      nisn: student.nisn || "",
      nik: student.nik || "",
      jurusan: student.jurusan || student.jurusan_1 || student.jurusan1 || ""
    });
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/siswa-aktif/${student.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedApplicant(data.data);
        setEditForm({
          nama: data.data.nama || "",
          nisn: data.data.nisn || "",
          nik: data.data.nik || "",
          jurusan: data.data.jurusan || data.data.jurusan_1 || data.data.jurusan1 || ""
        });
      }
    } catch (err) {
      console.warn("Failed to lazy load active student detail:", err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editApplicant) return;
    if (!editForm.nama?.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }
    if (editForm.nisn?.length !== 10) {
      alert("NISN harus 10 digit!");
      return;
    }
    if (editForm.nik && editForm.nik.length !== 16) {
      alert("NIK harus 16 digit jika diisi!");
      return;
    }

    try {
      setIsSaving(true);
      const currentMajor = editApplicant.jurusan || editApplicant.jurusan_1 || editApplicant.jurusan1;
      const majorChanged = editForm.jurusan_1 !== currentMajor;

      // Sanitize null values by simply omitting them, so backend falls back to existing or defaults
      const sanitizedForm: any = {};
      for (const key in editForm) {
        if (editForm[key] !== null) {
          sanitizedForm[key] = editForm[key];
        }
      }

      const updatedPayload: any = {
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
          // close detail modal too or let it update
          setSelectedApplicant(null);
        }
        if (typeof fetchActiveStudents === "function") {
          await fetchActiveStudents();
        }
      } else {
        alert(res?.message || "Gagal menyimpan perubahan.");
      }
    } catch (e: any) {
      setIsSaving(false);
      alert("Terjadi kesalahan: " + e.message);
    }
  };

  const handleBatalVerifikasi = async (id: number, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin membatalkan verifikasi untuk "${nama}"? Siswa ini akan dikembalikan ke daftar pendaftar dengan status Pending.`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/siswa-aktif/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast("Berhasil", `${nama} berhasil dikembalikan ke pendaftar.`, "success");
        if (typeof fetchActiveStudents === 'function') fetchActiveStudents();
      } else {
        addToast("Gagal", data.message || "Terjadi kesalahan.", "error");
      }
    } catch (err) {
      addToast("Error", "Gagal terhubung ke server", "error");
    }
  };

  const [activeTab, setActiveTab] = useState<string>("biodata");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedApplicant) {
      setSelectedDoc(null);
    }
  }, [selectedApplicant]);

  const activeApplicants = useMemo(() => {
    return activeStudents.filter((a: Applicant) => !!(a.diterima_kelas || a.diterimaKelas));
  }, [activeStudents]);

  const filteredApplicants = useMemo(() => {
    return activeApplicants.filter((a: Applicant) => {
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
    const stats: Record<string, { L: number, P: number, total: number }> = {};
    activeApplicants.forEach((a: Applicant) => {
      const k = a.diterima_kelas || a.diterimaKelas;
      if (k) {
        if (!stats[k]) stats[k] = { L: 0, P: 0, total: 0 };
        stats[k].total += 1;
        const jk = (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase();
        if (jk.startsWith("l")) stats[k].L += 1;
        else if (jk.startsWith("p")) stats[k].P += 1;
      }
    });
    return stats;
  }, [activeApplicants]);

  const uniqueClasses = useMemo(() => {
    return Object.keys(classStats).sort();
  }, [classStats]);

  const groupedByPeriod = (() => {
    const groups: Record<string, Applicant[]> = {};

    customPeriods.forEach(p => {
      groups[p] = [];
    });

    filteredApplicants.forEach((a: Applicant) => {
      const period = a.periode || "2026-2027";
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(a);
    });

    Object.keys(groups).forEach(p => {
      groups[p].sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
    });

    return groups;
  })();

  const sortedPeriods = useMemo(() => {
    return Object.keys(groupedByPeriod).sort((a, b) => b.localeCompare(a));
  }, [groupedByPeriod]);

  useEffect(() => {
    if (sortedPeriods.length > 0) {
      setExpandedPeriods(prev => {
        
        if (Object.keys(prev).length === 0) {
          const defaults: Record<string, boolean> = {};
          sortedPeriods.forEach((p, idx) => {
            defaults[p] = idx === 0; 
          });
          return defaults;
        }
        return prev;
      });
    }
  }, [sortedPeriods]);

  const togglePeriod = (period: string) => {
    setExpandedPeriods(prev => ({
      ...prev,
      [period]: !prev[period]
    }));
  };

  const stats = useMemo(() => {
    const total = activeApplicants.length;
    const currentBatch = activeApplicants.filter(a => (a.periode || "2026-2027") === "2026-2027").length;

    const majors: Record<string, number> = {};
    activeApplicants.forEach(a => {
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

  const handleDownloadTemplate = async () => {
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Siswa Aktif');

    worksheet.columns = [
      { header: 'Nama Lengkap', key: 'nama', width: 35 },
      { header: 'NISN', key: 'nisn', width: 25 },
      { header: 'NIPD', key: 'nipd', width: 20 },
      { header: 'Jurusan', key: 'jurusan', width: 20 },
      { header: 'Periode Angkatan', key: 'periode', width: 20 },
      { header: 'Jenis Kelamin (L/P)', key: 'jk', width: 20 },
    ];

    worksheet.addRow({
      nama: 'Contoh Siswa',
      nisn: '1234567890',
      nipd: '242510001',
      jurusan: 'TKJ',
      periode: '2026-2027',
      jk: 'L'
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Template_Import_Siswa_Aktif.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const worksheet = workbook.worksheets[0];
      
      const students: any[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        
        const rowData: any = {};
        worksheet.columns?.forEach((col, idx) => {
          if (col.key) {
            rowData[col.key] = row.getCell(idx + 1).value?.toString() || '';
          }
        });
        
        if (rowData.nama) {
          students.push({
            nama: rowData.nama,
            nisn: rowData.nisn || '',
            nipd: rowData.nipd || '',
            jurusan: rowData.jurusan || '',
            periode: rowData.periode || '2026-2027',
            jenis_kelamin: rowData.jk === 'L' ? 'Laki-laki' : (rowData.jk === 'P' ? 'Perempuan' : ''),
            status: 'Lulus/Aktif'
          });
        }
      });

      if (students.length === 0) {
        addToast('Tidak ada data siswa yang valid ditemukan di Excel.', 'error');
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const token = localStorage.getItem('ppdb_admin_token');
      const res = await fetch('/api/siswa-aktif/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ students })
      });
      
      const data = await res.json();
      if (data.success) {
        addToast(data.message, 'success');
        if (typeof fetchActiveStudents === 'function') {
          fetchActiveStudents();
        }
      } else {
        addToast(data.message || 'Gagal mengimpor data.', 'error');
      }
    } catch (err) {
      console.error('Import error:', err);
      addToast('Terjadi kesalahan saat membaca file Excel.', 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExportExcel = async (students: Applicant[], fileNameSuffix: string) => {
    if (isDemoMode) {
      Swal.fire({
        icon: "success",
        title: "Berhasil Diekspor",
        text: "Data siswa aktif berhasil diekspor ke Excel (Demo Mode).",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (students.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    
    // Group students by period
    const groups: Record<string, Applicant[]> = {};
    students.forEach((a: Applicant) => {
      const period = a.periode || '2026-2027';
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(a);
    });

    // Sort periods descending to have the latest period first
    const periods = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    periods.forEach((period) => {
      // Sheet name must not exceed 31 characters and cannot contain special characters like : \ / ? * [ ]
      const sheetName = `Periode ${period.replace(/[:\\/?*\[\]]/g, '')}`.substring(0, 31);
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.columns = [
        { header: 'No.', key: 'no', width: 10 },
        { header: 'NIPD', key: 'nipd', width: 20 },
        { header: 'No. Pendaftaran', key: 'no_pendaftaran', width: 20 },
        { header: 'Periode Angkatan', key: 'periode', width: 20 },
        { header: 'Nama Lengkap', key: 'nama', width: 35 },
        { header: 'Jenis Kelamin', key: 'jk', width: 15 },
        { header: 'NISN', key: 'nisn', width: 25 },
        { header: 'NIK', key: 'nik', width: 25 },
        { header: 'Asal Sekolah', key: 'sekolah', width: 35 },
        { header: 'Jurusan', key: 'jurusan', width: 35 },
        { header: 'Kelas', key: 'kelas', width: 20 },
        { header: 'No. WhatsApp', key: 'whatsapp', width: 25 },
        { header: 'Email', key: 'email', width: 35 },
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
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      const periodStudents = groups[period];
      // Sort periodStudents alphabetically by name
      periodStudents.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

      periodStudents.forEach((a: Applicant, idx: number) => {
        worksheet.addRow({
          no: idx + 1,
          nipd: nipdMap.get(a.id) || "-",
          no_pendaftaran: formatNoPendaftaran(a.periode, a.id),
          periode: a.periode || '2026-2027',
          nama: a.nama || "",
          jk: (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "Laki-laki" : (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("p") ? "Perempuan" : "-",
          nisn: a.nisn || "",
          nik: a.nik || "",
          sekolah: a.sekolah_asal || a.sekolahAsal || "",
          jurusan: a.jurusan || a.jurusan_1 || a.jurusan1 || "",
          kelas: a.diterima_kelas || a.diterimaKelas || "-",
          whatsapp: a.whatsapp || "",
          email: a.email || "",
        });
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.height = 25;
        }
        row.eachCell((cell, colNumber) => {
          if (rowNumber > 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            if ([1, 3, 4, 7, 8, 9].includes(colNumber)) {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
            }
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Data_Siswa_Aktif_${fileNameSuffix}_${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      
      {/* Executive Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-950/60 dark:to-indigo-900/40 border border-indigo-400/20 dark:border-indigo-850/40 rounded-3xl p-6 shadow-sm text-white flex items-center justify-between transition-all duration-300 hover:shadow-md">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Total Siswa Aktif</span>
            <h3 className="text-3xl font-black leading-none">{stats.total} <span className="text-xs font-bold text-indigo-200">Siswa</span></h3>
            <p className="text-[10px] text-indigo-150 font-bold mt-1">Gabungan seluruh angkatan terverifikasi</p>
          </div>
          <div className="w-12 h-12 bg-white dark:bg-[#0f172a]/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
            <GraduationCap size={24} className="text-indigo-100" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">Periode Terkini (2026-2027)</span>
            <h3 className="text-3xl font-black leading-none text-slate-800 dark:text-white">{stats.currentBatch} <span className="text-xs font-bold text-slate-400">Siswa</span></h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Calon angkatan tahun ini</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 shrink-0">
            <Calendar size={24} className="text-emerald-600 dark:text-emerald-450" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors duration-300">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-black tracking-widest">Konsentrasi Populer</span>
            <h3 className="text-base font-black truncate max-w-[200px] leading-tight text-slate-800 dark:text-white uppercase tracking-wider">{stats.popular}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Kompetensi keahlian pendaftar terbanyak</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 shrink-0">
            <BookOpen size={24} className="text-blue-600 dark:text-blue-450" />
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row gap-4 items-center justify-between transition-colors duration-300">
        <div className="w-full xl:w-auto flex flex-col md:flex-row items-center gap-3 flex-1">
          {/* Universal Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550" size={16} />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, atau asal sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Major/Prodi selection dropdown */}
          <div className="relative w-full md:w-80">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 animate-pulse" size={14} />
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer uppercase tracking-wider"
            >
              <option value="ALL">Semua Jurusan</option>
              <option value="Rekayasa Perangkat Lunak">RPL / PPLG</option>
              <option value="Teknik Jaringan Komputer & Telekomunikasi">TJKT / TKJ</option>
              <option value="Desain Komunikasi Visual">DKV</option>
              <option value="Animasi">Animasi</option>
              <option value="Broadcasting & Perfilman">Broadcasting / BCF</option>
              <option value="Teknik Elektronika">Teknik Elektronika / TE</option>
            </select>
          </div>

          {/* Class selection dropdown */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 animate-pulse" size={14} />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer tracking-wider"
            >
              <option value="ALL">Semua Kelas</option>
              {uniqueClasses.map((kls) => (
                <option key={kls} value={kls}>{kls} (L: {classStats[kls].L}, P: {classStats[kls].P})</option>
              ))}
            </select>
          </div>

          {/* Gender selection dropdown */}
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 animate-pulse" size={14} />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-2xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all appearance-none cursor-pointer tracking-wider"
            >
              <option value="ALL">Semua Gender</option>
              <option value="L">Laki-Laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-3 w-full xl:w-auto">
          {/* Add Period Button */}
          <button
            onClick={() => {
              setNewPeriodValue(getNextPeriod());
              setIsAddPeriodModalOpen(true);
            }}
            className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800"
          >
            + Tambah Periode
          </button>

          {/* Global Export active students */}
          <button
            onClick={() => handleExportExcel(filteredApplicants, "semua_periode")}
            disabled={filteredApplicants.length === 0}
            className={`w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-sm ${
              filteredApplicants.length === 0
                ? "bg-slate-100 dark:bg-[#1e293b] text-slate-400 dark:bg-slate-800 dark:text-slate-600 dark:text-slate-300 border-transparent cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 hover:border-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.15)] cursor-pointer"
            }`}
          >
            <Download size={14} />
            Ekspor Semua Siswa
          </button>

          {/* Import Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-sm bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 hover:border-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.15)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={14} />
            {isImporting ? 'Mengimpor...' : 'Impor Siswa'}
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImportExcel}
          />

          {/* Download Template */}
          <button
            onClick={handleDownloadTemplate}
            className="w-full xl:w-auto px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <FileSpreadsheet size={14} />
            Template
          </button>
        </div>
      </div>

      {/* Accordion List (Grouped by Period) */}
      <div className="space-y-4">
        {sortedPeriods.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 dark:border-slate-800/40 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-[#020617] border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600 dark:text-slate-300">
              <Users size={28} />
            </div>
            <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">Tidak Ada Siswa Aktif</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold max-w-sm mx-auto mt-1 uppercase tracking-wider">
              {searchTerm || majorFilter !== "ALL" 
                ? "Tidak ada data siswa aktif yang cocok dengan kriteria filter pencarian Anda."
                : "Belum ada calon siswa yang berstatus 'Approved' (Terverifikasi) dari sistem PPDB."}
            </p>
          </div>
        ) : (
          sortedPeriods.map((period) => {
            const students = groupedByPeriod[period];
            const isExpanded = expandedPeriods[period] ?? false;

            return (
              <div 
                key={period} 
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-colors duration-300"
              >
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => togglePeriod(period)}
                  className="px-6 py-5 flex items-center justify-between cursor-pointer select-none bg-slate-50 dark:bg-slate-800/50/40 dark:bg-slate-950/15 border-b border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-50 dark:bg-slate-800/50/80 dark:hover:bg-slate-950/25"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 leading-none">
                        Angkatan Periode {period}
                        {period === "2026-2027" && (
                          <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">
                            Terbaru
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">Kelompok siswa aktif periode pendidikan {period}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100/80 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase">
                      {students.length} Siswa
                    </span>
                    
                    {/* Separate Export Button for this specific Period */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportExcel(students, `angkatan_${period.replace("-", "_")}`);
                      }}
                      className="p-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-blue-50 hover:text-blue-600 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 text-slate-500 dark:text-slate-400 rounded-xl transition-all shadow-sm"
                      title={`Ekspor Daftar Siswa Excel Periode ${period}`}
                    >
                      <Download size={14} />
                    </button>

                    {/* Delete button - only for custom-added periods */}
                    {customPeriods.includes(period) && students.length === 0 && (
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const result = await Swal.fire({
                            title: 'Konfirmasi',
                            text: `Hapus periode angkatan "${period}"? Tindakan ini tidak dapat dibatalkan.`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya',
                            cancelButtonText: 'Batal'
                          });
                          if (result.isConfirmed) {
                            const updated = customPeriods.filter(p => p !== period);
                            setCustomPeriods(updated);
                            if (typeof window !== 'undefined') {
                              localStorage.setItem("ppdb_custom_periods", JSON.stringify(updated));
                            }
                            addToast("Periode Dihapus", `Angkatan ${period} telah dihapus.`, "warning");
                          }
                        }}
                        className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 border border-rose-200/50 dark:border-rose-900/30 text-rose-500 dark:text-rose-400 rounded-xl transition-all shadow-sm"
                        title={`Hapus Periode ${period}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {/* Delete button - warn if has students */}
                    {customPeriods.includes(period) && students.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToast("Tidak Bisa Dihapus", `Periode ${period} masih memiliki ${students.length} siswa aktif.`, "warning");
                        }}
                        className="p-2 bg-slate-100 dark:bg-white dark:bg-[#0f172a]/5 border border-slate-200 dark:border-slate-800/50 dark:border-white/5 text-slate-400 dark:text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-sm cursor-not-allowed"
                        title="Tidak bisa hapus periode yang masih ada siswanya"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    
                    <div className="p-1 rounded-lg text-slate-400 dark:text-slate-600 dark:text-slate-300">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Accordion Table Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 overflow-x-auto">
                        <table className="w-full text-xs font-bold text-slate-655 dark:text-slate-400 border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-550 uppercase tracking-widest text-[9px]">
                              <th className="py-3 px-3 text-left w-12">No</th>
                              <th className="py-3 px-4 text-left">NIPD</th>
                              <th className="py-3 px-4 text-left">Kelas</th>
                              <th className="py-3 px-4 text-left">Nama Siswa</th>
                              <th className="py-3 px-4 text-center w-20">L/P</th>
                              <th className="py-3 px-4 text-left">NISN</th>
                              <th className="py-3 px-4 text-left">Asal Sekolah</th>
                              <th className="py-3 px-4 text-left">Jurusan</th>
                              <th className="py-3 px-3 text-center w-32">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student, idx) => (
                              <tr 
                                key={student.id}
                                className="border-b border-slate-100 dark:border-slate-800/50 dark:border-white/5 hover:bg-slate-50 dark:bg-slate-800/50/30 dark:hover:bg-slate-950/10 transition-colors"
                              >
                                <td className="py-3.5 px-3 text-slate-400 dark:text-slate-600 dark:text-slate-300 font-mono">{idx + 1}</td>
                                <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{nipdMap.get(student.id) || "-"}</td>
                                <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-xs">
                                  {student.diterima_kelas || student.diterimaKelas ? student.diterima_kelas || student.diterimaKelas : (
                                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-400 dark:text-slate-500 dark:text-slate-400">BELUM ADA</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-black text-slate-800 dark:text-white uppercase tracking-wider">{student.nama}</div>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider block mt-0.5">
                                    Lahir: {student.tempat_lahir || student.tempatLahir || "-"}, {student.tgl_lahir || student.tglLahir || "-"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center">
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
                                <td className="py-3.5 px-4 font-mono">{student.nisn}</td>
                                <td className="py-3.5 px-4 uppercase">{student.sekolah_asal || student.sekolahAsal || "-"}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase">{student.jurusan || student.jurusan_1 || student.jurusan1}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => {
                                        handleViewDetail(student);
                                        setActiveTab("biodata");
                                      }}
                                      className="p-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 text-slate-600 dark:text-slate-355 hover:text-slate-850 dark:hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 dark:border-white/5"
                                      title="Detail Siswa"
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleBatalVerifikasi(student.id, student.nama)}
                                      className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all border border-rose-200/50 dark:border-rose-500/20"
                                      title="Batal Verifikasi (Kembalikan ke Pendaftar)"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Beautiful Rich ReadOnly Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApplicant(null)}></div>
          <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-4xl rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Top Header */}
            <div className="px-8 pt-8 pb-6 flex justify-between items-start">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/30 shrink-0">
                  {(selectedApplicant.nama || "K")[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{selectedApplicant.nama}</h2>
                    <span className="px-3 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-500/30 rounded-full uppercase tracking-widest whitespace-nowrap">
                      Siswa Aktif
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 flex-wrap">
                    <span className="text-blue-500 font-mono">NIPD: {nipdMap.get(selectedApplicant.id) || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#0f172a]/5 rounded-lg border border-white/10 shadow-sm backdrop-blur-md transition-all hover:bg-white dark:bg-[#0f172a]/10 cursor-default">
                    <BookOpen size={13} className="text-blue-400" />
                    <span className="text-blue-500 font-mono">NO. DAFTAR: {formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-blue-500 flex items-center gap-1">
                      NISN: {selectedApplicant.nisn}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      NIK: {selectedApplicant.nik || "-"}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>ANGKATAN: {selectedApplicant.periode || "2026-2027"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:text-slate-300 transition-colors shrink-0 ml-4"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 shrink-0">
              <div className="bg-slate-100 dark:bg-[#1e293b] p-1.5 rounded-[16px] flex items-center gap-1 w-full overflow-x-auto scrollbar-none">
                {[
                  { id: "biodata", label: "Biodata" },
                  { id: "periodik", label: "Periodik" },
                  { id: "bantuan", label: "Bantuan" },
                  { id: "orangtua", label: "Orang Tua" },
                  { id: "akademik", label: "Akademik" },
                  { id: "pernyataan", label: "Pernyataan" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      setSelectedDoc(null);
                    }}
                    className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-[12px] shrink-0 transition-colors ${
                      activeTab === t.id
                        ? "bg-white dark:bg-[#0f172a] text-blue-600 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-200/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-8 max-h-[60vh] transition-colors duration-300">
              {activeTab === "biodata" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Identitas Diri Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
                        <User size={14} />
                      </div>
                      <h3 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">Identitas Diri</h3>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nama Lengkap</div>
                      <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedApplicant.nama}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NISN / NIK</div>
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tempat, Tanggal Lahir</div>
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jenis Kelamin / Agama</div>
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</div>
                    </div>
                  </div>

                  {/* Alamat & Kontak Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
                        <span className="text-blue-500 font-bold" style={{fontSize: "12px"}}>!</span>
                      </div>
                      <h3 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest">Alamat & Kontak</h3>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp / Email</div>
                      <div className="text-sm font-bold text-blue-500">{selectedApplicant.whatsapp || "-"} / {selectedApplicant.email || "-"}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Tempat Tinggal</div>
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kelurahan / Kecamatan</div>
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tinggal Dengan / Transportasi</div>
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "periodik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Calendar size={12} className="text-blue-500" /> Data Fisik & Periodik
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Heart size={12} className="text-blue-500" /> Kondisi Kesehatan
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span> <span className="text-slate-800 dark:text-white font-extrabold uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span></div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-550 block mb-1.5 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-slate-355 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase">{k}</span>
                          )) : <span className="text-slate-455 italic font-semibold">Tidak Ada</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bantuan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <HelpCircle size={12} className="text-blue-500" /> Jaminan Sosial / Bantuan
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Beasiswa & Prestasi
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orangtua" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Ayah Kandung
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ayah</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <User size={12} className="text-blue-500" /> Ibu Kandung
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Users size={12} className="text-blue-500" /> Wali & Kontak Darurat
                    </h4>
                    <div className="space-y-3.5">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Wali</span> <span className="text-slate-850 dark:text-white font-extrabold">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Telepon Orang Tua</span> <span className="text-blue-600 dark:text-blue-455 font-mono text-sm font-extrabold">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "akademik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Info size={12} className="text-blue-500" /> Pendidikan Asal
                    </h4>
                    <div className="space-y-4">
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Nama Sekolah Asal</span> <span className="text-slate-850 dark:text-white text-sm font-extrabold">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKHUN</span> <span className="text-slate-800 dark:text-white font-mono font-extrabold">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span></div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Tgl Lulus / Lama Belajar</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" /> Pilihan Minat Studi
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-slate-400 dark:text-slate-550 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Kompetensi Keahlian / Jurusan</span>
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-extrabold uppercase">
                          {selectedApplicant.jurusan || selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}
                        </span>
                      </div>
                      <div><span className="text-slate-400 dark:text-slate-555 block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih Jurusan</span> <span className="text-slate-800 dark:text-white font-extrabold">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pernyataan" && (
                <div className="space-y-6">
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                    <FileCheck size={12} className="text-blue-500" /> Komitmen & Janji Kedisiplinan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tawuran / Perkelahian</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.perkelahian === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.perkelahian || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penyalahgunaan Narkoba</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.narkoba === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.narkoba || "Tidak"}</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/50 dark:border-white/5 rounded-2xl">
                      <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pelanggaran Hukum Lain</span>
                      <span className={`font-black px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wide border ${selectedApplicant.pelanggaran_lain === "Ya" ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{selectedApplicant.pelanggaran_lain || "Tidak"}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl space-y-3">
                    <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Taruna Baru:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[10px] text-slate-655 dark:text-slate-350">
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Patuh Aturan Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menerima Sanksi Sekolah</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Hubungan Akrab Taruna</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Belajar Dengan Tekun</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Menjaga Nama Baik Almamater</div>
                    </div>
                  </div>
                </div>
                  )}
            </div>

            {/* Modal Action Controls Footer */}
            <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0f172a] shrink-0">
              <div>
                <button
                  onClick={() => {
                    setEditApplicant(selectedApplicant);
                    setEditForm({
                      ...selectedApplicant,
                      jurusan_1: selectedApplicant.jurusan || selectedApplicant.jurusan_1 || selectedApplicant.jurusan1 || "",
                      tinggi_badan: String(selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || ""),
                      berat_badan: String(selectedApplicant.berat_badan || selectedApplicant.beratBadan || ""),
                      tempat_lahir: selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir || "",
                      tgl_lahir: selectedApplicant.tgl_lahir || selectedApplicant.tglLahir || "",
                      jenis_kelamin: selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin || "",
                      rt_rw: selectedApplicant.rt_rw || selectedApplicant.rtRw || "",
                      kode_pos: selectedApplicant.kode_pos || selectedApplicant.kodePos || "",
                      tinggal_dengan: selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan || "",
                      golongan_darah: selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "",
                      sekolah_asal: selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal || "",
                      tgl_lulus: selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "",
                      nama_ayah: selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "",
                      pekerjaan_ayah: selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "",
                      penghasilan_ayah: selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "",
                      nama_ibu: selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "",
                      pekerjaan_ibu: selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "",
                      penghasilan_ibu: selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "",
                      telepon_ortu: selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "",
                      cita_cita: selectedApplicant.cita_cita || selectedApplicant.citaCita || "",
                      alasan_memilih: selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "",
                    });
                  }}
                  className="px-6 py-2.5 rounded-[12px] font-bold text-[11px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                >
                  Edit Data
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-6 py-2.5 rounded-[12px] font-bold text-[11px] uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-[#1e293b] hover:text-slate-900 border border-slate-100 dark:border-slate-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Period Modal */}
      {isAddPeriodModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-3xl w-full max-w-sm flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/15">
              <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase tracking-wide">
                Tambah Periode Angkatan
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-550 font-bold mt-1">
                Otomatis terisi tahun ajaran berikutnya. Bisa diubah jika perlu.
              </p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newPeriodValue.trim()) return;
              const added = [...customPeriods, newPeriodValue.trim()];
              setCustomPeriods(added);
              if (typeof window !== 'undefined') {
                localStorage.setItem("ppdb_custom_periods", JSON.stringify(added));
              }
              setNewPeriodValue("");
              setIsAddPeriodModalOpen(false);
              addToast("Periode Ditambahkan", `Angkatan ${newPeriodValue.trim()} berhasil dibuat!`, "success");
            }}>
              <div className="p-6">
                <input
                  type="text"
                  placeholder={getNextPeriod()}
                  value={newPeriodValue}
                  onChange={(e) => setNewPeriodValue(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617]/50 border border-slate-200 dark:border-white/5 rounded-xl text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-all uppercase"
                  required
                />
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPeriodModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 text-slate-600 dark:text-slate-355 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-slate-800/50 dark:border-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md"
                >
                  Simpan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===== EDIT MODAL ===== */}
      {editApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-8 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 transition-all">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between bg-white dark:bg-[#0f172a] shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm shrink-0">
                  <Pencil size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white uppercase tracking-wide">
                    Edit Data — {editApplicant.nama}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                    <span className="text-blue-500">NISN:</span> {editApplicant.nisn}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditApplicant(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all relative z-10 shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* Body — scrollable form */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/20 hide-scrollbar">
              {[
                {
                  section: "Identitas Diri", icon: <User size={14} />, fields: [
                    { label: "Nama Lengkap", key: "nama" },
                    { label: "NISN", key: "nisn" },
                    { label: "NIK", key: "nik" },
                    { label: "Tempat Lahir", key: "tempat_lahir" },
                    { label: "Tanggal Lahir", key: "tgl_lahir", type: "date" },
                    { label: "Jenis Kelamin", key: "jenis_kelamin", type: "select", options: ["L", "P", "Laki-laki", "Perempuan"] },
                    { label: "Agama", key: "agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
                    { label: "Golongan Darah", key: "golongan_darah", type: "select", options: ["A", "B", "AB", "O", "-"] },
                  ]
                },
                {
                  section: "Alamat & Kontak", icon: <School size={14} />, fields: [
                    { label: "Alamat", key: "alamat" },
                    { label: "RT/RW", key: "rt_rw" },
                    { label: "Kelurahan", key: "kelurahan" },
                    { label: "Kecamatan", key: "kecamatan" },
                    { label: "Kode Pos", key: "kode_pos" },
                    { label: "WhatsApp", key: "whatsapp" },
                    { label: "Email", key: "email" },
                    { label: "Tinggal Dengan", key: "tinggal_dengan" },
                    { label: "Transportasi", key: "transportasi" },
                  ]
                },
                {
                  section: "Data Fisik", icon: <Heart size={14} />, fields: [
                    { label: "Tinggi Badan (cm)", key: "tinggi_badan", type: "number" },
                    { label: "Berat Badan (kg)", key: "berat_badan", type: "number" },
                  ]
                },
                {
                  section: "Akademik & Jurusan", icon: <Layers size={14} />, fields: [
                    { label: "Sekolah Asal", key: "sekolah_asal" },
                    { label: "Tanggal Lulus", key: "tgl_lulus", type: "date" },
                    { label: "Program Studi", key: "jurusan_1", type: "select", options: ["Rekayasa Perangkat Lunak", "Teknik Jaringan Komputer & Telekomunikasi", "Desain Komunikasi Visual", "Broadcasting & Perfilman", "Teknik Elektronika", "Animasi"] },
                    { label: "Alasan Memilih", key: "alasan_memilih" },
                    { label: "Cita-cita", key: "cita_cita" },
                  ]
                },
                {
                  section: "Data Orang Tua", icon: <Users size={14} />, fields: [
                    { label: "Nama Ayah", key: "nama_ayah" },
                    { label: "Pekerjaan Ayah", key: "pekerjaan_ayah" },
                    { label: "Penghasilan Ayah", key: "penghasilan_ayah" },
                    { label: "Nama Ibu", key: "nama_ibu" },
                    { label: "Pekerjaan Ibu", key: "pekerjaan_ibu" },
                    { label: "Penghasilan Ibu", key: "penghasilan_ibu" },
                    { label: "Telepon Orang Tua", key: "telepon_ortu" },
                  ]
                }
              ].map((section) => (
                <div key={section.section} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      {section.icon}
                    </div>
                    {section.section}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.fields.map((f) => (
                      <div key={f.key} className="group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-455 dark:text-slate-450 mb-2 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">{f.label}</label>
                        {f.type === "select" ? (
                          <select
                            value={(editForm as any)[f.key] || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-[#1e293b]/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all cursor-pointer"
                          >
                            {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={f.type || "text"}
                            value={(editForm as any)[f.key] || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-[#1e293b]/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50/80 dark:bg-slate-950/40 flex items-center justify-end gap-4 shrink-0">
              <button
                onClick={() => setEditApplicant(null)}
                className="px-6 py-3 bg-white dark:bg-[#0f172a] hover:bg-slate-100 dark:bg-[#1e293b] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-white/5"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex items-center gap-2"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ActiveStudentsDirectory() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold animate-pulse">Memuat direktori siswa...</div>}>
      <ActiveStudentsDirectoryContent />
    </Suspense>
  );
}
