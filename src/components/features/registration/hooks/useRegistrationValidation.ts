"use client";

import { useCallback } from "react";
import { RegistrationFormData, DEFAULT_FIELDS_CONFIG } from "../types";

export function useRegistrationValidation(
  fieldsConfig: Record<string, { label: string; required: boolean; active: boolean }>,
  formData: RegistrationFormData
) {
  const getFieldLabel = useCallback(
    (key: string, defaultLabel: string) => {
      return fieldsConfig[key]?.label || defaultLabel;
    },
    [fieldsConfig]
  );

  const isFieldRequired = useCallback(
    (key: string) => {
      const configVal = fieldsConfig[key];
      if (configVal === undefined) {
        return DEFAULT_FIELDS_CONFIG[key]?.required !== false;
      }
      return configVal.required;
    },
    [fieldsConfig]
  );

  const isFieldActive = useCallback(
    (key: string) => {
      const configVal = fieldsConfig[key];
      if (configVal === undefined) {
        return DEFAULT_FIELDS_CONFIG[key]?.active !== false;
      }
      return configVal.active;
    },
    [fieldsConfig]
  );

  const getStepLabel = (step: number): string => {
    switch (step) {
      case 1:
        return "Data Pribadi Siswa";
      case 2:
        return "Data Tempat Tinggal";
      case 3:
        return "Data Rincian (Data Periodik)";
      case 4:
        return "Data Kesehatan & Berkebutuhan Khusus";
      case 5:
        return "Data Prestasi (Opsional)";
      case 6:
        return "Data Beasiswa (Opsional)";
      case 7:
        return "Data Rincian (Data Pendidikan SMP)";
      case 8:
        return "Data Ayah Kandung";
      case 9:
        return "Data Ibu Kandung";
      case 10:
        return "Data Wali (Opsional)";
      case 11:
        return "Data Kegemaran & Minat";
      case 12:
        return "Data Budi Pekerti & Ekonomi";
      case 13:
        return "Tinjau & Verifikasi Data Anda";
      case 14:
        return "Berkas & Konfirmasi Pendaftaran";
      default:
        return "";
    }
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1:
        return ["nama", "jenisKelamin", "nisn", "nik", "tempatLahir", "tglLahir", "agama", "kewarganegaraan"];
      case 2:
        return [
          "alamat",
          "rtRw",
          "kelurahan",
          "kecamatan",
          "kodePos",
          "whatsapp",
          "teleponOrtu",
          "email",
          "tinggalDengan",
          "transportasi"
        ];
      case 3:
        return [
          "tinggiBadan",
          "beratBadan",
          "jarakSekolah",
          "jarakKm",
          "waktuJam",
          "waktuMenit",
          "jumlahSaudara"
        ];
      case 4:
        return ["golonganDarah", "penyakitDiderita", "kebutuhanKhusus"];
      case 5:
        return ["jenisPrestasi", "tingkatPrestasi", "uraianPrestasi", "tahunPrestasi", "penyelenggara"];
      case 6:
        return ["jenisBeasiswa", "uraianBeasiswa", "tahunMulaiBeasiswa", "tahunSelesaiBeasiswa"];
      case 7:
        return [
          "sekolahAsal",
          "tglLulus",
          "noIjazah",
          "noSKHUN",
          "noPesertaUN",
          "lamaBelajar",
          "pindahanDari",
          "alasanPindah",
          "diterimaKelas",
          "diterimaTanggal"
        ];
      case 8:
        return [
          "namaAyah",
          "tempatLahirAyah",
          "tglLahirAyah",
          "agamaAyah",
          "kewarganegaraanAyah",
          "pendidikanAyah",
          "pekerjaanAyah",
          "penghasilanAyah",
          "alamatAyah",
          "rtrwAyah",
          "kelurahanAyah",
          "kecamatanAyah",
          "kodePosAyah",
          "statusAyah"
        ];
      case 9:
        return [
          "namaIbu",
          "tempatLahirIbu",
          "tglLahirIbu",
          "agamaIbu",
          "kewarganegaraanIbu",
          "pendidikanIbu",
          "pekerjaanIbu",
          "penghasilanIbu",
          "alamatIbu",
          "rtrwIbu",
          "kelurahanIbu",
          "kecamatanIbu",
          "kodePosIbu",
          "statusIbu"
        ];
      case 10:
        return [
          "namaWali",
          "tempatLahirWali",
          "tglLahirWali",
          "agamaWali",
          "kewarganegaraanWali",
          "pendidikanWali",
          "pekerjaanWali",
          "penghasilanWali",
          "alamatWali",
          "rtrwWali",
          "kelurahanWali",
          "kecamatanWali",
          "kodePosWali",
          "statusWali"
        ];
      case 11:
        return [
          "hobi",
          "citaCita",
          "citaCitaSetelahLulus",
          "pelajaranDisenangi",
          "alasanDisenangi",
          "kesulitanBelajar"
        ];
      case 12:
        return [
          "perkelahian",
          "narkoba",
          "pelanggaranLain",
          "janjiTaat",
          "janjiSanksi",
          "janjiAkrab",
          "janjiBelajar",
          "janjiNamaBaik"
        ];
      case 13:
        return [];
      case 14:
        return ["berkasFotoBase64", "buktiBayar", "metodePembayaran", "deklarasi"];
      default:
        return [];
    }
  };

  const validateStep = (step: number): string[] => {
    const fields = getStepFields(step);
    const errors: string[] = [];

    if (step === 14) {
      if (!formData.deklarasi) errors.push("Pernyataan Deklarasi");
    }

    fields.forEach((key) => {
      const conf = fieldsConfig[key] || DEFAULT_FIELDS_CONFIG[key];
      if (conf && conf.active !== false && conf.required === true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (formData as any)[key];
        const isEmpty =
          val === undefined ||
          val === null ||
          (typeof val === "string" && val.trim() === "") ||
          (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          errors.push(conf.label || key);
        }
      }
    });

    return errors;
  };

  return {
    getFieldLabel,
    isFieldRequired,
    isFieldActive,
    getStepLabel,
    getStepFields,
    validateStep
  };
}
