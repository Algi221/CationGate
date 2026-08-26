"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";

/**
 * Returns a function `href(path)` that generates the correct URL path
 * based on whether the user is on a subdomain or root domain.
 *
 * - Subdomain (e.g., smktb.cationgate.site): href("/dashboard") → "/dashboard"
 * - Root domain (e.g., cationgate.site/smktb): href("/dashboard") → "/smktb/dashboard"
 */
export function useSchoolHref() {
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";

  const isSubdomain =
    typeof window !== "undefined" &&
    (() => {
      const hostname = window.location.hostname.toLowerCase();
      return (
        (hostname.endsWith(".localhost") && hostname !== "localhost") ||
        (hostname.endsWith(".cationgate.site") && hostname !== "cationgate.site") ||
        (hostname.endsWith(".vercel.app") && !hostname.startsWith("cationgate."))
      );
    })();

  const href = useCallback(
    (path: string) => {
      if (isSubdomain) {
        // On subdomain, no slug prefix needed
        return path.startsWith("/") ? path : `/${path}`;
      }
      // On root domain, include slug prefix
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `/${schoolSlug}${cleanPath}`;
    },
    [isSubdomain, schoolSlug]
  );

  return { href, schoolSlug, isSubdomain };
}
