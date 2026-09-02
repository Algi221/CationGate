"use client";

import { useState, useEffect } from "react";
import { DEFAULT_MAJORS } from "@/components/features/kelola-ui/defaultData";
import { RegistrationFormData } from "../types";

interface UseRegistrationLiveConfigProps {
  schoolSlug: string;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
}

export function useRegistrationLiveConfig({
  schoolSlug,
  setFormData,
}: UseRegistrationLiveConfigProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [kuotaData, setKuotaData] = useState<any[] | null>(null);

  const [isSubscriptionActive, setIsSubscriptionActive] = useState<boolean>(
    () => {
      if (
        schoolSlug === "demo" ||
        schoolSlug === "smktarunabhakti" ||
        schoolSlug === "smktiglobal"
      )
        return true;
      if (typeof window !== "undefined") {
        const savedSub = localStorage.getItem(
          `ppdb_school_subscription_${schoolSlug}`,
        );
        if (
          savedSub &&
          (savedSub.includes("PRO") ||
            savedSub.includes("ACTIVE") ||
            savedSub.includes("YEARLY"))
        ) {
          return true;
        }
      }
      return true;
    },
  );

  const [portalStatus, setPortalStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const cached =
        localStorage.getItem(`ppdb_portal_status_${schoolSlug}`) ||
        localStorage.getItem("ppdb_portal_status");
      if (cached) return cached;
    }
    return "open";
  });

  const [fieldsConfig, setFieldsConfig] = useState<
    Record<string, { label: string; required: boolean; active: boolean }>
  >(() => {
    if (typeof window !== "undefined") {
      const savedFieldsConfig =
        localStorage.getItem(`ppdb_fields_config_${schoolSlug}`) ||
        localStorage.getItem("ppdb_fields_config");
      if (savedFieldsConfig) {
        try {
          const parsed = JSON.parse(savedFieldsConfig);
          if (parsed && typeof parsed === "object") return parsed;
        } catch (_e) {}
      }
    }
    return {};
  });

  const [formGuideline, setFormGuideline] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ppdb_form_guideline") || "";
    }
    return "";
  });

  const [schoolPeriod, setSchoolPeriod] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ppdb_school_period") || "2026-2027";
    }
    return "2026-2027";
  });

  const [regCost, setRegCost] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_reg_cost");
      if (saved) {
        const parsed = parseInt(saved);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 250000;
  });

  const [waGroupUrl, setWaGroupUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("ppdb_wa_group_url") ||
        "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS"
      );
    }
    return "https://chat.whatsapp.com/HJXHYajEOhl5RM6iN2SJOS";
  });

  const [waAdmin, setWaAdmin] = useState("6281292244456");

  const [bankConfigList, setBankConfigList] = useState<
    Array<{ bankName: string; accountNumber: string; accountHolder: string }>
  >(() => {
    if (typeof window !== "undefined") {
      const savedBank = localStorage.getItem("ppdb_bank_config");
      if (savedBank) {
        try {
          const parsed = JSON.parse(savedBank);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === "object") return [parsed];
        } catch (_e) {}
      }
    }
    return [
      {
        bankName: "Bank Mandiri",
        accountNumber: "157-00-0174092-2",
        accountHolder: "Yayasan Taruna Bhakti",
      },
    ];
  });

  const [majors, setMajors] = useState<
    Array<{ code: string; title: string; logo?: string; color?: string }>
  >(() => {
    if (typeof window !== "undefined") {
      const savedMajors =
        localStorage.getItem(`ppdb_majors_config_${schoolSlug}`) ||
        localStorage.getItem("ppdb_majors_config");
      if (savedMajors) {
        try {
          const parsed = JSON.parse(savedMajors);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_e) {}
      }
    }
    const isDemo = schoolSlug === "demo";
    return isDemo
      ? (DEFAULT_MAJORS as Array<{
          code: string;
          title: string;
          logo?: string;
          color?: string;
        }>)
      : [];
  });

  useEffect(() => {
    const loadLiveConfig = async () => {
      try {
        const res = await fetch(
          `/api/config?school_slug=${encodeURIComponent(schoolSlug)}&_t=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );
        const json = await res.json();
        if (json.success && json.data) {
          const config = json.data;
          try {
            if (config.ppdb_form_fee) {
              const parsed = parseInt(config.ppdb_form_fee);
              if (!isNaN(parsed)) {
                setRegCost(parsed);
                localStorage.setItem("ppdb_reg_cost", config.ppdb_form_fee);
              }
            }
            if (config.ppdb_school_period) {
              setSchoolPeriod(config.ppdb_school_period);
              setFormData((prev) => ({
                ...prev,
                periode: config.ppdb_school_period,
              }));
              localStorage.setItem(
                "ppdb_school_period",
                config.ppdb_school_period,
              );
            }
            if (config.ppdb_wa_group_url) {
              setWaGroupUrl(config.ppdb_wa_group_url);
              localStorage.setItem(
                "ppdb_wa_group_url",
                config.ppdb_wa_group_url,
              );
            }
            if (config.ppdb_wa_admin) {
              setWaAdmin(config.ppdb_wa_admin);
              localStorage.setItem("ppdb_wa_admin", config.ppdb_wa_admin);
            }
            const resolvedPortalStatus = config.ppdb_portal_status || "open";
            setPortalStatus(resolvedPortalStatus);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                `ppdb_portal_status_${schoolSlug}`,
                resolvedPortalStatus,
              );
              localStorage.setItem("ppdb_portal_status", resolvedPortalStatus);
            }
            if (config.ppdb_form_guideline) {
              setFormGuideline(config.ppdb_form_guideline);
              localStorage.setItem(
                "ppdb_form_guideline",
                config.ppdb_form_guideline,
              );
            }
            if (config.ppdb_fields_config) {
              let parsedFields = config.ppdb_fields_config;
              if (
                typeof parsedFields === "string" &&
                (parsedFields.startsWith("{") || parsedFields.startsWith("["))
              ) {
                try {
                  parsedFields = JSON.parse(parsedFields);
                } catch (_e) {}
              }
              if (parsedFields && typeof parsedFields === "object") {
                setFieldsConfig(parsedFields);
                if (typeof window !== "undefined" && schoolSlug) {
                  localStorage.setItem(
                    `ppdb_fields_config_${schoolSlug}`,
                    JSON.stringify(parsedFields),
                  );
                  localStorage.setItem(
                    "ppdb_fields_config",
                    JSON.stringify(parsedFields),
                  );
                }
              }
            }
            if (
              config.ppdb_majors_config !== undefined &&
              config.ppdb_majors_config !== null
            ) {
              let parsedMajors = config.ppdb_majors_config;
              if (typeof parsedMajors === "string") {
                let depth = 0;
                while (depth < 4 && typeof parsedMajors === "string") {
                  const trimmed = parsedMajors.trim();
                  if (
                    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
                    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
                    (trimmed.startsWith('"') && trimmed.endsWith('"'))
                  ) {
                    try {
                      parsedMajors = JSON.parse(trimmed);
                      depth++;
                    } catch (_) {
                      break;
                    }
                  } else {
                    break;
                  }
                }
              }
              if (Array.isArray(parsedMajors) && parsedMajors.length > 0) {
                setMajors(parsedMajors);
                if (typeof window !== "undefined" && schoolSlug) {
                  localStorage.setItem(
                    `ppdb_majors_config_${schoolSlug}`,
                    JSON.stringify(parsedMajors),
                  );
                  localStorage.setItem(
                    "ppdb_majors_config",
                    JSON.stringify(parsedMajors),
                  );
                }
              }
            }
            if (config.ppdb_bank_config) {
              const bankData = config.ppdb_bank_config;
              let finalBanks = [];
              if (Array.isArray(bankData)) {
                finalBanks = bankData;
              } else if (bankData && typeof bankData === "object") {
                finalBanks = [bankData];
              }
              if (finalBanks.length > 0) {
                setBankConfigList(finalBanks);
                localStorage.setItem(
                  "ppdb_bank_config",
                  JSON.stringify(finalBanks),
                );
              }
            }
          } catch (storageErr) {
            console.warn(
              "Storage quota exceeded or unavailable. LocalStorage config cache sync bypassed.",
              storageErr,
            );
          }
        }
      } catch (err) {
        console.log(
          "Failed to fetch live config on registration page, using local storage fallback:",
          err,
        );
      }

      try {
        const isDemo = schoolSlug === "demo";
        if (isDemo) {
          setIsSubscriptionActive(true);
        } else {
          const sRes = await fetch(
            `/api/saas/school-by-slug/${schoolSlug}?t=${Date.now()}`,
          );
          const sData = await sRes.json();
          if (sData.success && sData.data) {
            const s = sData.data;
            const subActive =
              s.is_subscription_active === true ||
              s.is_verified === true ||
              s.status === "FULL_VERIFIED" ||
              s.status === "VERIFIED" ||
              s.status === "verified" ||
              s.plan_type === "PRO" ||
              s.plan_type === "ENTERPRISE" ||
              s.plan_type === "TRIAL" ||
              s.plan_type === "YEARLY" ||
              (s.subscription_expires_at &&
                new Date(s.subscription_expires_at).getTime() > Date.now()) ||
              (typeof window !== "undefined" &&
                localStorage
                  .getItem(`ppdb_school_subscription_${schoolSlug}`)
                  ?.includes("ACTIVE"));
            setIsSubscriptionActive(!!subActive);
          } else {
            setIsSubscriptionActive(true);
          }
        }
      } catch (_e) {}
    };
    loadLiveConfig();

    const loadKuota = async () => {
      try {
        const res = await fetch(`/api/kuota?school_slug=${schoolSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setKuotaData(json.data.pendaftar);
        }
      } catch (err) {
        console.log("Failed to fetch kuota data:", err);
      }
    };
    loadKuota();

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("cationgate_landing_sync");
        channel.onmessage = (event) => {
          if (event.data?.type === "CONFIG_UPDATED") {
            const payload = event.data.data;
            if (!payload) return;
            if (
              event.data.slug &&
              schoolSlug &&
              event.data.slug !== schoolSlug
            )
              return;

            if (payload.ppdb_fields_config) {
              let parsedFields = payload.ppdb_fields_config;
              if (
                typeof parsedFields === "string" &&
                (parsedFields.startsWith("{") || parsedFields.startsWith("["))
              ) {
                try {
                  parsedFields = JSON.parse(parsedFields);
                } catch (_e) {}
              }
              if (parsedFields && typeof parsedFields === "object") {
                setFieldsConfig(parsedFields);
                localStorage.setItem(
                  `ppdb_fields_config_${schoolSlug}`,
                  JSON.stringify(parsedFields),
                );
                localStorage.setItem(
                  "ppdb_fields_config",
                  JSON.stringify(parsedFields),
                );
              }
            }
            if (payload.ppdb_form_guideline !== undefined) {
              setFormGuideline(payload.ppdb_form_guideline);
              localStorage.setItem(
                "ppdb_form_guideline",
                payload.ppdb_form_guideline,
              );
            }
            if (payload.ppdb_portal_status !== undefined) {
              setPortalStatus(payload.ppdb_portal_status);
              localStorage.setItem(
                `ppdb_portal_status_${schoolSlug}`,
                payload.ppdb_portal_status,
              );
              localStorage.setItem(
                "ppdb_portal_status",
                payload.ppdb_portal_status,
              );
            }
            if (payload.ppdb_majors_config !== undefined) {
              let parsedMajors = payload.ppdb_majors_config;
              if (
                typeof parsedMajors === "string" &&
                (parsedMajors.startsWith("[") || parsedMajors.startsWith("{"))
              ) {
                try {
                  parsedMajors = JSON.parse(parsedMajors);
                } catch (_e) {}
              }
              if (Array.isArray(parsedMajors) && parsedMajors.length > 0) {
                setMajors(parsedMajors);
                localStorage.setItem(
                  `ppdb_majors_config_${schoolSlug}`,
                  JSON.stringify(parsedMajors),
                );
                localStorage.setItem(
                  "ppdb_majors_config",
                  JSON.stringify(parsedMajors),
                );
              }
            }
          }
        };
      }
    } catch (_bcErr) {}

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [schoolSlug, setFormData]);

  return {
    kuotaData,
    isSubscriptionActive,
    portalStatus,
    fieldsConfig,
    formGuideline,
    schoolPeriod,
    regCost,
    waGroupUrl,
    waAdmin,
    bankConfigList,
    majors,
  };
}
