"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { KuotaData, KuotaItem } from "../types";

function getDemoKuotaData(
  periode: string = "2026-2027",
  customTargets?: Record<string, number>
): KuotaData {
  const majors = [
    { key: "Rekayasa Perangkat Lunak", defaultTarget: 0, pendaftar: 86, siswaAktif: 312 },
    { key: "Teknik Komputer dan Jaringan", defaultTarget: 0, pendaftar: 74, siswaAktif: 298 },
    { key: "Desain Komunikasi Visual", defaultTarget: 0, pendaftar: 65, siswaAktif: 210 },
    { key: "Broadcasting dan Perfilman", defaultTarget: 0, pendaftar: 52, siswaAktif: 195 },
    { key: "Animasi", defaultTarget: 0, pendaftar: 48, siswaAktif: 188 },
    { key: "Teknik Elektronika", defaultTarget: 0, pendaftar: 38, siswaAktif: 165 },
  ];

  let totalTarget = 0;
  let totalPendaftar = 0;
  let totalSiswaAktif = 0;

  const pendaftarItems: KuotaItem[] = majors.map((m, idx) => {
    const target =
      customTargets && typeof customTargets[m.key] === "number"
        ? customTargets[m.key]
        : m.defaultTarget;
    const jumlah = m.pendaftar;
    const persentaseVal = target > 0 ? Number(((jumlah / target) * 100).toFixed(1)) : 0;
    totalTarget += target;
    totalPendaftar += jumlah;
    return {
      no: idx + 1,
      key: m.key,
      konsentrasi_keahlian: m.key,
      target,
      jumlah,
      presentase: `${persentaseVal}%`,
    };
  });

  const siswaAktifItems: KuotaItem[] = majors.map((m, idx) => {
    const target =
      (customTargets && typeof customTargets[m.key] === "number"
        ? customTargets[m.key]
        : m.defaultTarget) * 3;
    const jumlah = m.siswaAktif;
    const persentaseVal = target > 0 ? Number(((jumlah / target) * 100).toFixed(1)) : 0;
    totalSiswaAktif += jumlah;
    return {
      no: idx + 1,
      key: m.key,
      konsentrasi_keahlian: m.key,
      target,
      jumlah,
      presentase: `${persentaseVal}%`,
    };
  });

  return {
    pendaftar: pendaftarItems,
    siswaAktif: siswaAktifItems,
    totalPendaftar,
    totalSiswaAktif,
    totalTarget,
    availablePeriodes: ["2026-2027", "2025-2026", "2024-2025"],
    selectedPeriode: periode || "2026-2027",
  };
}

export function useKuotaData(schoolId: string | number | undefined) {
  const [data, setData] = useState<KuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editingTargets, setEditingTargets] = useState<Record<string, number>>({});
  const [isSavingTargets, setIsSavingTargets] = useState(false);

  const [selectedPeriode, setSelectedPeriode] = useState<string>("");
  const [availablePeriodes, setAvailablePeriodes] = useState<string[]>([]);

  const params = useParams();
  const schoolSlug = (params?.school_slug as string) || "";

  const isDemo =
    schoolId === "demo" ||
    String(schoolId) === "demo" ||
    schoolSlug === "demo" ||
    (typeof window !== "undefined" && window.location.pathname.includes("/demo/"));

  const fetchKuota = useCallback(
    async (periode?: string) => {
      try {
        setLoading(true);
        setError(null);

        // DEMO MODE: Fully isolated mock dataset
        if (isDemo) {
          let customTargets: Record<string, number> | undefined;
          if (typeof window !== "undefined") {
            const raw = localStorage.getItem("demo_kuota_targets");
            if (raw) {
              try {
                customTargets = JSON.parse(raw);
              } catch (_) {}
            }
          }
          const demoData = getDemoKuotaData(periode || "2026-2027", customTargets);
          setData(demoData);
          setAvailablePeriodes(demoData.availablePeriodes);
          setSelectedPeriode(demoData.selectedPeriode);
          setLoading(false);
          return;
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
        const effectiveId =
          schoolId ||
          schoolSlug ||
          (typeof window !== "undefined" && window.location.hostname.includes(".") && !window.location.hostname.startsWith("www.") && !window.location.hostname.startsWith("gatekeeper.")
            ? window.location.hostname.split(".")[0]
            : "");

        const url = periode
          ? `/api/kuota?periode=${encodeURIComponent(periode)}${effectiveId ? "&school_id=" + effectiveId : ""}`
          : `/api/kuota${effectiveId ? "?school_id=" + effectiveId : ""}`;
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (json.success && json.data) {
          const raw = json.data;
          const pendaftarObj = raw.pendaftar;
          const siswaAktifObj = raw.siswa_aktif || raw.siswaAktif;

          const pendaftarItems: KuotaItem[] = Array.isArray(pendaftarObj)
            ? pendaftarObj
            : Array.isArray(pendaftarObj?.items)
              ? pendaftarObj.items
              : [];

          const siswaAktifItems: KuotaItem[] = Array.isArray(siswaAktifObj)
            ? siswaAktifObj
            : Array.isArray(siswaAktifObj?.items)
              ? siswaAktifObj.items
              : [];

          const totalPendaftarVal =
            typeof raw.totalPendaftar === "number"
              ? raw.totalPendaftar
              : (pendaftarObj?.total?.jumlah ??
                pendaftarItems.reduce(
                  (acc: number, curr: KuotaItem) => acc + (curr.jumlah || 0),
                  0
                ));

          const totalSiswaAktifVal =
            typeof raw.totalSiswaAktif === "number"
              ? raw.totalSiswaAktif
              : (siswaAktifObj?.total?.jumlah ??
                siswaAktifItems.reduce(
                  (acc: number, curr: KuotaItem) => acc + (curr.jumlah || 0),
                  0
                ));

          const totalTargetVal =
            typeof raw.totalTarget === "number"
              ? raw.totalTarget
              : (pendaftarObj?.total?.target ??
                pendaftarItems.reduce(
                  (acc: number, curr: KuotaItem) => acc + (curr.target || 0),
                  0
                ));

          setData({
            pendaftar: pendaftarItems,
            siswaAktif: siswaAktifItems,
            totalPendaftar: totalPendaftarVal,
            totalSiswaAktif: totalSiswaAktifVal,
            totalTarget: totalTargetVal,
            availablePeriodes: raw.available_periodes || raw.availablePeriodes || [],
            selectedPeriode: raw.selected_periode || raw.selectedPeriode || "",
          });

          const periodesList = raw.available_periodes || raw.availablePeriodes;
          if (periodesList && availablePeriodes.length === 0) {
            setAvailablePeriodes(periodesList);
          }
        } else {
          // Fallback to demo data if backend fails
          const demoData = getDemoKuotaData(periode || "2026-2027");
          setData(demoData);
          setAvailablePeriodes(demoData.availablePeriodes);
          setSelectedPeriode(demoData.selectedPeriode);
        }
      } catch (err: unknown) {
        if (isDemo) {
          const demoData = getDemoKuotaData(periode || "2026-2027");
          setData(demoData);
          setAvailablePeriodes(demoData.availablePeriodes);
          setSelectedPeriode(demoData.selectedPeriode);
        } else {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        setLoading(false);
      }
    },
    [schoolId, schoolSlug, isDemo, availablePeriodes.length]
  );

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!ignore) {
        await fetchKuota();
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [fetchKuota]);

  const handlePeriodeChange = (newPeriode: string) => {
    setSelectedPeriode(newPeriode);
    setEditMode(false);
    if (newPeriode === "") {
      fetchKuota();
    } else {
      fetchKuota(newPeriode);
    }
  };

  const handleEditClick = () => {
    if (!data) return;
    const targets: Record<string, number> = {};
    const sourceData = data.pendaftar;
    sourceData.forEach((item) => {
      if (item.key !== "Belum Memilih") {
        targets[item.key] = item.target;
      }
    });
    setEditingTargets(targets);
    setEditMode(true);
  };

  const handleTargetChange = (key: string, value: string) => {
    const num = parseInt(value, 10);
    setEditingTargets((prev) => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num,
    }));
  };

  const saveTargets = async () => {
    try {
      setIsSavingTargets(true);
      if (isDemo) {
        if (typeof window !== "undefined") {
          localStorage.setItem("demo_kuota_targets", JSON.stringify(editingTargets));
        }
        setData(getDemoKuotaData(selectedPeriode || "2026-2027", editingTargets));
        setEditMode(false);
        return;
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : null;
      const effectiveId =
        schoolId ||
        schoolSlug ||
        (typeof window !== "undefined" && window.location.hostname.includes(".") && !window.location.hostname.startsWith("www.") && !window.location.hostname.startsWith("gatekeeper.")
          ? window.location.hostname.split(".")[0]
          : "");

      const url = `/api/kuota/targets${effectiveId ? "?school_id=" + effectiveId : ""}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ targets: editingTargets }),
      });
      const json = await res.json();
      if (json.success) {
        setEditMode(false);
        fetchKuota(selectedPeriode || undefined);
      } else {
        alert(json.message || json.error || "Gagal menyimpan target kuota");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSavingTargets(false);
    }
  };

  return {
    data,
    loading,
    error,
    isExporting,
    setIsExporting,
    editMode,
    setEditMode,
    editingTargets,
    isSavingTargets,
    selectedPeriode,
    availablePeriodes,
    fetchKuota,
    handlePeriodeChange,
    handleEditClick,
    handleTargetChange,
    saveTargets,
  };
}
