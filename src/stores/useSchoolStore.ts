import { create } from "zustand";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProfilSekolah = any;

interface SchoolState {
  schoolId: string;
  schoolSlug: string;
  schoolStatus: string;
  isDemoMode: boolean;
  isSchoolNotFound: boolean;
  isConfigLoaded: boolean;
  ppdbLogo: string;
  ppdbTitle: string;
  ppdbFooterDesc: string;
  schoolPeriod: string;
  profilSekolah: ProfilSekolah | null;

  setSchoolId: (id: string) => void;
  setSchoolSlug: (slug: string) => void;
  setSchoolStatus: (status: string) => void;
  setIsSchoolNotFound: (notFound: boolean) => void;
  setPpdbLogo: (logo: string) => void;
  setPpdbTitle: (title: string) => void;
  setPpdbFooterDesc: (desc: string) => void;
  setSchoolPeriod: (period: string) => void;
  setProfilSekolah: (profil: ProfilSekolah | ((prev: ProfilSekolah | null) => ProfilSekolah | null)) => void;

  fetchConfigs: (customSlug?: string) => Promise<void>;
  resolveSchoolBySlug: (slug: string) => Promise<void>;
  applyThemeColor: (color: string) => void;
}

const SAFE_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\))$/;

export const useSchoolStore = create<SchoolState>((set, get) => ({
  schoolId: "",
  schoolSlug: "",
  schoolStatus: "",
  isDemoMode: false,
  isSchoolNotFound: false,
  isConfigLoaded: false,
  ppdbLogo: "/assets/logo_sekolah/logo_smktb.png",
  ppdbTitle: "SMK TB",
  ppdbFooterDesc:
    "Pionir pendidikan kejuruan teknologi informasi dan industri kreatif. Membina talenta unggul berkarakter mulia dan berdaya saing global.",
  schoolPeriod: "2026-2027",
  profilSekolah: null,

  setSchoolId: (id) => {
    set({ schoolId: id });
    if (id) {
      fetch(`/api/config?school_id=${id}`)
        .then((res) => (res.ok && res.headers.get("content-type")?.includes("application/json") ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.data?.ppdb_school_theme_color) {
            get().applyThemeColor(data.data.ppdb_school_theme_color);
          }
        })
        .catch((err) => console.error("Gagal mengambil config tema sekolah:", err));
    }
  },

  setSchoolSlug: (slugInput) => {
    let slug = slugInput;
    if (!slug && typeof window !== "undefined") {
      const host = window.location.host.split(":")[0].toLowerCase();
      if (host.endsWith(".cationgate.site")) {
        const sub = host.replace(".cationgate.site", "");
        if (!["www", "api", "admin", "app", "mail"].includes(sub)) slug = sub;
      } else if (host.endsWith(".localhost")) {
        const sub = host.replace(".localhost", "");
        if (!["www", "api", "admin", "app", "mail"].includes(sub)) slug = sub;
      }
    }
    const isDemo =
      slug === "demo" ||
      (typeof window !== "undefined" &&
        (window.location.pathname.startsWith("/demo") ||
          window.location.host.startsWith("demo.")));
    set({
      schoolSlug: slug,
      isDemoMode: isDemo,
    });
    if (slug) {
      get().resolveSchoolBySlug(slug);
      get().fetchConfigs(slug);
    }
  },

  setSchoolStatus: (status) => set({ schoolStatus: status }),
  setIsSchoolNotFound: (notFound) => set({ isSchoolNotFound: notFound }),
  setPpdbLogo: (logo) => set({ ppdbLogo: logo }),
  setPpdbTitle: (title) => set({ ppdbTitle: title }),
  setPpdbFooterDesc: (desc) => set({ ppdbFooterDesc: desc }),
  setSchoolPeriod: (period) => set({ schoolPeriod: period }),
  setProfilSekolah: (profilOrUpdater) => {
    set((state) => ({
      profilSekolah: typeof profilOrUpdater === "function" ? profilOrUpdater(state.profilSekolah) : profilOrUpdater,
    }));
  },

  applyThemeColor: (themeColor: string) => {
    if (typeof document === "undefined") return;
    if (!SAFE_COLOR_RE.test(themeColor)) {
      console.warn("Invalid theme color rejected:", themeColor);
      return;
    }
    const styleId = "ppdb-school-theme";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      :where(:not(.dark *)):where(:not([data-dashboard] *)) .text-primary { color: ${themeColor} !important; }
      :where(:not(.dark *)):where(:not([data-dashboard] *)) .bg-primary { background-color: ${themeColor} !important; }
      :where(:not(.dark *)):where(:not([data-dashboard] *)) .border-primary { border-color: ${themeColor} !important; }
      [data-dashboard] .bg-blue-600 { background-color: ${themeColor} !important; }
      [data-dashboard] .text-blue-600 { color: ${themeColor} !important; }
      [data-dashboard] .border-blue-600 { border-color: ${themeColor} !important; }
    `;
  },

  fetchConfigs: async (customSlug?: string) => {
    const slug = customSlug || get().schoolSlug;
    const isDemo = get().isDemoMode || slug === "demo" || (typeof window !== "undefined" && window.location.pathname.startsWith("/demo"));
    if (isDemo) {
      set({
        ppdbTitle: "SMK Demo Indonesia",
        ppdbLogo: "/assets/logo_sekolah/logo_smktb.png",
        ppdbFooterDesc: "Portal simulasi dan demonstrasi interaktif sistem SPMB CationGate untuk sekolah kejuruan di Indonesia.",
        schoolPeriod: "2026-2027",
        isConfigLoaded: true,
      });
      return;
    }

    try {
      const res = await fetch(`/api/config?school_slug=${slug}&t=${Date.now()}`);
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data.success && data.data) {
        set({
          ppdbLogo: data.data.ppdb_logo_url || get().ppdbLogo,
          ppdbTitle: data.data.ppdb_title || get().ppdbTitle,
          ppdbFooterDesc: data.data.ppdb_footer_desc || get().ppdbFooterDesc,
          profilSekolah: data.data.ppdb_profil_sekolah || get().profilSekolah,
          schoolPeriod: data.data.ppdb_school_period || get().schoolPeriod,
          isConfigLoaded: true,
        });
      } else {
        set({ isConfigLoaded: true });
      }
    } catch (err) {
      console.error("Gagal mengambil config:", err);
      set({ isConfigLoaded: true });
    }
  },

  resolveSchoolBySlug: async (slug: string) => {
    if (slug === "demo" || (typeof window !== "undefined" && window.location.pathname.startsWith("/demo"))) {
      set({
        isSchoolNotFound: false,
        schoolId: "demo",
        schoolStatus: "FULL_VERIFIED",
        ppdbTitle: "SMK Demo Indonesia",
        ppdbLogo: "/assets/logo_sekolah/logo_smktb.png",
      });
      return;
    }

    if (!slug) return;

    try {
      const res = await fetch(`/api/saas/school-by-slug/${slug}?t=${Date.now()}`);
      if (!res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data && data.notFound) {
        set({ isSchoolNotFound: true });
      } else if (data && data.success && data.data) {
        const schoolUuid = data.data.school_uuid || data.data.id;
        set({
          isSchoolNotFound: false,
          schoolId: schoolUuid,
          schoolStatus: data.data.status || get().schoolStatus,
          ppdbLogo: data.data.logo_url || get().ppdbLogo,
          ppdbTitle: data.data.name || get().ppdbTitle,
        });
        if (schoolUuid) {
          get().setSchoolId(schoolUuid);
        }
      } else if (slug !== "smktarunabhakti" && slug !== "demo") {
        set({ isSchoolNotFound: true });
      } else {
        set({
          isSchoolNotFound: false,
          schoolId: slug,
          ppdbTitle: slug === "smktarunabhakti" ? "SMK Taruna Bhakti" : "SMK Demo Indonesia",
        });
      }
    } catch (err: unknown) {
      console.warn("Gagal mengambil data sekolah:", err instanceof Error ? err.message : String(err));
    }
  },
}));
