"use client";

import { useState } from "react";
import { Applicant, EditFormState } from "../types";

interface UsePendaftarEditModalProps {
  updateApplicant: (
    id: number,
    data: Partial<EditFormState>,
  ) => Promise<{ success: boolean; message?: string } | undefined>;
}

export function usePendaftarEditModal({
  updateApplicant,
}: UsePendaftarEditModalProps) {
  const [editApplicant, setEditApplicant] = useState<Applicant | null>(null);
  const [editForm, setEditForm] = useState<Partial<EditFormState>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const openEdit = (a: Applicant) => {
    setEditApplicant(a);
    setEditForm({
      nama: a.nama || "",
      nisn: a.nisn || "",
      nik: a.nik || "",
      tempat_lahir: a.tempat_lahir || a.tempatLahir || "",
      tgl_lahir: a.tgl_lahir || a.tglLahir || "",
      jenis_kelamin: a.jenis_kelamin || a.jenisKelamin || "",
      agama: a.agama || "",
      alamat: a.alamat || "",
      rt_rw: a.rt_rw || a.rtRw || "",
      kelurahan: a.kelurahan || "",
      kecamatan: a.kecamatan || "",
      kode_pos: a.kode_pos || a.kodePos || "",
      whatsapp: a.whatsapp || "",
      email: a.email || "",
      tinggal_dengan: a.tinggal_dengan || a.tinggalDengan || "",
      transportasi: a.transportasi || "",
      tinggi_badan: String(a.tinggi_badan || a.tinggiBadan || ""),
      berat_badan: String(a.berat_badan || a.beratBadan || ""),
      golongan_darah: a.golongan_darah || a.golonganDarah || "",
      sekolah_asal: a.sekolah_asal || a.sekolahAsal || "",
      tgl_lulus: a.tgl_lulus || a.tglLulus || "",
      jurusan_1: a.jurusan_1 || a.jurusan1 || "",
      nama_ayah: a.nama_ayah || a.namaAyah || "",
      pekerjaan_ayah: a.pekerjaan_ayah || a.pekerjaanAyah || "",
      penghasilan_ayah: a.penghasilan_ayah || a.penghasilanAyah || "",
      nama_ibu: a.nama_ibu || a.namaIbu || "",
      pekerjaan_ibu: a.pekerjaan_ibu || a.pekerjaanIbu || "",
      penghasilan_ibu: a.penghasilan_ibu || a.penghasilanIbu || "",
      telepon_ortu: a.telepon_ortu || a.teleponOrtu || "",
      cita_cita: a.cita_cita || a.citaCita || "",
      alasan_memilih: a.alasan_memilih || a.alasanMemilih || "",
    });
  };

  const handleEditSave = async () => {
    if (!editApplicant) return;
    setIsSaving(true);
    const res = await updateApplicant(editApplicant.id, editForm);
    setIsSaving(false);
    if (res?.success) {
      setEditApplicant(null);
    } else {
      alert(res?.message || "Gagal menyimpan perubahan.");
    }
  };

  return {
    editApplicant,
    setEditApplicant,
    editForm,
    setEditForm,
    isSaving,
    openEdit,
    handleEditSave,
  };
}
