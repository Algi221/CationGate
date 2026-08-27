"use client";

import React from "react";
import { Applicant } from "../../types";
import { formatNoPendaftaran } from "../DetailModal";

interface ApplicantSpreadsheetRowProps {
  applicant: Applicant;
  rIdx: number;
  currentPage: number;
  activeCell: { row: number; col: number } | null;
  setActiveCell: (cell: { row: number; col: number } | null) => void;
  onViewDetail: (applicant: Applicant) => void;
}

export const ApplicantSpreadsheetRow: React.FC<ApplicantSpreadsheetRowProps> = ({
  applicant: a,
  rIdx,
  currentPage,
  activeCell,
  setActiveCell,
  onViewDetail
}) => {
  return (
    <tr 
      key={a.id}
      onDoubleClick={() => onViewDetail(a)}
      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer border-b border-slate-100 dark:border-slate-800/50"
    >
      <td className="p-2 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 text-[10px]">
        {(currentPage - 1) * 10 + rIdx + 1}
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 0 })}
        className={`p-2 border-r border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-bold ${
          activeCell?.row === rIdx && activeCell?.col === 0 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        {a.registration_no || formatNoPendaftaran(a.periode, a.id)}
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 1 })}
        className={`p-2 border-r border-slate-100 dark:border-slate-800 ${
          activeCell?.row === rIdx && activeCell?.col === 1 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        {a.nisn}
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 2 })}
        className={`p-2 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white ${
          activeCell?.row === rIdx && activeCell?.col === 2 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        {a.nama}
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 3 })}
        className={`p-2 border-r border-slate-100 dark:border-slate-800 text-center ${
          activeCell?.row === rIdx && activeCell?.col === 3 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        {(a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l") ? "L" : "P"}
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 4 })}
        className={`p-2 border-r border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 ${
          activeCell?.row === rIdx && activeCell?.col === 4 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        {a.sekolah_asal || a.sekolahAsal || "-"}
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 5 })}
        className={`p-2 border-r border-slate-100 dark:border-slate-800 ${
          activeCell?.row === rIdx && activeCell?.col === 5 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        {a.jurusan_1 || a.jurusan1 || "-"}
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 6 })}
        className={`p-2 border-r border-slate-100 dark:border-slate-800 text-xs font-bold ${
          activeCell?.row === rIdx && activeCell?.col === 6 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        <span className={a.status === "Approved" ? "text-emerald-500 font-bold" : a.status === "Rejected" ? "text-rose-500 font-bold" : "text-amber-500 font-bold"}>
          {a.status || "Pending"}
        </span>
      </td>
      <td 
        onClick={() => setActiveCell({ row: rIdx, col: 7 })}
        className={`p-2 ${
          activeCell?.row === rIdx && activeCell?.col === 7 ? "outline-2 outline-blue-500 bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
      >
        {a.whatsapp || "-"}
      </td>
    </tr>
  );
};
