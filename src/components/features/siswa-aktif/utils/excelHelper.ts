"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ActiveStudent, ImportPreviewRow } from "../types";
import { formatNoPendaftaran } from "@/components/features/pendaftar/components/detail-sections/sanitizeUrl";
import { formatExcelTable } from "@/lib/excelStyleHelper";
import { generateDemoActiveStudents } from "@/stores/slices/demoApplicantGenerator";

export { formatNoPendaftaran };

/**
 * Downloads a structured Excel template for importing active students.
 */
export async function downloadActiveStudentsTemplate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Template Siswa Aktif", {
    views: [{ showGridLines: true }]
  });

  const headers = [
    "Nama Lengkap *",
    "NISN *",
    "NIK",
    "NIPD",
    "Jurusan *",
    "Kelas *",
    "Tahun Ajaran / Periode *",
    "Jenis Kelamin (L/P) *",
    "Tempat Lahir",
    "Tanggal Lahir (YYYY-MM-DD)",
    "Agama",
    "Alamat Lengkap",
    "No WhatsApp / HP",
    "Email",
    "Asal Sekolah",
    "Nama Ayah",
    "Nama Ibu",
    "Telepon Orang Tua"
  ];

  const dataRows = [
    [
      "Ahmad Rizky Pratama", "0071234567", "3201012345670001", "262710001",
      "Rekayasa Perangkat Lunak", "X PPLG 1", "2026-2027", "L",
      "Jakarta", "2008-05-14", "Islam", "Jl. Merdeka No. 12 RT 01/RW 04",
      "081234567890", "ahmad.rizky@example.com", "SMP Negeri 1 Jakarta",
      "Bambang Pratama", "Siti Aminah", "081298765432"
    ],
    [
      "Siti Nurhaliza", "0069876543", "3201012345670002", "252610002",
      "Teknik Jaringan Komputer & Telekomunikasi", "XI TJKT 2", "2025-2026", "P",
      "Bandung", "2007-11-20", "Islam", "Jl. Dago Asri No. 45",
      "081398765432", "siti.nurhaliza@example.com", "SMP Negeri 5 Bandung",
      "Herman Santoso", "Dewi Lestari", "081312345678"
    ]
  ];

  formatExcelTable({
    worksheet,
    title: "TEMPLATE IMPORT SISWA AKTIF",
    headers,
    dataRows
  });

  // Instruction Sheet
  const infoSheet = workbook.addWorksheet("Panduan Pengisian");
  infoSheet.columns = [
    { header: "Kolom", key: "kolom", width: 25 },
    { header: "Kewajiban", key: "wajib", width: 15 },
    { header: "Petunjuk Pengisian", key: "keterangan", width: 60 },
  ];
  const infoHeader = infoSheet.getRow(1);
  infoHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
  infoHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } };

  infoSheet.addRow({ kolom: "Nama Lengkap", wajib: "Wajib", keterangan: "Nama lengkap calon/siswa aktif sesuai ijazah/akta." });
  infoSheet.addRow({ kolom: "NISN", wajib: "Wajib", keterangan: "Nomor Induk Siswa Nasional (10 digit angka)." });
  infoSheet.addRow({ kolom: "Jurusan", wajib: "Wajib", keterangan: "Contoh: Rekayasa Perangkat Lunak, Teknik Jaringan Komputer, DKV, dsb." });
  infoSheet.addRow({ kolom: "Kelas", wajib: "Wajib", keterangan: "Nama rombel kelas tempat siswa terdaftar, contoh: X PPLG 1, XI TJKT 2, XII DKV 1." });
  infoSheet.addRow({ kolom: "Tahun Ajaran / Periode", wajib: "Wajib", keterangan: "Tahun ajaran angkatan siswa, contoh: 2026-2027, 2025-2026, 2024-2025." });
  infoSheet.addRow({ kolom: "Jenis Kelamin", wajib: "Wajib", keterangan: "Isi dengan 'L' (Laki-laki) atau 'P' (Perempuan)." });
  infoSheet.addRow({ kolom: "Tanggal Lahir", wajib: "Opsional", keterangan: "Format standar YYYY-MM-DD (Contoh: 2008-05-14) atau DD/MM/YYYY." });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, "Template_Import_Siswa_Aktif_CationGate.xlsx");
}

/**
 * Parses an uploaded Excel/CSV file and extracts active student rows with security sanitization.
 */
export async function parseActiveStudentsFile(file: File): Promise<{
  rows: ImportPreviewRow[];
  rawStudents: Record<string, unknown>[];
  errors: string[];
}> {
  // Enforce 10MB max file limit to prevent zip bombs
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran file Excel melebihi batas maksimal 10MB.");
  }

  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("File Excel tidak memiliki lembar kerja (worksheet).");
  }

  // Find column headers mapping dynamically
  const headerMap: Record<string, number> = {};
  
  // Try to find which row contains the headers (look at first 5 rows)
  let headerRowIndex = 1;
  for (let i = 1; i <= 5; i++) {
    const row = worksheet.getRow(i);
    let matchCount = 0;
    row.eachCell((cell) => {
      const text = String(cell.value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (text.includes("nama") || text.includes("nisn") || text.includes("jurusan") || text.includes("kelas")) {
        matchCount++;
      }
    });
    if (matchCount >= 3) {
      headerRowIndex = i;
      break;
    }
  }

  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.eachCell((cell, colNumber) => {
    const headerText = String(cell.value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    
    if (headerText.includes("nama")) headerMap["nama"] = colNumber;
    else if (headerText.includes("nisn")) headerMap["nisn"] = colNumber;
    else if (headerText.includes("nik")) headerMap["nik"] = colNumber;
    else if (headerText.includes("nipd")) headerMap["nipd"] = colNumber;
    else if (headerText.includes("jurusan") || headerText.includes("prodi")) headerMap["jurusan"] = colNumber;
    else if (headerText.includes("kelas") || headerText.includes("rombel")) headerMap["kelas"] = colNumber;
    else if (headerText.includes("periode") || headerText.includes("angkatan") || headerText.includes("tahun")) headerMap["periode"] = colNumber;
    else if (headerText.includes("jeniskelamin") || headerText === "jk" || headerText.includes("gender")) headerMap["jk"] = colNumber;
    else if (headerText.includes("tempatlahir")) headerMap["tempat_lahir"] = colNumber;
    else if (headerText.includes("tanggallahir") || headerText.includes("tgllahir")) headerMap["tgl_lahir"] = colNumber;
    else if (headerText.includes("agama")) headerMap["agama"] = colNumber;
    else if (headerText.includes("alamat")) headerMap["alamat"] = colNumber;
    else if (headerText.includes("whatsapp") || headerText.includes("hp") || headerText.includes("telepon")) headerMap["whatsapp"] = colNumber;
    else if (headerText.includes("email")) headerMap["email"] = colNumber;
    else if (headerText.includes("sekolah") || headerText.includes("asal")) headerMap["sekolah_asal"] = colNumber;
    else if (headerText.includes("ayah")) headerMap["nama_ayah"] = colNumber;
    else if (headerText.includes("ibu")) headerMap["nama_ibu"] = colNumber;
    else if (headerText.includes("ortu")) headerMap["telepon_ortu"] = colNumber;
  });

  const rows: ImportPreviewRow[] = [];
  const rawStudents: Record<string, unknown>[] = [];
  const errors: string[] = [];

  // Helper to sanitize potential CSV formula injection (=, +, -, @)
  const sanitizeCell = (raw: string): string => {
    let str = raw.trim();
    // Neutralize formula triggers
    if (/^[=+\-@\t\r]/.test(str)) {
      str = str.replace(/^[=+\-@\t\r]+/, "");
    }
    // Remove script tags
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    return str;
  };

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowIndex) return; // Skip header row and above

    const getVal = (key: string): string => {
      const colIdx = headerMap[key];
      if (!colIdx) return "";
      const val = row.getCell(colIdx).value;
      if (val === null || val === undefined) return "";
      let rawStr = "";
      if (typeof val === "object" && "text" in val) rawStr = String(val.text || "");
      else rawStr = String(val);
      return sanitizeCell(rawStr);
    };

    const nama = getVal("nama");
    if (!nama) return; // Skip completely empty rows

    const nisn = getVal("nisn");
    const nik = getVal("nik");
    const nipd = getVal("nipd");
    const jurusan = getVal("jurusan") || "Umum";
    const kelas = getVal("kelas") || "Kelas X";
    const periode = getVal("periode") || "2026-2027";
    const rawJk = getVal("jk").toLowerCase();
    const jk = rawJk.startsWith("l") ? "Laki-laki" : rawJk.startsWith("p") ? "Perempuan" : "Laki-laki";
    const whatsapp = getVal("whatsapp");
    const sekolahAsal = getVal("sekolah_asal");

    if (!nisn) {
      errors.push(`Baris ${rowNumber}: Siswa "${nama}" tidak memiliki NISN.`);
    }

    const previewRow: ImportPreviewRow = {
      nama,
      nisn,
      nik: nik || undefined,
      nipd: nipd || undefined,
      jurusan,
      diterima_kelas: kelas,
      periode,
      jenis_kelamin: jk,
      tempat_lahir: getVal("tempat_lahir") || undefined,
      tgl_lahir: getVal("tgl_lahir") || undefined,
      agama: getVal("agama") || undefined,
      alamat: getVal("alamat") || undefined,
      whatsapp: whatsapp || undefined,
      email: getVal("email") || undefined,
      sekolah_asal: sekolahAsal || undefined,
      nama_ayah: getVal("nama_ayah") || undefined,
      nama_ibu: getVal("nama_ibu") || undefined,
      telepon_ortu: getVal("telepon_ortu") || undefined,
      status: "Lulus/Aktif"
    };

    const rawPayload: Record<string, unknown> = {
      nama,
      nisn,
      nik: nik || null,
      nipd: nipd || null,
      jurusan,
      diterima_kelas: kelas,
      periode,
      jenis_kelamin: jk,
      tempat_lahir: getVal("tempat_lahir") || null,
      tgl_lahir: getVal("tgl_lahir") || null,
      agama: getVal("agama") || null,
      alamat: getVal("alamat") || null,
      whatsapp: whatsapp || null,
      email: getVal("email") || null,
      sekolah_asal: sekolahAsal || null,
      nama_ayah: getVal("nama_ayah") || null,
      nama_ibu: getVal("nama_ibu") || null,
      telepon_ortu: getVal("telepon_ortu") || null,
      status: "Lulus/Aktif"
    };

    rows.push(previewRow);
    rawStudents.push(rawPayload);
  });

  return { rows, rawStudents, errors };
}


export async function exportActiveStudentsToExcel(
  studentsInput: ActiveStudent[],
  nipdMap: Map<number, string>
) {
  const students =
    studentsInput && studentsInput.length > 0
      ? studentsInput
      : (generateDemoActiveStudents() as unknown as ActiveStudent[]);

  const workbook = new ExcelJS.Workbook();
  const groups: Record<string, ActiveStudent[]> = {};

  students.forEach((a) => {
    const period = a.periode || "2026-2027";
    if (!groups[period]) groups[period] = [];
    groups[period].push(a);
  });

  const periods = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const headers = [
    "Nama Lengkap *",
    "NISN *",
    "NIK",
    "NIPD",
    "Jurusan *",
    "Kelas *",
    "Tahun Ajaran / Periode *",
    "Jenis Kelamin (L/P) *",
    "Tempat Lahir",
    "Tanggal Lahir (YYYY-MM-DD)",
    "Agama",
    "Alamat Lengkap",
    "No WhatsApp / HP",
    "Email",
    "Asal Sekolah",
    "Nama Ayah",
    "Nama Ibu",
    "Telepon Orang Tua"
  ];

  periods.forEach((period) => {
    const sheetName = `Periode ${period.replace(/[:\\/?*\[\]]/g, "")}`.substring(0, 31);
    const worksheet = workbook.addWorksheet(sheetName);

    const periodStudents = groups[period];
    periodStudents.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    const dataRows = periodStudents.map((a) => [
      a.nama || "-",
      a.nisn || "-",
      a.nik || "-",
      nipdMap.get(a.id) || a.nipd || "-",
      a.jurusan || a.jurusan_1 || a.jurusan1 || "-",
      a.diterima_kelas || a.diterimaKelas || "-",
      a.periode || "2026-2027",
      (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
        ? "L"
        : (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("p")
        ? "P"
        : "-",
      a.tempat_lahir || a.tempatLahir || "-",
      a.tgl_lahir || a.tglLahir || "-",
      a.agama || "-",
      a.alamat || "-",
      a.whatsapp || "-",
      a.email || "-",
      a.sekolah_asal || a.sekolahAsal || "-",
      a.nama_ayah || a.namaAyah || "-",
      a.nama_ibu || a.namaIbu || "-",
      a.telepon_ortu || a.teleponOrtu || "-"
    ]);

    formatExcelTable({
      worksheet,
      title: `DATA SISWA AKTIF - PERIODE ${period}`,
      headers,
      dataRows
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, `Data_Siswa_Aktif_${new Date().toISOString().split("T")[0]}.xlsx`);
}
