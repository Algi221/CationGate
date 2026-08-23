import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { Applicant } from "../types";

export async function exportApplicantsToExcel(applicants: Applicant[], isDemoMode: boolean) {
  if (isDemoMode) {
    Swal.fire({
      icon: "success",
      title: "Berhasil Diekspor",
      text: "Data pendaftar berhasil diekspor ke Excel (Demo Mode).",
      confirmButtonColor: "#2563eb",
    });
    return;
  }

  try {
    const token = localStorage.getItem("ppdb_admin_token") || localStorage.getItem("ppdb_token");
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
    const res = await fetch(`${backendUrl}/applicants/export`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      const blob = await res.blob();
      saveAs(blob, `Data_Calon_Siswa_${new Date().toISOString().split("T")[0]}.xlsx`);
      return;
    }
    throw new Error("Server export endpoint unavailable");
  } catch (_err: unknown) {
    // Client-side ExcelJS fallback
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data Calon Siswa");
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "NISN", key: "nisn", width: 15 },
        { header: "Nama Lengkap", key: "nama", width: 30 },
        { header: "Sekolah Asal", key: "sekolah_asal", width: 25 },
        { header: "Jurusan Pilihan", key: "jurusan_1", width: 25 },
        { header: "Status", key: "status", width: 15 },
        { header: "Tanggal Daftar", key: "tgl_daftar", width: 20 },
      ];
      applicants.forEach(app => {
        worksheet.addRow({
          id: app.id,
          nisn: app.nisn || "-",
          nama: app.nama || "-",
          sekolah_asal: app.sekolah_asal || app.sekolahAsal || "-",
          jurusan_1: app.jurusan_1 || app.jurusan1 || "-",
          status: app.status || "Pending",
          tgl_daftar: app.tgl_daftar ? new Date(app.tgl_daftar).toLocaleDateString("id-ID") : "-"
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `Data_Calon_Siswa_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (clientErr: unknown) {
      Swal.fire({
        icon: "error",
        title: "Ekspor Gagal",
        text: clientErr instanceof Error ? clientErr.message : String(clientErr)
      });
    }
  }
}
