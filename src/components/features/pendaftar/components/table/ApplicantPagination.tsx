"use client";

import React from "react";

interface ApplicantPaginationProps {
  paginatedCount: number;
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const ApplicantPagination: React.FC<ApplicantPaginationProps> = ({
  paginatedCount,
  totalFilteredCount,
  currentPage,
  totalPages,
  setPage
}) => {
  return (
    <div className="p-4 px-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/20">
      <div>
        Menampilkan <span className="text-slate-800 dark:text-white font-extrabold">{paginatedCount}</span> dari{" "}
        <span className="text-slate-800 dark:text-white font-extrabold">{totalFilteredCount}</span> pendaftar
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          Sebelumnya
        </button>
        <span className="px-3 py-1.5 font-mono text-slate-700 dark:text-slate-300">
          Halaman {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};
