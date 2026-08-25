"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();

  const isForcedLight =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/daftar" ||
    pathname === "/register" ||
    pathname === "/masuk" ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/tentang") ||
    pathname?.startsWith("/fitur") ||
    pathname?.startsWith("/harga") ||
    pathname?.startsWith("/kontak") ||
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/gatekeeper");

  return (
    <NextThemesProvider
      {...props}
      forcedTheme={isForcedLight ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
