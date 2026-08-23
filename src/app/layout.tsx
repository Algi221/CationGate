import React from "react";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { PPDBProvider } from "@/context/PPDBContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import {
  WebSiteJsonLd,
  SiteNavigationJsonLd,
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
  FaqJsonLd,
} from "@/components/seo/JsonLd";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        plusJakarta.variable,
        "font-sans",
        geist.variable,
      )}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <WebSiteJsonLd />
        <SiteNavigationJsonLd />
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
        <FaqJsonLd />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PPDBProvider>{children}</PPDBProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
