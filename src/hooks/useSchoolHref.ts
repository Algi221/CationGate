"use client";

import { useCallback } from "react";
import { useParams, usePathname } from "next/navigation";

/**
 * Returns a function `href(path)` that generates the correct URL path
 * based on whether the user is on a subdomain or root domain.
 *
 * Uses `usePathname()` to ensure 100% hydration consistency between SSR and Client.
 * - Subdomain (e.g., pathname="/dashboard"): href("/forum") → "/forum"
 * - Root domain (e.g., pathname="/smktb/dashboard"): href("/forum") → "/smktb/forum"
 */
export function useSchoolHref(explicitSlug?: string) {
  const params = useParams();
  const pathname = usePathname();
  const schoolSlug = explicitSlug || (params?.school_slug as string) || "";

  const isSubdomain = typeof window !== "undefined"
    ? (() => {
        const host = window.location.hostname.toLowerCase();
        return (
          (host.endsWith(".cationgate.site") && host !== "cationgate.site" && !host.startsWith("www.")) ||
          (host.endsWith(".localhost") && host !== "localhost") ||
          (host.endsWith(".vercel.app") && host !== "cationgate.vercel.app")
        );
      })()
    : false;

  const hasSlugInPath = Boolean(
    !isSubdomain &&
    schoolSlug &&
    pathname &&
    (pathname === `/${schoolSlug}` || pathname.startsWith(`/${schoolSlug}/`))
  );

  const href = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      if (isSubdomain) {
        return cleanPath;
      }
      if (hasSlugInPath) {
        return `/${schoolSlug}${cleanPath}`;
      }
      return cleanPath;
    },
    [isSubdomain, hasSlugInPath, schoolSlug]
  );

  return { href, schoolSlug, isSubdomain: isSubdomain || !hasSlugInPath };
}
