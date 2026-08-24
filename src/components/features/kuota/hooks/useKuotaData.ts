"use client";

import { useState, useCallback, useEffect } from "react";
import { KuotaData, KuotaItem } from "../types";

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

  const fetchKuota = useCallback(async (periode?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = periode
        ? `/api/kuota?periode=${encodeURIComponent(periode)}${schoolId ? '&school_id=' + schoolId : ''}`
        : `/api/kuota${schoolId ? '?school_id=' + schoolId : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        const raw = json.data;
        const pendaftarObj = raw.pendaftar;
        const siswaAktifObj = raw.siswa_aktif || raw.siswaAktif;

        const pendaftarItems: KuotaItem[] = Array.isArray(pendaftarObj)
          ? pendaftarObj
          : (Array.isArray(pendaftarObj?.items) ? pendaftarObj.items : []);

        const siswaAktifItems: KuotaItem[] = Array.isArray(siswaAktifObj)
          ? siswaAktifObj
          : (Array.isArray(siswaAktifObj?.items) ? siswaAktifObj.items : []);

        const totalPendaftarVal = typeof raw.totalPendaftar === 'number'
          ? raw.totalPendaftar
          : (pendaftarObj?.total?.jumlah ?? (pendaftarItems.reduce((acc: number, curr: KuotaItem) => acc + (curr.jumlah || 0), 0)));

        const totalSiswaAktifVal = typeof raw.totalSiswaAktif === 'number'
          ? raw.totalSiswaAktif
          : (siswaAktifObj?.total?.jumlah ?? (siswaAktifItems.reduce((acc: number, curr: KuotaItem) => acc + (curr.jumlah || 0), 0)));

        const totalTargetVal = typeof raw.totalTarget === 'number'
          ? raw.totalTarget
          : (pendaftarObj?.total?.target ?? (pendaftarItems.reduce((acc: number, curr: KuotaItem) => acc + (curr.target || 0), 0)));

        setData({
          pendaftar: pendaftarItems,
          siswaAktif: siswaAktifItems,
          totalPendaftar: totalPendaftarVal,
          totalSiswaAktif: totalSiswaAktifVal,
          totalTarget: totalTargetVal,
          availablePeriodes: raw.available_periodes || raw.availablePeriodes || [],
          selectedPeriode: raw.selected_periode || raw.selectedPeriode || ''
        });

        const periodesList = raw.available_periodes || raw.availablePeriodes;
        if (periodesList && availablePeriodes.length === 0) {
          setAvailablePeriodes(periodesList);
        }
      } else {
        throw new Error(json.error || 'Gagal memuat data kuota');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [schoolId, availablePeriodes.length]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!ignore && schoolId !== undefined) {
        await fetchKuota();
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [schoolId, fetchKuota]);

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
    sourceData.forEach(item => {
      if (item.key !== "Belum Memilih") {
        targets[item.key] = item.target;
      }
    });
    setEditingTargets(targets);
    setEditMode(true);
  };

  const handleTargetChange = (key: string, value: string) => {
    const num = parseInt(value, 10);
    setEditingTargets(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num
    }));
  };

  const saveTargets = async () => {
    try {
      setIsSavingTargets(true);
      const url = `/api/kuota/targets${schoolId ? '?school_id=' + schoolId : ''}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: editingTargets })
      });
      const json = await res.json();
      if (json.success) {
        setEditMode(false);
        fetchKuota(selectedPeriode || undefined);
      } else {
        alert(json.error || 'Gagal menyimpan target kuota');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data');
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
    saveTargets
  };
}
