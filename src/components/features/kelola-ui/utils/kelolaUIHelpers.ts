import { formatPhoneNumber } from "../defaultData";
import { DEFAULT_FIELDS_CONFIG_UI } from "../defaultData";
import {
  AlurItem,
  MajorItem,
  PartnerItem,
  FaqItem,
  FieldConfigItem,
} from "../types";

export function parseConfigArray<T>(val: unknown): T[] | null {
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "string") {
    let curr = val.trim();
    let depth = 0;
    while (depth < 4) {
      if (curr.startsWith("[") && curr.endsWith("]")) {
        try {
          const parsed = JSON.parse(curr);
          if (Array.isArray(parsed)) return parsed as T[];
          if (typeof parsed === "string") {
            curr = parsed.trim();
            depth++;
            continue;
          }
        } catch (_e) {
          break;
        }
      } else if (curr.startsWith('"') && curr.endsWith('"')) {
        try {
          const unquoted = JSON.parse(curr);
          if (typeof unquoted === "string") {
            curr = unquoted.trim();
            depth++;
            continue;
          }
          if (Array.isArray(unquoted)) return unquoted as T[];
        } catch (_e) {
          break;
        }
      } else {
        break;
      }
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeForDraft(obj: any): any {
  if (typeof obj === "string") {
    return obj.startsWith("data:") && obj.length > 500 ? "" : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForDraft);
  }
  if (obj !== null && typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    for (const k of Object.keys(obj)) {
      res[k] = sanitizeForDraft(obj[k]);
    }
    return res;
  }
  return obj;
}

export function formatRevisionDate(dateString: string): string {
  if (!dateString) return "-";
  let normalized = dateString;
  if (
    typeof dateString === "string" &&
    !dateString.includes("Z") &&
    !dateString.includes("+") &&
    dateString.includes(" ")
  ) {
    normalized = dateString.replace(" ", "T") + "Z";
  } else if (
    typeof dateString === "string" &&
    !dateString.endsWith("Z") &&
    !dateString.includes("+") &&
    dateString.includes("T")
  ) {
    normalized = dateString + "Z";
  }
  const date = new Date(normalized);
  return date
    .toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", ".");
}

export interface KelolaUISnapshotData {
  ppdb_landing_active: boolean;
  ppdb_hero_title: string;
  ppdb_hero_title_sub: string;
  ppdb_hero_subtitle: string;
  ppdb_hero_bg_image: string;
  ppdb_phone: string;
  ppdb_email: string;
  ppdb_address: string;
  ppdb_map_title: string;
  ppdb_map_url: string;
  ppdb_school_period: string;
  ppdb_wa_group_url: string;
  ppdb_wa_admin: string;
  ppdb_form_guideline: string;
  ppdb_form_fee: string;
  ppdb_logo_url: string;
  ppdb_title: string;
  ppdb_footer_desc: string;
  ppdb_alur_config: AlurItem[];
  ppdb_majors_config: MajorItem[];
  ppdb_faq_config: FaqItem[];
  ppdb_faq_title: string;
  ppdb_faq_subtitle: string;
  ppdb_partners_config: PartnerItem[];
  ppdb_gelombang_config: {
    gelombang1: { start: string; end: string };
    gelombang2: { start: string; end: string };
  };
  ppdb_fields_config: Record<string, FieldConfigItem>;
}

export function buildKelolaUISnapshot(data: KelolaUISnapshotData): string {
  return JSON.stringify({
    ppdb_landing_active: data.ppdb_landing_active,
    ppdb_hero_title: data.ppdb_hero_title || "",
    ppdb_hero_title_sub: data.ppdb_hero_title_sub || "",
    ppdb_hero_subtitle: data.ppdb_hero_subtitle || "",
    ppdb_hero_bg_image: data.ppdb_hero_bg_image || "",
    ppdb_phone: formatPhoneNumber(data.ppdb_phone || ""),
    ppdb_email: data.ppdb_email || "",
    ppdb_address: data.ppdb_address || "",
    ppdb_map_title: data.ppdb_map_title || "",
    ppdb_map_url: data.ppdb_map_url || "",
    ppdb_school_period: data.ppdb_school_period || "",
    ppdb_wa_group_url: data.ppdb_wa_group_url || "",
    ppdb_wa_admin: formatPhoneNumber(data.ppdb_wa_admin || ""),
    ppdb_form_guideline: data.ppdb_form_guideline || "",
    ppdb_form_fee: data.ppdb_form_fee || "",
    ppdb_logo_url: data.ppdb_logo_url || "",
    ppdb_title: data.ppdb_title || "",
    ppdb_footer_desc: data.ppdb_footer_desc || "",
    ppdb_alur_config: Array.isArray(data.ppdb_alur_config)
      ? data.ppdb_alur_config
      : [],
    ppdb_majors_config: Array.isArray(data.ppdb_majors_config)
      ? data.ppdb_majors_config
      : [],
    ppdb_faq_config: Array.isArray(data.ppdb_faq_config)
      ? data.ppdb_faq_config
      : [],
    ppdb_faq_title: data.ppdb_faq_title || "",
    ppdb_faq_subtitle: data.ppdb_faq_subtitle || "",
    ppdb_partners_config: Array.isArray(data.ppdb_partners_config)
      ? data.ppdb_partners_config
      : [],
    ppdb_gelombang_config: data.ppdb_gelombang_config,
    ppdb_fields_config:
      data.ppdb_fields_config && typeof data.ppdb_fields_config === "object"
        ? { ...DEFAULT_FIELDS_CONFIG_UI, ...data.ppdb_fields_config }
        : DEFAULT_FIELDS_CONFIG_UI,
  });
}
