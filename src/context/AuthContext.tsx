"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "./ToastContext";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children, schoolId }: { children: React.ReactNode; schoolId: string }) {
  const { addToast } = useToast();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [gatekeeperToken, setGatekeeperToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gatekeeperUser, setGatekeeperUser] = useState<any | null>(null);

  // Restore token & user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Restore Admin Session
      const token = localStorage.getItem("ppdb_admin_token");
      if (token && !token.includes('.')) {
        localStorage.removeItem("ppdb_admin_token");
        localStorage.removeItem("ppdb_admin_user");
        localStorage.removeItem("ppdb_admin_last_active");
      } else {
        const lastActive = localStorage.getItem("ppdb_admin_last_active");
        if (token && lastActive) {
          const elapsed = Date.now() - parseInt(lastActive, 10);
          if (elapsed > 60 * 60 * 1000) {
            localStorage.removeItem("ppdb_admin_token");
            localStorage.removeItem("ppdb_admin_user");
            localStorage.removeItem("ppdb_admin_last_active");
          } else {
            setAdminToken(token);
          }
        } else if (token) {
          setAdminToken(token);
        }
      }

      const savedUser = localStorage.getItem("ppdb_admin_user");
      if (savedUser) {
        try {
          setAdminUser(JSON.parse(savedUser));
        } catch (_e) {
          // ignore
        }
      }

      // 2. Restore Gatekeeper Session
      const gkToken = localStorage.getItem("gatekeeper_token");
      if (gkToken && !gkToken.includes('.')) {
        localStorage.removeItem("gatekeeper_token");
        localStorage.removeItem("gatekeeper_user");
        localStorage.removeItem("gatekeeper_last_active");
      } else {
        const gkLastActive = localStorage.getItem("gatekeeper_last_active");
        if (gkToken && gkLastActive) {
          const elapsed = Date.now() - parseInt(gkLastActive, 10);
          if (elapsed > 60 * 60 * 1000) {
            localStorage.removeItem("gatekeeper_token");
            localStorage.removeItem("gatekeeper_user");
            localStorage.removeItem("gatekeeper_last_active");
          } else {
            setGatekeeperToken(gkToken);
          }
        } else if (gkToken) {
          setGatekeeperToken(gkToken);
        }
      }

      const savedGkUser = localStorage.getItem("gatekeeper_user");
      if (savedGkUser) {
        try {
          setGatekeeperUser(JSON.parse(savedGkUser));
        } catch (_e) {
          // ignore
        }
      }
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

  const loginAdmin = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`/api/auth/login${schoolId ? '?school_id=' + schoolId : ''}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
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
      console.error("Login error:", (err as any).message);
      return { success: false, message: "Terjadi kesalahan koneksi. Silakan coba lagi." };
    }
  }, [addToast, schoolId]);

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
      console.error("Login Gatekeeper error:", (err as any).message);
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
