import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Applicant, ClassItem, MajorConfigItem } from "../types";
import { formatNoPendaftaran } from "@/components/features/pendaftar/components/detail-sections/sanitizeUrl";
import { formatExcelTable } from "@/lib/excelStyleHelper";

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

  const headers = [
    "No.",
    "No. Pendaftaran",
    "NIPD",
    "Nama Siswa",
    "L/P",
    "NISN",
    "Asal Sekolah",
    "No. WhatsApp",
    "Email",
    "Tanggal Diterima"
  ];

  const dataRows = classStudents.map((s: Applicant, index: number) => [
    index + 1,
    s.registration_no || s.no_pendaftaran || formatNoPendaftaran(s.periode, s.id),
    nipdMap.get(s.id) || "-",
    s.nama || "-",
    (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l")
      ? "L"
      : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p")
      ? "P"
      : "-",
    s.nisn || "-",
    s.sekolah_asal || s.sekolahAsal || "-",
    s.whatsapp || "-",
    s.email || "-",
    s.diterima_tanggal || s.diterimaTanggal || "-"
  ]);

  formatExcelTable({
    worksheet,
    title: `DAFTAR SISWA KELAS ${className.toUpperCase()}`,
    headers,
    dataRows
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

  const headers = [
    "No.",
    "No. Pendaftaran",
    "NIPD",
    "Nama Lengkap",
    "L/P",
    "NISN",
    "Asal Sekolah"
  ];

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

    const dataRows = classStudents.map((s: Applicant, index: number) => {
      totalExported++;
      return [
        index + 1,
        String(s.registration_no || s.no_pendaftaran || formatNoPendaftaran(s.periode, s.id)),
        nipdMap.get(s.id) || "-",
        s.nama || "-",
        (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("l")
          ? "L"
          : (s.jenis_kelamin || s.jenisKelamin || "").toLowerCase().startsWith("p")
          ? "P"
          : "-",
        s.nisn || "-",
        s.sekolah_asal || s.sekolahAsal || "-"
      ];
    });

    const majorTitle =
      activeMajors.find((m) => m.code === selectedMajor)?.name?.toUpperCase() || selectedMajor;

    formatExcelTable({
      worksheet,
      title: `DAFTAR PESERTA DIDIK KELAS ${c.name.toUpperCase()} (${majorTitle} - PERIODE ${
        schoolPeriod || "2026-2027"
      })`,
      headers,
      dataRows
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
