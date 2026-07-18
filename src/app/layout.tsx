import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PPDBProvider } from "@/context/PPDBContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "PPDB SMK Taruna Bhakti Depok - Portal Pendaftaran Siswa Baru 2026/2027",
  description: "Selamat datang di Portal PPDB Online SMK Taruna Bhakti Depok. Pendaftaran mudah, cepat, transparan, dan terintegrasi untuk calon taruna-taruni baru bidang IT dan Elektronika.",
  keywords: ["PPDB", "SMK Taruna Bhakti", "SMK TB", "Pendaftaran SMK", "Depok", "Sekolah IT"],
  authors: [{ name: "SMK Taruna Bhakti Depok" }],
  icons: {
    icon: "/logo_smktb.png",
    apple: "/logo_smktb.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <PPDBProvider>
          {children}
        </PPDBProvider>
      </body>
    </html>
  );
}
