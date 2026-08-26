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

  // If pathname already starts with /${schoolSlug}, we are in path-based mode.
  // Otherwise, we are in subdomain mode. This is 100% identical on SSR and Client.
  const hasSlugInPath = Boolean(
    schoolSlug &&
    pathname &&
    (pathname === `/${schoolSlug}` || pathname.startsWith(`/${schoolSlug}/`))
  );

  const href = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      if (hasSlugInPath) {
        return `/${schoolSlug}${cleanPath}`;
      }
      return cleanPath;
    },
    [hasSlugInPath, schoolSlug]
  );

  return { href, schoolSlug, isSubdomain: !hasSlugInPath };
}
