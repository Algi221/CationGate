"use client";

import { useEffect, useState, Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Plus, Trash2, Edit3, User, KeyRound, Eye, EyeOff, Save, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';

function AdminManagementPageContent() {
  const { adminUser, adminToken } = usePPDB();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "admin";
  const activeTab = activeTabParam as "admin" | "trash";

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

  const handleTabChange = (tab: "admin" | "trash") => {
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
    if (adminUser.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }
    fetchAdmins();
  }, [adminUser, adminToken, router]);

  useEffect(() => {
    if (activeTab === "trash") {
      fetchTrashedAdmins();
    }
  }, [activeTab, adminToken]);

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
        setAdmins(data.data || []);
      } else {
        setError(data.message || 'Gagal mengambil data admin');
      }
    } catch (err: any) {
      setError(err.message);
    } fontInMem: false; finally {
      setLoading(false);
    }
  };

  const fetchTrashedAdmins = async () => {
    if (!adminToken) return;
    try {
      setTrashLoading(true);
      setError("");
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/trashed`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTrashedAdmins(data.data || []);
      } else {
        setError(data.message || 'Gagal mengambil data sampah admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTrashLoading(false);
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
        setError(data.message || 'Gagal membuat akun admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (admin: any) => {
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
      const payload: any = {
        username: formData.username,
        nama_lengkap: formData.nama_lengkap,
        role: formData.role
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(`${backendUrl}/api/admin/users/${editAdminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
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
        setError(data.message || 'Gagal memperbarui data admin');
      }
    } catch (err: any) {
      setError(err.message);
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
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setSuccessMsg("Akun admin berhasil dipindahkan ke sampah.");
            fetchAdmins();
            if (activeTab === "trash") fetchTrashedAdmins();
          } else {
            setError(data.message || 'Gagal menghapus admin');
          }
        } catch (err: any) {
          setError(err.message);
        }
      }
    });
  };

  const handleRestoreAdmin = async (id: number) => {
    if (!adminToken) return;

    try {
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/admin/users/${id}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
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
        setError(data.message || 'Gagal memulihkan admin');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Kelola Akun Admin Sekolah</h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Tambah, edit, dan kelola staf panitia atau admin sekolah yang berhak mengakses dashboard instansi.
            </p>
          </div>
        </div>

        {activeTab === "admin" && (
          <button
            onClick={() => {
              if (showAddForm) {
                setShowAddForm(false);
                setEditAdminId(null);
                setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
              } else {
                setShowAddForm(true);
                setEditAdminId(null);
                setFormData({ username: "", password: "", nama_lengkap: "", role: "admin" });
              }
              setError("");
              setSuccessMsg("");
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
              showAddForm 
                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
            }`}
          >
            {showAddForm ? 'Batal Form' : <><Plus size={16} /> Tambah Admin Baru</>}
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => handleTabChange("admin")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "admin"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Manajemen Akun Admin ({admins.length})
        </button>
        <button
          onClick={() => handleTabChange("trash")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "trash"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Trash2 size={15} />
          Sampah / Akun Dihapus ({trashedAdmins.length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-bold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-xs font-bold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      {activeTab === "admin" && (
        <>
          <AnimatePresence>
            {/* Form Tambah / Edit Admin */}
            {showAddForm && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={editAdminId ? handleUpdateAdmin : handleAddAdmin}
                className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  {editAdminId ? "Edit Akun Admin / Panitia" : "Buat Akun Panitia Baru"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Nama Lengkap Staff</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={formData.nama_lengkap}
                        onChange={e => setFormData({ ...formData, nama_lengkap: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="Contoh: Budi Santoso, S.Pd"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Username Login</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="Contoh: admin_budi"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
                      Password {editAdminId && "(Kosongkan jika tidak ingin mengubah)"}
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required={!editAdminId}
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl pl-10 pr-10 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Peran / Hak Akses</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="admin">Admin Staff (Akses Pendaftaran & Data)</option>
                      <option value="superadmin">Superadmin Sekolah (Akses Penuh)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditAdminId(null);
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-blue-500/20"
                  >
                    <Save size={16} />
                    {formLoading ? "Menyimpan..." : (editAdminId ? "Simpan Perubahan" : "Buat Akun")}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Table Active Admins */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold text-xs">Memuat daftar admin sekolah...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-extrabold uppercase tracking-wider">Nama Lengkap / Username</th>
                      <th className="px-6 py-4 font-extrabold uppercase tracking-wider">Hak Akses</th>
                      <th className="px-6 py-4 font-extrabold uppercase tracking-wider">Tgl Dibuat</th>
                      <th className="px-6 py-4 font-extrabold uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {admins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-slate-800 dark:text-white">{adm.nama_lengkap}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono mt-0.5">@{adm.username}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            adm.role === 'superadmin' 
                              ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900' 
                              : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                          }`}>
                            {adm.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {adm.created_at ? new Date(adm.created_at).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(adm)}
                              className="p-1.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                              title="Edit Admin"
                            >
                              <Edit3 size={16} />
                            </button>
                            {adm.id !== adminUser?.id && (
                              <button
                                onClick={() => handleDeleteAdmin(adm.id, adm.nama_lengkap)}
                                className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                title="Hapus Akun"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {admins.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                          Belum ada akun admin sekolah terdaftar.
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

      {activeTab === "trash" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          {trashLoading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold text-xs">Memuat sampah admin...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-extrabold uppercase tracking-wider">Nama Lengkap / Username</th>
                    <th className="px-6 py-4 font-extrabold uppercase tracking-wider">Hak Akses</th>
                    <th className="px-6 py-4 font-extrabold uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {trashedAdmins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-800 dark:text-white line-through opacity-70">{adm.nama_lengkap}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">@{adm.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400">
                          {adm.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRestoreAdmin(adm.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:hover:bg-blue-950/70 dark:text-blue-400 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
                        >
                          <RotateCcw size={14} /> Pulihkan
                        </button>
                      </td>
                    </tr>
                  ))}

                  {trashedAdmins.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                        Tidak ada akun admin di dalam tempat sampah.
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
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Memuat halaman...</div>}>
      <AdminManagementPageContent />
    </Suspense>
  );
}
