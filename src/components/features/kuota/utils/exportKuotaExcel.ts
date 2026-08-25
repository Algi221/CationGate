import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { KuotaData, KuotaItem } from "../types";

export async function exportKuotaToExcel(data: KuotaData, selectedPeriode: string) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data Kuota");

  const titleFont = { name: "Arial", size: 12, bold: true };
  const headerFont = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  const bodyFont = { name: "Arial", size: 10 };
  const borderStyle = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    top: { style: "thin" as any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    left: { style: "thin" as any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bottom: { style: "thin" as any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    right: { style: "thin" as any }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alignCenter = { vertical: "middle" as any, horizontal: "center" as any };

  const tahunAjaran = selectedPeriode
    ? `TAHUN AJARAN ${selectedPeriode.replace("-", "/")}`
    : "TAHUN AJARAN 2026/2027";

  const createTable = (startRow: number, title: string, items: KuotaItem[], totalJumlah: number) => {
    sheet.mergeCells(`A${startRow}:E${startRow}`);
    const title1 = sheet.getCell(`A${startRow}`);
    title1.value = title;
    title1.font = titleFont;
    title1.alignment = alignCenter;

    sheet.mergeCells(`A${startRow + 1}:E${startRow + 1}`);
    const title2 = sheet.getCell(`A${startRow + 1}`);
    title2.value = "SMK TARUNA BHAKTI DEPOK";
    title2.font = titleFont;
    title2.alignment = alignCenter;

    sheet.mergeCells(`A${startRow + 2}:E${startRow + 2}`);
    const title3 = sheet.getCell(`A${startRow + 2}`);
    title3.value = tahunAjaran;
    title3.font = titleFont;
    title3.alignment = alignCenter;

    const headerRowIndex = startRow + 3;
    const headers = ["NO", "KONSENTRASI KEAHLIAN", "JUMLAH", "TARGET", "PRESENTASE"];
    headers.forEach((header, index) => {
      const colLetter = String.fromCharCode(65 + index);
      const cell = sheet.getCell(`${colLetter}${headerRowIndex}`);
      cell.value = header;
      cell.font = { ...headerFont, color: { argb: "FF000000" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6B9EE0" } };
      cell.border = borderStyle;
      cell.alignment = alignCenter;
    });

    let currentRow = headerRowIndex + 1;
    items.forEach((item) => {
      const rowData = [item.no, item.konsentrasi_keahlian, item.jumlah, item.target, item.presentase];
      rowData.forEach((val, index) => {
        const colLetter = String.fromCharCode(65 + index);
        const cell = sheet.getCell(`${colLetter}${currentRow}`);
        cell.value = val;
        cell.font = bodyFont;
        cell.border = borderStyle;
        cell.alignment = alignCenter;
      });
      currentRow++;
    });

    sheet.mergeCells(`A${currentRow}:B${currentRow}`);
    const totalLabel = sheet.getCell(`A${currentRow}`);
    totalLabel.value = "TOTAL KESELURUHAN";
    totalLabel.font = { name: "Arial", size: 10, bold: true };
    totalLabel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDBB11" } };
    totalLabel.border = borderStyle;
    totalLabel.alignment = alignCenter;

    const dummyB = sheet.getCell(`B${currentRow}`);
    dummyB.border = borderStyle;

    const totalJumlahCell = sheet.getCell(`C${currentRow}`);
    totalJumlahCell.value = totalJumlah;
    totalJumlahCell.font = { name: "Arial", size: 10, bold: true };
    totalJumlahCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDBB11" } };
    totalJumlahCell.border = borderStyle;
    totalJumlahCell.alignment = alignCenter;

    const totalTargetCell = sheet.getCell(`D${currentRow}`);
    totalTargetCell.value = data.totalTarget;
    totalTargetCell.font = { name: "Arial", size: 10, bold: true };
    totalTargetCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDBB11" } };
    totalTargetCell.border = borderStyle;
    totalTargetCell.alignment = alignCenter;

    const totalPersentaseCell = sheet.getCell(`E${currentRow}`);
    totalPersentaseCell.value = "";
    totalPersentaseCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDBB11" } };
    totalPersentaseCell.border = borderStyle;

    return currentRow + 3;
  };

  const nextRow = createTable(1, "PRESENTASE PEMBELIAN FORMULIR CALON PESERTA DIDIK", data.pendaftar, data.totalPendaftar);
  createTable(nextRow, "PRESENTASE FIX MASUK PESERTA DIDIK", data.siswaAktif, data.totalSiswaAktif);

  sheet.getColumn("A").width = 5;
  sheet.getColumn("B").width = 40;
  sheet.getColumn("C").width = 15;
  sheet.getColumn("D").width = 15;
  sheet.getColumn("E").width = 15;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `Data_Kuota_${selectedPeriode || "Semua"}.xlsx`);
}
