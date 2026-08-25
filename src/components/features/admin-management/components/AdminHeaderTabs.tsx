"use client";

import React from "react";
import { Shield, Plus, Trash2 } from "lucide-react";

interface AdminHeaderTabsProps {
  activeTab: "admin" | "trash";
  handleTabChange: (tab: "admin" | "trash") => void;
  showAddForm: boolean;
  setShowAddForm: (val: boolean) => void;
  setEditAdminId: (id: number | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<{ username: string; password: string; nama_lengkap: string; role: string }>>;
  setError: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
  trashedCount: number;
}

export const AdminHeaderTabs: React.FC<AdminHeaderTabsProps> = ({
  activeTab,
  handleTabChange,
  showAddForm,
  setShowAddForm,
  setEditAdminId,
  setFormData,
  setError,
  setSuccessMsg,
  trashedCount
}) => {
  return (
    <>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
              Kelola Akun Admin Sekolah
            </h1>
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
                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            }`}
          >
            {showAddForm ? (
              "Batal Form"
            ) : (
              <>
                <Plus size={16} /> Tambah Admin Baru
              </>
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => handleTabChange("admin")}
          className={`px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "admin"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Shield size={14} /> Daftar Admin Aktif
        </button>

        <button
          onClick={() => handleTabChange("trash")}
          className={`px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "trash"
              ? "border-red-600 text-red-600 dark:text-red-400 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Trash2 size={14} /> Tempat Sampah
          {trashedCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-[10px] bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 rounded-full font-black">
              {trashedCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
