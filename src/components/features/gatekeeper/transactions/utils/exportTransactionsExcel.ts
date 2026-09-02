import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { TransactionItem, formatDateTime } from "../types";
import { formatExcelTable } from "@/lib/excelStyleHelper";

export async function exportTransactionsToExcel(
  transactions: TransactionItem[],
) {
  try {
    if (!transactions || transactions.length === 0) {
      Swal.fire({
        title: "Tidak Ada Data",
        text: "Tidak ada transaksi untuk diekspor.",
        icon: "info",
        confirmButtonColor: "#2563EB",
        customClass: {
          popup: "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
        },
      });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Transaksi");

    const headers = [
      "No.",
      "Order ID",
      "Instansi Sekolah",
      "Subdomain",
      "Paket Langganan",
      "Nominal (Rp)",
      "Metode Pembayaran",
      "Status Transaksi",
      "Waktu Transaksi",
    ];

    const dataRows = transactions.map((tx, idx) => [
      idx + 1,
      tx.order_id,
      tx.school_name,
      `${tx.school_slug}.cationgate.site`,
      tx.plan_name,
      tx.amount || 0,
      tx.payment_method || "-",
      tx.status || "-",
      formatDateTime(tx.settlement_time || tx.created_at),
    ]);

    const columnWidths = [6, 26, 30, 28, 18, 18, 20, 16, 22];

    formatExcelTable({
      worksheet,
      title: "LAPORAN REKAPITULASI TRANSAKSI SAAS CATIONGATE",
      headers,
      dataRows,
      columnWidths,
    });

    // Format nominal currency column (Column F / index 6)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        const amountCell = row.getCell(6);
        if (typeof amountCell.value === "number") {
          amountCell.numFmt = '"Rp "#,##0';
        }
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const filename = `Laporan_Transaksi_CationGate_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, filename);

    Swal.fire({
      icon: "success",
      title: "Export Berhasil!",
      text: `File ${filename} berhasil diunduh (${transactions.length} baris data).`,
      confirmButtonColor: "#2563EB",
      timer: 3000,
      customClass: {
        popup: "rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900",
      },
    });
  } catch (err) {
    console.error("Gagal export Excel:", err);
    Swal.fire({
      icon: "error",
      title: "Gagal Mengunduh",
      text: "Terjadi kesalahan saat memproses file Excel.",
      confirmButtonColor: "#2563EB",
    });
  }
}
