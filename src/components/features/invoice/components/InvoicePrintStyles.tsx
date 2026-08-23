"use client";

import React from "react";

export const InvoicePrintStyles: React.FC = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }

          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
          }

          .no-print, .action-panel, .signature-block, nav, header, footer, button, a {
            display: none !important;
          }

          html,
          body,
          body > div,
          .print-root,
          .screen-layout {
            display: block !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            position: static !important;
          }

          .invoice-sheet {
            display: block !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            background: white !important;
            background-color: white !important;
            color: #0f172a !important;
            overflow: visible !important;
            position: static !important;
          }

          .invoice-inner {
            padding: 0 !important;
            width: 100% !important;
            background: white !important;
          }

          .invoice-sheet *,
          .invoice-sheet span,
          .invoice-sheet p,
          .invoice-sheet h1,
          .invoice-sheet h2,
          .invoice-sheet h4,
          .invoice-sheet td,
          .invoice-sheet th {
            color: #0f172a !important;
            background: transparent !important;
            background-color: transparent !important;
          }

          .invoice-sheet .text-blue-600,
          .invoice-sheet span[style*="color: rgb(37, 99, 235)"],
          .invoice-sheet span[style*="color:#2563eb"],
          .invoice-sheet span[style*="color: #2563eb"] {
            color: #2563eb !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .invoice-sheet, .invoice-inner {
            page-break-inside: avoid;
          }
        }

        html.dark .invoice-sheet,
        html.dark .invoice-sheet.bg-white dark:bg-[#0f172a] {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-color: #e2e8f0 !important;
        }

        html.dark .invoice-sheet * {
          border-color: #e2e8f0 !important;
        }

        html.dark .invoice-sheet div[style*="background: #f8fafc"],
        html.dark .invoice-sheet div[style*="background-color: #f8fafc"] {
          background-color: #f8fafc !important;
          background: #f8fafc !important;
        }

        @media screen {
          .screen-layout {
            display: flex;
            gap: 2rem;
            max-width: 72rem;
            margin: 0 auto;
            align-items: flex-start;
          }

          .invoice-sheet {
            flex: 1;
            min-width: 0;
          }

          .action-panel {
            width: 280px;
            flex-shrink: 0;
          }

          @media (max-width: 1023px) {
            .screen-layout {
              flex-direction: column;
            }
            .action-panel {
              width: 100%;
            }
          }
        }
      `
      }}
    />
  );
};
