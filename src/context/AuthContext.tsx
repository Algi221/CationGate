"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "./ToastContext";

interface AuthContextType {
  adminToken: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminUser: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAdminUser: React.Dispatch<React.SetStateAction<any | null>>;
  gatekeeperToken: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gatekeeperUser: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setGatekeeperUser: React.Dispatch<React.SetStateAction<any | null>>;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginGatekeeper: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  logoutGatekeeper: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, schoolId, schoolSlug }: { children: React.ReactNode; schoolId?: string; schoolSlug?: string }) {
  const { addToast } = useToast();
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("ppdb_admin_token");
      if (token && token.includes('.')) {
        const lastActive = localStorage.getItem("ppdb_admin_last_active");
        if (lastActive) {
          const elapsed = Date.now() - parseInt(lastActive, 10);
          if (elapsed <= 60 * 60 * 1000) return token;
        } else {
          return token;
        }
      }
    }
    return null;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("ppdb_admin_user");
      if (savedUser) {
        try { return JSON.parse(savedUser); } catch {}
      }
    }
    return null;
  });

  const [gatekeeperToken, setGatekeeperToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const gkToken = localStorage.getItem("gatekeeper_token");
      if (gkToken && gkToken.includes('.')) {
        const gkLastActive = localStorage.getItem("gatekeeper_last_active");
        if (gkLastActive) {
          const elapsed = Date.now() - parseInt(gkLastActive, 10);
          if (elapsed <= 60 * 60 * 1000) return gkToken;
        } else {
          return gkToken;
        }
      }
    }
    return null;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gatekeeperUser, setGatekeeperUser] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      const savedGkUser = localStorage.getItem("gatekeeper_user");
      if (savedGkUser) {
        try { return JSON.parse(savedGkUser); } catch {}
      }
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncAuth = () => {
        const token = localStorage.getItem("ppdb_admin_token");
        if (token && !token.includes('.')) {
          localStorage.removeItem("ppdb_admin_token");
          localStorage.removeItem("ppdb_admin_user");
          localStorage.removeItem("ppdb_admin_last_active");
          setAdminToken(null);
          setAdminUser(null);
        } else if (token) {
          const lastActive = localStorage.getItem("ppdb_admin_last_active");
          if (lastActive) {
            const elapsed = Date.now() - parseInt(lastActive, 10);
            if (elapsed > 60 * 60 * 1000) {
              localStorage.removeItem("ppdb_admin_token");
              localStorage.removeItem("ppdb_admin_user");
              localStorage.removeItem("ppdb_admin_last_active");
              setAdminToken(null);
              setAdminUser(null);
            } else {
              setAdminToken(token);
              const savedUser = localStorage.getItem("ppdb_admin_user");
              if (savedUser) {
                try { setAdminUser(JSON.parse(savedUser)); } catch {}
              }
            }
          } else {
            setAdminToken(token);
            const savedUser = localStorage.getItem("ppdb_admin_user");
            if (savedUser) {
              try { setAdminUser(JSON.parse(savedUser)); } catch {}
            }
          }
        }

        const gkToken = localStorage.getItem("gatekeeper_token");
        if (gkToken && !gkToken.includes('.')) {
          localStorage.removeItem("gatekeeper_token");
          localStorage.removeItem("gatekeeper_user");
          localStorage.removeItem("gatekeeper_last_active");
          setGatekeeperToken(null);
          setGatekeeperUser(null);
        } else if (gkToken) {
          const gkLastActive = localStorage.getItem("gatekeeper_last_active");
          if (gkLastActive) {
            const elapsed = Date.now() - parseInt(gkLastActive, 10);
            if (elapsed > 60 * 60 * 1000) {
              localStorage.removeItem("gatekeeper_token");
              localStorage.removeItem("gatekeeper_user");
              localStorage.removeItem("gatekeeper_last_active");
              setGatekeeperToken(null);
              setGatekeeperUser(null);
            } else {
              setGatekeeperToken(gkToken);
              const savedGkUser = localStorage.getItem("gatekeeper_user");
              if (savedGkUser) {
                try { setGatekeeperUser(JSON.parse(savedGkUser)); } catch {}
              }
            }
          } else {
            setGatekeeperToken(gkToken);
            const savedGkUser = localStorage.getItem("gatekeeper_user");
            if (savedGkUser) {
              try { setGatekeeperUser(JSON.parse(savedGkUser)); } catch {}
            }
          }
        }
      };

      syncAuth();
      window.addEventListener("storage", syncAuth);
      return () => window.removeEventListener("storage", syncAuth);
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("ppdb_admin_token");
    localStorage.removeItem("ppdb_admin_user");
    localStorage.removeItem("ppdb_admin_last_active");
  }, []);

  const logoutGatekeeper = useCallback(() => {
    setGatekeeperToken(null);
    setGatekeeperUser(null);
    localStorage.removeItem("gatekeeper_token");
    localStorage.removeItem("gatekeeper_user");
    localStorage.removeItem("gatekeeper_last_active");
  }, []);

  const loginAdmin = useCallback(async (username: string, password: string, schoolSlugParam?: string) => {
    try {
      const targetSlug = schoolSlugParam || schoolSlug;
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password, 
          school_id: schoolId || undefined,
          school_slug: targetSlug || undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ success: false, message: "Login gagal" }));
        return { success: false, message: errorData.message || "Username atau password salah" };
      }

      const data = await res.json();
      if (data && data.success) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem("ppdb_admin_token", data.token);
        localStorage.setItem("ppdb_admin_user", JSON.stringify(data.admin));
        localStorage.setItem("ppdb_admin_last_active", Date.now().toString());
        addToast("Login Berhasil", `Selamat datang, ${data.admin?.nama || username}!`, "success");
        return { success: true };
      } else {
        return { success: false, message: data.message || "Username atau password salah" };
      }
    } catch (err: unknown) {
      console.error("Login error:", err instanceof Error ? err.message : String(err));
      return { success: false, message: "Terjadi kesalahan koneksi. Silakan coba lagi." };
    }
  }, [addToast, schoolId, schoolSlug]);

  const loginGatekeeper = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`/api/gatekeeper/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ success: false, message: "Login gatekeeper gagal" }));
        return { success: false, message: errorData.message || "Username atau password salah" };
      }

      const data = await res.json();
      if (data && data.success) {
        setGatekeeperToken(data.token);
        setGatekeeperUser(data.gatekeeper);
        localStorage.setItem("gatekeeper_token", data.token);
        localStorage.setItem("gatekeeper_user", JSON.stringify(data.gatekeeper));
        localStorage.setItem("gatekeeper_last_active", Date.now().toString());
        addToast("Login Gatekeeper Berhasil", `Selamat datang, ${data.gatekeeper?.nama_lengkap || username}!`, "success");
        return { success: true };
      } else {
        return { success: false, message: data.message || "Username atau password salah" };
      }
    } catch (err: unknown) {
      console.error("Login Gatekeeper error:", err instanceof Error ? err.message : String(err));
      return { success: false, message: "Terjadi kesalahan koneksi. Silakan coba lagi." };
    }
  }, [addToast]);

  return (
    <AuthContext.Provider value={{ 
      adminToken, adminUser, setAdminUser, loginAdmin, logoutAdmin,
      gatekeeperToken, gatekeeperUser, setGatekeeperUser, loginGatekeeper, logoutGatekeeper
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
