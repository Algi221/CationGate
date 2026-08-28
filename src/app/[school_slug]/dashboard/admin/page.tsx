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
        isPro={isPro}
      />

      {!isPro && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-amber-800 dark:text-amber-300">
                Fitur Multi-Admin Terkunci (Paket Free Trial)
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                Menambah dan mengelola banyak staf panitia PPDB tersedia untuk paket Pro dan Enterprise.
              </p>
            </div>
          </div>
          <Link
            href="./subscription"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-sm shrink-0 inline-flex items-center gap-1.5"
          >
            <Shield size={13} /> Upgrade Langganan
          </Link>
        </div>
      )}

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
          isPro={isPro}
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
