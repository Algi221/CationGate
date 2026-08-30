import ExcelJS from "exceljs";
import { getSupabaseClient } from "../db/supabase";
import { formatExcelTable } from "../../lib/excelStyleHelper";
import { ApplicantQueryService } from "./applicant/ApplicantQueryService";

export class ApplicantExportService {
  static async exportToExcel(
    schoolId: string | null,
    authToken?: string
  ): Promise<{ buffer: ExcelJS.Buffer; filename: string }> {
    const supabase = getSupabaseClient(authToken);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Calon Siswa");

    const headers = [
      "No. Pendaftaran",
      "Nama Lengkap",
      "NISN",
      "NIK",
      "Jenis Kelamin",
      "Sekolah Asal",
      "Program Keahlian (Jurusan)",
      "No. WhatsApp",
      "Email",
      "Status Seleksi",
      "Verifikasi Berkas Fisik",
      "Diverifikasi Oleh",
      "Tanggal Daftar"
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rows: any[] = [];
    try {
      let exportQuery = supabase
        .from("student_applicants")
        .select("*")
        .is("deleted_at", null)
        .order("tgl_daftar", { ascending: false });

      if (schoolId) exportQuery = exportQuery.eq("school_id", schoolId);

      const { data, error } = await exportQuery;
      if (!error && data && data.length > 0) {
        rows = data;
      }
    } catch (_e) {}

    // Fallback to ApplicantQueryService (which checks PostgreSQL pool & inMemApplicants)
    if (rows.length === 0) {
      try {
        rows = await ApplicantQueryService.getAdminApplicants(schoolId || "1", authToken);
      } catch (_e) {}
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataRows = (rows || []).map((row: Record<string, any>) => [
      row.registration_no || row.no_pendaftaran || "-",
      row.nama || "-",
      row.nisn || "-",
      row.nik || "-",
      row.jenis_kelamin === "L"
        ? "Laki-laki"
        : row.jenis_kelamin === "P"
        ? "Perempuan"
        : row.jenis_kelamin || "-",
      row.sekolah_asal || row.sekolahAsal || "-",
      row.jurusan_1 || row.jurusan1 || "-",
      row.whatsapp || row.no_telepon || "-",
      row.email || "-",
      row.status || "Pending",
      row.physical_doc_verified ? "Sudah Diterima" : "Belum Diterima",
      row.physical_doc_verified_by || row.verified_by || "-",
      row.tgl_daftar ? new Date(row.tgl_daftar as string).toLocaleString("id-ID") : "-"
    ]);

    formatExcelTable({
      worksheet,
      title: "DATA CALON SISWA PPDB",
      headers,
      dataRows
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `Data-Calon-Siswa-${new Date().toISOString().split("T")[0]}.xlsx`;

    return { buffer, filename };
  }
}
