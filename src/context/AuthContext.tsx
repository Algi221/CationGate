"use client";

import React, { createContext, useEffect, useCallback } from "react";
import { useAuthStore, type AuthUser } from "@/stores/useAuthStore";
import { useSchoolStore } from "@/stores/useSchoolStore";

interface AuthContextType {
  adminToken: string | null;
  adminUser: AuthUser | null;
  setAdminUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  gatekeeperToken: string | null;
  gatekeeperUser: AuthUser | null;
  setGatekeeperUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  loginAdmin: (username: string, password: string, schoolSlugParam?: string) => Promise<{ success: boolean; message?: string }>;
  loginGatekeeper: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  logoutGatekeeper: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  schoolId,
  schoolSlug,
}: {
  children: React.ReactNode;
  schoolId?: string;
  schoolSlug?: string;
}) {
  const adminToken = useAuthStore((s) => s.adminToken);
  const adminUser = useAuthStore((s) => s.adminUser);
  const gatekeeperToken = useAuthStore((s) => s.gatekeeperToken);
  const gatekeeperUser = useAuthStore((s) => s.gatekeeperUser);
  const setAdminUser = useAuthStore((s) => s.setAdminUser);
  const setGatekeeperUser = useAuthStore((s) => s.setGatekeeperUser);
  const storeLoginAdmin = useAuthStore((s) => s.loginAdmin);
  const storeLoginGatekeeper = useAuthStore((s) => s.loginGatekeeper);
  const logoutAdmin = useAuthStore((s) => s.logoutAdmin);
  const logoutGatekeeper = useAuthStore((s) => s.logoutGatekeeper);
  const initAuthSync = useAuthStore((s) => s.initAuthSync);

  const currentSchoolId = useSchoolStore((s) => s.schoolId);
  const currentSchoolSlug = useSchoolStore((s) => s.schoolSlug);

  useEffect(() => {
    const cleanup = initAuthSync();
    return cleanup;
  }, [initAuthSync]);

  const loginAdmin = useCallback(
    async (username: string, password: string, schoolSlugParam?: string) => {
      const effectiveSlug = schoolSlugParam || schoolSlug || currentSchoolSlug;
      const effectiveId = schoolId || currentSchoolId;
      return storeLoginAdmin(username, password, effectiveSlug, effectiveId);
    },
    [storeLoginAdmin, schoolSlug, currentSchoolSlug, schoolId, currentSchoolId]
  );

  const loginGatekeeper = useCallback(
    async (username: string, password: string) => {
      return storeLoginGatekeeper(username, password);
    },
    [storeLoginGatekeeper]
  );

  const value: AuthContextType = {
    adminToken,
    adminUser,
    setAdminUser: setAdminUser as React.Dispatch<React.SetStateAction<AuthUser | null>>,
    gatekeeperToken,
    gatekeeperUser,
    setGatekeeperUser: setGatekeeperUser as React.Dispatch<React.SetStateAction<AuthUser | null>>,
    loginAdmin,
    loginGatekeeper,
    logoutAdmin,
    logoutGatekeeper,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const adminToken = useAuthStore((s) => s.adminToken);
  const adminUser = useAuthStore((s) => s.adminUser);
  const gatekeeperToken = useAuthStore((s) => s.gatekeeperToken);
  const gatekeeperUser = useAuthStore((s) => s.gatekeeperUser);
  const setAdminUser = useAuthStore((s) => s.setAdminUser);
  const setGatekeeperUser = useAuthStore((s) => s.setGatekeeperUser);
  const loginAdmin = useAuthStore((s) => s.loginAdmin);
  const loginGatekeeper = useAuthStore((s) => s.loginGatekeeper);
  const logoutAdmin = useAuthStore((s) => s.logoutAdmin);
  const logoutGatekeeper = useAuthStore((s) => s.logoutGatekeeper);

  return {
    adminToken,
    adminUser,
    setAdminUser: setAdminUser as React.Dispatch<React.SetStateAction<AuthUser | null>>,
    gatekeeperToken,
    gatekeeperUser,
    setGatekeeperUser: setGatekeeperUser as React.Dispatch<React.SetStateAction<AuthUser | null>>,
    loginAdmin,
    loginGatekeeper,
    logoutAdmin,
    logoutGatekeeper,
  };
}
