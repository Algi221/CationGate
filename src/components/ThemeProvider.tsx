"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    orig.apply(console, args as [unknown, ...unknown[]]);
  };
}
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  const [isSubdomain, setIsSubdomain] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname.toLowerCase();
      return (
        (hostname.endsWith(".localhost") && hostname !== "localhost") ||
        (hostname.endsWith(".cationgate.site") && hostname !== "cationgate.site" && hostname !== "www.cationgate.site") ||
        (hostname.endsWith(".vercel.app") && !hostname.startsWith("cationgate."))
      );
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname.toLowerCase();
      const sub =
        (hostname.endsWith(".localhost") && hostname !== "localhost") ||
        (hostname.endsWith(".cationgate.site") && hostname !== "cationgate.site" && hostname !== "www.cationgate.site") ||
        (hostname.endsWith(".vercel.app") && !hostname.startsWith("cationgate."));
      setIsSubdomain(sub);
    }
  }, []);

  const isDemoOrSchoolPage =
    isSubdomain ||
    pathname?.startsWith("/demo") ||
    pathname?.startsWith("/jurusan");

  const isForcedLight =
    !isDemoOrSchoolPage &&
    (pathname === "/" ||
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
      pathname === "/gatekeeper" ||
      pathname === "/gatekeeper/login");

  return (
    <NextThemesProvider
      {...props}
      forcedTheme={isForcedLight ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
