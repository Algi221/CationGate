"use client";

import { useState } from "react";
import { RevisionLog } from "../types";
import { formatRevisionDate } from "../utils/kelolaUIHelpers";

interface UseKelolaUIRevisionsProps {
  slug: string;
  adminToken?: string | null;
  draftKey: string;
  showToastMsg: (message: string, type?: "success" | "error" | "info") => void;
  fetchCurrentConfig: () => Promise<void>;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useKelolaUIRevisions({
  slug,
  adminToken,
  draftKey,
  showToastMsg,
  fetchCurrentConfig,
  setSaving,
}: UseKelolaUIRevisionsProps) {
  const [revisions, setRevisions] = useState<RevisionLog[]>([]);

  const fetchRevisions = async () => {
    try {
      const token =
        adminToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem("ppdb_admin_token")
          : null);
      const url = slug
        ? `/api/config/revisions?school_slug=${encodeURIComponent(slug)}&_t=${Date.now()}`
        : `/api/config/revisions?_t=${Date.now()}`;
      const res = await fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.success) {
        setRevisions(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil riwayat perubahan:", e);
    }
  };

  const handleRestore = async (revId: string | number) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin memulihkan semua konfigurasi UI ke versi riwayat #${revId}?`,
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      const token =
        adminToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem("ppdb_admin_token")
          : null);
      const res = await fetch("/api/config/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ revisionId: revId }),
      });

      const json = await res.json();
      if (json.success) {
        showToastMsg(`Sukses memulihkan tampilan ke versi #${revId}!`);
        localStorage.removeItem(draftKey);
        await fetchCurrentConfig();
        await fetchRevisions();
      } else {
        showToastMsg(json.message || "Gagal melakukan pemulihan.", "error");
      }
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal menghubungi server.", "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    revisions,
    setRevisions,
    fetchRevisions,
    handleRestore,
    formatDate: formatRevisionDate,
  };
}
