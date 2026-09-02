"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getBrowserSupabase } from "@/lib/supabase-client";
import { Landmark, CheckCircle2, Hourglass, FileQuestion } from "lucide-react";
import {
  SchoolTenant,
  GatekeeperHeaderBanner,
  GatekeeperStatsCards,
  GatekeeperChartsSection,
  GatekeeperGeoSection,
  GatekeeperPendingSchools,
} from "@/components/features/gatekeeper/overview";

export default function GatekeeperOverviewPage() {
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("gatekeeper_token")
          : null;

      const res = await fetch("/api/gatekeeper/schools", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        setSchools([]);
        return;
      }
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_parseError) {
        console.error("Invalid JSON from API:", text.substring(0, 150));
        setSchools([]);
        return;
      }

      if (json && json.success && Array.isArray(json.data)) {
        setSchools(json.data);
      } else {
        setSchools([]);
      }
    } catch (err: unknown) {
      console.error("Gagal mengambil data sekolah real:", err);
      setError("Gagal menghubungkan ke database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();

    const supabase = getBrowserSupabase();
    if (supabase) {
      const channel = supabase
        .channel("public:schools")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "schools" },
          (payload) => {
            console.log("Real-Time Supabase Change Received (Schools):", payload);
            fetchSchools();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Compute Live Metrics
  const totalSchoolsCount = schools.length;
  const verifiedCount = schools.filter((s) => s.status === "FULL_VERIFIED").length;
  const pendingCount = schools.filter((s) => s.status === "PENDING_VERIFICATION").length;
  const unverifiedCount = schools.filter(
    (s) => s.status === "BELUM_KIRIM_VERIFIKASI" || s.status === "UNVERIFIED",
  ).length;

  const pendingSchools = schools.filter((s) => s.status === "PENDING_VERIFICATION");

  // Dynamic Real School Geo-mapping & Regional Classifier
  const mapSchools = useMemo(() => {
    if (!schools || schools.length === 0) {
      return [
        { id: 1, name: "SMK Taruna Bhakti", slug: "smktarunabhakti", lat: -6.4025, lng: 106.7942, region: "Jawa Barat", status: "FULL_VERIFIED", npsn: "20229215" },
        { id: 2, name: "SMK TI Bali Global Denpasar", slug: "smktiglobal", lat: -8.6705, lng: 115.2126, region: "Bali", status: "FULL_VERIFIED", npsn: "50103641" },
        { id: 3, name: "SMKN 26 Jakarta", slug: "smkn26jkt", lat: -6.2088, lng: 106.8456, region: "DKI Jakarta", status: "FULL_VERIFIED", npsn: "20100223" },
        { id: 4, name: "SMAN 1 Tangerang", slug: "sman1tgr", lat: -6.1783, lng: 106.6319, region: "Banten", status: "PENDING_VERIFICATION", npsn: "20603214" },
      ];
    }

    return schools.map((s, idx) => {
      const text = `${s.name || ""} ${s.slug || ""} ${s.official_email || ""}`.toLowerCase();
      const jitterLat = (((idx * 17 + (s.slug?.length || 3)) % 10) - 5) * 0.04;
      const jitterLng = (((idx * 23 + (s.name?.length || 5)) % 10) - 5) * 0.04;

      let lat = -6.4025 + jitterLat;
      let lng = 106.7942 + jitterLng;
      let region = "Jawa Barat";

      if (text.includes("bali") || text.includes("denpasar") || text.includes("singaraja") || text.includes("badung")) {
        lat = -8.6705 + jitterLat;
        lng = 115.2126 + jitterLng;
        region = "Bali";
      } else if (text.includes("surabaya") || text.includes("malang") || text.includes("kediri") || text.includes("jember") || text.includes("jatim")) {
        lat = -7.2575 + jitterLat;
        lng = 112.7521 + jitterLng;
        region = "Jawa Timur";
      } else if (text.includes("semarang") || text.includes("solo") || text.includes("surakarta") || text.includes("magelang") || text.includes("jateng")) {
        lat = -6.9667 + jitterLat;
        lng = 110.4167 + jitterLng;
        region = "Jawa Tengah";
      } else if (text.includes("yogyakarta") || text.includes("jogja") || text.includes("sleman") || text.includes("bantul")) {
        lat = -7.7956 + jitterLat;
        lng = 110.3695 + jitterLng;
        region = "DI Yogyakarta";
      } else if (text.includes("tangerang") || text.includes("serang") || text.includes("cilegon") || text.includes("banten")) {
        lat = -6.1783 + jitterLat;
        lng = 106.6319 + jitterLng;
        region = "Banten";
      } else if (text.includes("jakarta") || text.includes("dki") || text.includes("jaksel") || text.includes("jaktim") || text.includes("jakbar")) {
        lat = -6.2088 + jitterLat;
        lng = 106.8456 + jitterLng;
        region = "DKI Jakarta";
      } else if (text.includes("depok") || text.includes("taruna") || text.includes("cimanggis") || text.includes("bogor") || text.includes("bandung") || text.includes("bekasi")) {
        lat = -6.4025 + jitterLat;
        lng = 106.7942 + jitterLng;
        region = "Jawa Barat";
      } else {
        const fallbackRegions = [
          { name: "Jawa Barat", baseLat: -6.9175, baseLng: 107.6191 },
          { name: "DKI Jakarta", baseLat: -6.2088, baseLng: 106.8456 },
          { name: "Banten", baseLat: -6.1200, baseLng: 106.1503 },
          { name: "Jawa Timur", baseLat: -7.2575, baseLng: 112.7521 },
          { name: "Jawa Tengah", baseLat: -6.9667, baseLng: 110.4167 },
          { name: "Bali", baseLat: -8.6705, baseLng: 115.2126 },
        ];
        const fb = fallbackRegions[idx % fallbackRegions.length];
        lat = fb.baseLat + jitterLat;
        lng = fb.baseLng + jitterLng;
        region = fb.name;
      }

      return {
        id: s.id || s.slug || idx,
        name: s.name || "Sekolah Terdaftar",
        slug: s.slug,
        lat,
        lng,
        region,
        status: s.status,
        npsn: s.npsn,
      };
    });
  }, [schools]);

  // Live Demographics Summary from Real School Data
  const regionDemographics = useMemo(() => {
    const counts: Record<string, number> = {};
    mapSchools.forEach((s) => {
      counts[s.region] = (counts[s.region] || 0) + 1;
    });

    const total = mapSchools.length;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([region, count]) => ({
        region,
        count,
        percentage: total > 0 ? `${Math.round((count / total) * 100)}%` : "0%",
      }));
  }, [mapSchools]);

  const stats = [
    {
      label: "Total Sekolah SaaS",
      value: totalSchoolsCount.toString(),
      change: `${totalSchoolsCount} Instansi Terdaftar`,
      icon: Landmark,
      color: "text-[#2e3749] dark:text-[#FFD33B] bg-[#FFD33B]/15 dark:bg-white/10",
    },
    {
      label: "Verifikasi Resmi (Aktif)",
      value: verifiedCount.toString(),
      change:
        totalSchoolsCount > 0
          ? `${Math.round((verifiedCount / totalSchoolsCount) * 100)}% Terverifikasi`
          : "0% Terverifikasi",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "Menunggu Verifikasi SK",
      value: pendingCount.toString(),
      change: pendingCount > 0 ? "Perlu Tindakan Gatekeeper" : "Semua Berkas Diproses",
      icon: Hourglass,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "Belum Kirim Dokumen SK",
      value: unverifiedCount.toString(),
      change: "Pendaftar Baru / Belum SK",
      icon: FileQuestion,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40",
    },
  ];

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      {/* 1. Header Banner & Notification */}
      <GatekeeperHeaderBanner
        pendingCount={pendingCount}
        totalSchoolsCount={totalSchoolsCount}
        loading={loading}
        onRefresh={fetchSchools}
      />

      {/* 2. Top Stats Cards Grid */}
      <GatekeeperStatsCards stats={stats} loading={loading} />

      {/* 3. Charts: Registration Trend & Donut Ratio */}
      <GatekeeperChartsSection
        isMounted={isMounted}
        totalSchoolsCount={totalSchoolsCount}
        verifiedCount={verifiedCount}
        pendingCount={pendingCount}
        unverifiedCount={unverifiedCount}
      />

      {/* 4. Geography Map & Infrastructure Usage */}
      <GatekeeperGeoSection
        mapSchools={mapSchools}
        regionDemographics={regionDemographics}
      />

      {/* 5. Pending Schools Verification & Audit Log */}
      <GatekeeperPendingSchools
        loading={loading}
        pendingSchools={pendingSchools}
      />
    </div>
  );
}