import dompurify from "dompurify";
import { ParsedMedia } from "../types";

export const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url) return "";
  try {
    return dompurify.sanitize(url, {
      ALLOWED_URI_REGEXP: /^(?:https?:\/\/|\/|data:image\/|data:application\/pdf|data:video\/)/i
    });
  } catch (_e) {
    return "";
  }
};

export const sanitizeSrc = (src: string | undefined | null): string => sanitizeUrl(src);

export const parseMedia = (raw: string | null | undefined): ParsedMedia => {
  if (!raw) return { foto: "", video: "", videoName: "", dokumen: "", dokumenName: "" };
  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw);
      return {
        foto: parsed.foto || "",
        video: parsed.video || "",
        videoName: parsed.video_name || "",
        dokumen: parsed.dokumen || "",
        dokumenName: parsed.dokumen_name || ""
      };
    } catch (_e) {
      // ignore
    }
  }
  return { foto: raw, video: "", videoName: "", dokumen: "", dokumenName: "" };
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  } catch (_e) {
    return dateString;
  }
};

export const formatInputDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (_e) {
    return "";
  }
};
