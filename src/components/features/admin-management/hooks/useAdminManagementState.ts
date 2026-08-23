"use client";

import { useEffect, useState, useCallback } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { AdminItem } from "../types";

export function useAdminManagementState() {
  const { adminUser, adminToken } = usePPDB();
  const router = useRouter();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";
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

  const [currentPlan] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ppdb_school_plan") || "FREE_PLAN";
    }
    return "FREE_PLAN";
  });

  const isPro = currentPlan !== "FREE_PLAN";

  const handleTabChange = (tab: "admin" | "trash") => {
    setError("");
    setSuccessMsg("");
    router.push(`/${schoolSlug}/dashboard/admin?tab=${tab}`);
  };

  const getBackendUrl = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof window !== "undefined") return `/api`;
    return "/api";
  };

  const fetchAdmins = useCallback(
    async (showSpinner = false) => {
      if (!adminToken) return;
      try {
        if (showSpinner) setLoading(true);
        setError("");
        const backendUrl = getBackendUrl();
        const res = await fetch(`${backendUrl}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
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
    [adminToken]
  );

  const fetchTrashedAdmins = useCallback(async () => {
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      setError("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/trashed`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
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
  }, [adminToken]);

  useEffect(() => {
    if (!adminUser) return;
    if (adminUser.role !== "superadmin") {
      router.push(`/${schoolSlug}/dashboard`);
      return;
    }
    fetchAdmins();
  }, [adminUser, router, schoolSlug, fetchAdmins]);

  useEffect(() => {
    if (activeTab === "trash") {
      fetchTrashedAdmins();
    }
  }, [activeTab, fetchTrashedAdmins]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
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
    if (!adminToken || !editAdminId) return;

    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const payload: Record<string, string> = {
        username: formData.username,
        nama_lengkap: formData.nama_lengkap,
        role: formData.role
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(`${backendUrl}/api/admin/users/${editAdminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
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
    if (!adminToken) return;

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
          const backendUrl = getBackendUrl();
          const res = await fetch(`${backendUrl}/api/admin/users/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${adminToken}`
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
    if (!adminToken) return;

    try {
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}/restore`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`
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
