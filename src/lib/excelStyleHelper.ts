import ExcelJS from "exceljs";

function getColumnLetter(colIndex: number): string {
  let temp = 0;
  let letter = "";
  while (colIndex > 0) {
    temp = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + temp) + letter;
    colIndex = Math.floor((colIndex - temp - 1) / 26);
  }
  return letter;
}

export interface ExcelTableConfig {
  worksheet: ExcelJS.Worksheet;
  title: string;
  headers: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataRows: any[][];
  columnWidths?: number[];
}

export function formatExcelTable({
  worksheet,
  title,
  headers,
  dataRows,
  columnWidths
}: ExcelTableConfig) {
  const colCount = headers.length;
  const lastColLetter = getColumnLetter(colCount);

  // Row 1: Title (Merged & Centered Bold Title)
  worksheet.mergeCells(`A1:${lastColLetter}1`);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = title.toUpperCase();
  titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "000000" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 32;

  // Row 2: Empty spacing row
  worksheet.getRow(2).height = 12;

  // Row 3: Header Row (Royal Blue Accent, White Bold Text, AutoFilter)
  const headerRow = worksheet.getRow(3);
  headerRow.height = 26;
  headers.forEach((headerText, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = headerText;
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "366092" } // Modern Royal Blue Header matching Excel image
    };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "244062" } },
      bottom: { style: "medium", color: { argb: "244062" } },
      left: { style: "thin", color: { argb: "538DD5" } },
      right: { style: "thin", color: { argb: "538DD5" } }
    };
  });

  // Enable AutoFilter dropdown buttons on row 3 header range
  worksheet.autoFilter = `A3:${lastColLetter}3`;

  // Row 4 onwards: Data Rows with alternating zebra striping
  dataRows.forEach((rowVals, rIdx) => {
    const rowNum = rIdx + 4;
    const row = worksheet.getRow(rowNum);
    row.height = 22;
    const isEven = rIdx % 2 === 0;
    const bgFill = isEven ? "FFFFFF" : "F2F5F9";

    rowVals.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.value = val ?? "-";
      cell.font = { name: "Calibri", size: 10, color: { argb: "000000" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bgFill }
      };

      const headerText = (headers[cIdx] || "").toLowerCase();
      const isLeftAlign =
        headerText.includes("nama") ||
        headerText.includes("sekolah") ||
        headerText.includes("alamat") ||
        headerText.includes("email") ||
        headerText.includes("tempat lahir") ||
        headerText.includes("keterangan");

      cell.alignment = {
        horizontal: isLeftAlign ? "left" : "center",
        vertical: "middle"
      };

      cell.border = {
        top: { style: "thin", color: { argb: "D9D9D9" } },
        bottom: { style: "thin", color: { argb: "D9D9D9" } },
        left: { style: "thin", color: { argb: "D9D9D9" } },
        right: { style: "thin", color: { argb: "D9D9D9" } }
      };
    });
  });

  // Calculate and apply optimal column widths
  headers.forEach((headerText, idx) => {
    const col = worksheet.getColumn(idx + 1);
    if (columnWidths && columnWidths[idx]) {
      col.width = columnWidths[idx];
    } else {
      let maxLen = headerText.length;
      dataRows.forEach((r) => {
        const cellStr = String(r[idx] ?? "");
        if (cellStr.length > maxLen) maxLen = cellStr.length;
      });
      col.width = Math.min(Math.max(maxLen + 12, 18), 55);
    }
  });
}
