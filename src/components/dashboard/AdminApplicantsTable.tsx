"use client";

import React, { useState } from "react";
import { useApplicants, useUpdateApplicantStatus } from "@/hooks/useApplicants";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import { Check, X } from "lucide-react";
import Swal from "sweetalert2";

interface AdminApplicantsTableProps {
  schoolId: string;
}

export function AdminApplicantsTable({ schoolId }: AdminApplicantsTableProps) {
  const { data: applicants, isLoading, isError } = useApplicants(schoolId);
  const { mutate: updateStatus } = useUpdateApplicantStatus(schoolId);
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <h3 className="text-lg font-semibold">Memuat Data Pendaftar...</h3>
        <SkeletonTable rows={10} columns={5} />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Gagal memuat data pendaftar.</div>;
  }

  const filteredApplicants = applicants?.filter((a) =>
    a.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = (id: number, status: string) => {

    updateStatus(
      { id, status },
      {
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat mengupdate status. Perubahan telah di-rollback.",
          });
        },
        onSuccess: () => {

        }
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Cari nama pendaftar..."
          className="border p-2 rounded-lg w-1/3 text-slate-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="text-sm text-slate-500">
          Auto-polling aktif setiap 15 detik saat tab fokus.
        </div>
      </div>

      <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Nama Lengkap</th>
              <th className="p-4 font-semibold text-slate-700">NISN</th>
              <th className="p-4 font-semibold text-slate-700">Jurusan</th>
              <th className="p-4 font-semibold text-slate-700">Status</th>
              <th className="p-4 font-semibold text-slate-700">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredApplicants?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Tidak ada pendaftar ditemukan
                </td>
              </tr>
            ) : (
              filteredApplicants?.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{applicant.nama}</td>
                  <td className="p-4 text-slate-600">{applicant.nisn}</td>
                  <td className="p-4 text-slate-600">{applicant.jurusan_1}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      applicant.status === "Approved" 
                        ? "bg-green-100 text-green-700" 
                        : applicant.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    {applicant.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(applicant.id, "Approved")}
                          className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                          title="Setujui"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(applicant.id, "Rejected")}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          title="Tolak"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
