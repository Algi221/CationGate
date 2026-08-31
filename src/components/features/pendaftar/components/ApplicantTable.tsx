"use client";

import React, { useState, useEffect } from "react";
import { Applicant } from "../types";
import { ApplicantFilterBar } from "./table/ApplicantFilterBar";
import { ApplicantStandardRow } from "./table/ApplicantStandardRow";
import { ApplicantSpreadsheetRow } from "./table/ApplicantSpreadsheetRow";
import { ApplicantPagination } from "./table/ApplicantPagination";

interface ApplicantTableProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  majorFilter: string;
  setMajorFilter: (val: string) => void;
  gelombangFilter: string;
  setGelombangFilter: (val: string) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
  paymentFilter: string;
  setPaymentFilter: (val: string) => void;
  majorsList: string[];
  isSpreadsheetMode: boolean;
  setIsSpreadsheetMode: (val: boolean) => void;
  onExport: () => void;
  filteredApplicants: Applicant[];
  paginatedApplicants: Applicant[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  currentPage: number;
  onViewDetail: (applicant: Applicant) => void;
  onOpenEdit: (applicant: Applicant) => void;
  onVerify: (id: number) => void;
  onOpenReject: (id: number) => void;
  onDelete: (id: number) => void;
  onTogglePhysicalDoc: (applicant: Applicant) => Promise<void>;
  onOpenReceipt: (applicant: Applicant) => void;
  onConfirmPayment: (applicantId: number) => Promise<void>;
  onOpenDummyModal?: () => void;
  activeCell: { row: number; col: number } | null;
  setActiveCell: (cell: { row: number; col: number } | null) => void;
}

export const ApplicantTable: React.FC<ApplicantTableProps> = ({
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
  majorsList,
  isSpreadsheetMode,
  setIsSpreadsheetMode,
  onExport,
  onOpenDummyModal,
  filteredApplicants,
  paginatedApplicants,
  page: _page,
  setPage,
  totalPages,
  currentPage,
  onViewDetail,
  onOpenEdit,
  onVerify,
  onOpenReject,
  onDelete,
  onTogglePhysicalDoc,
  onOpenReceipt,
  onConfirmPayment: _onConfirmPayment,
  activeCell,
  setActiveCell
}) => {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Date.now());
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xs transition-colors duration-300">
      {/* Search and Toolbar Header */}
      <ApplicantFilterBar
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
        onExport={onExport}
        onOpenDummyModal={onOpenDummyModal}
        filteredApplicants={filteredApplicants}
      />

      {/* Primary Data Grid */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl backdrop-blur-md overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors duration-300">
        {!isSpreadsheetMode ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50">
                  <th className="py-4 px-6 pl-8">No. Pendaftaran</th>
                  <th className="py-4 px-6">Nama Calon Siswa</th>
                  <th className="py-4 px-6 text-center w-20">L/P</th>
                  <th className="py-4 px-6">Asal Sekolah</th>
                  <th className="py-4 px-6">Pilihan Jurusan Utama</th>
                  <th className="py-4 px-6 text-center">Status Berkas</th>
                  <th className="py-4 px-6 text-center">Biaya Formulir</th>
                  <th className="py-4 px-6 text-center">Berkas Fisik</th>
                  <th className="py-4 px-6 text-right pr-8">Aksi Administrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {paginatedApplicants.map((a: Applicant, idx: number) => (
                  <ApplicantStandardRow
                    key={a.id || idx}
                    applicant={a}
                    idx={idx}
                    currentTime={currentTime}
                    onViewDetail={onViewDetail}
                    onOpenEdit={onOpenEdit}
                    onVerify={onVerify}
                    onOpenReject={onOpenReject}
                    onDelete={onDelete}
                    onTogglePhysicalDoc={onTogglePhysicalDoc}
                    onOpenReceipt={onOpenReceipt}
                  />
                ))}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                      Tidak ditemukan data calon siswa yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Spreadsheet Excel Mode */
          <div className="overflow-x-auto select-none">
            <table className="w-full text-left text-xs font-mono border-collapse border border-slate-200 dark:border-slate-800">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-black">
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800 text-center w-10 bg-slate-200/60 dark:bg-slate-800">#</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">REG_NO</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">NISN</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">NAMA_LENGKAP</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">GENDER</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">ASAL_SEKOLAH</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">JURUSAN</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-800">STATUS</th>
                  <th className="p-2">WHATSAPP</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplicants.map((a: Applicant, rIdx: number) => (
                  <ApplicantSpreadsheetRow
                    key={a.id}
                    applicant={a}
                    rIdx={rIdx}
                    currentPage={currentPage}
                    activeCell={activeCell}
                    setActiveCell={setActiveCell}
                    onViewDetail={onViewDetail}
                  />
                ))}
                {paginatedApplicants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 font-medium text-xs">
                      Belum ada calon siswa yang mendaftar pada kriteria/tab ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Toolbar */}
        <ApplicantPagination
          paginatedCount={paginatedApplicants.length}
          totalFilteredCount={filteredApplicants.length}
          currentPage={currentPage}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};
