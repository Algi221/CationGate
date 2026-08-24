"use client";

import React, { Suspense } from "react";
import { Trash2, PieChart } from "lucide-react";
import KuotaTab from "@/components/KuotaTab";
import { usePendaftarState } from "@/components/features/pendaftar/hooks/usePendaftarState";
import { ApplicantTable } from "@/components/features/pendaftar/components/ApplicantTable";
import { DetailModal } from "@/components/features/pendaftar/components/DetailModal";
import { EditModal } from "@/components/features/pendaftar/components/EditModal";
import { RejectModal } from "@/components/features/pendaftar/components/RejectModal";
import { TrashTab } from "@/components/features/pendaftar/components/TrashTab";
import { PaymentReceiptModal } from "@/components/features/pendaftar/components/PaymentReceiptModal";

function ApplicantsDirectoryContent() {
  const {
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
    handlePermanentDeleteApplicant
  } = usePendaftarState();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => handleTabChange("active")}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap px-1 ${
            activePageTab === "active"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          Calon Siswa Baru (Kelas X)
        </button>
        <button
          onClick={() => handleTabChange("transfer")}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap px-1 ${
            activePageTab === "transfer"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          Calon Siswa Pindahan (Kelas XI & XII)
        </button>
        <button
          onClick={() => handleTabChange("kuota")}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap px-1 ${
            activePageTab === "kuota"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          <PieChart size={15} />
          <span>Data Kuota</span>
        </button>
        <button
          onClick={() => handleTabChange("trash")}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap px-1 ${
            activePageTab === "trash"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          <Trash2 size={15} />
          <span>Sampah / Calon Siswa Dihapus</span>
        </button>
      </div>

      {trashError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
          {trashError}
        </div>
      )}

      {trashSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm font-semibold dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          {trashSuccess}
        </div>
      )}

      {activePageTab === "kuota" ? (
        <KuotaTab type="pendaftar" />
      ) : activePageTab === "trash" ? (
        <TrashTab
          trashedApplicants={trashedApplicants}
          trashLoading={trashLoading}
          onRestore={handleRestoreApplicant}
          onPermanentDelete={handlePermanentDeleteApplicant}
        />
      ) : (
        <ApplicantTable
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          majorFilter={majorFilter}
          setMajorFilter={setMajorFilter}
          gelombangFilter={gelombangFilter}
          setGelombangFilter={setGelombangFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
          majorsList={majorsList}
          isSpreadsheetMode={isSpreadsheetMode}
          setIsSpreadsheetMode={setIsSpreadsheetMode}
          onExport={handleExport}
          filteredApplicants={filteredApplicants}
          paginatedApplicants={paginatedApplicants}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          currentPage={currentPage}
          onViewDetail={handleViewDetail}
          onOpenEdit={openEdit}
          onVerify={verifyApplicant}
          onOpenReject={(id) => {
            setRejectingApplicantId(id);
            setRejectionPreset("");
            setRejectionNotes("");
          }}
          onDelete={deleteApplicant}
          onTogglePhysicalDoc={handleTogglePhysicalDoc}
          onOpenReceipt={(applicant) => setReceiptModalApplicant(applicant)}
          onConfirmPayment={handleConfirmPayment}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
      )}

      {/* Payment Receipt / Cashier Modal */}
      <PaymentReceiptModal
        isOpen={!!receiptModalApplicant}
        onClose={() => setReceiptModalApplicant(null)}
        applicant={receiptModalApplicant}
        onConfirmLunas={handleConfirmPayment}
      />

      {/* Detail Modal */}
      <DetailModal
        selectedApplicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onVerify={verifyApplicant}
        onOpenReject={(id) => {
          setRejectingApplicantId(id);
          setRejectionPreset("");
          setRejectionNotes("");
        }}
        onChecklistChange={handleChecklistChange}
      />

      {/* Edit Modal */}
      <EditModal
        editApplicant={editApplicant}
        editForm={editForm}
        setEditForm={setEditForm}
        isSaving={isSaving}
        onClose={() => setEditApplicant(null)}
        onSave={handleEditSave}
      />

      {/* Reject Modal */}
      <RejectModal
        rejectingApplicantId={rejectingApplicantId}
        rejectionPreset={rejectionPreset}
        setRejectionPreset={setRejectionPreset}
        rejectionNotes={rejectionNotes}
        setRejectionNotes={setRejectionNotes}
        onClose={() => {
          setRejectingApplicantId(null);
          setRejectionPreset("");
          setRejectionNotes("");
        }}
        onConfirm={() => {
          if (rejectionPreset && rejectingApplicantId) {
            const formattedReason = rejectionPreset + (rejectionNotes.trim() ? `. Catatan admin: ${rejectionNotes.trim()}` : "");
            rejectApplicant(rejectingApplicantId, formattedReason);
            if (selectedApplicant && selectedApplicant.id === rejectingApplicantId) {
              setSelectedApplicant(null);
            }
            setRejectingApplicantId(null);
            setRejectionPreset("");
            setRejectionNotes("");
          }
        }}
      />
    </div>
  );
}

export default function ApplicantsDirectory() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat data pendaftar...</div>}>
      <ApplicantsDirectoryContent />
    </Suspense>
  );
}
