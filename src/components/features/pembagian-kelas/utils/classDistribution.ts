import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Applicant, ClassItem, MajorConfigItem } from "../types";

export const DEFAULT_MAJORS: MajorConfigItem[] = [
  { code: "RPL", name: "Rekayasa Perangkat Lunak" },
  { code: "TJKT", name: "Teknik Jaringan Komputer & Telekomunikasi" },
  { code: "DKV", name: "Desain Komunikasi Visual" },
  { code: "BC", name: "Broadcasting & Perfilman" },
  { code: "ANM", name: "Animasi" },
  { code: "TE", name: "Teknik Elektronika" }
];

export const getClassGrade = (className: string): number => {
  if (!className) return 10;
  const upper = className.toUpperCase().trim();
  const match = upper.match(/^(XII|XI|X|12|11|10)\b/) || upper.match(/^(XII|XI|X|12|11|10)/);
  if (match) {
    const val = match[1];
    if (val === "XII" || val === "12") return 12;
    if (val === "XI" || val === "11") return 11;
    if (val === "X" || val === "10") return 10;
  }
  return 10;
};

export const getMajorLogoUrl = (code: string): string => {
  switch (code?.toUpperCase()) {
    case "RPL":
    case "PPLG":
      return "/assets/jurusan/pplg.png";
    case "TJKT":
      return "/assets/jurusan/tjkt.png";
    case "DKV":
      return "/assets/jurusan/dkv.png";
    case "BC":
      return "/assets/jurusan/bc.png";
    case "ANM":
      return "/assets/jurusan/animasi.png";
    case "TE":
      return "/assets/jurusan/te.png";
    default:
      return "/assets/logo_sekolah/logo_smktb.png";
  }
};

export const exportClassToExcel = async (
  className: string,
  classStudents: Applicant[],
  nipdMap: Map<number, string>
) => {
  if (classStudents.length === 0) return false;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Kelas_${className}`);

  worksheet.columns = [
    { header: "No.", key: "no", width: 10 },
    { header: "No. Pendaftaran", key: "no_pendaftaran", width: 25 },
    { header: "NIPD", key: "nipd", width: 20 },
    { header: "Nama Siswa", key: "nama", width: 35 },
    { header: "L/P", key: "jk", width: 10 },
    { header: "NISN", key: "nisn", width: 25 },
    { header: "Asal Sekolah", key: "sekolah", width: 35 },
    { header: "No. WhatsApp", key: "whatsapp", width: 25 },
    { header: "Email", key: "email", width: 35 },
    { header: "Tanggal Diterima", key: "tanggal", width: 25 }
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 35;
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

  classStudents.forEach((s: Applicant, index: number) => {
    worksheet.addRow({
      no: index + 1,
      no_pendaftaran: s.no_pendaftaran || "-",
      nipd: nipdMap.get(s.id) || "-",
      nama: s.nama || "",
      jk: (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l")
        ? "L"
        : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p")
        ? "P"
        : "-",
      nisn: s.nisn || "",
      sekolah: s.sekolah_asal || s.sekolahAsal || "",
      whatsapp: s.whatsapp || "",
      email: s.email || "",
      tanggal: s.diterima_tanggal || s.diterimaTanggal || ""
    });
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.height = 25;
    }
    row.eachCell((cell, colNumber) => {
      if (rowNumber > 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFFFF" }
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };

        if ([1, 3, 5, 7].includes(colNumber)) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        } else {
          cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        }
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, `Daftar_Kelas_${className.replace(/\s+/g, "_")}_${Date.now()}.xlsx`);
  return true;
};

export const exportAllClassesToExcel = async (
  classesToExport: ClassItem[],
  applicants: Applicant[],
  activeMajors: MajorConfigItem[],
  selectedMajor: string,
  schoolPeriod: string,
  nipdMap: Map<number, string>
) => {
  if (classesToExport.length === 0) return false;

  const workbook = new ExcelJS.Workbook();
  let totalExported = 0;

  classesToExport.forEach((c) => {
    const classStudents = applicants
      .filter((a: Applicant) => {
        if (a.status === "Rejected") return false;
        const cls = a.diterima_kelas || a.diterimaKelas;
        return cls === c.name;
      })
      .sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    const sheetName = c.name.replace(/\s+/g, "_").substring(0, 30);
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.mergeCells("A1:G1");
    worksheet.mergeCells("A2:G2");
    worksheet.mergeCells("A3:G3");
    worksheet.mergeCells("A4:G4");

    worksheet.getCell("A1").value = "DAFTAR PESERTA DIDIK";
    worksheet.getCell("A2").value = `JURUSAN: ${
      activeMajors.find((m) => m.code === selectedMajor)?.name?.toUpperCase() || selectedMajor
    }`;
    worksheet.getCell("A3").value = `PERIODE AKADEMIK: ${schoolPeriod || "2026-2027"}`;
    worksheet.getCell("A4").value = `KELAS: ${c.name}`;

    ["A1", "A2", "A3", "A4"].forEach((cellId, idx) => {
      const cell = worksheet.getCell(cellId);
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = {
        bold: true,
        name: "Arial",
        size: idx === 0 ? 14 : 11,
        color: { argb: "FF1F497D" }
      };
    });

    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 20;
    worksheet.getRow(3).height = 20;
    worksheet.getRow(4).height = 20;
    worksheet.getRow(5).height = 10;

    const headerRowIndex = 6;
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.height = 28;

    const columns = [
      { header: "No.", key: "no", width: 8 },
      { header: "No. Pendaftaran", key: "no_pendaftaran", width: 20 },
      { header: "NIPD", key: "nipd", width: 20 },
      { header: "Nama Lengkap", key: "nama", width: 35 },
      { header: "L/P", key: "jk", width: 10 },
      { header: "NISN", key: "nisn", width: 18 },
      { header: "Asal Sekolah", key: "sekolah", width: 30 }
    ];

    columns.forEach((col, idx) => {
      const cell = headerRow.getCell(idx + 1);
      cell.value = col.header;
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4F81BD" }
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
      worksheet.getColumn(idx + 1).width = col.width;
    });

    classStudents.forEach((s: Applicant, index: number) => {
      totalExported++;
      const rowIndex = headerRowIndex + 1 + index;
      const row = worksheet.getRow(rowIndex);
      row.height = 22;

      row.getCell(1).value = index + 1;
      row.getCell(2).value = s.no_pendaftaran || "-";
      row.getCell(3).value = nipdMap.get(s.id) || "-";
      row.getCell(4).value = s.nama || "";
      row.getCell(5).value = (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l")
        ? "L"
        : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p")
        ? "P"
        : "-";
      row.getCell(6).value = s.nisn || "";
      row.getCell(7).value = s.sekolah_asal || s.sekolahAsal || "";

      row.eachCell((cell, colNum) => {
        cell.font = { name: "Arial", size: 10 };
        cell.border = {
          top: { style: "thin", color: { argb: "FFD9D9D9" } },
          left: { style: "thin", color: { argb: "FFD9D9D9" } },
          bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
          right: { style: "thin", color: { argb: "FFD9D9D9" } }
        };
        if ([1, 2, 3, 5, 6].includes(colNum)) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        } else {
          cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        }
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(
    blob,
    `Semua_Kelas_${selectedMajor}_${schoolPeriod.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.xlsx`
  );
  return totalExported;
};
