"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePPDB } from "@/context/PPDBContext";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import Swal from "sweetalert2";
import { MajorItem, MajorConfigItem, ApplicantItem } from "../types";

export function useDashboardOverviewState() {
  const { applicants, schoolId, adminToken, schoolStatus, isDemoMode } = usePPDB();
  const { href } = useSchoolHref();
  const router = useRouter();
  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "demo";
  const [trendView, setTrendView] = useState<"hari" | "minggu" | "bulan" | "periode">("hari");
  const counterTrigger = (applicants?.length || 0) > 0;

  const isVerified =
    schoolStatus === "FULL_VERIFIED" ||
    schoolStatus === "VERIFIED" ||
    schoolStatus === "verified" ||
    schoolSlug === "smktarunabhakti" ||
    schoolSlug === "smktiglobal" ||
    isDemoMode;

  useEffect(() => {
    if (schoolSlug && !isVerified) {
      router.push(`/${schoolSlug}/dashboard/verification`);
    }
  }, [schoolSlug, isVerified, router]);

  const [majorsList, setMajorsList] = useState<MajorItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ppdb_majors_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((m: MajorConfigItem) => ({
              name:
                m.code === "RPL"
                  ? "PPLG"
                  : m.code === "ANM"
                  ? "Animasi"
                  : m.code === "BC"
                  ? "Broadcasting"
                  : m.code || m.name || "",
              dbName: m.title || m.name || "",
              color: m.color || "#2E7CF6"
            }));
          }
        } catch {
          /* ignore */
        }
      }
    }
    return [
      { name: "PPLG", dbName: "Rekayasa Perangkat Lunak", color: "#2E7CF6" },
      { name: "TJKT", dbName: "Teknik Jaringan Komputer & Telekomunikasi", color: "#0BB0CE" },
      { name: "DKV", dbName: "Desain Komunikasi Visual", color: "#7957F5" },
      { name: "Broadcasting", dbName: "Broadcasting & Perfilman", color: "#F7A325" },
      { name: "Elektronika", dbName: "Teknik Elektronika", color: "#16C172" },
      { name: "Animasi", dbName: "Animasi", color: "#EC4E9E" }
    ];
  });

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.ppdb_majors_config) {
          const dbMajors = json.data.ppdb_majors_config;
          if (Array.isArray(dbMajors) && dbMajors.length > 0) {
            const hasLocalMajors = !!localStorage.getItem("ppdb_majors_config");
            const slugPath = window.location.pathname.split("/")[1] || "";
            if (slugPath === "demo" || !hasLocalMajors) {
              const mapped = dbMajors.map((m: MajorConfigItem) => ({
                name:
                  m.code === "RPL"
                    ? "PPLG"
                    : m.code === "ANM"
                    ? "Animasi"
                    : m.code === "BC"
                    ? "Broadcasting"
                    : m.code || m.name || "",
                dbName: m.title || m.name || "",
                color: m.color || "#2E7CF6"
              }));
              setMajorsList(mapped);
              localStorage.setItem("ppdb_majors_config", JSON.stringify(dbMajors));
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const computedStats = useMemo(() => {
    const list: ApplicantItem[] = applicants || [];
    const approved = list.filter((a: ApplicantItem) => a.status === "Approved").length;
    const pending = list.filter((a: ApplicantItem) => a.status === "Pending").length;
    const rejected = list.filter((a: ApplicantItem) => a.status === "Rejected").length;
    return { total: list.length, approved, pending, rejected };
  }, [applicants]);

  const majorsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    (applicants || []).forEach((a: ApplicantItem) => {
      const name = a.jurusan_1 || a.jurusan1 || "";
      if (name) counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [applicants]);

  const barData = useMemo(() => {
    return Object.entries(majorsMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => {
        const conf = majorsList.find((ml) => ml.dbName === name || ml.name === name);
        return { label: conf?.name || name, color: conf?.color || "#2E7CF6", value };
      });
  }, [majorsMap, majorsList]);

  const trend = useMemo(() => {
    const now = new Date();
    const dayMs = 86400000;
    const startOfDay = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };

    const nowTime = now.getTime();
    const registeredAt = (a: { tgl_daftar?: string; created_at?: string }) => {
      const dateStr = a.tgl_daftar || a.created_at;
      if (!dateStr) return nowTime;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? nowTime : d.getTime();
    };

    let buckets: { label: string; from: number; to: number }[] = [];

    if (trendView === "hari") {
      const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      for (let i = 6; i >= 0; i--) {
        const d = startOfDay(new Date(now.getTime() - i * dayMs));
        buckets.push({ label: dayNames[d.getDay()], from: d.getTime(), to: d.getTime() + dayMs });
      }
    } else if (trendView === "minggu") {
      const startOfWeek = (d: Date) => {
        const x = startOfDay(d);
        const diff = x.getDay() === 0 ? -6 : 1 - x.getDay();
        return new Date(x.getTime() + diff * dayMs);
      };
      const weekStart = startOfWeek(now);
      for (let i = 3; i >= 0; i--) {
        const from = new Date(weekStart.getTime() - i * 7 * dayMs);
        buckets.push({
          label: `${from.getDate()}/${from.getMonth() + 1}`,
          from: from.getTime(),
          to: from.getTime() + 7 * dayMs
        });
      }
    } else if (trendView === "bulan") {
      for (let i = 5; i >= 0; i--) {
        const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        buckets.push({
          label: from.toLocaleDateString("id-ID", { month: "short" }),
          from: from.getTime(),
          to: to.getTime()
        });
      }
    } else {
      const months = new Map<string, { from: number; to: number }>();
      (applicants || []).forEach((a: ApplicantItem) => {
        const t = registeredAt(a);
        const d = new Date(t);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!months.has(key)) {
          months.set(key, {
            from: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
            to: new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime()
          });
        }
      });
      buckets = [...months.entries()]
        .sort((a, b) => a[1].from - b[1].from)
        .map(([, r]) => {
          const d = new Date(r.from);
          return {
            label: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
            from: r.from,
            to: r.to
          };
        });
    }

    const counts = buckets.map(
      (b) =>
        (applicants || []).filter((a: ApplicantItem) => {
          const t = registeredAt(a);
          return t >= b.from && t < b.to;
        }).length
    );
    return { labels: buckets.map((b) => b.label), counts };
  }, [applicants, trendView]);

  const isDemo = isDemoMode || schoolSlug === "demo" || (typeof window !== "undefined" && (window.location.pathname.startsWith("/demo") || window.location.host.startsWith("demo.")));
  const [isSpmbOpen, setIsSpmbOpen] = useState(() => isDemo);
  const [isUpdatingSpmb, setIsUpdatingSpmb] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setIsSpmbOpen(true);
      return;
    }
    if (!schoolId && !schoolSlug) return;
    const query = schoolId ? `school_id=${schoolId}` : `school_slug=${schoolSlug}`;
    fetch(`/api/config?${query}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const status = json.data.ppdb_portal_status;
          if (status === "closed") setIsSpmbOpen(false);
          else if (status === "open") setIsSpmbOpen(true);
        } else {
          setIsSpmbOpen(false);
        }
      })
      .catch(() => {
        setIsSpmbOpen(false);
      });
  }, [schoolId, schoolSlug, isDemo]);

  const handleToggleSpmbStatus = async () => {
    const nextStatus = !isSpmbOpen;

    // Validate paid subscription before allowing to open public SPMB registration
    let isSubscribed = isDemo;
    if (!isSubscribed && typeof window !== "undefined") {
      const savedSub = localStorage.getItem(`ppdb_school_subscription_${schoolSlug || 'default'}`);
      if (savedSub && (savedSub.includes("PRO") || savedSub.includes("ENTERPRISE") || savedSub.includes("ACTIVE"))) {
        isSubscribed = true;
      }
    }

    if (nextStatus && !isSubscribed) {
      const result = await Swal.fire({
        title: "Perlu Berlangganan Paket Pro 🔒",
        text: "Fitur Pembukaan Pendaftaran Publik (SPMB Online) hanya dapat diaktifkan setelah instansi sekolah berlangganan paket Pro atau Enterprise.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563EB",
        cancelButtonColor: "#64748B",
        confirmButtonText: "Lihat Paket & Langganan Sekarang",
        cancelButtonText: "Tutup",
        customClass: { popup: "rounded-3xl dark:bg-slate-900 dark:text-white" }
      });
      if (result.isConfirmed) {
        router.push(href("/dashboard/subscription"));
      }
      return;
    }

    const statusText = nextStatus ? "DIBUKA" : "DITUTUP";
    const statusDesc = nextStatus
      ? "Formulir pendaftaran publik akan kembali menerima calon peserta didik baru."
      : "Formulir pendaftaran publik akan di-nonaktifkan dan pengunjung tidak dapat mendaftar.";

    const { isConfirmed } = await Swal.fire({
      title: `Ubah Status SPMB ke ${statusText}?`,
      text: statusDesc,
      icon: nextStatus ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus ? "#10B981" : "#F43F5E",
      cancelButtonColor: "#64748B",
      confirmButtonText: `Ya, ${statusText} SPMB`,
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl dark:bg-slate-900 dark:text-white border dark:border-slate-800"
      }
    });
    if (!isConfirmed) return;

    setIsUpdatingSpmb(true);
    try {
      const res = await fetch(`/api/config?school_id=${schoolId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          key: "ppdb_portal_status",
          value: nextStatus ? "open" : "closed"
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSpmbOpen(nextStatus);
        Swal.fire({
          title: `Status SPMB ${statusText}!`,
          text: `Pendaftaran SPMB sekolah telah resmi di-${statusText.toLowerCase()}.`,
          icon: "success",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      } else {
        Swal.fire({
          title: "Gagal Menyimpan",
          text: data.message || "Gagal mengubah status pendaftaran SPMB.",
          icon: "error",
          confirmButtonColor: "#2563EB",
          customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
        });
      }
    } catch {
      Swal.fire({
        title: "Kesalahan Koneksi",
        text: "Terjadi kesalahan saat menghubungi server. Status belum berubah.",
        icon: "error",
        confirmButtonColor: "#2563EB",
        customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
      });
    } finally {
      setIsUpdatingSpmb(false);
    }
  };

  return {
    schoolSlug,
    applicants: applicants || [],
    computedStats,
    counterTrigger,
    isVerified,
    isSpmbOpen,
    isUpdatingSpmb,
    handleToggleSpmbStatus,
    trendView,
    setTrendView,
    trend,
    majorsList,
    barData
  };
}
