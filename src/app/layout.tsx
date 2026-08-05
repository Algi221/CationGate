import React from "react";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { PPDBProvider } from "@/context/PPDBContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "CationGate - Platform Manajemen PPDB",
  description: "SaaS Manajemen Penerimaan Siswa Baru Cerdas dan Terintegrasi.",
};

import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", plusJakarta.variable, "font-sans", geist.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground dark:bg-slate-950 dark:text-slate-100">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PPDBProvider>
              {children}
            </PPDBProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
