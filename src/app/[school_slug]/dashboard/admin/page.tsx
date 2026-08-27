"use client";

import { Suspense } from "react";
import { Shield, Lock } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAdminManagementState } from "@/components/features/admin-management/hooks/useAdminManagementState";
import { AdminHeaderTabs } from "@/components/features/admin-management/components/AdminHeaderTabs";
import { AdminActiveTable } from "@/components/features/admin-management/components/AdminActiveTable";
import { AdminTrashTable } from "@/components/features/admin-management/components/AdminTrashTable";
import { AdminFormModal } from "@/components/features/admin-management/components/AdminFormModal";

function AdminManagementPageContent() {
  const {
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
    schoolSlug,
    handleAddAdmin,
    handleEditClick,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleRestoreAdmin,
    handleResendActivation
  } = useAdminManagementState();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AdminHeaderTabs
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        setEditAdminId={setEditAdminId}
        setFormData={setFormData}
        setError={setError}
        setSuccessMsg={setSuccessMsg}
        trashedCount={trashedAdmins.length}
      />

      {!isPro ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl mt-6 shadow-sm">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
            Fitur Terkunci (Hanya untuk Paket Berbayar)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center mb-6 leading-relaxed">
            Menambah dan mengelola banyak admin panitia secara spesifik hanya tersedia untuk paket Pro dan Pro Max. Silakan berlangganan untuk membuka fitur ini.
          </p>
          <Link
            href="./subscription"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 inline-flex items-center gap-2"
          >
            <Shield size={16} /> Buka Halaman Subscription
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-2xl text-xs font-bold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {successMsg}
            </div>
          )}

          {/* Form Modal Add/Edit */}
          <AnimatePresence>
            {showAddForm && (
              <AdminFormModal
                editAdminId={editAdminId}
                formData={formData}
                setFormData={setFormData}
                formLoading={formLoading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleSubmit={editAdminId ? handleUpdateAdmin : handleAddAdmin}
                handleCancel={() => {
                  setShowAddForm(false);
                  setEditAdminId(null);
                }}
              />
            )}
          </AnimatePresence>

          {activeTab === "admin" ? (
            <AdminActiveTable
              admins={admins}
              loading={loading}
              adminUser={adminUser}
              schoolSlug={schoolSlug}
              handleEditClick={handleEditClick}
              handleDeleteAdmin={handleDeleteAdmin}
              handleResendActivation={handleResendActivation}
            />
          ) : (
            <AdminTrashTable
              trashedAdmins={trashedAdmins}
              trashLoading={trashLoading}
              handleRestoreAdmin={handleRestoreAdmin}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function AdminManagementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <AdminManagementPageContent />
    </Suspense>
  );
}
