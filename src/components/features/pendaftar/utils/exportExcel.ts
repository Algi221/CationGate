import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { Applicant } from "../types";
import { formatExcelTable } from "@/lib/excelStyleHelper";
import { usePPDBStore } from "@/stores/usePPDBStore";

export async function exportApplicantsToExcel(applicantsList: Applicant[], _isDemoMode?: boolean) {
  try {
    const storeApplicants = usePPDBStore.getState().applicants;
    const listToExport =
      applicantsList && applicantsList.length > 0
        ? applicantsList
        : storeApplicants && storeApplicants.length > 0
        ? storeApplicants
        : [];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Calon Siswa");

    const headers = [
      "No.",
      "No. Pendaftaran",
      "Nama Lengkap",
      "NISN",
      "NIK",
      "NIPD",
      "Jurusan",
      "Kelas",
      "Tahun Ajaran / Periode",
      "Jenis Kelamin (L/P)",
      "Tempat Lahir",
      "Tanggal Lahir (YYYY-MM-DD)",
      "Agama",
      "Alamat Lengkap",
      "No WhatsApp / HP",
      "Email",
      "Asal Sekolah",
      "Nama Ayah",
      "Nama Ibu",
      "Telepon Orang Tua",
      "Status Berkas",
      "Status Biaya",
      "Tanggal Daftar"
    ];

    const dataRows = listToExport.map((app, idx) => [
      idx + 1,
      app.registration_no || app.no_pendaftaran || "-",
      app.nama || "-",
      app.nisn || "-",
      app.nik || "-",
      app.nipd || "-",
      app.jurusan_1 || app.jurusan1 || "-",
      app.diterima_kelas || app.diterimaKelas || "-",
      app.periode || "2026-2027",
      (app.jenis_kelamin || app.jenisKelamin || "").toLowerCase().startsWith("l")
        ? "L"
        : (app.jenis_kelamin || app.jenisKelamin || "").toLowerCase().startsWith("p")
        ? "P"
        : "-",
      app.tempat_lahir || app.tempatLahir || "-",
      app.tgl_lahir || app.tglLahir || "-",
      app.agama || "-",
      app.alamat || "-",
      app.whatsapp || "-",
      app.email || "-",
      app.sekolah_asal || app.sekolahAsal || "-",
      app.nama_ayah || app.namaAyah || "-",
      app.nama_ibu || app.namaIbu || "-",
      app.telepon_ortu || app.teleponOrtu || "-",
      app.status || "Pending",
      app.status_pembayaran || "UNPAID",
      app.tgl_daftar ? new Date(app.tgl_daftar).toLocaleDateString("id-ID") : "-"
    ]);

    formatExcelTable({
      worksheet,
      title: "DATA CALON SISWA PPDB",
      headers,
      dataRows
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const filename = `Data_Calon_Siswa_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, filename);

    Swal.fire({
      icon: "success",
      title: "Berhasil Diekspor",
      text: `File ${filename} berhasil diunduh (${listToExport.length} data calon siswa).`,
      confirmButtonColor: "#2563eb",
    });
  } catch (clientErr: unknown) {
    Swal.fire({
      icon: "error",
      title: "Ekspor Gagal",
      text: clientErr instanceof Error ? clientErr.message : String(clientErr)
    });
  }
}
