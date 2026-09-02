"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { Applicant, BSTNode, PendaftarPageTab } from "../types";
import { exportApplicantsToExcel } from "../utils/exportExcel";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import {
  bstInsert,
  bstSearch,
  buildKey,
} from "../utils/pendaftarBstSearch";
import { usePendaftarTrash } from "./usePendaftarTrash";
import { usePendaftarEditModal } from "./usePendaftarEditModal";

export function usePendaftarState() {
  const {
    applicants,
    setApplicants,
    verifyApplicant,
    rejectApplicant,
    deleteApplicant,
    updateApplicant,
    generateDummyApplicants,
    fetchAdminApplicants,
    addToast,
    isDemoMode,
  } = usePPDB();

  const [isDummyModalOpen, setIsDummyModalOpen] = useState<boolean>(false);
  const [isGeneratingDummy, setIsGeneratingDummy] = useState<boolean>(false);

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

  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";
  const { href } = useSchoolHref();

  // Sub-hook: Trash management
  const {
    trashedApplicants,
    trashLoading,
    trashError,
    trashSuccess,
    setTrashError,
    setTrashSuccess,
    fetchTrashedApplicants,
    handleRestoreApplicant,
    handlePermanentDeleteApplicant,
  } = usePendaftarTrash({
    isDemoMode,
    schoolSlug,
    setApplicants,
    fetchAdminApplicants,
  });

  const handleTabChange = (tab: PendaftarPageTab) => {
    setTrashError("");
    setTrashSuccess("");
    router.push(href(`/dashboard/pendaftar?tab=${tab}`));
  };

  useEffect(() => {
    if (activePageTab === "trash") {
      fetchTrashedApplicants();
    }
  }, [activePageTab, fetchTrashedApplicants]);

  useEffect(() => {
    if (typeof fetchAdminApplicants === "function") {
      fetchAdminApplicants();
    }
  }, [fetchAdminApplicants, schoolSlug]);

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

  // Sub-hook: Edit modal form
  const {
    editApplicant,
    setEditApplicant,
    editForm,
    setEditForm,
    isSaving,
    openEdit,
    handleEditSave,
  } = usePendaftarEditModal({
    updateApplicant,
  });

  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const isDemo =
    isDemoMode ||
    schoolSlug === "demo" ||
    (typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/demo") ||
        window.location.host.startsWith("demo.")));

  const [majorsList, setMajorsList] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_majors_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
              .map(
                (m: { title?: string; name?: string }) =>
                  m.title || m.name || "",
              )
              .filter(Boolean);
          }
        } catch (_) {}
      }
    }
    return isDemo
      ? [
          "Rekayasa Perangkat Lunak",
          "Teknik Jaringan Komputer & Telekomunikasi",
          "Desain Komunikasi Visual",
          "Broadcasting & Perfilman",
          "Teknik Elektronika",
          "Animasi",
        ]
      : [];
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
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        let configMajors = json.data?.ppdb_majors_config;
        if (typeof configMajors === "string") {
          try {
            configMajors = JSON.parse(configMajors);
            if (typeof configMajors === "string")
              configMajors = JSON.parse(configMajors);
          } catch (_) {}
        }
        if (
          json.success &&
          Array.isArray(configMajors) &&
          configMajors.length > 0
        ) {
          const list = configMajors
            .map(
              (m: { title?: string; name?: string; code?: string }) =>
                m.title || m.name || m.code || "",
            )
            .filter(Boolean);
          setMajorsList(list);
          try {
            localStorage.setItem(
              "ppdb_majors_config",
              JSON.stringify(configMajors),
            );
          } catch (_) {}
        } else if (!isDemoEnv) {
          setMajorsList([]);
        }
      } catch (_e) {}
    };
    fetchConfig();
  }, [schoolSlug, isDemoMode, isDemo]);

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

  const handleGenerateDummy = async (
    count: number = 5,
    statusPreference: string = "random",
  ) => {
    setIsGeneratingDummy(true);
    try {
      await generateDummyApplicants(count, statusPreference);
      setIsDummyModalOpen(false);
    } catch (err) {
      console.error("Failed to generate dummy applicants:", err);
    } finally {
      setIsGeneratingDummy(false);
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
    isDummyModalOpen,
    setIsDummyModalOpen,
    isGeneratingDummy,
    handleGenerateDummy,
  };
}
