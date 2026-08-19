"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import dompurify from "dompurify";

const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (_e) {
    return "";
  }
};

const sanitizeSrc = (src: string | undefined | null): string => sanitizeUrl(src);
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Check, X, Eye, FileText, Download, Upload, Filter, Search, TableProperties, FileSpreadsheet, Trash2, Layers, Pencil, PieChart, CloudLightning } from "lucide-react";
import KuotaTab from "@/components/KuotaTab";
import Swal from 'sweetalert2';
import {
  Info,
  Calendar,
  Heart,
  HelpCircle,
  FileCheck,
  User,
  Users,
  FileImage,
  School
} from "lucide-react";

export const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (_e) {
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
  diterima_kelas?: string | null;
  diterimaKelas?: string | null;
  diterima_tanggal?: string | null;
  diterimaTanggal?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface EditFormState {
  nama: string;
  nisn: string;
  nik: string;
  tempat_lahir: string;
  tgl_lahir: string;
  jenis_kelamin: string;
  agama: string;
  alamat: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kode_pos: string;
  whatsapp: string;
  email: string;
  tinggal_dengan: string;
  transportasi: string;
  tinggi_badan: string;
  berat_badan: string;
  golongan_darah: string;
  sekolah_asal: string;
  tgl_lulus: string;
  jurusan_1: string;
  nama_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  telepon_ortu: string;
  cita_cita: string;
  alasan_memilih: string;
  [key: string]: string;
}

type SyncStatus = "IDLE" | "SYNCING" | "SUCCESS";

interface BSTNode {
  key: string;       
  id: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function bstInsert(root: BSTNode | null, node: BSTNode): BSTNode {
  if (!root) return node;
  if (node.key < root.key) root.left = bstInsert(root.left, node);
  else root.right = bstInsert(root.right, node);
  return root;
}

function bstSearch(root: BSTNode | null, query: string, results: number[]): void {
  if (!root) return;
  bstSearch(root.left, query, results);
  if (root.key.includes(query)) results.push(root.id);
  bstSearch(root.right, query, results);
}

function buildKey(a: Applicant): string {
  const initial = (a.nama || "").trim().charAt(0).toLowerCase();
  const jurusan = (a.jurusan_1 || a.jurusan1 || "").toLowerCase();
  const sekolah = (a.sekolah_asal || a.sekolahAsal || "").toLowerCase();
  return `${initial}|${jurusan}|${sekolah}`;
}

function ApplicantsDirectoryContent() {
  const { applicants, setApplicants, verifyApplicant, rejectApplicant, deleteApplicant, updateApplicant, fetchAdminApplicants, addToast, isDemoMode } = usePPDB();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [gelombangFilter, setGelombangFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [rejectingApplicantId, setRejectingApplicantId] = useState<number | null>(null);
  const [rejectionPreset, setRejectionPreset] = useState<string>("");
  const [rejectionNotes, setRejectionNotes] = useState<string>("");
  
  // Trash bin implementation
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "active";
  const activePageTab = activeTabParam as "active" | "transfer" | "trash" | "kuota";

  const [trashedApplicants, setTrashedApplicants] = useState<Applicant[]>([]);
  const [trashLoading, setTrashLoading] = useState<boolean>(false);
  const [trashError, setTrashError] = useState<string>("");
  const [trashSuccess, setTrashSuccess] = useState<string>("");

  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || '';

  const handleTabChange = (tab: "active" | "transfer" | "trash" | "kuota") => {
    setTrashError("");
    setTrashSuccess("");
    router.push(`/${schoolSlug}/dashboard/pendaftar?tab=${tab}`);
  };

  const fetchTrashedApplicants = async () => {
    try {
      setTrashLoading(true);
      setTrashError("");
      const token = localStorage.getItem("ppdb_admin_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
      const res = await fetch(`${backendUrl}/api/applicants/trashed`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTrashedApplicants(data.data);
      } else {
        setTrashError(data.message || "Gagal mengambil data pendaftar terhapus");
      }
    } catch (err: unknown) {
      setTrashError((err as any).message || "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  const handleRestoreApplicant = async (id: number) => {
    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
      const res = await fetch(`${backendUrl}/api/applicants/${id}/restore`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTrashSuccess("Data calon siswa berhasil dipulihkan!");
        fetchTrashedApplicants();
        await fetchAdminApplicants();
      } else {
        setTrashError(data.message || "Gagal memulihkan data");
      }
    } catch (err: unknown) {
      setTrashError((err as any).message || "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  const handlePermanentDeleteApplicant = async (id: number) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menghapus data calon siswa ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;
    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
      const res = await fetch(`${backendUrl}/api/applicants/${id}?permanent=true`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTrashSuccess("Data calon siswa berhasil dihapus secara permanen.");
        fetchTrashedApplicants();
      } else {
        setTrashError(data.message || "Gagal menghapus data");
      }
    } catch (err: unknown) {
      setTrashError((err as any).message || "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  useEffect(() => {
    if (activePageTab === "trash") {
      fetchTrashedApplicants();
    }
  }, [activePageTab]);
  
  const handleViewDetail = async (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    try {
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/applicants/${applicant.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedApplicant(data.data);
      }
    } catch (err) {
      console.warn("Failed to lazy load applicant detail:", err);
    }
  };

  const [activeTab, setActiveTab] = useState<string>("biodata");
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState<boolean>(false);

  const [editApplicant, setEditApplicant] = useState<Applicant | null>(null);
  const [editForm, setEditForm] = useState<Partial<EditFormState>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>("IDLE");
  const [syncProgress, setSyncProgress] = useState<number>(0);

  const openEdit = (a: Applicant) => {
    setEditApplicant(a);
    setEditForm({
      nama: a.nama || "",
      nisn: a.nisn || "",
      nik: a.nik || "",
      tempat_lahir: a.tempat_lahir || a.tempatLahir || "",
      tgl_lahir: a.tgl_lahir || a.tglLahir || "",
      jenis_kelamin: a.jenis_kelamin || a.jenisKelamin || "",
      agama: a.agama || "",
      alamat: a.alamat || "",
      rt_rw: a.rt_rw || a.rtRw || "",
      kelurahan: a.kelurahan || "",
      kecamatan: a.kecamatan || "",
      kode_pos: a.kode_pos || a.kodePos || "",
      whatsapp: a.whatsapp || "",
      email: a.email || "",
      tinggal_dengan: a.tinggal_dengan || a.tinggalDengan || "",
      transportasi: a.transportasi || "",
      tinggi_badan: String(a.tinggi_badan || a.tinggiBadan || ""),
      berat_badan: String(a.berat_badan || a.beratBadan || ""),
      golongan_darah: a.golongan_darah || a.golonganDarah || "",
      sekolah_asal: a.sekolah_asal || a.sekolahAsal || "",
      tgl_lulus: a.tgl_lulus || a.tglLulus || "",
      jurusan_1: a.jurusan_1 || a.jurusan1 || "",
      nama_ayah: a.nama_ayah || a.namaAyah || "",
      pekerjaan_ayah: a.pekerjaan_ayah || a.pekerjaanAyah || "",
      penghasilan_ayah: a.penghasilan_ayah || a.penghasilanAyah || "",
      nama_ibu: a.nama_ibu || a.namaIbu || "",
      pekerjaan_ibu: a.pekerjaan_ibu || a.pekerjaanIbu || "",
      penghasilan_ibu: a.penghasilan_ibu || a.penghasilanIbu || "",
      telepon_ortu: a.telepon_ortu || a.teleponOrtu || "",
      cita_cita: a.cita_cita || a.citaCita || "",
      alasan_memilih: a.alasan_memilih || a.alasanMemilih || "",
    });
  };

  const handleEditSave = async () => {
    if (!editApplicant) return;
    setIsSaving(true);
    const res = await updateApplicant(editApplicant.id, editForm);
    setIsSaving(false);
    if (res?.success) {
      setEditApplicant(null);
    } else {
      alert(res?.message || "Gagal menyimpan perubahan.");
    }
  };

  const majorsList = [
    "Rekayasa Perangkat Lunak",
    "Teknik Jaringan Komputer & Telekomunikasi",
    "Desain Komunikasi Visual",
    "Broadcasting & Perfilman",
    "Teknik Elektronika",
    "Animasi"
  ];

  const bstRoot = React.useMemo(() => {
    let root: BSTNode | null = null;
    applicants.forEach((a: Applicant) => {
      root = bstInsert(root, { key: buildKey(a), id: a.id, left: null, right: null });
    });
    return root;
  }, [applicants]);

  const bstMatchedIds = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return null; 
    const ids: number[] = [];
    bstSearch(bstRoot, q, ids);
    return new Set(ids);
  }, [bstRoot, searchTerm]);

  const filteredApplicants = applicants.filter((a: Applicant) => {
    // Segregate active (new students) and transfer students
    const isTransfer = a.diterima_kelas && (a.diterima_kelas.includes("XI") || a.diterima_kelas.includes("XII"));
    if (activePageTab === "active" && isTransfer) return false;
    if (activePageTab === "transfer" && !isTransfer) return false;
    
    const matchesSearch = bstMatchedIds === null || bstMatchedIds.has(a.id);

    const matchesStatus =
      statusFilter === "ALL" ||
      a.status === statusFilter ||
      (statusFilter === "Pending" && (!a.status || a.status === "Pending"));

    const matchesMajor =
      majorFilter === "ALL" ||
      a.jurusan_1 === majorFilter ||
      a.jurusan1 === majorFilter;

    const matchesGelombang =
      gelombangFilter === "ALL" ||
      (a.gelombang || "Gelombang 1") === gelombangFilter;

    const matchesGender =
      genderFilter === "ALL" ||
      (genderFilter === "L" && (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")) ||
      (genderFilter === "P" && (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("p"));

    return matchesSearch && matchesStatus && matchesMajor && matchesGelombang && matchesGender;
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, majorFilter, gelombangFilter, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / itemsPerPage));
  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const _triggerGoogleSheetsSync = () => {
    if (filteredApplicants.length === 0) return;
    setSyncStatus("SYNCING");
    setSyncProgress(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (syncStatus === "SYNCING") {
      interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSyncStatus("SUCCESS");
            setTimeout(() => setSyncStatus("IDLE"), 4000);
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [syncStatus]);

  const exportToExcel = async () => {
    if (isDemoMode) {
      Swal.fire({
        icon: "success",
        title: "Berhasil Diekspor",
        text: "Data pendaftar berhasil diekspor ke Excel (Demo Mode).",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    try {
      const token = localStorage.getItem("ppdb_admin_token") || localStorage.getItem("ppdb_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
      const res = await fetch(`${backendUrl}/applicants/export`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const blob = await res.blob();
        saveAs(blob, `Data_Calon_Siswa_${new Date().toISOString().split("T")[0]}.xlsx`);
        return;
      }
      throw new Error("Server export endpoint unavailable");
    } catch (_err: unknown) {
      // Client-side ExcelJS fallback for production (cationgate.site)
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Calon Siswa");
        worksheet.columns = [
          { header: "ID", key: "id", width: 10 },
          { header: "NISN", key: "nisn", width: 15 },
          { header: "Nama Lengkap", key: "nama", width: 30 },
          { header: "Sekolah Asal", key: "sekolah_asal", width: 25 },
          { header: "Jurusan Pilihan", key: "jurusan_1", width: 25 },
          { header: "Status", key: "status", width: 15 },
          { header: "Tanggal Daftar", key: "tgl_daftar", width: 20 },
        ];
        applicants.forEach(app => {
          worksheet.addRow({
            id: app.id,
            nisn: app.nisn || "-",
            nama: app.nama || "-",
            sekolah_asal: app.sekolah_asal || app.sekolahAsal || "-",
            jurusan_1: app.jurusan_1 || app.jurusan1 || "-",
            status: app.status || "Pending",
            tgl_daftar: app.tgl_daftar ? new Date(app.tgl_daftar).toLocaleDateString("id-ID") : "-"
          });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `Data_Calon_Siswa_${new Date().toISOString().split("T")[0]}.xlsx`);
      } catch (clientErr: unknown) {
        Swal.fire({
          icon: "error",
          title: "Ekspor Gagal",
          text: (clientErr as any).message
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => handleTabChange("active")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activePageTab === "active"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Calon Siswa Baru (Kelas X)
        </button>
        <button
          onClick={() => handleTabChange("transfer")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activePageTab === "transfer"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Calon Siswa Pindahan (Kelas XI & XII)
        </button>
        <button
          onClick={() => handleTabChange("kuota")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activePageTab === "kuota"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <PieChart size={15} />
          Data Kuota
        </button>

        <button
          onClick={() => handleTabChange("trash")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activePageTab === "trash"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Trash2 size={15} />
          Sampah / Calon Siswa Dihapus
        </button>
      </div>

      {trashError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
          {trashError}
        </div>
      )}

      {trashSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-600 rounded-xl text-sm font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          {trashSuccess}
        </div>
      )}

      {activePageTab === "kuota" ? (
        <KuotaTab type="pendaftar" />
      ) : activePageTab === "active" || activePageTab === "transfer" ? (
        <>
          {/* Search, Filter & Spreadsheet Toggle Toolbar */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row gap-4 items-center justify-between transition-colors duration-300">

        {/* Search Field */}
        <div className="relative w-full xl:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 dark:text-slate-550">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari: nama, jurusan, sekolah, gelombang..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-655 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/15 transition-all font-semibold"
          />
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl px-3 py-1.5 shrink-0">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-350 text-xs focus:outline-none transition-all font-extrabold uppercase tracking-wide cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="Pending">Menunggu Verifikasi</option>
              <option value="Approved">Terverifikasi</option>
              <option value="Rejected">Ditolak / Gugur</option>
            </select>
          </div>

          {/* Major Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl px-3 py-1.5 shrink-0">
            <Layers size={13} className="text-slate-400" />
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-350 text-xs focus:outline-none transition-all font-extrabold uppercase tracking-wide cursor-pointer max-w-[160px]"
            >
              <option value="ALL">Semua Jurusan</option>
              {majorsList.map((m, idx) => (
                <option key={idx} value={m}>
                  {m.replace("Teknik ", "").replace("Komunikasi ", "")}
                </option>
              ))}
            </select>
          </div>

          {/* Gelombang Filter Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner">
            {[
              { id: "ALL", label: "Semua Gelombang" },
              { id: "Gelombang 1", label: "Gelombang 1" },
              { id: "Gelombang 2", label: "Gelombang 2" }
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGelombangFilter(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  gelombangFilter === g.id
                    ? "bg-black text-white border-black dark:bg-black dark:border-slate-500 shadow-sm"
                    : "bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200/70 dark:hover:bg-slate-800"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-white/5 rounded-2xl px-3 py-1.5 shrink-0">
            <User size={13} className="text-slate-400" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-350 text-xs focus:outline-none transition-all font-extrabold uppercase tracking-wide cursor-pointer max-w-[140px]"
            >
              <option value="ALL">Semua Gender</option>
              <option value="L">Laki-Laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Toggle View: Standard Table vs Excel Spreadsheet Grid */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/50 dark:border-white/5 shrink-0 shadow-inner">
            <button
              onClick={() => setIsSpreadsheetMode(false)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${!isSpreadsheetMode
                  ? "bg-white dark:bg-[#0f172a] text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800/40 dark:border-white/5"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-white dark:hover:text-white"
                }`}
              title="Tampilan Tabel Standard"
            >
              <TableProperties size={14} />
              <span className="hidden sm:inline">Standard</span>
            </button>
            <button
              onClick={() => setIsSpreadsheetMode(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isSpreadsheetMode
                  ? "bg-white dark:bg-[#0f172a] text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800/40 dark:border-white/5"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-white dark:hover:text-white"
                }`}
              title="Tampilan Excel Sheet Mode"
            >
              <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline text-emerald-500 font-bold">Excel Preview</span>
            </button>
          </div>

          {/* Export formatted CSV/Spreadsheet button */}
          <button
            onClick={exportToExcel}
            disabled={filteredApplicants.length === 0}
            className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/50 hover:bg-emerald-600/10 text-emerald-650 dark:text-emerald-400 disabled:opacity-40 disabled:pointer-events-none rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            <span>Export XLS</span>
          </button>
        </div>
      </div>

      {/* Primary Data Grid (Standard vs Spreadsheet Mode views) */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl backdrop-blur-md overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">

        {!isSpreadsheetMode ? (
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold text-slate-650 dark:text-slate-355">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/15">
                  <th className="py-4 px-6 pl-8">No. Pendaftaran</th>
                  <th className="py-4 px-6">Nama Calon Siswa</th>
                  <th className="py-4 px-6 text-center w-20">L/P</th>
                  <th className="py-4 px-6">Asal Sekolah</th>
                  <th className="py-4 px-6">Pilihan Jurusan Utama</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Berkas Fisik</th>
                  <th className="py-4 px-6 text-right pr-8">Aksi Administrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {paginatedApplicants.map((a: Applicant, idx: number) => (
                  <tr
                    key={a.id || idx}
                    className="hover:bg-slate-50 dark:bg-slate-800/50/60 dark:hover:bg-white dark:bg-[#0f172a]/5 transition-all group cursor-pointer"
                    onDoubleClick={() => handleViewDetail(a)}
                  >
                    <td className="py-4 px-6 pl-8">
                      <div className="font-extrabold text-blue-600 dark:text-blue-400 text-sm font-mono">
                        {a.registration_no || formatNoPendaftaran(a.periode, a.id)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-850 dark:text-white text-sm">{a.nama}</div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-555 font-bold tracking-wide uppercase mt-0.5 block">
                        Daftar: {new Date(a.tgl_daftar || a.createdAt || Date.now()).toLocaleDateString("id-ID")} · {a.gelombang || "Gelombang 1"} · Lahir: {a.tempat_lahir || a.tempatLahir || "-"}, {a.tgl_lahir || a.tglLahir || "-"}
                        {a.status === "Approved" && a.verified_by && ` · Diverifikasi: ${a.verified_by}`}
                        {a.status === "Rejected" && a.rejected_by && ` · Digugurkan: ${a.rejected_by}`}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {(a.jenis_kelamin || a.jenisKelamin) ? (
                        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                          (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
                            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                            : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                        }`}>
                          {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-semibold">{a.sekolah_asal || a.sekolahAsal}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50/70 dark:bg-blue-950/40 text-blue-550 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 font-extrabold text-[9px] uppercase tracking-wide">
                        {a.jurusan_1 || a.jurusan1}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${a.status === "Approved"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                            : a.status === "Rejected"
                              ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                              : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                          }`}
                      >
                        {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const token = localStorage.getItem("ppdb_token");
                          const targetState = !a.physical_doc_verified;
                          try {
                            const res = await fetch(`/api/applicants/${a.id}/physical-doc`, {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                              },
                              body: JSON.stringify({ verified: targetState })
                            });
                            const data = await res.json();
                            if (data.success) {
                              setApplicants(prev => prev.map(item => item.id === a.id ? { ...item, physical_doc_verified: targetState, physical_doc_verified_by: data.data.physical_doc_verified_by } : item));
                              if (typeof addToast === "function") {
                                addToast("Verifikasi Berkas Fisik", data.message, "success");
                              }
                            }
                          } catch (err: unknown) {
                            console.error("Gagal update berkas fisik:", err);
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-wider cursor-pointer transition-all ${
                          a.physical_doc_verified
                            ? "bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-400 hover:bg-emerald-100"
                            : "bg-rose-50 border-rose-250 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400 hover:bg-rose-100"
                        }`}
                        title={a.physical_doc_verified ? `Diverifikasi oleh ${a.physical_doc_verified_by || 'Admin'} - Klik untuk batalkan` : "Klik jika Berkas Fisik siswa sudah diterima di sekolah"}
                      >
                        {a.physical_doc_verified ? "✓ Diterima" : "⌛ Belum Ada"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right pr-8 shrink-0">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewDetail(a)}
                          className="p-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 text-slate-600 dark:text-slate-355 hover:text-slate-850 dark:hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 dark:border-white/5"
                          title="Lihat Detail Form"
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          onClick={() => openEdit(a)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl transition-all border border-blue-200/50 dark:border-blue-500/20"
                          title="Edit Data Pendaftar"
                        >
                          <Pencil size={13} />
                        </button>

                        {a.status !== "Approved" && (
                          <button
                            onClick={() => verifyApplicant(a.id)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl transition-all border border-emerald-250 dark:border-emerald-500/20"
                            title="Setujui & Verifikasi"
                          >
                            <Check size={13} />
                          </button>
                        )}

                        {a.status !== "Rejected" && (
                          <button
                            onClick={() => {
                               setRejectingApplicantId(a.id);
                               setRejectionPreset("");
                               setRejectionNotes("");    
                            }}
                            className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-all border border-rose-250 dark:border-rose-500/20"
                            title="Tolak Pendaftaran"
                          >
                            <X size={13} />
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: 'Konfirmasi',
                              text: "Apakah Anda yakin ingin menghapus data pendaftar ini secara permanen?",
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Ya',
                              cancelButtonText: 'Batal'
                            });
                            if (result.isConfirmed) {
                              deleteApplicant(a.id);
                            }
                          }}
                          className="p-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-rose-500/10 dark:bg-slate-955/20 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl transition-all border border-slate-200 dark:border-slate-800/50 dark:border-white/5 hover:border-rose-500/25"
                          title="Hapus Permanen"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                      Tidak ditemukan data calon siswa yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          
          <div className="overflow-x-auto">
            <div className="bg-[#f8fafc] dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 p-2.5 text-[10px] font-bold font-mono tracking-widest flex items-center justify-between shrink-0">
              <span className="flex items-center gap-2">
                <FileSpreadsheet size={13} className="text-emerald-500" />
                <span>EXCEL PREVIEW : PPDB_SMK_TARUNABHAKTI_2026.XLSX</span>
              </span>
              <span className="text-slate-400 dark:text-slate-655">Double-click baris untuk Verifikasi Dokumen</span>
            </div>

            <table className="w-full text-left text-xs font-semibold text-slate-650 dark:text-slate-355 border-collapse table-fixed">
              <thead>
                {/* Column Headers (Alphabetical A-G) */}
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#1e293b]/80 dark:bg-slate-950/60 font-mono text-[10px] tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="py-2 px-2 text-center w-12 border-r border-slate-200 dark:border-slate-800">#</th>
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 w-8 flex-none text-center">A</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[220px]">B (NAMA_LENGKAP)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[200px]">C (ASAL_SEKOLAH)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[180px]">D (JURUSAN_UTAMA)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[130px] text-center font-mono">E (NO_WA)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[120px] text-center font-mono">F (STATUS)</th>
                  <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 w-[160px] text-center font-mono">G (TANGGAL_LAHIR)</th>
                  <th className="py-2 px-4 w-[60px] text-center font-mono">H (L/P)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplicants.map((a: Applicant, rowIdx: number) => (
                  <tr
                    key={a.id || rowIdx}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-colors duration-150"
                    onDoubleClick={() => handleViewDetail(a)}
                  >
                    {/* Row Index Number */}
                    <td className="py-2.5 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50/80 dark:bg-slate-950/40 text-slate-400 font-bold">
                      {(currentPage - 1) * itemsPerPage + rowIdx + 1}
                    </td>

                    {/* Checkbox A */}
                    <td className="py-2.5 text-center border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        className="rounded border-slate-350 text-blue-600 focus:ring-blue-500 w-3 h-3 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    {/* Column B: Nama */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 1 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white font-extrabold text-sm ${activeCell?.row === rowIdx && activeCell?.col === 1 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.nama}
                    </td>

                    {/* Column C: Sekolah */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 3 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 font-semibold ${activeCell?.row === rowIdx && activeCell?.col === 3 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.sekolah_asal || a.sekolahAsal}
                    </td>

                    {/* Column D: Jurusan */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 4 })}
                      className={`py-2.5 px-4 truncate border-r border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[10px] ${activeCell?.row === rowIdx && activeCell?.col === 4 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.jurusan_1 || a.jurusan1}
                    </td>

                    {/* Column E: WA */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 5 })}
                      className={`py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800 font-mono text-slate-655 dark:text-slate-300 text-[11px] ${activeCell?.row === rowIdx && activeCell?.col === 5 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.whatsapp || "-"}
                    </td>

                    {/* Column F: Status */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 6 })}
                      className={`py-2.5 px-4 text-center text-[10px] font-extrabold uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 ${a.status === "Approved"
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                          : a.status === "Rejected"
                            ? "text-rose-600 dark:text-rose-400 bg-rose-500/5"
                            : "text-amber-600 dark:text-amber-400 bg-amber-500/5"
                        } ${activeCell?.row === rowIdx && activeCell?.col === 6 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.status || "Pending"}
                    </td>

                    {/* Column G: Tanggal Lahir */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 7 })}
                      className={`py-2.5 px-4 text-center border-r border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-600 dark:text-slate-355 ${activeCell?.row === rowIdx && activeCell?.col === 7 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {a.tgl_lahir || a.tglLahir || "-"}
                    </td>

                    {/* Column H: Gender */}
                    <td
                      onClick={() => setActiveCell({ row: rowIdx, col: 8 })}
                      className={`py-2.5 px-4 text-center text-xs font-mono font-bold text-slate-600 dark:text-slate-355 ${activeCell?.row === rowIdx && activeCell?.col === 8 ? "bg-blue-500/10 outline outline-2 outline-blue-500" : ""
                        }`}
                    >
                      {(a.jenis_kelamin || a.jenisKelamin) ? (
                        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border shadow-sm ${
                          (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
                            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                            : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                        }`}>
                          {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                        </span>
                      ) : "-"}
                    </td>
                  </tr>
                ))}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 font-mono text-slate-450 italic uppercase bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/20">
                      Zero lines of data found. Filter criteria matches nothing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredApplicants.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50/25 dark:bg-slate-950/20">
            <div className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Menampilkan <span className="text-slate-700 dark:text-slate-300">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-700 dark:text-slate-300">{Math.min(currentPage * itemsPerPage, filteredApplicants.length)}</span> dari <span className="text-slate-700 dark:text-slate-300">{filteredApplicants.length}</span> Siswa
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Sebelumnya
              </button>
              <span className="text-xs text-slate-550 dark:text-slate-400 font-extrabold uppercase px-2">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      ) : (
        /* Trash Table View */
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-slate-800/60 rounded-3xl backdrop-blur-md overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
          {trashLoading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat data sampah...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-655 dark:text-slate-355">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/15">
                    <th className="py-4 px-6 pl-8">Nama Calon Siswa</th>
                    <th className="py-4 px-6 text-center w-20">L/P</th>
                    <th className="py-4 px-6">Asal Sekolah</th>
                    <th className="py-4 px-6">Pilihan Jurusan Utama</th>
                    <th className="py-4 px-6 text-center">Status Sebelumnya</th>
                    <th className="py-4 px-6 text-right pr-8">Aksi Pemulihan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {trashedApplicants.map((a: Applicant, idx: number) => (
                    <tr key={a.id || idx} className="hover:bg-slate-50 dark:bg-slate-800/50/60 dark:hover:bg-white dark:bg-[#0f172a]/5 transition-all">
                      <td className="py-4 px-6 pl-8">
                        <div className="font-extrabold text-slate-850 dark:text-white text-sm">{a.nama}</div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-555 font-bold tracking-wide uppercase mt-0.5 block">
                          NISN: {a.nisn} · Lahir: {a.tempat_lahir || a.tempatLahir || "-"}, {a.tgl_lahir || a.tglLahir || "-"}
                          {a.deleted_by && ` · Dihapus: ${a.deleted_by}`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {(a.jenis_kelamin || a.jenisKelamin) ? (
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border shadow-sm ${
                            (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
                              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400"
                              : "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/50 dark:text-pink-400"
                          }`}>
                            {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-semibold">{a.sekolah_asal || a.sekolahAsal}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50/70 dark:bg-blue-950/40 text-blue-550 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 font-extrabold text-[9px] uppercase tracking-wide">
                          {a.jurusan_1 || a.jurusan1}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${a.status === "Approved"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                              : a.status === "Rejected"
                                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                                : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                            }`}
                        >
                          {a.status === "Approved" ? "Terverifikasi" : a.status === "Rejected" ? "Ditolak" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestoreApplicant(a.id)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                            title="Pulihkan Calon Siswa"
                          >
                            Pulihkan
                          </button>
                          
                          <button
                            onClick={() => handlePermanentDeleteApplicant(a.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                            title="Hapus Permanen"
                          >
                            Hapus Permanen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {trashedApplicants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                        Tempat sampah kosong.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Interactive Google Sheets Sync Simulation progress banner overlay */}
      {syncStatus === "SYNCING" && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161f2e] border border-blue-500/30 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] w-80 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 mb-2">
            <CloudLightning className="text-blue-400 animate-bounce shrink-0" size={18} />
            <h4 className="text-xs font-black uppercase text-white tracking-widest leading-none">Auto-Syncing Sheets</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold pl-7 mb-3 leading-snug">Menyinkronkan data PPDB siswa ke Google Spreadsheet...</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden pl-7">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${syncProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Beautiful Rich Detail Modal (13 Wizard Steps tabs overlay) */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 transition-colors duration-300">

            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex items-start justify-between shrink-0 bg-white dark:bg-[#0f172a] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none"></div>
                           <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-2xl font-black shrink-0">
                  {selectedApplicant.nama.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white flex items-center gap-3 uppercase tracking-wide">
                    <span>{selectedApplicant.nama}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-widest ${selectedApplicant.status === "Approved"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                          : selectedApplicant.status === "Rejected"
                            ? "bg-rose-50 dark:bg-rose-950/60 border-rose-250 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                            : "bg-amber-50 dark:bg-amber-950/60 border-amber-250 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                        }`}
                    >
                      {selectedApplicant.status === "Approved" ? "Terverifikasi" : selectedApplicant.status === "Rejected" ? "Ditolak" : "Pending"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-555 font-bold uppercase tracking-wider mt-1.5 flex items-center flex-wrap gap-2">
                    <span className="text-blue-500">No. Pendaftaran:</span> <span className="font-mono text-blue-600 dark:text-blue-400">{formatNoPendaftaran(selectedApplicant.periode, selectedApplicant.id)}</span>
                    <span className="text-slate-300 dark:text-slate-700 dark:text-slate-200">•</span> 
                    <span className="text-blue-500">NISN:</span> {selectedApplicant.nisn} 
                    <span className="text-slate-300 dark:text-slate-700 dark:text-slate-200">•</span> 
                    <span className="text-blue-500">Asal:</span> {selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}
                  </p>
                  {selectedApplicant.status === "Approved" && selectedApplicant.verified_by && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide mt-1">
                      ✓ Diverifikasi oleh: {selectedApplicant.verified_by}
                    </p>
                  )}
                  {selectedApplicant.status === "Rejected" && selectedApplicant.rejected_by && (
                    <div className="mt-1.5 flex flex-col gap-1.5 align-start text-left">
                      <p className="text-[10px] text-rose-650 dark:text-rose-400 font-extrabold uppercase tracking-wide">
                        ✗ Digugurkan oleh: {selectedApplicant.rejected_by}
                      </p>
                      <div className="text-[10px] p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-350 max-w-md">
                        <span className="font-extrabold uppercase tracking-wider block mb-0.5">Alasan Penolakan:</span>
                        <span className="font-bold">{selectedApplicant.alasan_ditolak || "Tidak ada alasan spesifik yang diberikan."}</span>
                      </div>
                    </div>
                  )}
                  {selectedApplicant.deleted_at && selectedApplicant.deleted_by && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wide mt-1">
                      🗑️ Dihapus oleh: {selectedApplicant.deleted_by}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedApplicant(null);
                  setIsFullscreenImageOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-450 hover:text-rose-500 dark:hover:text-rose-400 flex items-center justify-center transition-all font-bold relative z-10 shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-white/5 shrink-0 w-full overflow-hidden">
              <div className="flex overflow-x-auto hide-scrollbar bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1 w-full max-w-full border border-slate-200 dark:border-slate-800/50 dark:border-white/5">
                {[
                  { id: "biodata", label: "Biodata" },
                  { id: "periodik", label: "Periodik" },
                  { id: "bantuan", label: "Bantuan" },
                  { id: "orangtua", label: "Orang Tua" },
                  { id: "akademik", label: "Akademik" },
                  { id: "pembayaran", label: "Verifikasi Berkas" },
                  { id: "pernyataan", label: "Pernyataan" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-2.5 text-[10px] md:text-xs font-black transition-all rounded-xl uppercase tracking-wider shrink-0 text-center min-w-[90px] whitespace-nowrap ${activeTab === t.id
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800/50 dark:border-white/10"
                        : "text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:text-white dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Tab Content Viewport */}
            <div className="flex-1 overflow-y-auto p-8 text-xs leading-relaxed text-slate-655 dark:text-slate-350 font-bold max-h-[50vh] transition-colors duration-300">
              {activeTab === "biodata" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User size={12} />
                      </div>
                      Identitas Diri
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                        <span className="text-slate-850 dark:text-white text-sm font-black">{selectedApplicant.nama}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">NISN / NIK</span>
                        <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{selectedApplicant.nisn} / {selectedApplicant.nik || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tempat, Tanggal Lahir</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tempat_lahir || selectedApplicant.tempatLahir}, {selectedApplicant.tgl_lahir || selectedApplicant.tglLahir}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Kelamin / Agama</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jenis_kelamin || selectedApplicant.jenisKelamin} / {selectedApplicant.agama}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Info size={12} />
                      </div>
                      Alamat & Kontak
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">WhatsApp / Email</span>
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-black">{selectedApplicant.whatsapp} / {selectedApplicant.email}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alamat Tempat Tinggal</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alamat} (RT/RW {selectedApplicant.rt_rw || selectedApplicant.rtRw})</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Kelurahan / Kecamatan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.kelurahan} / {selectedApplicant.kecamatan}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggal Dengan / Transportasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggal_dengan || selectedApplicant.tinggalDengan} / {selectedApplicant.transportasi}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "periodik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Calendar size={12} />
                      </div>
                      Data Fisik & Periodik
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tinggi / Berat Badan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tinggi_badan || selectedApplicant.tinggiBadan || "-"} cm / {selectedApplicant.berat_badan || selectedApplicant.beratBadan || "-"} kg</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jarak ke Sekolah</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jarak_sekolah || selectedApplicant.jarakSekolah || "-"} km</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Waktu Tempuh Perjalanan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.waktu_jam || selectedApplicant.waktuJam || 0} Jam {selectedApplicant.waktu_menit || selectedApplicant.waktuMenit || 0} Menit</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jumlah Saudara Kandung</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.jumlah_saudara || selectedApplicant.jumlahSaudara || 0} orang</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Heart size={12} />
                      </div>
                      Kondisi Kesehatan
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-rose-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Golongan Darah</span>
                        <span className="text-rose-600 dark:text-rose-400 font-black text-xs uppercase">{selectedApplicant.golongan_darah || selectedApplicant.golonganDarah || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-rose-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Riwayat Penyakit</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penyakit_diderita || selectedApplicant.penyakitDiderita || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-rose-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-2 font-bold uppercase text-[9px] tracking-wider">Kebutuhan Khusus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedApplicant.kebutuhan_khusus) ? selectedApplicant.kebutuhan_khusus.map((k, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase shadow-sm">{k}</span>
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
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <HelpCircle size={12} />
                      </div>
                      Jaminan Sosial / Bantuan
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-amber-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KPS</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.punya_kps || selectedApplicant.punyaKps || "Tidak"} {selectedApplicant.no_kps || selectedApplicant.noKps ? `(No: ${selectedApplicant.no_kps || selectedApplicant.noKps})` : ""}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-amber-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penerima KIP</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.punya_kip || selectedApplicant.punyaKip || "Tidak"} {selectedApplicant.no_kip || selectedApplicant.noKip ? `(No: ${selectedApplicant.no_kip || selectedApplicant.noKip})` : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Layers size={12} />
                      </div>
                      Beasiswa & Prestasi
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Jenis Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{Array.isArray(selectedApplicant.jenis_prestasi) ? selectedApplicant.jenis_prestasi.join(", ") : selectedApplicant.jenisPrestasi || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tingkat Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{Array.isArray(selectedApplicant.tingkat_prestasi) ? selectedApplicant.tingkat_prestasi.join(", ") : selectedApplicant.tingkatPrestasi || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.uraian_prestasi || selectedApplicant.uraianPrestasi || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tahun Prestasi</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tahun_prestasi || selectedApplicant.tahunPrestasi || "Tidak Ada"}</span>
                      </div>
                      {selectedApplicant.berkas_prestasi && (
                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                          <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Berkas Prestasi</span>
                          <a href={sanitizeSrc(selectedApplicant.berkas_prestasi)} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-600 underline text-left block w-full truncate">Lihat Sertifikat</a>
                        </div>
                      )}
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Uraian Beasiswa</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.uraian_beasiswa || selectedApplicant.uraianBeasiswa || "Tidak Ada"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orangtua" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <User size={12} />
                      </div>
                      Ayah Kandung
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                        <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_ayah || selectedApplicant.namaAyah || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pekerjaan Ayah</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.pekerjaan_ayah || selectedApplicant.pekerjaanAyah || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penghasilan_ayah || selectedApplicant.penghasilanAyah || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <User size={12} />
                      </div>
                      Ibu Kandung
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                        <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_ibu || selectedApplicant.namaIbu || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Pendidikan / Pekerjaan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.pendidikan_ibu || selectedApplicant.pendidikanIbu || "-"} / {selectedApplicant.pekerjaan_ibu || selectedApplicant.pekerjaanIbu || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-pink-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Penghasilan Bulanan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.penghasilan_ibu || selectedApplicant.penghasilanIbu || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-500">
                        <Users size={12} />
                      </div>
                      Wali & Kontak Darurat
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-teal-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Wali</span>
                        <span className="text-slate-850 dark:text-white font-bold text-xs">{selectedApplicant.nama_wali || selectedApplicant.namaWali || "Tidak Ada"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-teal-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">No. Telepon Orang Tua</span>
                        <span className="text-teal-600 dark:text-teal-400 font-mono text-sm font-black">{selectedApplicant.telepon_ortu || selectedApplicant.teleponOrtu || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "akademik" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Info size={12} />
                      </div>
                      Pendidikan Asal
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">Nama Sekolah Asal</span>
                        <span className="text-slate-850 dark:text-white text-sm font-black">{selectedApplicant.sekolah_asal || selectedApplicant.sekolahAsal}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-550 block mb-1 font-bold uppercase text-[9px] tracking-wider">No. Ijazah / SKHUN</span>
                        <span className="text-slate-800 dark:text-white font-mono font-bold text-xs">{selectedApplicant.no_ijazah || selectedApplicant.noIjazah || "-"} / {selectedApplicant.no_skhun || selectedApplicant.noSkhun || "-"}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Tgl Lulus / Lama Belajar</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.tgl_lulus || selectedApplicant.tglLulus || "-"} ({selectedApplicant.lama_belajar || selectedApplicant.lamaBelajar || 3} Tahun)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-3 text-[10px] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Layers size={12} />
                      </div>
                      Pilihan Minat Studi
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-100 dark:border-blue-500/10 shadow-sm">
                        <span className="text-blue-500 dark:text-blue-400 block mb-1 font-bold uppercase text-[9px] tracking-wider">Program Studi Pilihan Utama</span>
                        <span className="text-blue-700 dark:text-blue-300 text-sm font-black uppercase">{selectedApplicant.jurusan_1 || selectedApplicant.jurusan1}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-white/5 hover:border-orange-500/20 transition-colors">
                        <span className="text-slate-400 dark:text-slate-555 block mb-1 font-bold uppercase text-[9px] tracking-wider">Alasan Memilih Jurusan</span>
                        <span className="text-slate-800 dark:text-white font-bold text-xs">{selectedApplicant.alasan_memilih || selectedApplicant.alasanMemilih || "Ingin belajar IT"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pembayaran" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] flex items-center gap-1.5">
                    <FileCheck size={12} className="text-blue-500" /> Status Verifikasi Berkas Fisik
                  </h4>
                  
                  <div className="p-6 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800/50 dark:border-white/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                      <div className="space-y-1">
                        <h4 className="text-slate-800 dark:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Check size={12} />
                          </div>
                          Checklist Berkas Fisik
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Tandai dokumen yang telah diserahkan secara fisik ke sekolah.</p>
                        {selectedApplicant.physical_doc_verified && selectedApplicant.physical_doc_verified_by && (
                          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                            ✓ Diverifikasi oleh admin {selectedApplicant.physical_doc_verified_by}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          selectedApplicant.physical_doc_verified
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                        }`}>
                          {selectedApplicant.physical_doc_verified ? "Lengkap & Valid" : "Belum Lengkap"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'kk', label: 'Fotokopi Kartu Keluarga (KK)' },
                        { id: 'ktp_ortu', label: 'Fotokopi KTP Orang Tua (Ayah & Ibu)' },
                        { id: 'akta', label: 'Akta Kelahiran asli & 1 Fotokopi' },
                        { id: 'ijazah', label: 'Fotokopi Ijazah / SKL legalisir' },
                        { id: 'pas_foto', label: 'Pas foto berwarna 3x4 (3 lembar)' },
                        { id: 'bukti_bayar', label: 'Bukti Pembayaran Pendaftaran' }
                      ].map(doc => {
                        const isChecked = selectedApplicant.physical_docs_checklist?.[doc.id] || false;
                        return (
                          <button
                            key={doc.id}
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("ppdb_token") || localStorage.getItem("ppdb_admin_token");
                                const currentChecklist = selectedApplicant.physical_docs_checklist || {};
                                const newChecklist = { ...currentChecklist, [doc.id]: !isChecked };
                                
                                // Optimistic update
                                setSelectedApplicant(prev => prev ? {
                                  ...prev,
                                  physical_docs_checklist: newChecklist
                                } : null);

                                const res = await fetch(`/api/applicants/${selectedApplicant.id}/physical-doc`, {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ checklist: newChecklist, verified: false })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  setSelectedApplicant(prev => prev ? {
                                    ...prev,
                                    physical_doc_verified: data.data.physical_doc_verified,
                                    physical_doc_verified_by: data.data.physical_doc_verified_by,
                                    physical_docs_checklist: data.data.physical_docs_checklist
                                  } : null);
                                  setApplicants(prev => prev.map(item => item.id === selectedApplicant.id ? {
                                    ...item,
                                    physical_doc_verified: data.data.physical_doc_verified,
                                    physical_doc_verified_by: data.data.physical_doc_verified_by,
                                    physical_docs_checklist: data.data.physical_docs_checklist
                                  } : item));
                                } else {
                                  // Revert on error
                                  setSelectedApplicant(prev => prev ? { ...prev, physical_docs_checklist: currentChecklist } : null);
                                  if (typeof addToast === "function") {
                                    addToast("Gagal Update", data.message, "error");
                                  }
                                }
                              } catch(err) {
                                console.error("Error updating checklist:", err);
                              }
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isChecked 
                                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50" 
                                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:border-slate-800 hover:border-blue-400/50"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                              isChecked
                                ? "bg-emerald-500 border-emerald-600 text-white"
                                : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            }`}>
                              {isChecked && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className={`text-xs font-bold leading-tight ${
                              isChecked ? "text-emerald-900 dark:text-emerald-100" : "text-slate-600 dark:text-slate-400"
                            }`}>
                              {doc.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
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
                    <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider text-[9px] block">Pernyataan Kesanggupan Calon Taruna Baru:</span>
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
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-950/15 flex items-center justify-end shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:bg-white dark:bg-[#0f172a]/5 dark:hover:bg-white dark:bg-[#0f172a]/10 text-slate-600 dark:text-slate-355 hover:text-slate-850 dark:hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-slate-800/50 dark:border-white/5"
                >
                  Tutup
                </button>

                {selectedApplicant.status !== "Approved" && (
                  <button
                    onClick={() => {
                      verifyApplicant(selectedApplicant.id);
                      setSelectedApplicant(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5"
                  >
                    Verifikasi Lolos
                  </button>
                )}

                {selectedApplicant.status !== "Rejected" && (
                  <button
                    onClick={() => {
                      setRejectingApplicantId(selectedApplicant.id);
                      setRejectionPreset("");
                      setRejectionNotes("");
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] flex items-center gap-1.5"
                  >
                    Tolak / Gugurkan
                  </button>
                )}
              </div>
            </div>
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
                    { label: "Gelombang", key: "gelombang", type: "select", options: ["Gelombang 1", "Gelombang 2"] },
                    { label: "Program Studi Pilihan Utama", key: "jurusan_1", type: "select", options: ["Rekayasa Perangkat Lunak", "Teknik Jaringan Komputer & Telekomunikasi", "Desain Komunikasi Visual", "Broadcasting & Perfilman", "Teknik Elektronika", "Animasi"] },
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
                },
                {
                  section: "Prestasi & Beasiswa", icon: <Layers size={14} />, fields: [
                    { label: "Uraian Prestasi", key: "uraian_prestasi" },
                    { label: "Tahun Prestasi", key: "tahun_prestasi" },
                    { label: "Uraian Beasiswa", key: "uraian_beasiswa" },
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
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={(editForm as any)[f.key] || ""}
                            onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-[#1e293b]/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all cursor-pointer"
                          >
                            {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={f.type || "text"}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                onClick={handleEditSave}
                disabled={isSaving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex items-center gap-2"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isFullscreenImageOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsFullscreenImageOpen(false)}
        >
          <button
            onClick={() => setIsFullscreenImageOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white dark:bg-[#0f172a]/10 hover:bg-white dark:bg-[#0f172a]/20 border border-white/10 text-white flex items-center justify-center text-xl transition-all shadow font-bold cursor-pointer hover:scale-110"
          >
            ✕
          </button>
          <img
            src={sanitizeSrc(selectedApplicant?.bukti_bayar || "")}
            alt="Bukti Transfer Manual Fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-xl select-none cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Custom Rejection Reason Modal */}
      {rejectingApplicantId !== null && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-[32px] p-8 shadow-2xl flex flex-col gap-6 text-left max-w-md w-full backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-500 border border-rose-100 dark:border-rose-900/40 shadow-inner">
              <svg className="w-7 h-7 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Tolak Pendaftaran</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Silakan masukkan alasan mengapa pendaftaran calon siswa ini ditolak. Alasan ini akan langsung ditampilkan kepada calon siswa di halaman beranda.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Alasan Penolakan (Wajib Pilih)
                </label>
                <select
                  value={rejectionPreset}
                  onChange={(e) => setRejectionPreset(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">-- Pilih Alasan Penolakan --</option>
                  <option value="Dokumen atau berkas tidak lengkap">Dokumen atau berkas tidak lengkap</option>
                  <option value="Dokumen atau data identitas tidak valid">Dokumen atau data identitas tidak valid</option>
                  <option value="Nilai/hasil seleksi belum memenuhi syarat">Nilai/hasil seleksi belum memenuhi syarat</option>
                  <option value="Kuota program keahlian sudah penuh">Kuota program keahlian sudah penuh</option>
                  <option value="Tidak memenuhi ketentuan jalur pendaftaran">Tidak memenuhi ketentuan jalur pendaftaran</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="rejection-reason" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  id="rejection-reason"
                  rows={2}
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="Contoh: Scan rapor semester 4 belum diunggah..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold resize-none"
                />
              </div>
            </div>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectingApplicantId(null);
                  setRejectionPreset("");
                  setRejectionNotes("");
                }}
                className="flex-1 py-3.5 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all border border-slate-205 dark:border-slate-700 cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!rejectionPreset}
                onClick={() => {
                  if (rejectionPreset && rejectingApplicantId) {
                    const formattedReason = rejectionPreset + (rejectionNotes.trim() ? `. Catatan admin: ${rejectionNotes.trim()}` : "");
                    rejectApplicant(rejectingApplicantId, formattedReason);
                    if (selectedApplicant && selectedApplicant.id === rejectingApplicantId) {
                      setSelectedApplicant(null);
                    }
                    setRejectingApplicantId(null);
                    setRejectionPreset("");
                    setRejectionNotes("");
                  }
                }}
                className="flex-1 py-3.5 bg-gradient-to-tr from-rose-600 to-red-500 hover:brightness-110 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow shadow-rose-500/20 transition-all cursor-pointer text-center"
              >
                Tolak Siswa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ApplicantsDirectory() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat data pendaftar...</div>}>
      <ApplicantsDirectoryContent />
    </Suspense>
  );
}
