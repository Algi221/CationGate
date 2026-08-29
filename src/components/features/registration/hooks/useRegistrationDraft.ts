"use client";

import { useState } from "react";
import { RegistrationFormData } from "../types";

export const createInitialFormData = (): RegistrationFormData => ({
  nama: "",
  nisn: "",
  nik: "",
  tempatLahir: "",
  tglLahir: "",
  jenisKelamin: "",
  agama: "",
  kewarganegaraan: "",
  alamat: "",
  rtRw: "",
  kelurahan: "",
  kecamatan: "",
  kodePos: "",
  whatsapp: "",
  email: "",
  tinggalDengan: "",
  transportasi: "",
  tinggiBadan: "",
  beratBadan: "",
  jarakSekolah: "",
  jarakKm: "",
  waktuJam: "",
  waktuMenit: "",
  jumlahSaudara: "",
  golonganDarah: "",
  penyakitDiderita: "",
  kebutuhanKhusus: [],
  jenisPrestasi: [],
  tingkatPrestasi: [],
  uraianPrestasi: "",
  tahunPrestasi: "",
  penyelenggara: "",
  jenisBeasiswa: [],
  uraianBeasiswa: "",
  tahunMulaiBeasiswa: "",
  tahunSelesaiBeasiswa: "",
  namaAyah: "",
  tempatLahirAyah: "",
  tglLahirAyah: "",
  agamaAyah: "",
  kewarganegaraanAyah: "WNI",
  pendidikanAyah: "",
  pekerjaanAyah: "",
  penghasilanAyah: "",
  alamatAyah: "",
  rtrwAyah: "",
  kelurahanAyah: "",
  kecamatanAyah: "",
  kodePosAyah: "",
  statusAyah: "Masih Hidup",
  namaIbu: "",
  tempatLahirIbu: "",
  tglLahirIbu: "",
  agamaIbu: "",
  kewarganegaraanIbu: "WNI",
  pendidikanIbu: "",
  pekerjaanIbu: "",
  penghasilanIbu: "",
  alamatIbu: "",
  rtrwIbu: "",
  kelurahanIbu: "",
  kecamatanIbu: "",
  kodePosIbu: "",
  statusIbu: "Masih Hidup",
  namaWali: "",
  tempatLahirWali: "",
  tglLahirWali: "",
  agamaWali: "",
  kewarganegaraanWali: "WNI",
  pendidikanWali: "",
  pekerjaanWali: "",
  penghasilanWali: "",
  alamatWali: "",
  rtrwWali: "",
  kelurahanWali: "",
  kecamatanWali: "",
  kodePosWali: "",
  statusWali: "Masih Hidup",
  teleponOrtu: "",
  sekolahAsal: "",
  tglLulus: "",
  noIjazah: "",
  noSKHUN: "",
  noPesertaUN: "",
  lamaBelajar: "3",
  pindahanDari: "",
  alasanPindah: "",
  diterimaKelas: "",
  diterimaTanggal: "",
  jurusan1: "",
  hobi: [],
  citaCita: "",
  nilaiUSTeori: "",
  nilaiUSPraktik: "",
  nilaiMuatanLokal: "",
  alasanMemilih: "",
  citaCitaSetelahLulus: "",
  pelajaranDisenangi: "",
  punyaKPS: "Tidak",
  noKPS: "",
  punyaKIP: "Tidak",
  noKIP: "",
  alasanDisenangi: "",
  kesulitanBelajar: "",
  perkelahian: "",
  ketPerkelahian: "",
  narkoba: "",
  ketNarkoba: "",
  pelanggaranLain: "",
  ketPelanggaranLain: "",
  janjiTaat: "",
  janjiSanksi: "",
  janjiAkrab: "",
  janjiBelajar: "",
  janjiNamaBaik: "",
  deklarasi: false,
  periode: "2026-2027",
  berkasFotoOk: false,
  berkasFotoFile: null,
  berkasFotoName: "",
  berkasFotoBase64: "",
  berkasPrestasiBase64: ""
});

export function useRegistrationDraft() {
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const initial = createInitialFormData();

    if (typeof window !== "undefined") {
      const savedPeriod = localStorage.getItem("ppdb_school_period");
      if (savedPeriod) initial.periode = savedPeriod;

      const savedSuccess = localStorage.getItem("ppdb_registration_success");
      if (savedSuccess) {
        try {
          const parsed = JSON.parse(savedSuccess);
          if (parsed && parsed.success && parsed.nisn) {
            initial.nisn = parsed.nisn;
            return initial;
          }
        } catch (_e) {
          // ignore
        }
      }

      const savedCheckout = localStorage.getItem("ppdb_active_checkout");
      if (!savedCheckout) {
        const savedFormData = localStorage.getItem("ppdb_registration_form_data");
        if (savedFormData) {
          try {
            const parsed = JSON.parse(savedFormData);
            return { ...initial, ...parsed };
          } catch (_e) {
            // ignore
          }
        }
      }
    }
    return initial;
  });

  const [wizardStep, setWizardStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("ppdb_registration_wizard_step");
      if (savedStep) {
        const parsed = parseInt(savedStep);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 14) return parsed;
      }
    }
    return 1;
  });

  const [furthestStep, setFurthestStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("ppdb_registration_wizard_step");
      if (savedStep) {
        const parsed = parseInt(savedStep);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 14) return parsed;
      }
    }
    return 1;
  });

  return {
    formData,
    setFormData,
    wizardStep,
    setWizardStep,
    furthestStep,
    setFurthestStep
  };
}
