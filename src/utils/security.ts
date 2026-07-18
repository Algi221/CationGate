import dompurify from "dompurify";

export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "#";

  const cleaned = url.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, "");

  if (cleaned.startsWith("/") && !cleaned.startsWith("//")) {
    return cleaned;
  }

  try {
    const sanitized = dompurify.sanitize(cleaned, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/(png|jpeg|jpg|gif|webp);base64,|data:application\/pdf;base64,|data:video\/)/i
    });
    return sanitized || "#";
  } catch (e) {
    return "#";
  }
}

export function sanitizeSrc(src: string | undefined | null): string {
  if (!src) return "";
  let sanitized = sanitizeUrl(src);
  if (sanitized && sanitized.startsWith("/jurusan/")) {
    sanitized = sanitized.replace("/jurusan/", "/assets/jurusan/");
  }
  return sanitized === "#" ? "" : sanitized;
}
