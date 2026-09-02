"use client";

import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { Applicant } from "../types";
import { DEMO_TRASHED_APPLICANTS_SEED } from "@/context/PPDBContext";

interface UsePendaftarTrashProps {
  isDemoMode?: boolean;
  schoolSlug: string;
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  fetchAdminApplicants?: () => Promise<void>;
}

export function usePendaftarTrash({
  isDemoMode,
  schoolSlug,
  setApplicants,
  fetchAdminApplicants,
}: UsePendaftarTrashProps) {
  const [trashedApplicants, setTrashedApplicants] = useState<Applicant[]>([]);
  const [trashLoading, setTrashLoading] = useState<boolean>(false);
  const [trashError, setTrashError] = useState<string>("");
  const [trashSuccess, setTrashSuccess] = useState<string>("");

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

  return {
    trashedApplicants,
    trashLoading,
    trashError,
    trashSuccess,
    setTrashError,
    setTrashSuccess,
    fetchTrashedApplicants,
    handleRestoreApplicant,
    handlePermanentDeleteApplicant,
  };
}
