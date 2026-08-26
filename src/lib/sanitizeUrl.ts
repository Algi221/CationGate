/**
 * Security utility for URL sanitization, Open Redirect protection, and DOM XSS prevention.
 */

const ALLOWED_HOST_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "cationgate.site"
];

/**
 * Validates whether a URL belongs to a trusted domain to prevent Open Redirect.
 */
export function isSafeRedirectUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== "string") return false;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const parsed = new URL(urlStr, origin);
    
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    return ALLOWED_HOST_DOMAINS.some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

/**
 * Sanitizes a document URL (only allows verified storage endpoints or safe data URIs).
 */
export function getSafeDocUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "#";
  const trimmed = url.trim();

  if (
    trimmed.startsWith("/api/storage/") ||
    trimmed.startsWith("/assets/") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("data:application/pdf;base64,") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (isSafeRedirectUrl(trimmed)) {
    return trimmed;
  }

  return "#";
}

/**
 * Sanitizes a URL for use in href, src, or redirection.
 */
export function sanitizeSafeUrl(url: string | null | undefined, fallback = "#"): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();

  // Allow relative URLs starting with /
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Allow safe data URIs
  if (
    trimmed.startsWith("data:image/png;base64,") ||
    trimmed.startsWith("data:image/jpeg;base64,") ||
    trimmed.startsWith("data:image/jpg;base64,") ||
    trimmed.startsWith("data:image/webp;base64,") ||
    trimmed.startsWith("data:application/pdf;base64,") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (isSafeRedirectUrl(trimmed)) {
    return trimmed;
  }

  return fallback;
}

/**
 * Sanitizes a slug string to prevent open redirect and path traversal.
 */
export function sanitizeSlug(slug: string | null | undefined): string {
  if (!slug || typeof slug !== "string") return "demo";
  return slug.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase().slice(0, 60) || "demo";
}

/**
 * Safely opens a URL in a new window with noopener and noreferrer.
 */
export function safeOpenWindow(url: string | null | undefined): void {
  if (typeof window === "undefined") return;
  const safeUrl = getSafeDocUrl(url);
  if (safeUrl && safeUrl !== "#") {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }
}
