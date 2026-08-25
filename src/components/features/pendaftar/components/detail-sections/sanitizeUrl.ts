import dompurify from "dompurify";

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

/**
 * Format Nomor Pendaftaran: [PERIODE (4 digit)][KODE SEKOLAH (1 digit)][NOMOR URUT (4 digit)]
 * Contoh: 2026-2027, Sekolah 1, ID 1 -> 262710001
 *         2026-2027, Sekolah 1, ID 6 -> 262710006
 */
export const formatNoPendaftaran = (
  periode?: string | null,
  id?: number | string | null,
  schoolCodeOrId?: string | number | null
): string => {
  try {
    let yearPrefix = "2627";
    if (periode) {
      const cleaned = String(periode).replace(/[^0-9/-]/g, "");
      const parts = cleaned.split(/[/ -]+/);
      if (parts.length >= 2) {
        const y1 = parts[0].slice(-2);
        const y2 = parts[1].slice(-2);
        if (y1 && y2) yearPrefix = `${y1}${y2}`;
      } else if (parts.length === 1 && parts[0].length >= 4) {
        const y1 = parts[0].slice(-2);
        const y2 = String(parseInt(y1, 10) + 1).padStart(2, "0");
        yearPrefix = `${y1}${y2}`;
      }
    }

    let schoolDigit = "1";
    if (schoolCodeOrId) {
      if (typeof schoolCodeOrId === "number") {
        schoolDigit = String(((Math.abs(schoolCodeOrId) - 1) % 9) + 1);
      } else {
        const numMatch = String(schoolCodeOrId).match(/\d+/);
        if (numMatch) {
          schoolDigit = String(((parseInt(numMatch[0], 10) - 1) % 9) + 1);
        } else {
          let hash = 0;
          for (let i = 0; i < schoolCodeOrId.length; i++) {
            hash = (hash + schoolCodeOrId.charCodeAt(i)) % 9;
          }
          schoolDigit = String(hash + 1);
        }
      }
    }

    const numId =
      typeof id === "number"
        ? id
        : parseInt(String(id || "1").replace(/\D/g, "") || "1", 10);
    const seq = String(numId).padStart(4, "0");

    return `${yearPrefix}${schoolDigit}${seq}`;
  } catch (_e) {
    const numId = typeof id === "number" ? id : 1;
    return `26271${String(numId).padStart(4, "0")}`;
  }
};
