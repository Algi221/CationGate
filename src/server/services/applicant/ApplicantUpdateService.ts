import { getSupabaseClient } from "../../db/supabase";
import { updateApplicantSchema } from "../../validations/applicants";
import { ApplicantSyncService } from "./ApplicantSyncService";

export class ApplicantUpdateService {
  static async updateApplicant(
    id: number,
    schoolId: string,
    rawBody: unknown,
    authToken?: string
  ) {
    const result = updateApplicantSchema.safeParse(rawBody);
    if (!result.success) {
      return {
        success: false as const,
        statusCode: 400 as const,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validated = result.data as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = rawBody as any;

    const supabase = getSupabaseClient(authToken);
    const query = supabase
      .from("student_applicants")
      .select("*")
      .eq("id", id)
      .eq("school_id", schoolId);
    const { data: existingRecord } = await query.single();
    if (!existingRecord) {
      return {
        success: false as const,
        statusCode: 404 as const,
        message: "Calon siswa tidak ditemukan."
      };
    }

    const getVal = (dbKey: string, feKeys: string[]) => {
      for (const k of feKeys) {
        if (validated[k] !== undefined) return validated[k];
      }
      if (validated[dbKey] !== undefined) return validated[dbKey];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (existingRecord as any)[dbKey];
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseNum = (val: any) => {
      if (val === undefined || val === null || val === "") return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseDate = (val: any) => {
      if (!val) return null;
      const str = String(val).trim();
      let normalizedStr = str;
      if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(str)) {
        const parts = str.split(/[-/]/);
        normalizedStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      const d = new Date(normalizedStr);
      if (isNaN(d.getTime()) || d.getFullYear() < 1900 || d.getFullYear() > 2100) return null;
      return d.toISOString();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: any = {
      nama: getVal("nama", ["nama"]),
      nisn: getVal("nisn", ["nisn"]),
      nik: getVal("nik", ["nik"]),
      tempat_lahir: getVal("tempat_lahir", ["tempat_lahir", "tempatLahir"]),
      tgl_lahir: parseDate(getVal("tgl_lahir", ["tgl_lahir", "tglLahir"])),
      jenis_kelamin: (() => {
        const jk = getVal("jenis_kelamin", ["jenis_kelamin", "jenisKelamin"]);
        if (jk === "Laki-laki") return "L";
        if (jk === "Perempuan") return "P";
        return jk;
      })(),
      agama: getVal("agama", ["agama"]),
      kewarganegaraan: getVal("kewarganegaraan", ["kewarganegaraan"]),
      alamat: getVal("alamat", ["alamat"]),
      rt_rw: getVal("rt_rw", ["rt_rw", "rtRw"]),
      kelurahan: getVal("kelurahan", ["kelurahan"]),
      kecamatan: getVal("kecamatan", ["kecamatan"]),
      kode_pos: getVal("kode_pos", ["kode_pos", "kodePos"]),
      whatsapp: getVal("whatsapp", ["whatsapp"]),
      email: getVal("email", ["email"]),
      tinggal_dengan: getVal("tinggal_dengan", ["tinggal_dengan", "tinggalDengan"]),
      transportasi: getVal("transportasi", ["transportasi"]),
      tinggi_badan: Math.min(300, Math.max(0, parseInt(getVal("tinggi_badan", ["tinggi_badan", "tinggiBadan"])) || 0)),
      berat_badan: Math.min(500, Math.max(0, parseInt(getVal("berat_badan", ["berat_badan", "beratBadan"])) || 0)),
      jarak_sekolah: getVal("jarak_sekolah", ["jarak_sekolah", "jarakSekolah"]),
      jarak_km: (() => {
        let j = parseNum(getVal("jarak_km", ["jarak_km", "jarakKm"])) || 0;
        const js = getVal("jarak_sekolah", ["jarak_sekolah", "jarakSekolah"]);
        if (js === "Kurang dari 1 km" && j > 20) j = j / 1000;
        if (j > 999.99) j = 999.99;
        if (j < 0) j = 0;
        return Math.round(j * 100) / 100;
      })(),
      waktu_jam: Math.min(99, Math.max(0, parseInt(getVal("waktu_jam", ["waktu_jam", "waktuJam"])) || 0)),
      waktu_menit: Math.min(59, Math.max(0, parseInt(getVal("waktu_menit", ["waktu_menit", "waktuMenit"])) || 0)),
      jumlah_saudara: Math.min(99, Math.max(0, parseInt(getVal("jumlah_saudara", ["jumlah_saudara", "jumlahSaudara"])) || 0)),
      golongan_darah: getVal("golongan_darah", ["golongan_darah", "golonganDarah"]),
      penyakit_diderita: getVal("penyakit_diderita", ["penyakit_diderita", "penyakitDiderita"]),
      punya_kps: getVal("punya_kps", ["punya_kps", "punyaKPS"]),
      no_kps: getVal("no_kps", ["no_kps", "noKPS"]),
      punya_kip: getVal("punya_kip", ["punya_kip", "punyaKIP"]),
      no_kip: getVal("no_kip", ["no_kip", "noKIP"]),
      nama_ayah: getVal("nama_ayah", ["nama_ayah", "namaAyah"]),
      tempat_lahir_ayah: getVal("tempat_lahir_ayah", ["tempat_lahir_ayah", "tempatLahirAyah"]),
      tgl_lahir_ayah: parseDate(getVal("tgl_lahir_ayah", ["tgl_lahir_ayah", "tglLahirAyah"])),
      agama_ayah: getVal("agama_ayah", ["agama_ayah", "agamaAyah"]),
      kewarganegaraan_ayah: getVal("kewarganegaraan_ayah", ["kewarganegaraan_ayah", "kewarganegaraanAyah"]),
      pendidikan_ayah: getVal("pendidikan_ayah", ["pendidikan_ayah", "pendidikanAyah"]),
      pekerjaan_ayah: getVal("pekerjaan_ayah", ["pekerjaan_ayah", "pekerjaanAyah"]),
      penghasilan_ayah: getVal("penghasilan_ayah", ["penghasilan_ayah", "penghasilanAyah"]),
      alamat_ayah: getVal("alamat_ayah", ["alamat_ayah", "alamatAyah"]),
      rtrw_ayah: getVal("rtrw_ayah", ["rtrw_ayah", "rtrwAyah"]),
      kelurahan_ayah: getVal("kelurahan_ayah", ["kelurahan_ayah", "kelurahanAyah"]),
      kecamatan_ayah: getVal("kecamatan_ayah", ["kecamatan_ayah", "kecamatanAyah"]),
      kode_pos_ayah: getVal("kode_pos_ayah", ["kode_pos_ayah", "kodePosAyah"]),
      status_ayah: getVal("status_ayah", ["status_ayah", "statusAyah"]),
      nama_ibu: getVal("nama_ibu", ["nama_ibu", "namaIbu"]),
      tempat_lahir_ibu: getVal("tempat_lahir_ibu", ["tempat_lahir_ibu", "tempatLahirIbu"]),
      tgl_lahir_ibu: parseDate(getVal("tgl_lahir_ibu", ["tgl_lahir_ibu", "tglLahirIbu"])),
      agama_ibu: getVal("agama_ibu", ["agama_ibu", "agamaIbu"]),
      kewarganegaraan_ibu: getVal("kewarganegaraan_ibu", ["kewarganegaraan_ibu", "kewarganegaraanIbu"]),
      pendidikan_ibu: getVal("pendidikan_ibu", ["pendidikan_ibu", "pendidikanIbu"]),
      pekerjaan_ibu: getVal("pekerjaan_ibu", ["pekerjaan_ibu", "pekerjaanIbu"]),
      penghasilan_ibu: getVal("penghasilan_ibu", ["penghasilan_ibu", "penghasilanIbu"]),
      alamat_ibu: getVal("alamat_ibu", ["alamat_ibu", "alamatIbu"]),
      rtrw_ibu: getVal("rtrw_ibu", ["rtrw_ibu", "rtrwIbu"]),
      kelurahan_ibu: getVal("kelurahan_ibu", ["kelurahan_ibu", "kelurahanIbu"]),
      kecamatan_ibu: getVal("kecamatan_ibu", ["kecamatan_ibu", "kecamatanIbu"]),
      kode_pos_ibu: getVal("kode_pos_ibu", ["kode_pos_ibu", "kodePosIbu"]),
      status_ibu: getVal("status_ibu", ["status_ibu", "statusIbu"]),
      nama_wali: getVal("nama_wali", ["nama_wali", "namaWali"]),
      tempat_lahir_wali: getVal("tempat_lahir_wali", ["tempat_lahir_wali", "tempatLahirWali"]),
      tgl_lahir_wali: parseDate(getVal("tgl_lahir_wali", ["tgl_lahir_wali", "tglLahirWali"])),
      agama_wali: getVal("agama_wali", ["agama_wali", "agamaWali"]),
      kewarganegaraan_wali: getVal("kewarganegaraan_wali", ["kewarganegaraan_wali", "kewarganegaraanWali"]),
      pendidikan_wali: getVal("pendidikan_wali", ["pendidikan_wali", "pendidikanWali"]),
      pekerjaan_wali: getVal("pekerjaan_wali", ["pekerjaan_wali", "pekerjaanWali"]),
      penghasilan_wali: getVal("penghasilan_wali", ["penghasilan_wali", "penghasilanWali"]),
      alamat_wali: getVal("alamat_wali", ["alamat_wali", "alamatWali"]),
      rtrw_wali: getVal("rtrw_wali", ["rtrw_wali", "rtrwWali"]),
      kelurahan_wali: getVal("kelurahan_wali", ["kelurahan_wali", "kelurahanWali"]),
      kecamatan_wali: getVal("kecamatan_wali", ["kecamatan_wali", "kecamatanWali"]),
      kode_pos_wali: getVal("kode_pos_wali", ["kode_pos_wali", "kodePosWali"]),
      status_wali: getVal("status_wali", ["status_wali", "statusWali"]),
      telepon_ortu: getVal("telepon_ortu", ["telepon_ortu", "teleponOrtu", "telepon"]),
      sekolah_asal: getVal("sekolah_asal", ["sekolah_asal", "sekolahAsal"]),
      tgl_lulus: parseDate(getVal("tgl_lulus", ["tgl_lulus", "tglLulus"])),
      no_ijazah: getVal("no_ijazah", ["no_ijazah", "noIjazah"]),
      no_skhun: getVal("no_skhun", ["no_skhun", "noSKHUN"]),
      no_peserta_un: getVal("no_peserta_un", ["no_peserta_un", "noPesertaUN"]),
      lama_belajar: Math.min(20, Math.max(1, parseInt(getVal("lama_belajar", ["lama_belajar", "lamaBelajar"])) || 3)),
      pindahan_dari: getVal("pindahan_dari", ["pindahan_dari", "pindahanDari"]),
      alasan_pindah: getVal("alasan_pindah", ["alasan_pindah", "alasanPindah"]),
      jurusan_1: getVal("jurusan_1", ["jurusan_1", "jurusan1"]),
      alasan_memilih: getVal("alasan_memilih", ["alasan_memilih", "alasanMinatKeahlian", "alasanMemilih"]),
      cita_cita: getVal("cita_cita", ["cita_cita", "citaCita"]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hobi: f.hobi !== undefined ? f.hobi : (existingRecord as any).hobi,
      nilai_us_teori: (() => {
        let n = parseNum(getVal("nilai_us_teori", ["nilai_us_teori", "nilaiUSTeori"])) || 0;
        if (n < 0) n = 0;
        if (n > 100) n = 100;
        return Math.round(n * 100) / 100;
      })(),
      nilai_us_praktik: (() => {
        let n = parseNum(getVal("nilai_us_praktik", ["nilai_us_praktik", "nilaiUSPraktik"])) || 0;
        if (n < 0) n = 0;
        if (n > 100) n = 100;
        return Math.round(n * 100) / 100;
      })(),
      nilai_muatan_lokal: (() => {
        let n = parseNum(getVal("nilai_muatan_lokal", ["nilai_muatan_lokal", "nilaiMuatanLokal"])) || 0;
        if (n < 0) n = 0;
        if (n > 100) n = 100;
        return Math.round(n * 100) / 100;
      })(),
      kesulitan_belajar: getVal("kesulitan_belajar", ["kesulitan_belajar", "kesulitanBelajar"]),
      pelajaran_disenangi: getVal("pelajaran_disenangi", ["pelajaran_disenangi", "pelajaranDisenangi"]),
      cita_cita_setelah_lulus: getVal("cita_cita_setelah_lulus", ["cita_cita_setelah_lulus", "citaCitaSetelahLulus"]),
      periode: getVal("periode", ["periode"]),
      diterima_kelas: getVal("diterima_kelas", ["diterima_kelas", "diterimaKelas"]),
      diterima_tanggal: parseDate(getVal("diterima_tanggal", ["diterima_tanggal", "diterimaTanggal"])),
      gelombang: getVal("gelombang", ["gelombang"]),
      status: getVal("status", ["status"]),
      kebutuhan_khusus:
        f.kebutuhanKhusus !== undefined
          ? f.kebutuhanKhusus
          : (existingRecord as Record<string, unknown>).kebutuhan_khusus,
      jenis_prestasi:
        f.jenisPrestasi !== undefined
          ? f.jenisPrestasi
          : (existingRecord as Record<string, unknown>).jenis_prestasi,
      tingkat_prestasi:
        f.tingkatPrestasi !== undefined
          ? f.tingkatPrestasi
          : (existingRecord as Record<string, unknown>).tingkat_prestasi,
      jenis_beasiswa:
        f.jenisBeasiswa !== undefined
          ? f.jenisBeasiswa
          : (existingRecord as Record<string, unknown>).jenis_beasiswa
    };

    const updateQuery = supabase
      .from("student_applicants")
      .update(fields)
      .eq("id", id)
      .eq("school_id", schoolId);
    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    await ApplicantSyncService.syncCandidateToSiswaAktif(updatedRecord);

    return {
      success: true as const,
      statusCode: 200 as const,
      message: "Data pendaftar berhasil diperbarui.",
      data: updatedRecord
    };
  }
}
