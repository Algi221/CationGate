"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();

  const isMainLanding =
    pathname === "/" ||
    pathname?.startsWith("/tentang") ||
    pathname?.startsWith("/fitur") ||
    pathname?.startsWith("/harga") ||
    pathname?.startsWith("/kontak") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/daftar") ||
    pathname?.startsWith("/blog");

  return (
    <NextThemesProvider
      {...props}
      forcedTheme={isMainLanding ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
