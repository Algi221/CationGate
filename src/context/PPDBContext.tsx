"use client";

import React, { createContext, useEffect } from "react";
import { ToastProvider, useToast } from "./ToastContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { SchoolProvider, useSchool } from "./SchoolContext";

import { useToastStore } from "@/stores/useToastStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSchoolStore } from "@/stores/useSchoolStore";
import {
  usePPDBStore,
  type WsLog,
} from "@/stores/usePPDBStore";

export { DEMO_TRASHED_APPLICANTS_SEED } from "@/stores/usePPDBStore";
export { useToast } from "./ToastContext";
export { useAuth } from "./AuthContext";
export { useSchool } from "./SchoolContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PPDBRecord = any;

export interface PPDBContextType {
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;

  adminToken: string | null;
  adminUser: PPDBRecord | null;
  setAdminUser: React.Dispatch<React.SetStateAction<PPDBRecord | null>>;
  loginAdmin: (username: string, password: string, schoolSlugParam?: string) => Promise<{ success: boolean; message?: string }>;
  loginGatekeeper: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  logoutGatekeeper: () => void;
  gatekeeperToken: string | null;
  gatekeeperUser: PPDBRecord | null;

  schoolId: string;
  schoolStatus: string;
  isDemoMode: boolean;
  isSchoolNotFound: boolean;
  isConfigLoaded: boolean;
  ppdbLogo: string;
  ppdbTitle: string;
  ppdbFooterDesc: string;
  schoolPeriod: string;
  profilSekolah: PPDBRecord;
  setProfilSekolah: React.Dispatch<React.SetStateAction<PPDBRecord>>;
  fetchConfigs: () => Promise<void>;

  toasts: { id: string; title: string; message: string; type: string }[];
  addToast: (title: string, message: string, type?: string) => void;

  applicants: PPDBRecord[];
  setApplicants: React.Dispatch<React.SetStateAction<PPDBRecord[]>>;
  publicApplicants: PPDBRecord[];
  activeStudents: PPDBRecord[];
  wsStatus: string;
  wsLogs: WsLog[];
  simulationActive: boolean;
  setSimulationActive: React.Dispatch<React.SetStateAction<boolean>>;

  registerApplicant: (formData: PPDBRecord) => Promise<{ success: boolean; data?: PPDBRecord; message?: string }>;
  verifyApplicant: (id: number) => Promise<void>;
  rejectApplicant: (id: number, alasan_ditolak?: string) => Promise<void>;
  deleteApplicant: (id: number) => Promise<void>;
  updateApplicant: (id: number, updatedData: PPDBRecord) => Promise<{ success: boolean; data?: PPDBRecord; message?: string }>;
  updateActiveStudent: (id: number, updatedData: PPDBRecord) => Promise<{ success: boolean; data?: PPDBRecord; message?: string }>;
  deleteActiveStudent: (id: number) => Promise<void>;
  fetchPublicApplicants: () => Promise<void>;
  fetchAdminApplicants: () => Promise<void>;
  fetchActiveStudents: () => Promise<void>;
  simulateRegistration: () => Promise<void>;
  checkPaymentStatus: (nisn: string) => Promise<PPDBRecord>;
}

const PPDBContext = createContext<PPDBContextType | null>(null);

function PPDBLifeCycleSync({ children }: { children: React.ReactNode }) {
  const isLoaded = usePPDBStore((s) => s.isLoaded);
  const setIsLoaded = usePPDBStore((s) => s.setIsLoaded);
  const applicants = usePPDBStore((s) => s.applicants);
  const setApplicants = usePPDBStore((s) => s.setApplicants);
  const publicApplicants = usePPDBStore((s) => s.publicApplicants);
  const activeStudents = usePPDBStore((s) => s.activeStudents);
  const wsStatus = usePPDBStore((s) => s.wsStatus);
  const wsLogs = usePPDBStore((s) => s.wsLogs);
  const simulationActive = usePPDBStore((s) => s.simulationActive);
  const setSimulationActive = usePPDBStore((s) => s.setSimulationActive);

  const fetchPublicApplicants = usePPDBStore((s) => s.fetchPublicApplicants);
  const fetchAdminApplicants = usePPDBStore((s) => s.fetchAdminApplicants);
  const fetchActiveStudents = usePPDBStore((s) => s.fetchActiveStudents);
  const registerApplicant = usePPDBStore((s) => s.registerApplicant);
  const verifyApplicant = usePPDBStore((s) => s.verifyApplicant);
  const rejectApplicant = usePPDBStore((s) => s.rejectApplicant);
  const deleteApplicant = usePPDBStore((s) => s.deleteApplicant);
  const updateApplicant = usePPDBStore((s) => s.updateApplicant);
  const updateActiveStudent = usePPDBStore((s) => s.updateActiveStudent);
  const deleteActiveStudent = usePPDBStore((s) => s.deleteActiveStudent);
  const simulateRegistration = usePPDBStore((s) => s.simulateRegistration);
  const checkPaymentStatus = usePPDBStore((s) => s.checkPaymentStatus);
  const initRealtimeSubscription = usePPDBStore((s) => s.initRealtimeSubscription);

  const { adminToken, adminUser, setAdminUser, loginAdmin, loginGatekeeper, logoutAdmin, logoutGatekeeper, gatekeeperToken, gatekeeperUser } = useAuth();
  const { schoolId, schoolStatus, isDemoMode, isSchoolNotFound, isConfigLoaded, ppdbLogo, ppdbTitle, ppdbFooterDesc, schoolPeriod, profilSekolah, setProfilSekolah, fetchConfigs } = useSchool();
  const { toasts, addToast } = useToast();

  // Loading complete event listener
  useEffect(() => {
    const handleLoadingComplete = () => setIsLoaded(true);
    window.addEventListener("cationgate:loading-complete", handleLoadingComplete);
    return () => window.removeEventListener("cationgate:loading-complete", handleLoadingComplete);
  }, [setIsLoaded]);

  // Realtime subscription
  useEffect(() => {
    const cleanup = initRealtimeSubscription(schoolId);
    return cleanup;
  }, [initRealtimeSubscription, schoolId]);

  // Initial Public load & Real-time polling fallback
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!ignore) {
        await fetchPublicApplicants();
      }
    };
    run();

    // Auto-sync public applicant status every 8 seconds for live dashboard/landing consistency
    const pollInterval = setInterval(() => {
      if (!ignore) {
        fetchPublicApplicants().catch(() => {});
      }
    }, 8000);

    return () => {
      ignore = true;
      clearInterval(pollInterval);
    };
  }, [fetchPublicApplicants]);

  // Admin and Active students load
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!ignore) {
        if (isDemoMode) {
          await fetchAdminApplicants();
          await fetchActiveStudents();
        } else if (adminToken && (!adminUser || (adminUser.role !== "gatekeeper" && !adminUser.isGatekeeper))) {
          await fetchAdminApplicants();
          await fetchActiveStudents();
        }
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
        }
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [adminToken, adminUser, fetchAdminApplicants, fetchActiveStudents, isDemoMode]);

  // Simulation interval
  useEffect(() => {
    if (!simulationActive) return;
    const intervalId = setInterval(() => simulateRegistration(), 25000);
    return () => clearInterval(intervalId);
  }, [simulationActive, simulateRegistration]);

  const value: PPDBContextType = {
    isLoaded,
    setIsLoaded: setIsLoaded as React.Dispatch<React.SetStateAction<boolean>>,
    applicants,
    setApplicants: setApplicants as React.Dispatch<React.SetStateAction<PPDBRecord[]>>,
    publicApplicants,
    activeStudents,
    adminToken,
    adminUser,
    setAdminUser,
    wsStatus,
    toasts,
    wsLogs,
    simulationActive,
    setSimulationActive: setSimulationActive as React.Dispatch<React.SetStateAction<boolean>>,
    registerApplicant,
    verifyApplicant,
    rejectApplicant,
    deleteApplicant,
    updateApplicant,
    updateActiveStudent,
    deleteActiveStudent,
    loginAdmin,
    loginGatekeeper,
    logoutAdmin,
    logoutGatekeeper,
    gatekeeperToken,
    gatekeeperUser,
    fetchPublicApplicants,
    fetchAdminApplicants,
    fetchActiveStudents,
    simulateRegistration,
    addToast,
    checkPaymentStatus,
    ppdbLogo,
    ppdbTitle,
    ppdbFooterDesc,
    schoolPeriod,
    profilSekolah,
    setProfilSekolah,
    fetchConfigs,
    schoolId,
    schoolStatus,
    isDemoMode,
    isSchoolNotFound,
    isConfigLoaded,
  };

  return <PPDBContext.Provider value={value}>{children}</PPDBContext.Provider>;
}

export function PPDBProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SchoolProvider>
        <AuthProvider>
          <PPDBLifeCycleSync>{children}</PPDBLifeCycleSync>
        </AuthProvider>
      </SchoolProvider>
    </ToastProvider>
  );
}

export function usePPDB(): PPDBContextType {
  const isLoaded = usePPDBStore((s) => s.isLoaded);
  const setIsLoaded = usePPDBStore((s) => s.setIsLoaded);
  const applicants = usePPDBStore((s) => s.applicants);
  const setApplicants = usePPDBStore((s) => s.setApplicants);
  const publicApplicants = usePPDBStore((s) => s.publicApplicants);
  const activeStudents = usePPDBStore((s) => s.activeStudents);
  const wsStatus = usePPDBStore((s) => s.wsStatus);
  const wsLogs = usePPDBStore((s) => s.wsLogs);
  const simulationActive = usePPDBStore((s) => s.simulationActive);
  const setSimulationActive = usePPDBStore((s) => s.setSimulationActive);

  const fetchPublicApplicants = usePPDBStore((s) => s.fetchPublicApplicants);
  const fetchAdminApplicants = usePPDBStore((s) => s.fetchAdminApplicants);
  const fetchActiveStudents = usePPDBStore((s) => s.fetchActiveStudents);
  const registerApplicant = usePPDBStore((s) => s.registerApplicant);
  const verifyApplicant = usePPDBStore((s) => s.verifyApplicant);
  const rejectApplicant = usePPDBStore((s) => s.rejectApplicant);
  const deleteApplicant = usePPDBStore((s) => s.deleteApplicant);
  const updateApplicant = usePPDBStore((s) => s.updateApplicant);
  const updateActiveStudent = usePPDBStore((s) => s.updateActiveStudent);
  const deleteActiveStudent = usePPDBStore((s) => s.deleteActiveStudent);
  const simulateRegistration = usePPDBStore((s) => s.simulateRegistration);
  const checkPaymentStatus = usePPDBStore((s) => s.checkPaymentStatus);

  const adminToken = useAuthStore((s) => s.adminToken);
  const adminUser = useAuthStore((s) => s.adminUser);
  const setAdminUser = useAuthStore((s) => s.setAdminUser);
  const gatekeeperToken = useAuthStore((s) => s.gatekeeperToken);
  const gatekeeperUser = useAuthStore((s) => s.gatekeeperUser);
  const loginAdmin = useAuthStore((s) => s.loginAdmin);
  const loginGatekeeper = useAuthStore((s) => s.loginGatekeeper);
  const logoutAdmin = useAuthStore((s) => s.logoutAdmin);
  const logoutGatekeeper = useAuthStore((s) => s.logoutGatekeeper);

  const schoolId = useSchoolStore((s) => s.schoolId);
  const schoolStatus = useSchoolStore((s) => s.schoolStatus);
  const isDemoMode = useSchoolStore((s) => s.isDemoMode);
  const isSchoolNotFound = useSchoolStore((s) => s.isSchoolNotFound);
  const isConfigLoaded = useSchoolStore((s) => s.isConfigLoaded);
  const ppdbLogo = useSchoolStore((s) => s.ppdbLogo);
  const ppdbTitle = useSchoolStore((s) => s.ppdbTitle);
  const ppdbFooterDesc = useSchoolStore((s) => s.ppdbFooterDesc);
  const schoolPeriod = useSchoolStore((s) => s.schoolPeriod);
  const profilSekolah = useSchoolStore((s) => s.profilSekolah);
  const setProfilSekolah = useSchoolStore((s) => s.setProfilSekolah);
  const fetchConfigs = useSchoolStore((s) => s.fetchConfigs);

  const toasts = useToastStore((s) => s.toasts);
  const addToast = useToastStore((s) => s.addToast);

  return {
    isLoaded,
    setIsLoaded: setIsLoaded as React.Dispatch<React.SetStateAction<boolean>>,
    applicants,
    setApplicants: setApplicants as React.Dispatch<React.SetStateAction<PPDBRecord[]>>,
    publicApplicants,
    activeStudents,
    adminToken,
    adminUser,
    setAdminUser: setAdminUser as React.Dispatch<React.SetStateAction<PPDBRecord | null>>,
    wsStatus,
    toasts,
    wsLogs,
    simulationActive,
    setSimulationActive: setSimulationActive as React.Dispatch<React.SetStateAction<boolean>>,
    registerApplicant,
    verifyApplicant,
    rejectApplicant,
    deleteApplicant,
    updateApplicant,
    updateActiveStudent,
    deleteActiveStudent,
    loginAdmin,
    loginGatekeeper,
    logoutAdmin,
    logoutGatekeeper,
    gatekeeperToken,
    gatekeeperUser,
    fetchPublicApplicants,
    fetchAdminApplicants,
    fetchActiveStudents,
    simulateRegistration,
    addToast,
    checkPaymentStatus,
    ppdbLogo,
    ppdbTitle,
    ppdbFooterDesc,
    schoolPeriod,
    profilSekolah,
    setProfilSekolah: setProfilSekolah as React.Dispatch<React.SetStateAction<PPDBRecord>>,
    fetchConfigs,
    schoolId,
    schoolStatus,
    isDemoMode,
    isSchoolNotFound,
    isConfigLoaded,
  };
}
