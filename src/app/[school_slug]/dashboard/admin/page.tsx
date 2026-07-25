"use client";

import { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Plus, Trash2, Edit3, User, KeyRound, Eye, EyeOff, Save, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';


function AdminManagementPageContent() {
  const { adminUser, adminToken } = usePPDB();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "admin";
  const activeTab = activeTabParam as "admin" | "ysbmo" | "trash";

  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAdminId, setEditAdminId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ username: "", password: "", nama_lengkap: "", role: "admin" });
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [trashedAdmins, setTrashedAdmins] = useState<any[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [ysbmoStaff, setYsbmoStaff] = useState<any[]>([]);
  const [ysbmoLoading, setYsbmoLoading] = useState(false);
  const [ysbmoError, setYsbmoError] = useState("");
  const [ysbmoTokenInput, setYsbmoTokenInput] = useState("");
  const [showYsbmoTokenForm, setShowYsbmoTokenForm] = useState(false);

  const handleTabChange = (tab: "admin" | "ysbmo" | "trash") => {
    setError("");
    setSuccessMsg("");
    router.push(`/dashboard/admin?tab=${tab}`);
  };

  const getBackendUrl = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof window !== 'undefined') return `/api`;
    return '/api';
  };

  useEffect(() => {
    if (!adminUser) return;
    // Hanya superadmin yang boleh masuk halaman ini
    if (adminUser.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }
    fetchAdmins();
  }, [adminUser, adminToken, router]);

  const fetchAdmins = async () => {
    if (!adminToken) return;
    try {
      setLoading(true);
      setError("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        setError(data.message || 'Gagal mengambil data admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ysbmo" && ysbmoStaff.length === 0) {
      fetchYsbmoStaff();
    } else if (activeTab === "trash") {
      fetchTrashedAdmins();
    }
  }, [activeTab, adminToken]);

  async function fetchYsbmoStaff(manualToken?: string) {
    if (!adminToken) return;
    try {
      setYsbmoLoading(true);
      setYsbmoError("");
      const backendUrl = getBackendUrl();
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${adminToken}`
      };
      if (manualToken) {
        headers['X-YSBMO-Token'] = manualToken;
      }
      
      const res = await fetch(`${backendUrl}/api/admin/users/ysbmo/staff`, {
        headers
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Handle both nested data array or direct array
        const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        setYsbmoStaff(list);
        setShowYsbmoTokenForm(false);
        if (manualToken) {
          setSuccessMsg("Token YSBMO berhasil disimpan dan data berhasil dimuat!");
        }
      } else {
        if (data.code === 'NO_TOKEN') {
          setShowYsbmoTokenForm(true);
        } else {
          setYsbmoError(data.message || 'Gagal mengambil data staff YSBMO');
        }
      }
    } catch (err: any) {
      setYsbmoError(err.message);
    } finally {
      setYsbmoLoading(false);
    }
  };

  const handleSaveYsbmoToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ysbmoTokenInput.trim()) return;
    await fetchYsbmoStaff(ysbmoTokenInput);
  };

  const handleMakeAdmin = async (staff: any) => {
    if (!adminToken) return;
    const usernameVal = staff.id || staff.username || "";
    const nameVal = staff.text || staff.full_name || staff.nama_lengkap || "";
    if (!usernameVal || !nameVal) {
      setError("Data staff YSBMO tidak memiliki Username atau Nama Lengkap.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          username: usernameVal,
          nama_lengkap: nameVal,
          password: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2), // dynamic random bypass password
          role: "admin"
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Berhasil mendaftarkan ${nameVal} sebagai Admin PPDB!`);
        fetchAdmins(); // Refresh admin list
      } else {
        setError(data.message || 'Gagal mendaftarkan staff YSBMO sebagai admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil ditambahkan!");
        setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
        setShowAddForm(false);
        fetchAdmins();
      } else {
        setError(data.message || 'Gagal membuat admin baru');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleStartEdit = (admin: any) => {
    setEditAdminId(admin.id);
    setFormData({
      username: admin.username,
      password: "", // Kosongkan password kecuali ingin diganti
      nama_lengkap: admin.nama_lengkap,
      role: admin.role || "admin"
    });
    setError("");
    setSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setEditAdminId(null);
    setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdminId || !adminToken) return;

    try {
      setFormLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${editAdminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Data admin berhasil diperbarui!");
        setEditAdminId(null);
        setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
        fetchAdmins();
      } else {
        setError(data.message || 'Gagal memperbarui data admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menghapus admin ini secara permanen?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;
    if (!adminToken) return;
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil dihapus.");
        fetchAdmins();
      } else {
        setError(data.message || 'Gagal menghapus admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function fetchTrashedAdmins() {
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/trashed`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTrashedAdmins(data.data);
      }
    } catch (err: any) {
      console.error("Gagal mengambil data sampah:", err.message);
    } finally {
      setTrashLoading(false);
    }
  };

  const handleRestoreAdmin = async (id: number) => {
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil dipulihkan!");
        fetchTrashedAdmins();
        fetchAdmins();
      } else {
        setError(data.message || "Gagal memulihkan admin.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTrashLoading(false);
    }
  };

  const handlePermanentDeleteAdmin = async (id: number) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menghapus admin ini secara PERMANEN? Tindakan ini tidak dapat dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      setError("");
      setSuccessMsg("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}?permanent=true`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Admin berhasil dihapus secara permanen.");
        fetchTrashedAdmins();
      } else {
        setError(data.message || "Gagal menghapus admin secara permanen.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTrashLoading(false);
    }
  };


  if (!adminUser || adminUser.role !== 'superadmin') {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Shield className="text-emerald-500" size={28} />
            Manajemen Admin
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola hak akses, perbarui profil, hapus, dan atur peran (role) panitia PPDB.
          </p>
        </div>
        
        {!editAdminId && activeTab === "admin" && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setError("");
              setSuccessMsg("");
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              showAddForm 
                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 shadow-sm'
            }`}
          >
            {showAddForm ? 'Batal' : <><Plus size={16} /> Tambah Admin Baru</>}
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => handleTabChange("admin")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "admin"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Manajemen Akun Admin
        </button>
        <button
          onClick={() => handleTabChange("ysbmo")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "ysbmo"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Data Staff & Guru YSBMO
        </button>
        <button
          onClick={() => handleTabChange("trash")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "trash"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Trash2 size={15} />
          Sampah / Akun Dihapus
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-600 rounded-xl text-sm font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      {activeTab === "admin" && (
        <>
          <AnimatePresence>
            {/* Form Tambah Admin */}
            {showAddForm && !editAdminId && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddAdmin}
                className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Buat Akun Panitia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={formData.nama_lengkap}
                        onChange={e => setFormData({ ...formData, nama_lengkap: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        placeholder="Contoh: Budi Santoso"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        placeholder="Contoh: panitia_budi"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Password</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Peran (Role)</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    >
                      <option value="admin">Admin Biasa</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  >
                    {formLoading ? 'Menyimpan...' : 'Simpan Admin'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Form Edit Admin */}
            {editAdminId !== null && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleUpdateAdmin}
                className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Akun Panitia</h3>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-250"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={formData.nama_lengkap}
                        onChange={e => setFormData({ ...formData, nama_lengkap: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Peran (Role)</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    >
                      <option value="admin">Admin Biasa</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {formLoading ? 'Memperbarui...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Memuat data admin...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nama / Username</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{admin.nama_lengkap}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-mono">@{admin.username}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            admin.role === 'superadmin' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleStartEdit(admin)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all inline-flex"
                            title="Edit Admin"
                          >
                            <Edit3 size={16} />
                          </button>
                          
                          {admin.username !== adminUser.username && (
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all inline-flex"
                              title="Hapus Admin"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    
                    {admins.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                          Tidak ada data admin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "ysbmo" && (
        <>
          {/* Form Input Token YSBMO Manual */}
          {showYsbmoTokenForm && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSaveYsbmoToken}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Otentikasi API YSBMO Diperlukan</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Token YSBMO tidak ditemukan atau telah kedaluwarsa. Silakan masukkan token Authorization (Basic Auth) Anda untuk melanjutkan sinkronisasi data staff.
              </p>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Token Authorization / Basic Auth Value</label>
                <input
                  type="text"
                  required
                  value={ysbmoTokenInput}
                  onChange={e => setYsbmoTokenInput(e.target.value)}
                  placeholder="Basic To/WbnZk0DNtT1PJAOOaz+HdrU5eQQjBZbQHy..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={ysbmoLoading}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {ysbmoLoading ? "Menyimpan..." : "Simpan Token & Hubungkan"}
              </button>
            </motion.form>
          )}

          {ysbmoError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
              {ysbmoError}
            </div>
          )}

          {!showYsbmoTokenForm && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              {ysbmoLoading ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Memuat data staff YSBMO...</div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Staff/Guru YSBMO: {ysbmoStaff.length}</span>
                    <button
                      onClick={() => {
                        setShowYsbmoTokenForm(true);
                        setYsbmoTokenInput("");
                      }}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      Update Token Manual
                    </button>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nama / ID Guru</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Sekolah / Unit</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {ysbmoStaff.map((staff, idx) => {
                        const name = staff.text || staff.full_name || staff.nama_lengkap || staff.name || staff.nama || "-";
                        const username = staff.id || staff.username || staff.user_name || staff.nip || "-";
                        const schoolName = staff.nama_sekolah || staff.school_name || "-";
                        const schoolId = staff.id_school || staff.school_id || "-";
                        
                        const isLocalAdmin = admins.some(a => a.username === username);

                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 dark:text-white">{name}</div>
                              <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-mono">@{username}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-slate-700 dark:text-slate-300 font-semibold">{schoolName}</div>
                              <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">ID Unit: {schoolId}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isLocalAdmin ? (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200/40 dark:border-emerald-800/40 font-bold">
                                  Terdaftar Admin
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleMakeAdmin(staff)}
                                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-sm"
                                >
                                  Jadikan Admin
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {ysbmoStaff.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                            Tidak ada data staff YSBMO ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "trash" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {trashLoading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Memuat data sampah...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nama / Username</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {trashedAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-white">{admin.nama_lengkap}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-mono">@{admin.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          admin.role === 'superadmin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleRestoreAdmin(admin.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
                          title="Pulihkan Admin"
                        >
                          <RotateCcw size={14} />
                          Pulihkan
                        </button>
                        
                        <button
                          onClick={() => handlePermanentDeleteAdmin(admin.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-650 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-450 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
                          title="Hapus Permanen"
                        >
                          <Trash2 size={14} />
                          Hapus Permanen
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {trashedAdmins.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
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
    </div>
  );
}

export default function AdminManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat halaman manajemen admin...</div>}>
      <AdminManagementPageContent />
    </Suspense>
  );
}
