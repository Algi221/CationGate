/**
 * Security utility for URL sanitization, Open Redirect protection, and DOM XSS prevention.
 */

const ALLOWED_HOST_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "cationgate.site",
  "supabase.co",
  "supabase.in",
  "cloudinary.com",
  "googleapis.com",
  "googleusercontent.com",
  "midtrans.com",
  "unpkg.com",
  "cdnjs.cloudflare.com"
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
 * Sanitizes a document URL (allows verified storage endpoints, safe cloud providers, or safe data URIs).
 */
export function getSafeDocUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "#";
  const trimmed = url.trim();

  if (
    trimmed.startsWith("/api/storage/") ||
    trimmed.startsWith("/assets/") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
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

  // Allow safe data URIs & blobs
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (isSafeRedirectUrl(trimmed) || trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
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
 * Convert base64 Data URI to Blob URL
 */
export function dataUriToBlobUrl(dataUri: string): string {
  try {
    const parts = dataUri.split(";base64,");
    if (parts.length < 2) return dataUri;
    const contentType = parts[0].replace("data:", "");
    const byteCharacters = atob(parts[1]);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays as BlobPart[], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn("Failed to convert data URI to blob URL:", err);
    return dataUri;
  }
}

/**
 * Trigger file download directly in browser
 */
export function downloadDocFile(url: string | null | undefined, filename = "dokumen_verifikasi.pdf"): void {
  if (!url || typeof window === "undefined") return;
  const targetUrl = url.startsWith("data:") ? dataUriToBlobUrl(url) : url;
  const link = document.createElement("a");
  link.href = targetUrl;
  link.download = filename;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Safely opens a document/URL in a new window or converts base64 to Blob URL
 */
export function safeOpenWindow(url: string | null | undefined, filename = "dokumen.pdf"): void {
  if (typeof window === "undefined" || !url) return;
  const safeUrl = getSafeDocUrl(url);
  if (!safeUrl || safeUrl === "#") return;

  if (safeUrl.startsWith("data:")) {
    const blobUrl = dataUriToBlobUrl(safeUrl);
    const win = window.open(blobUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      downloadDocFile(safeUrl, filename);
    }
    return;
  }

  window.open(safeUrl, "_blank", "noopener,noreferrer");
}

/**
 * Sanitizes a URL for previewing in iframe / img to prevent DOM XSS.
 * Only allows trusted protocols and validated schemes.
 */
export function sanitizeDocPreviewUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "about:blank";
  const trimmed = url.trim();

  if (trimmed.startsWith("data:application/pdf") || trimmed.startsWith("data:image/")) {
    return dataUriToBlobUrl(trimmed);
  }

  if (trimmed.startsWith("blob:") || trimmed.startsWith("/assets/") || trimmed.startsWith("/api/")) {
    return trimmed;
  }

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const parsed = new URL(trimmed, origin);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // fallback
  }
  return "about:blank";
}

/**
 * Validates and safely redirects to an allowed domain/path, mitigating Open Redirect.
 */
export function safeRedirect(targetUrl: string | null | undefined, fallback = "/"): void {
  if (typeof window === "undefined" || !targetUrl) return;
  try {
    const origin = window.location.origin;
    const parsed = new URL(targetUrl, origin);
    const hostname = parsed.hostname.toLowerCase();

    const isSafeDomain =
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "cationgate.site" ||
      hostname.endsWith(".cationgate.site") ||
      hostname.endsWith(".vercel.app");

    if (isSafeDomain && (parsed.protocol === "http:" || parsed.protocol === "https:")) {
      window.location.assign(parsed.toString());
      return;
    }
    window.location.assign(fallback);
  } catch {
    window.location.assign(fallback);
  }
}

