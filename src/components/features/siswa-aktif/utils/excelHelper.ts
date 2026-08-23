"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ActiveStudent, ImportPreviewRow } from "../types";

export const formatNoPendaftaran = (periode: string | null | undefined, id: number) => {
  try {
    const parts = (periode || "2026-2027").split("-");
    const year1 = parts[0].slice(-2);
    const year2 = parts[1].slice(-2);
    const prefix = `${year1}${year2}`;
    const sequence = 10000 + id;
    return `${prefix}${sequence}`;
  } catch (_e) {
    return `2627${10000 + id}`;
  }
};

/**
 * Downloads a structured Excel template for importing active students.
 */
export async function downloadActiveStudentsTemplate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Template Siswa Aktif", {
    views: [{ showGridLines: true }]
  });

  worksheet.columns = [
    { header: "Nama Lengkap *", key: "nama", width: 30 },
    { header: "NISN *", key: "nisn", width: 18 },
    { header: "NIK", key: "nik", width: 22 },
    { header: "NIPD", key: "nipd", width: 18 },
    { header: "Jurusan *", key: "jurusan", width: 28 },
    { header: "Kelas *", key: "kelas", width: 18 },
    { header: "Tahun Ajaran / Periode *", key: "periode", width: 24 },
    { header: "Jenis Kelamin (L/P) *", key: "jk", width: 20 },
    { header: "Tempat Lahir", key: "tempat_lahir", width: 20 },
    { header: "Tanggal Lahir (YYYY-MM-DD)", key: "tgl_lahir", width: 25 },
    { header: "Agama", key: "agama", width: 16 },
    { header: "Alamat Lengkap", key: "alamat", width: 35 },
    { header: "No WhatsApp / HP", key: "whatsapp", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "Asal Sekolah", key: "sekolah_asal", width: 25 },
    { header: "Nama Ayah", key: "nama_ayah", width: 22 },
    { header: "Nama Ibu", key: "nama_ibu", width: 22 },
    { header: "Telepon Orang Tua", key: "telepon_ortu", width: 20 },
  ];

  // Header styling
  const headerRow = worksheet.getRow(1);
  headerRow.height = 32;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A8A" } // Dark blue B2B
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
  });

  // Example sample rows
  worksheet.addRow({
    nama: "Ahmad Rizky Pratama",
    nisn: "0071234567",
    nik: "3201012345670001",
    nipd: "262710001",
    jurusan: "Rekayasa Perangkat Lunak",
    kelas: "X PPLG 1",
    periode: "2026-2027",
    jk: "L",
    tempat_lahir: "Jakarta",
    tgl_lahir: "2008-05-14",
    agama: "Islam",
    alamat: "Jl. Merdeka No. 12 RT 01/RW 04",
    whatsapp: "081234567890",
    email: "ahmad.rizky@example.com",
    sekolah_asal: "SMP Negeri 1 Jakarta",
    nama_ayah: "Bambang Pratama",
    nama_ibu: "Siti Aminah",
    telepon_ortu: "081298765432"
  });

  worksheet.addRow({
    nama: "Siti Nurhaliza",
    nisn: "0069876543",
    nik: "3201012345670002",
    nipd: "252610002",
    jurusan: "Teknik Jaringan Komputer & Telekomunikasi",
    kelas: "XI TJKT 2",
    periode: "2025-2026",
    jk: "P",
    tempat_lahir: "Bandung",
    tgl_lahir: "2007-11-20",
    agama: "Islam",
    alamat: "Jl. Dago Asri No. 45",
    whatsapp: "081398765432",
    email: "siti.nurhaliza@example.com",
    sekolah_asal: "SMP Negeri 5 Bandung",
    nama_ayah: "Herman Santoso",
    nama_ibu: "Dewi Lestari",
    telepon_ortu: "081312345678"
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
 * Parses an uploaded Excel/CSV file and extracts active student rows.
 */
export async function parseActiveStudentsFile(file: File): Promise<{
  rows: ImportPreviewRow[];
  rawStudents: Record<string, unknown>[];
  errors: string[];
}> {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("File Excel tidak memiliki lembar kerja (worksheet).");
  }

  // Find column headers mapping dynamically
  const headerMap: Record<string, number> = {};
  const headerRow = worksheet.getRow(1);
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

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const getVal = (key: string): string => {
      const colIdx = headerMap[key];
      if (!colIdx) return "";
      const val = row.getCell(colIdx).value;
      if (val === null || val === undefined) return "";
      if (typeof val === "object" && "text" in val) return String(val.text || "").trim();
      return String(val).trim();
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
      whatsapp: whatsapp || undefined,
      sekolah_asal: sekolahAsal || undefined,
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

/**
 * Exports active students to formatted Excel grouped by Period.
 */
export async function exportActiveStudentsToExcel(
  students: ActiveStudent[],
  nipdMap: Map<number, string>
) {
  if (students.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const groups: Record<string, ActiveStudent[]> = {};

  students.forEach((a) => {
    const period = a.periode || "2026-2027";
    if (!groups[period]) groups[period] = [];
    groups[period].push(a);
  });

  const periods = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  periods.forEach((period) => {
    const sheetName = `Periode ${period.replace(/[:\\/?*\[\]]/g, "")}`.substring(0, 31);
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = [
      { header: "No.", key: "no", width: 8 },
      { header: "NIPD", key: "nipd", width: 18 },
      { header: "No. Pendaftaran", key: "no_pendaftaran", width: 20 },
      { header: "Periode Angkatan", key: "periode", width: 18 },
      { header: "Nama Lengkap", key: "nama", width: 32 },
      { header: "Jenis Kelamin", key: "jk", width: 15 },
      { header: "NISN", key: "nisn", width: 18 },
      { header: "NIK", key: "nik", width: 20 },
      { header: "Asal Sekolah", key: "sekolah", width: 28 },
      { header: "Jurusan", key: "jurusan", width: 28 },
      { header: "Kelas", key: "kelas", width: 16 },
      { header: "No. WhatsApp", key: "whatsapp", width: 20 },
      { header: "Email", key: "email", width: 25 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.height = 32;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF000000" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9BC2E6" }
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    const periodStudents = groups[period];
    periodStudents.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    periodStudents.forEach((a, idx) => {
      worksheet.addRow({
        no: idx + 1,
        nipd: nipdMap.get(a.id) || a.nipd || "-",
        no_pendaftaran: formatNoPendaftaran(a.periode, a.id),
        periode: a.periode || "2026-2027",
        nama: a.nama || "",
        jk: (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("l")
          ? "Laki-laki"
          : (a.jenis_kelamin || a.jenisKelamin || "").toLowerCase().startsWith("p")
            ? "Perempuan"
            : "-",
        nisn: a.nisn || "",
        nik: a.nik || "",
        sekolah: a.sekolah_asal || a.sekolahAsal || "",
        jurusan: a.jurusan || a.jurusan_1 || a.jurusan1 || "",
        kelas: a.diterima_kelas || a.diterimaKelas || "-",
        whatsapp: a.whatsapp || "",
        email: a.email || "",
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, `Data_Siswa_Aktif_${new Date().toISOString().split("T")[0]}.xlsx`);
}
