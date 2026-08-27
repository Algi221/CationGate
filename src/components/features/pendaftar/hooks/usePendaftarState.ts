"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { usePPDB, DEMO_TRASHED_APPLICANTS_SEED } from "@/context/PPDBContext";
import Swal from "sweetalert2";
import { Applicant, EditFormState, BSTNode, PendaftarPageTab } from "../types";
import { exportApplicantsToExcel } from "../utils/exportExcel";
import { useSchoolHref } from "@/hooks/useSchoolHref";

function bstInsert(root: BSTNode | null, node: BSTNode): BSTNode {
  if (!root) return node;
  if (node.key < root.key) root.left = bstInsert(root.left, node);
  else root.right = bstInsert(root.right, node);
  return root;
}

function bstSearch(
  root: BSTNode | null,
  query: string,
  results: number[],
): void {
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
    isDemoMode,
  } = usePPDB();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");
  const [gelombangFilter, setGelombangFilter] = useState<string>("ALL");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [receiptModalApplicant, setReceiptModalApplicant] =
    useState<Applicant | null>(null);

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [rejectingApplicantId, setRejectingApplicantId] = useState<
    number | null
  >(null);
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
  const { href } = useSchoolHref();

  const handleTabChange = (tab: PendaftarPageTab) => {
    setTrashError("");
    setTrashSuccess("");
    router.push(href(`/dashboard/pendaftar?tab=${tab}`));
  };

  const fetchTrashedApplicants = useCallback(async () => {
    const isDemo =
      isDemoMode ||
      schoolSlug === "demo" ||
      (typeof window !== "undefined" &&
        window.location.pathname.includes("/demo"));
    if (isDemo) {
      setTrashLoading(false);
      setTrashError("");
      try {
        const local =
          typeof window !== "undefined"
            ? localStorage.getItem("demo_trashed_applicants")
            : null;
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTrashedApplicants(parsed);
            return;
          }
        }
        setTrashedApplicants(DEMO_TRASHED_APPLICANTS_SEED);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "demo_trashed_applicants",
            JSON.stringify(DEMO_TRASHED_APPLICANTS_SEED),
          );
        }
      } catch (_e) {
        setTrashedApplicants(DEMO_TRASHED_APPLICANTS_SEED);
      }
      return;
    }

    try {
      setTrashLoading(true);
      setTrashError("");
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/applicants/trashed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrashedApplicants(data.data);
      } else {
        setTrashError(
          data.message || "Gagal mengambil data pendaftar terhapus",
        );
      }
    } catch (err: unknown) {
      setTrashError(
        err instanceof Error ? err.message : "Terjadi kesalahan koneksi",
      );
    } finally {
      setTrashLoading(false);
    }
  }, [isDemoMode, schoolSlug]);

  const handleRestoreApplicant = async (id: number) => {
    if (isDemoMode || schoolSlug === "demo") {
      try {
        setTrashLoading(true);
        const itemToRestore = trashedApplicants.find((a) => a.id === id);
        const remaining = trashedApplicants.filter((a) => a.id !== id);
        setTrashedApplicants(remaining);
        localStorage.setItem(
          "demo_trashed_applicants",
          JSON.stringify(remaining),
        );

        if (itemToRestore) {
          setApplicants((prev) => [itemToRestore, ...prev]);
        }
        setTrashSuccess("Data calon siswa berhasil dipulihkan (Demo)!");
      } catch (_e) {
        setTrashError("Gagal memulihkan data demo");
      } finally {
        setTrashLoading(false);
      }
      return;
    }

    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/applicants/${id}/restore`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
      setTrashError(
        err instanceof Error ? err.message : "Terjadi kesalahan koneksi",
      );
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
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    if (isDemoMode || schoolSlug === "demo") {
      const remaining = trashedApplicants.filter((a) => a.id !== id);
      setTrashedApplicants(remaining);
      localStorage.setItem(
        "demo_trashed_applicants",
        JSON.stringify(remaining),
      );
      setTrashSuccess(
        "Data calon siswa berhasil dihapus secara permanen (Demo).",
      );
      return;
    }

    try {
      setTrashLoading(true);
      setTrashError("");
      setTrashSuccess("");
      const token = localStorage.getItem("ppdb_admin_token");
      const res = await fetch(`/api/applicants/${id}?permanent=true`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrashSuccess("Data calon siswa berhasil dihapus secara permanen.");
        fetchTrashedApplicants();
      } else {
        setTrashError(data.message || "Gagal menghapus data");
      }
    } catch (err: unknown) {
      setTrashError(
        err instanceof Error ? err.message : "Terjadi kesalahan koneksi",
      );
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
        headers: { Authorization: `Bearer ${token}` },
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
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

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

  const isDemo = isDemoMode || schoolSlug === "demo" || (typeof window !== "undefined" && (window.location.pathname.startsWith("/demo") || window.location.host.startsWith("demo.")));
  const [majorsList, setMajorsList] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_majors_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((m: { title?: string; name?: string }) => m.title || m.name || "").filter(Boolean);
          }
        } catch (_) {}
      }
    }
    return isDemo ? [
      "Rekayasa Perangkat Lunak",
      "Teknik Jaringan Komputer & Telekomunikasi",
      "Desain Komunikasi Visual",
      "Broadcasting & Perfilman",
      "Teknik Elektronika",
      "Animasi",
    ] : [];
  });

  useEffect(() => {
    const isDemoEnv = isDemo;
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
        if (json.success && json.data?.ppdb_majors_config && Array.isArray(json.data.ppdb_majors_config)) {
          const list = json.data.ppdb_majors_config
            .map((m: { title?: string; name?: string }) => m.title || m.name || "")
            .filter(Boolean);
          setMajorsList(list);
        } else if (!isDemoEnv) {
          setMajorsList([]);
        }
      } catch (_e) {}
    };
    fetchConfig();
  }, [schoolSlug, isDemoMode]);

  const bstRoot = useMemo(() => {
    let root: BSTNode | null = null;
    applicants.forEach((a: Applicant) => {
      root = bstInsert(root, {
        key: buildKey(a),
        id: a.id,
        left: null,
        right: null,
      });
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
      const isTransfer = Boolean(
        (a.diterima_kelas &&
          (a.diterima_kelas.includes("XI") ||
            a.diterima_kelas.includes("XII"))) ||
        a.is_pindahan ||
        a.tipe_pendaftar === "PINDAHAN" ||
        a.jalur_pendaftaran === "PINDAHAN" ||
        a.pindahan_dari ||
        a.pindahanDari,
      );
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
        (genderFilter === "L" &&
          (a.jenis_kelamin || a.jenisKelamin || "")
            .toLowerCase()
            .startsWith("l")) ||
        (genderFilter === "P" &&
          (a.jenis_kelamin || a.jenisKelamin || "")
            .toLowerCase()
            .startsWith("p"));

      const isCashTU =
        a.metode_pembayaran === "Bayar Tunai di TU (Cash)" ||
        a.metode_pembayaran === "Tunai di TU" ||
        a.metode_pembayaran === "tu";
      const isBankTransfer =
        a.metode_pembayaran === "Transfer Manual" ||
        a.metode_pembayaran === "transfer" ||
        (!isCashTU && !!a.bukti_bayar);
      const isLunas =
        a.status_pembayaran === "LUNAS" ||
        a.status_pembayaran === "PAID" ||
        a.status === "Approved";

      const matchesPayment =
        paymentFilter === "ALL" ||
        (paymentFilter === "TU" && isCashTU) ||
        (paymentFilter === "TRANSFER" && isBankTransfer) ||
        (paymentFilter === "LUNAS" && isLunas) ||
        (paymentFilter === "UNPAID" && !isLunas);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMajor &&
        matchesGelombang &&
        matchesGender &&
        matchesPayment
      );
    });
  }, [
    applicants,
    activePageTab,
    bstMatchedIds,
    statusFilter,
    majorFilter,
    gelombangFilter,
    genderFilter,
    paymentFilter,
  ]);

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplicants.length / itemsPerPage),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedApplicants = useMemo(() => {
    return filteredApplicants.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredApplicants, currentPage, itemsPerPage]);

  const handleExport = () => {
    exportApplicantsToExcel(applicants, isDemoMode);
  };

  const handleConfirmPayment = async (applicantId: number) => {
    const applicant = applicants.find((a: Applicant) => a.id === applicantId);
    try {
      const res = await updateApplicant(applicantId, {
        status_pembayaran: "LUNAS",
        status: "Approved",
        verified_by: "Petugas Kasir TU",
        bukti_bayar_verified: true,
      });
      if (res?.success) {
        addToast(
          "Pembayaran Dikonfirmasi",
          `Pembayaran formulir ${applicant?.nama || "#" + applicantId} telah diverifikasi Lunas.`,
          "success",
        );
      }
    } catch (err) {
      console.error("Confirm payment error:", err);
    }
  };

  const handleTogglePhysicalDoc = async (a: Applicant) => {
    const token = localStorage.getItem("ppdb_token");
    const targetState = !a.physical_doc_verified;
    try {
      const res = await fetch(`/api/applicants/${a.id}/physical-doc`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verified: targetState }),
      });
      const data = await res.json();
      if (data.success) {
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === a.id
              ? {
                  ...app,
                  physical_doc_verified: targetState,
                  physical_doc_verified_by: "Admin TU",
                  physical_doc_verified_at: new Date().toISOString(),
                }
              : app,
          ),
        );
        addToast(
          targetState ? "Berkas Diterima" : "Berkas Dibatalkan",
          `Status berkas fisik ${a.nama} berhasil diperbarui.`,
          "success",
        );
      }
    } catch (err: unknown) {
      console.error("Physical doc update error:", err);
      // Fallback local update
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === a.id
            ? {
                ...app,
                physical_doc_verified: targetState,
                physical_doc_verified_by: "Admin TU",
              }
            : app,
        ),
      );
      addToast(
        targetState ? "Berkas Diterima (Lokal)" : "Berkas Dibatalkan (Lokal)",
        `Status berkas fisik ${a.nama} diperbarui di sesi lokal.`,
        "info",
      );
    }
  };

  const handleChecklistChange = async (
    applicantId: number,
    newChecklist: Record<string, boolean>,
  ) => {
    try {
      const token =
        localStorage.getItem("ppdb_token") ||
        localStorage.getItem("ppdb_admin_token");
      setSelectedApplicant((prev) =>
        prev && prev.id === applicantId
          ? { ...prev, physical_docs_checklist: newChecklist }
          : prev,
      );
      const allChecked = ["ijazah", "kk", "ktp_ortu", "akta", "foto"].every(
        (k) => newChecklist[k] === true,
      );
      const res = await fetch(`/api/applicants/${applicantId}/physical-doc`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ checklist: newChecklist, verified: allChecked }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApplicant((prev) =>
          prev && prev.id === applicantId
            ? {
                ...prev,
                physical_doc_verified:
                  data.data?.physical_doc_verified ?? allChecked,
                physical_doc_verified_by:
                  data.data?.physical_doc_verified_by ?? "Admin TU",
                physical_docs_checklist: newChecklist,
              }
            : prev,
        );
        setApplicants((prev: Applicant[]) =>
          prev.map((item) =>
            item.id === applicantId
              ? {
                  ...item,
                  physical_doc_verified:
                    data.data?.physical_doc_verified ?? allChecked,
                  physical_doc_verified_by:
                    data.data?.physical_doc_verified_by ?? "Admin TU",
                  physical_docs_checklist: newChecklist,
                }
              : item,
          ),
        );
      }
    } catch (err: unknown) {
      console.error("Gagal update checklist berkas fisik:", err);
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
    paymentFilter,
    setPaymentFilter,
    receiptModalApplicant,
    setReceiptModalApplicant,
    handleConfirmPayment,
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
    handlePermanentDeleteApplicant,
  };
}
