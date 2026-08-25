"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    orig.apply(console, args);
  };
}
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
