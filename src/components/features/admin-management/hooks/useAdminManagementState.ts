"use client";

import { useEffect, useState, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { AdminItem } from "../types";
import { useSchoolHref } from "@/hooks/useSchoolHref";

export function useAdminManagementState() {
  const { adminUser, adminToken, schoolId, isDemoMode } = usePPDB();
  const router = useRouter();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";
  const { href } = useSchoolHref();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "admin";
  const activeTab = activeTabParam as "admin" | "trash";

  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editAdminId, setEditAdminId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nama_lengkap: "",
    role: "admin"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [trashedAdmins, setTrashedAdmins] = useState<AdminItem[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);

  const [isPro, setIsPro] = useState(true);

  useEffect(() => {
    if (isDemoMode || schoolSlug === "demo") {
      setIsPro(true);
      return;
    }
    const checkSub = async () => {
      try {
        const query = schoolId ? `school_id=${schoolId}` : `slug=${schoolSlug}`;
        const res = await fetch(`/api/saas/subscription-status?${query}`);
        const data = await res.json();
        if (data.success && data.data) {
          const plan = data.data.plan;
          const isPaid = plan === "PRO_YEARLY" || plan === "PRO_750K" || plan === "PRO" || data.data.status === "ACTIVE" || !data.data.isExpired;
          setIsPro(isPaid);
        } else {
          setIsPro(true);
        }
      } catch (_e) {
        setIsPro(true);
      }
    };
    checkSub();
  }, [schoolId, schoolSlug, isDemoMode]);

  const handleTabChange = (tab: "admin" | "trash") => {
    setError("");
    setSuccessMsg("");
    router.push(href(`/dashboard/admin?tab=${tab}`));
  };

  const fetchAdmins = useCallback(
    async (showSpinner = false) => {
      const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "");
      if (!token) return;
      try {
        if (showSpinner) setLoading(true);
        setError("");
        const query = schoolSlug ? `?school_id=${encodeURIComponent(schoolSlug)}` : "";
        const res = await fetch(`/api/admin/users${query}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setAdmins(data.data || []);
        } else {
          setError(data.message || "Gagal mengambil data admin");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data admin");
      } finally {
        setLoading(false);
      }
    },
    [adminToken, schoolSlug]
  );

  const fetchTrashedAdmins = useCallback(async () => {
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "");
    if (!token) return;
    try {
      setTrashLoading(true);
      setError("");
      const query = schoolSlug ? `?school_id=${encodeURIComponent(schoolSlug)}` : "";
      const res = await fetch(`/api/admin/users/trashed${query}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTrashedAdmins(data.data || []);
      } else {
        setError(data.message || "Gagal mengambil data sampah admin");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data sampah admin");
    } finally {
      setTrashLoading(false);
    }
  }, [adminToken, schoolSlug]);

  useEffect(() => {
    if (!adminUser) return;
    if (adminUser.role !== "superadmin") {
      router.push(href("/dashboard"));
      return;
    }
    fetchAdmins();
  }, [adminUser, router, href, fetchAdmins]);

  useEffect(() => {
    if (activeTab === "trash") {
      fetchTrashedAdmins();
    }
  }, [activeTab, fetchTrashedAdmins]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "");
    if (!token) return;

    if (admins.length >= 5) {
      Swal.fire({
        title: "Batas Kuota Admin Tercapai 🔒",
        text: "Maksimal 5 akun admin panitia per instansi sekolah pada paket Pro. Silakan hapus atau nonaktifkan admin lama untuk menambahkan akun baru.",
        icon: "warning",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const query = schoolSlug ? `?school_id=${encodeURIComponent(schoolSlug)}` : "";
      const res = await fetch(`/api/admin/users${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Akun admin baru berhasil dibuat!");
        setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
        setShowAddForm(false);
        fetchAdmins();
        Swal.fire({
          title: "Admin Berhasil Ditambahkan!",
          text: `Akun panitia ${formData.nama_lengkap} aktif.`,
          icon: "success",
          confirmButtonColor: "#2563EB"
        });
      } else {
        setError(data.message || "Gagal membuat akun admin");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun admin");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (admin: AdminItem) => {
    setEditAdminId(admin.id);
    setFormData({
      username: admin.username,
      password: "",
      nama_lengkap: admin.nama_lengkap,
      role: admin.role
    });
    setShowAddForm(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "");
    if (!token || !editAdminId) return;

    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const payload: Record<string, string> = {
        username: formData.username,
        nama_lengkap: formData.nama_lengkap,
        role: formData.role
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const query = schoolSlug ? `?school_id=${encodeURIComponent(schoolSlug)}` : "";
      const res = await fetch(`/api/admin/users/${editAdminId}${query}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Data admin berhasil diperbarui!");
        setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
        setShowAddForm(false);
        setEditAdminId(null);
        fetchAdmins();
        Swal.fire({
          title: "Berhasil Diperbarui!",
          text: "Informasi admin telah diperbarui.",
          icon: "success",
          confirmButtonColor: "#2563EB"
        });
      } else {
        setError(data.message || "Gagal memperbarui data admin");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui data admin");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number, nama: string) => {
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "");
    if (!token) return;

    Swal.fire({
      title: "Hapus Akun Admin?",
      text: `Akun admin ${nama} akan dipindahkan ke sampah.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const query = schoolSlug ? `?school_id=${encodeURIComponent(schoolSlug)}` : "";
          const res = await fetch(`/api/admin/users/${id}${query}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setSuccessMsg("Akun admin berhasil dipindahkan ke sampah.");
            fetchAdmins();
            if (activeTab === "trash") fetchTrashedAdmins();
          } else {
            setError(data.message || "Gagal menghapus admin");
          }
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Gagal menghapus admin");
        }
      }
    });
  };

  const handleRestoreAdmin = async (id: number) => {
    const token = adminToken || (typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "");
    if (!token) return;

    try {
      const query = schoolSlug ? `?school_id=${encodeURIComponent(schoolSlug)}` : "";
      const res = await fetch(`/api/admin/users/${id}/restore${query}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Akun admin berhasil dipulihkan!");
        fetchTrashedAdmins();
        fetchAdmins();
        Swal.fire({
          title: "Akun Dipulihkan!",
          text: "Admin telah diaktifkan kembali.",
          icon: "success",
          confirmButtonColor: "#2563EB"
        });
      } else {
        setError(data.message || "Gagal memulihkan admin");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memulihkan admin");
    }
  };

  return {
    adminUser,
    activeTab,
    handleTabChange,
    admins,
    loading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    showAddForm,
    setShowAddForm,
    editAdminId,
    setEditAdminId,
    formData,
    setFormData,
    formLoading,
    showPassword,
    setShowPassword,
    trashedAdmins,
    trashLoading,
    isPro,
    handleAddAdmin,
    handleEditClick,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleRestoreAdmin
  };
}
