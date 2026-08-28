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
  ppdbLogo: "",
  ppdbTitle: "",
  ppdbFooterDesc: "",
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
      get().resolveSchoolBySlug(slug).finally(() => {
        get().fetchConfigs(slug);
      });
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
      const [configRes, profileRes] = await Promise.all([
        fetch(`/api/config?school_slug=${encodeURIComponent(slug)}&_t=${Date.now()}`, { cache: "no-store" }),
        fetch(`/api/school-profile?school_slug=${encodeURIComponent(slug)}&_t=${Date.now()}`, { cache: "no-store" }).catch(() => null)
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let configData: any = {};
      if (configRes.ok && configRes.headers.get("content-type")?.includes("application/json")) {
        const cJson = await configRes.json();
        if (cJson.success && cJson.data) configData = cJson.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let profileData: any = null;
      if (profileRes && profileRes.ok && profileRes.headers.get("content-type")?.includes("application/json")) {
        const pJson = await profileRes.json();
        if (pJson.success && pJson.data) profileData = pJson.data;
      }

      let profil = profileData || configData.ppdb_profil_sekolah || get().profilSekolah;
      if (typeof profil === "string" && (profil.startsWith("{") || profil.startsWith("["))) {
        try { profil = JSON.parse(profil); } catch (_e) {}
      }

      set({
        ppdbLogo: profileData?.logo_url || configData.ppdb_logo_url || get().ppdbLogo,
        ppdbTitle: profileData?.nama || profileData?.identitas?.nama || configData.ppdb_title || get().ppdbTitle,
        ppdbFooterDesc: configData.ppdb_footer_desc || get().ppdbFooterDesc,
        profilSekolah: profil,
        schoolPeriod: configData.ppdb_school_period || get().schoolPeriod,
        isConfigLoaded: true,
      });
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
      const res = await fetch(`/api/saas/school-by-slug/${encodeURIComponent(slug)}?_t=${Date.now()}`, {
        cache: "no-store"
      });
      if (!res.headers.get("content-type")?.includes("application/json")) return;
      const data = await res.json();
      if (data && data.notFound) {
        set({ isSchoolNotFound: true });
      } else if (data && data.success && data.data) {
        const schoolUuid = data.data.school_uuid || data.data.id;
        const currentProfil = get().profilSekolah || {};
        const currentIdentitas = currentProfil.identitas || {};
        set((state) => ({
          isSchoolNotFound: false,
          schoolId: schoolUuid,
          schoolStatus: data.data.status || state.schoolStatus,
          ppdbLogo: state.ppdbLogo || data.data.logo_url || "",
          ppdbTitle: state.ppdbTitle || data.data.name || "",
          profilSekolah: {
            ...currentProfil,
            identitas: {
              ...currentIdentitas,
              nama: currentIdentitas.nama || state.ppdbTitle || data.data.name || "",
              npsn: currentIdentitas.npsn || data.data.npsn || "",
              akreditasi: currentIdentitas.akreditasi || data.data.accreditation || "",
              email: currentIdentitas.email || data.data.official_email || "",
              telepon: currentIdentitas.telepon || data.data.phone || ""
            }
          }
        }));
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
