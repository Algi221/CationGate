import { create } from "zustand";
import { useToastStore } from "./useToastStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthUser = any;

interface AuthState {
  adminToken: string | null;
  adminUser: AuthUser | null;
  gatekeeperToken: string | null;
  gatekeeperUser: AuthUser | null;

  setAdminToken: (token: string | null) => void;
  setAdminUser: (user: AuthUser | null | ((prev: AuthUser | null) => AuthUser | null)) => void;
  setGatekeeperToken: (token: string | null) => void;
  setGatekeeperUser: (user: AuthUser | null | ((prev: AuthUser | null) => AuthUser | null)) => void;

  loginAdmin: (username: string, password: string, schoolSlugParam?: string, schoolIdParam?: string) => Promise<{ success: boolean; message?: string }>;
  loginGatekeeper: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  logoutGatekeeper: () => void;
  initAuthSync: () => () => void;
}

const getInitialAdminToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem("ppdb_admin_token");
    if (token && token.includes(".")) {
      const lastActive = localStorage.getItem("ppdb_admin_last_active");
      if (lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed <= 60 * 60 * 1000) return token;
      } else {
        return token;
      }
    }
  } catch {}
  return null;
};

const getInitialAdminUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const savedUser = localStorage.getItem("ppdb_admin_user");
    if (savedUser) return JSON.parse(savedUser);
  } catch {}
  return null;
};

const getInitialGatekeeperToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const gkToken = localStorage.getItem("gatekeeper_token");
    if (gkToken && gkToken.includes(".")) {
      const gkLastActive = localStorage.getItem("gatekeeper_last_active");
      if (gkLastActive) {
        const elapsed = Date.now() - parseInt(gkLastActive, 10);
        if (elapsed <= 60 * 60 * 1000) return gkToken;
      } else {
        return gkToken;
      }
    }
  } catch {}
  return null;
};

const getInitialGatekeeperUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const savedGkUser = localStorage.getItem("gatekeeper_user");
    if (savedGkUser) return JSON.parse(savedGkUser);
  } catch {}
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  adminToken: getInitialAdminToken(),
  adminUser: getInitialAdminUser(),
  gatekeeperToken: getInitialGatekeeperToken(),
  gatekeeperUser: getInitialGatekeeperUser(),

  setAdminToken: (token) => set({ adminToken: token }),
  setAdminUser: (userOrUpdater) => {
    set((state) => ({
      adminUser: typeof userOrUpdater === "function" ? userOrUpdater(state.adminUser) : userOrUpdater,
    }));
  },
  setGatekeeperToken: (token) => set({ gatekeeperToken: token }),
  setGatekeeperUser: (userOrUpdater) => {
    set((state) => ({
      gatekeeperUser: typeof userOrUpdater === "function" ? userOrUpdater(state.gatekeeperUser) : userOrUpdater,
    }));
  },

  logoutAdmin: () => {
    set({ adminToken: null, adminUser: null });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("ppdb_admin_token");
        localStorage.removeItem("ppdb_admin_user");
        localStorage.removeItem("ppdb_admin_last_active");
      } catch {}
    }
  },

  logoutGatekeeper: () => {
    set({ gatekeeperToken: null, gatekeeperUser: null });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("gatekeeper_token");
        localStorage.removeItem("gatekeeper_user");
        localStorage.removeItem("gatekeeper_last_active");
      } catch {}
    }
  },

  loginAdmin: async (username: string, password: string, schoolSlugParam?: string, schoolIdParam?: string) => {
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          school_id: schoolIdParam || undefined,
          school_slug: schoolSlugParam || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ success: false, message: "Login gagal" }));
        return { success: false, message: errorData.message || "Username atau password salah" };
      }

      const data = await res.json();
      if (data && data.success) {
        set({ adminToken: data.token, adminUser: data.admin });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("ppdb_admin_token", data.token);
            localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
            localStorage.setItem("ppdb_admin_last_active", Date.now().toString());
          } catch {}
        }
        useToastStore.getState().addToast("Login Berhasil", `Selamat datang, ${data.admin?.nama || username}!`, "success");
        return { success: true };
      } else {
        return { success: false, message: data.message || "Username atau password salah" };
      }
    } catch (err: unknown) {
      console.error("Login error:", err instanceof Error ? err.message : String(err));
      return { success: false, message: "Terjadi kesalahan koneksi. Silakan coba lagi." };
    }
  },

  loginGatekeeper: async (username: string, password: string) => {
    try {
      const res = await fetch(`/api/gatekeeper/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ success: false, message: "Login gatekeeper gagal" }));
        return { success: false, message: errorData.message || "Username atau password salah" };
      }

      const data = await res.json();
      if (data && data.success) {
        set({ gatekeeperToken: data.token, gatekeeperUser: data.gatekeeper });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("gatekeeper_token", data.token);
            localStorage.setItem("gatekeeper_user", JSON.stringify(data.gatekeeper));
            localStorage.setItem("gatekeeper_last_active", Date.now().toString());
          } catch {}
        }
        useToastStore.getState().addToast(
          "Login Gatekeeper Berhasil",
          `Selamat datang, ${data.gatekeeper?.nama_lengkap || username}!`,
          "success"
        );
        return { success: true };
      } else {
        return { success: false, message: data.message || "Username atau password salah" };
      }
    } catch (err: unknown) {
      console.error("Login Gatekeeper error:", err instanceof Error ? err.message : String(err));
      return { success: false, message: "Terjadi kesalahan koneksi. Silakan coba lagi." };
    }
  },

  initAuthSync: () => {
    if (typeof window === "undefined") return () => {};

    const syncAuth = () => {
      const token = localStorage.getItem("ppdb_admin_token");
      if (token && !token.includes(".")) {
        localStorage.removeItem("ppdb_admin_token");
        localStorage.removeItem("ppdb_admin_user");
        localStorage.removeItem("ppdb_admin_last_active");
        set({ adminToken: null, adminUser: null });
      } else if (token) {
        const lastActive = localStorage.getItem("ppdb_admin_last_active");
        if (lastActive) {
          const elapsed = Date.now() - parseInt(lastActive, 10);
          if (elapsed > 60 * 60 * 1000) {
            localStorage.removeItem("ppdb_admin_token");
            localStorage.removeItem("ppdb_admin_user");
            localStorage.removeItem("ppdb_admin_last_active");
            set({ adminToken: null, adminUser: null });
          } else {
            set({ adminToken: token });
            const savedUser = localStorage.getItem("ppdb_admin_user");
            if (savedUser) {
              try {
                set({ adminUser: JSON.parse(savedUser) });
              } catch {}
            }
          }
        } else {
          set({ adminToken: token });
          const savedUser = localStorage.getItem("ppdb_admin_user");
          if (savedUser) {
            try {
              set({ adminUser: JSON.parse(savedUser) });
            } catch {}
          }
        }
      } else {
        set({ adminToken: null, adminUser: null });
      }

      const gkToken = localStorage.getItem("gatekeeper_token");
      if (gkToken && !gkToken.includes(".")) {
        localStorage.removeItem("gatekeeper_token");
        localStorage.removeItem("gatekeeper_user");
        localStorage.removeItem("gatekeeper_last_active");
        set({ gatekeeperToken: null, gatekeeperUser: null });
      } else if (gkToken) {
        const gkLastActive = localStorage.getItem("gatekeeper_last_active");
        if (gkLastActive) {
          const elapsed = Date.now() - parseInt(gkLastActive, 10);
          if (elapsed > 60 * 60 * 1000) {
            localStorage.removeItem("gatekeeper_token");
            localStorage.removeItem("gatekeeper_user");
            localStorage.removeItem("gatekeeper_last_active");
            set({ gatekeeperToken: null, gatekeeperUser: null });
          } else {
            set({ gatekeeperToken: gkToken });
            const savedGkUser = localStorage.getItem("gatekeeper_user");
            if (savedGkUser) {
              try {
                set({ gatekeeperUser: JSON.parse(savedGkUser) });
              } catch {}
            }
          }
        } else {
          set({ gatekeeperToken: gkToken });
          const savedGkUser = localStorage.getItem("gatekeeper_user");
          if (savedGkUser) {
            try {
              set({ gatekeeperUser: JSON.parse(savedGkUser) });
            } catch {}
          }
        }
      } else {
        set({ gatekeeperToken: null, gatekeeperUser: null });
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  },
}));
