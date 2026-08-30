import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { KuotaData, KuotaItem } from "../types";

export async function exportKuotaToExcel(
  data: KuotaData,
  selectedPeriode: string,
  schoolName: string = "SMK TARUNA BHAKTI DEPOK",
  schoolPeriod: string = "2026-2027"
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data Kuota & Target");

  const titleFont = { name: "Calibri", size: 12, bold: true, color: { argb: "000000" } };
  const headerFont = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFF" } };
  const bodyFont = { name: "Calibri", size: 10 };

  const borderStyle = {
    top: { style: "thin" as const, color: { argb: "D9D9D9" } },
    left: { style: "thin" as const, color: { argb: "D9D9D9" } },
    bottom: { style: "thin" as const, color: { argb: "D9D9D9" } },
    right: { style: "thin" as const, color: { argb: "D9D9D9" } }
  };

  const alignCenter = { vertical: "middle" as const, horizontal: "center" as const };

  const periodeToUse =
    selectedPeriode && selectedPeriode !== "ALL"
      ? selectedPeriode
      : schoolPeriod || "2026-2027";

  const tahunAjaran = `TAHUN AJARAN ${periodeToUse.replace("-", "/")}`;

  const createTable = (startRow: number, title: string, items: KuotaItem[], totalJumlah: number) => {
    sheet.mergeCells(`A${startRow}:E${startRow}`);
    const title1 = sheet.getCell(`A${startRow}`);
    title1.value = title;
    title1.font = titleFont;
    title1.alignment = alignCenter;

    sheet.mergeCells(`A${startRow + 1}:E${startRow + 1}`);
    const title2 = sheet.getCell(`A${startRow + 1}`);
    title2.value = schoolName.toUpperCase();
    title2.font = titleFont;
    title2.alignment = alignCenter;

    sheet.mergeCells(`A${startRow + 2}:E${startRow + 2}`);
    const title3 = sheet.getCell(`A${startRow + 2}`);
    title3.value = tahunAjaran;
    title3.font = titleFont;
    title3.alignment = alignCenter;

    const headerRowIndex = startRow + 3;
    const headerRow = sheet.getRow(headerRowIndex);
    headerRow.height = 26;

    const headers = ["NO", "KONSENTRASI KEAHLIAN", "JUMLAH", "TARGET", "PERSENTASE"];
    headers.forEach((header, index) => {
      const colLetter = String.fromCharCode(65 + index);
      const cell = sheet.getCell(`${colLetter}${headerRowIndex}`);
      cell.value = header;
      cell.font = headerFont;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "366092" } };
      cell.border = {
        top: { style: "thin", color: { argb: "244062" } },
        bottom: { style: "medium", color: { argb: "244062" } },
        left: { style: "thin", color: { argb: "538DD5" } },
        right: { style: "thin", color: { argb: "538DD5" } }
      };
      cell.alignment = alignCenter;
    });

    let currentRow = headerRowIndex + 1;
    items.forEach((item, rIdx) => {
      const row = sheet.getRow(currentRow);
      row.height = 22;
      const isEven = rIdx % 2 === 0;
      const bgFill = isEven ? "FFFFFF" : "F2F5F9";

      const rowData = [item.no, item.konsentrasi_keahlian, item.jumlah, item.target, item.presentase];
      rowData.forEach((val, index) => {
        const colLetter = String.fromCharCode(65 + index);
        const cell = sheet.getCell(`${colLetter}${currentRow}`);
        cell.value = val;
        cell.font = bodyFont;
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgFill } };
        cell.border = borderStyle;
        cell.alignment = index === 1 ? { vertical: "middle", horizontal: "left" } : alignCenter;
      });
      currentRow++;
    });

    const summaryRow = sheet.getRow(currentRow);
    summaryRow.height = 24;

    sheet.mergeCells(`A${currentRow}:B${currentRow}`);
    const totalLabel = sheet.getCell(`A${currentRow}`);
    totalLabel.value = "TOTAL KESELURUHAN";
    totalLabel.font = { name: "Calibri", size: 10, bold: true, color: { argb: "000000" } };
    totalLabel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9E1F2" } };
    totalLabel.border = borderStyle;
    totalLabel.alignment = alignCenter;

    const dummyB = sheet.getCell(`B${currentRow}`);
    dummyB.border = borderStyle;

    const totalJumlahCell = sheet.getCell(`C${currentRow}`);
    totalJumlahCell.value = totalJumlah;
    totalJumlahCell.font = { name: "Calibri", size: 10, bold: true };
    totalJumlahCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9E1F2" } };
    totalJumlahCell.border = borderStyle;
    totalJumlahCell.alignment = alignCenter;

    const totalTargetCell = sheet.getCell(`D${currentRow}`);
    totalTargetCell.value = data.totalTarget;
    totalTargetCell.font = { name: "Calibri", size: 10, bold: true };
    totalTargetCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9E1F2" } };
    totalTargetCell.border = borderStyle;
    totalTargetCell.alignment = alignCenter;

    const totalPersentaseCell = sheet.getCell(`E${currentRow}`);
    const overallPct = data.totalTarget > 0 ? Math.round((totalJumlah / data.totalTarget) * 100) + "%" : "0%";
    totalPersentaseCell.value = overallPct;
    totalPersentaseCell.font = { name: "Calibri", size: 10, bold: true };
    totalPersentaseCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9E1F2" } };
    totalPersentaseCell.border = borderStyle;
    totalPersentaseCell.alignment = alignCenter;

    return currentRow + 3;
  };

  const nextRow = createTable(
    1,
    "PERSENTASE PEMBELIAN FORMULIR CALON PESERTA DIDIK",
    data.pendaftar,
    data.totalPendaftar
  );
  createTable(nextRow, "PERSENTASE FIX MASUK PESERTA DIDIK", data.siswaAktif, data.totalSiswaAktif);

  sheet.getColumn("A").width = 8;
  sheet.getColumn("B").width = 42;
  sheet.getColumn("C").width = 16;
  sheet.getColumn("D").width = 16;
  sheet.getColumn("E").width = 18;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(blob, `Data_Kuota_${selectedPeriode || "Semua"}.xlsx`);
}
