"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import Swal from "sweetalert2";
import { 
  Applicant, 
  EditFormState, 
  BSTNode, 
  PendaftarPageTab 
} from "../types";
import { exportApplicantsToExcel } from "../utils/exportExcel";

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

export function usePendaftarState() {
  const { 
    applicants, 
    setApplicants, 
    verifyApplicant, 
    rejectApplicant, 
    deleteApplicant, 
    updateApplicant, 
    fetchAdminApplicants, 
    addToast, 
    isDemoMode 
  } = usePPDB();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [gelombangFilter, setGelombangFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [rejectingApplicantId, setRejectingApplicantId] = useState<number | null>(null);
  const [rejectionPreset, setRejectionPreset] = useState<string>("");
  const [rejectionNotes, setRejectionNotes] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "active";
  const activePageTab = activeTabParam as PendaftarPageTab;

  const [trashedApplicants, setTrashedApplicants] = useState<Applicant[]>([]);
  const [trashLoading, setTrashLoading] = useState<boolean>(false);
  const [trashError, setTrashError] = useState<string>("");
  const [trashSuccess, setTrashSuccess] = useState<string>("");

  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";

  const handleTabChange = (tab: PendaftarPageTab) => {
    setTrashError("");
    setTrashSuccess("");
    router.push(`/${schoolSlug}/dashboard/pendaftar?tab=${tab}`);
  };

  const fetchTrashedApplicants = useCallback(async () => {
    try {
      setTrashLoading(true);
      setTrashError("");
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/applicants/trashed`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTrashedApplicants(data.data);
      } else {
        setTrashError(data.message || "Gagal mengambil data pendaftar terhapus");
      }
    } catch (err: unknown) {
      setTrashError(err instanceof Error ? err.message : "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  }, []);

  const handleRestoreApplicant = async (id: number) => {
    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/applicants/${id}/restore`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTrashSuccess("Data calon siswa berhasil dipulihkan!");
        fetchTrashedApplicants();
        if (fetchAdminApplicants) await fetchAdminApplicants();
      } else {
        setTrashError(data.message || "Gagal memulihkan data");
      }
    } catch (err: unknown) {
      setTrashError(err instanceof Error ? err.message : "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  const handlePermanentDeleteApplicant = async (id: number) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus data calon siswa ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal"
    });
    if (!result.isConfirmed) return;
    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/applicants/${id}?permanent=true`, {
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
      setTrashError(err instanceof Error ? err.message : "Terjadi kesalahan koneksi");
    } finally {
      setTrashLoading(false);
    }
  };

  useEffect(() => {
    if (activePageTab === "trash") {
      fetchTrashedApplicants();
    }
  }, [activePageTab, fetchTrashedApplicants]);

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

  const [editApplicant, setEditApplicant] = useState<Applicant | null>(null);
  const [editForm, setEditForm] = useState<Partial<EditFormState>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);

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

  const bstRoot = useMemo(() => {
    let root: BSTNode | null = null;
    applicants.forEach((a: Applicant) => {
      root = bstInsert(root, { key: buildKey(a), id: a.id, left: null, right: null });
    });
    return root;
  }, [applicants]);

  const bstMatchedIds = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return null; 
    const ids: number[] = [];
    bstSearch(bstRoot, q, ids);
    return new Set(ids);
  }, [bstRoot, searchTerm]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a: Applicant) => {
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
  }, [applicants, activePageTab, bstMatchedIds, statusFilter, majorFilter, gelombangFilter, genderFilter]);

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedApplicants = useMemo(() => {
    return filteredApplicants.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredApplicants, currentPage, itemsPerPage]);

  const handleExport = () => {
    exportApplicantsToExcel(applicants, isDemoMode);
  };

  const handleTogglePhysicalDoc = async (a: Applicant) => {
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
        setApplicants((prev: Applicant[]) => prev.map(item => item.id === a.id ? { ...item, physical_doc_verified: targetState, physical_doc_verified_by: data.data.physical_doc_verified_by } : item));
        if (typeof addToast === "function") {
          addToast("Verifikasi Berkas Fisik", data.message, "success");
        }
      }
    } catch (err: unknown) {
      console.error("Gagal update berkas fisik:", err);
    }
  };

  const handleChecklistChange = async (applicantId: number, newChecklist: Record<string, boolean>) => {
    try {
      const token = localStorage.getItem("ppdb_token") || localStorage.getItem("ppdb_admin_token");
      setSelectedApplicant(prev => prev ? { ...prev, physical_docs_checklist: newChecklist } : null);
      const res = await fetch(`/api/applicants/${applicantId}/physical-doc`, {
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
        setApplicants((prev: Applicant[]) => prev.map(item => item.id === applicantId ? {
          ...item,
          physical_doc_verified: data.data.physical_doc_verified,
          physical_doc_verified_by: data.data.physical_doc_verified_by,
          physical_docs_checklist: data.data.physical_docs_checklist
        } : item));
      }
    } catch(err) { 
      console.error("Error updating checklist:", err); 
    }
  };

  return {
    applicants,
    filteredApplicants,
    paginatedApplicants,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    majorFilter,
    setMajorFilter,
    gelombangFilter,
    setGelombangFilter,
    genderFilter,
    setGenderFilter,
    majorsList,
    page,
    setPage,
    totalPages,
    currentPage,
    activePageTab,
    handleTabChange,
    selectedApplicant,
    setSelectedApplicant,
    handleViewDetail,
    verifyApplicant,
    rejectApplicant,
    deleteApplicant,
    rejectingApplicantId,
    setRejectingApplicantId,
    rejectionPreset,
    setRejectionPreset,
    rejectionNotes,
    setRejectionNotes,
    editApplicant,
    setEditApplicant,
    editForm,
    setEditForm,
    isSaving,
    openEdit,
    handleEditSave,
    isSpreadsheetMode,
    setIsSpreadsheetMode,
    activeCell,
    setActiveCell,
    handleExport,
    handleTogglePhysicalDoc,
    handleChecklistChange,
    trashedApplicants,
    trashLoading,
    trashError,
    trashSuccess,
    handleRestoreApplicant,
    handlePermanentDeleteApplicant
  };
}
