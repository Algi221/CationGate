import { getSupabaseClient } from "../../db/supabase";
import { broadcast } from "../../ws/handler";
import { resolveSchoolUUID } from "../../db/resolve-school";
import { fontInMemSchools } from "../../routes/saas";
import { registerApplicantSchema } from "../../validations/applicants";

export class ApplicantCreateService {
  static async registerApplicant(rawBody: unknown, schoolSlug: string | undefined) {
    const result = registerApplicantSchema.safeParse(rawBody);
    if (!result.success) {
      return {
        success: false as const,
        statusCode: 400 as const,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      };
    }
    const validated = result.data;

    if (!schoolSlug) {
      return {
        success: false as const,
        statusCode: 400 as const,
        message: "Parameter school_slug wajib disertakan."
      };
    }

    const schoolId = await resolveSchoolUUID(schoolSlug, fontInMemSchools);
    if (!schoolId) {
      return {
        success: false as const,
        statusCode: 404 as const,
        message: "Sekolah tidak ditemukan."
      };
    }

    const supabase = getSupabaseClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: any = {
      school_id: schoolId,
      nama: validated.nama || "Calon Siswa",
      nisn: validated.nisn || Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      nik: validated.nik || Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
      tempat_lahir: validated.tempatLahir || "-",
      tgl_lahir: validated.tglLahir
        ? new Date(validated.tglLahir).toISOString()
        : new Date("2010-01-01").toISOString(),
      jenis_kelamin:
        validated.jenisKelamin === "L" || validated.jenisKelamin === "Laki-laki" ? "L" : "P",
      agama: validated.agama || "Islam",
      kewarganegaraan: validated.kewarganegaraan || "WNI",
      alamat: validated.alamat || "-",
      rt_rw: validated.rtRw || "01/01",
      kelurahan: validated.kelurahan || "-",
      kecamatan: validated.kecamatan || "-",
      kode_pos: validated.kodePos || "00000",
      whatsapp: validated.whatsapp || "-",
      email: validated.email,
      tinggal_dengan: validated.tinggalDengan,
      transportasi: validated.transportasi,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tinggi_badan: parseInt(validated.tinggiBadan as any) || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      berat_badan: parseInt(validated.beratBadan as any) || 0,
      jarak_sekolah: validated.jarakSekolah,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jarak_km: parseFloat(validated.jarakKm as any) || 0.0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      waktu_jam: parseInt(validated.waktuJam as any) || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      waktu_menit: parseInt(validated.waktuMenit as any) || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jumlah_saudara: parseInt(validated.jumlahSaudara as any) || 0,
      golongan_darah: validated.golonganDarah,
      penyakit_diderita: validated.penyakitDiderita,
      kebutuhan_khusus: validated.kebutuhanKhusus,
      punya_kps: validated.punyaKPS,
      no_kps: validated.noKPS,
      punya_kip: validated.punyaKIP,
      no_kip: validated.noKIP,
      jenis_prestasi: validated.jenisPrestasi,
      tingkat_prestasi: validated.tingkatPrestasi,
      uraian_prestasi: validated.uraianPrestasi,
      tahun_prestasi: validated.tahunPrestasi,
      penyelenggara: validated.penyelenggara,
      jenis_beasiswa: validated.jenisBeasiswa,
      uraian_beasiswa: validated.uraianBeasiswa,
      tahun_mulai_beasiswa: validated.tahunMulaiBeasiswa,
      tahun_selesai_beasiswa: validated.tahunSelesaiBeasiswa,
      nama_ayah: validated.namaAyah,
      tempat_lahir_ayah: validated.tempatLahirAyah,
      tgl_lahir_ayah: validated.tglLahirAyah
        ? new Date(validated.tglLahirAyah).toISOString()
        : null,
      agama_ayah: validated.agamaAyah,
      kewarganegaraan_ayah: validated.kewarganegaraanAyah,
      pendidikan_ayah: validated.pendidikanAyah,
      pekerjaan_ayah: validated.pekerjaanAyah,
      penghasilan_ayah: validated.penghasilanAyah,
      alamat_ayah: validated.alamatAyah,
      rtrw_ayah: validated.rtrwAyah,
      kelurahan_ayah: validated.kelurahanAyah,
      kecamatan_ayah: validated.kecamatanAyah,
      kode_pos_ayah: validated.kodePosAyah,
      status_ayah: validated.statusAyah,
      nama_ibu: validated.namaIbu,
      tempat_lahir_ibu: validated.tempatLahirIbu || "",
      tgl_lahir_ibu: validated.tglLahirIbu
        ? new Date(validated.tglLahirIbu).toISOString()
        : null,
      agama_ibu: validated.agamaIbu || "",
      kewarganegaraan_ibu: validated.kewarganegaraanIbu,
      pendidikan_ibu: validated.pendidikanIbu,
      pekerjaan_ibu: validated.pekerjaanIbu,
      penghasilan_ibu: validated.penghasilanIbu,
      alamat_ibu: validated.alamatIbu,
      rtrw_ibu: validated.rtrwIbu,
      kelurahan_ibu: validated.kelurahanIbu,
      kecamatan_ibu: validated.kecamatanIbu,
      kode_pos_ibu: validated.kodePosIbu,
      status_ibu: validated.statusIbu,
      nama_wali: validated.namaWali,
      tempat_lahir_wali: validated.tempatLahirWali,
      tgl_lahir_wali: validated.tglLahirWali
        ? new Date(validated.tglLahirWali).toISOString()
        : null,
      agama_wali: validated.agamaWali,
      kewarganegaraan_wali: validated.kewarganegaraanWali,
      pendidikan_wali: validated.pendidikanWali,
      pekerjaan_wali: validated.pekerjaanWali,
      penghasilan_wali: validated.penghasilanWali,
      alamat_wali: validated.alamatWali,
      rtrw_wali: validated.rtrwWali,
      kelurahan_wali: validated.kelurahanWali,
      kecamatan_wali: validated.kecamatanWali,
      kode_pos_wali: validated.kodePosWali,
      status_wali: validated.statusWali,
      telepon_ortu: validated.teleponOrtu,
      sekolah_asal: validated.sekolahAsal || "-",
      tgl_lulus: validated.tglLulus
        ? new Date(validated.tglLulus).toISOString()
        : new Date("2026-06-10").toISOString(),
      no_ijazah: validated.noIjazah,
      no_skhun: validated.noSKHUN,
      no_peserta_un: validated.noPesertaUN,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lama_belajar: parseInt(validated.lamaBelajar as any) || 3,
      pindahan_dari: validated.pindahanDari,
      alasan_pindah: validated.alasanPindah,
      diterima_kelas: validated.diterimaKelas || "X (Sepuluh)",
      diterima_tanggal: validated.diterimaTanggal
        ? new Date(validated.diterimaTanggal).toISOString()
        : null,
      jurusan_1: validated.jurusan1,
      alasan_memilih: validated.alasanMemilih,
      hobi: validated.hobi,
      cita_cita: validated.citaCita,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nilai_us_teori: parseFloat(validated.nilaiUSTeori as any) || 0.0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nilai_us_praktik: parseFloat(validated.nilaiUSPraktik as any) || 0.0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nilai_muatan_lokal: parseFloat(validated.nilaiMuatanLokal as any) || 0.0,
      cita_cita_setelah_lulus: validated.citaCitaSetelahLulus,
      pelajaran_disenangi: validated.pelajaranDisenangi,
      alasan_disenangi: validated.alasanDisenangi,
      kesulitan_belajar: validated.kesulitanBelajar,
      perkelahian:
        validated.perkelahian === "Pernah" || validated.perkelahian === "Ya" ? "Ya" : "Tidak",
      ket_perkelahian: validated.ketPerkelahian,
      narkoba: validated.narkoba === "Pernah" || validated.narkoba === "Ya" ? "Ya" : "Tidak",
      ket_narkoba: validated.ketNarkoba,
      pelanggaran_lain:
        validated.pelanggaranLain === "Pernah" || validated.pelanggaranLain === "Ya"
          ? "Ya"
          : "Tidak",
      ket_pelanggaran_lain: validated.ketPelanggaranLain,
      janji_taat: validated.janjiTaat === "Sanggup" || validated.janjiTaat === true,
      janji_sanksi: validated.janjiSanksi === "Sanggup" || validated.janjiSanksi === true,
      janji_akrab: validated.janjiAkrab === "Sanggup" || validated.janjiAkrab === true,
      janji_belajar: validated.janjiBelajar === "Sanggup" || validated.janjiBelajar === true,
      janji_nama_baik:
        validated.janjiNamaBaik === "Sanggup" || validated.janjiNamaBaik === true,
      periode: validated.periode,
      status: "Pending",
      tgl_daftar: new Date().toISOString()
    };

    let detectedGelombang = "Gelombang 1";
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let gelombangConfig: any = null;
      const { data: configRecord } = await supabase
        .from("landing_page_config")
        .select("config_value")
        .eq("config_key", "ppdb_gelombang_config")
        .eq("school_id", schoolId)
        .single();
      if (configRecord && configRecord.config_value) {
        gelombangConfig = configRecord.config_value;
        if (typeof gelombangConfig === "string") {
          try {
            gelombangConfig = JSON.parse(gelombangConfig);
          } catch (_e) {
            gelombangConfig = {};
          }
        }
      }

      if (gelombangConfig) {
        const todayStr = new Date().toISOString().split("T")[0];
        const g1 = gelombangConfig.gelombang1;
        const g2 = gelombangConfig.gelombang2;

        if (g1 && g1.start && g1.end && todayStr >= g1.start && todayStr <= g1.end) {
          detectedGelombang = "Gelombang 1";
        } else if (g2 && g2.start && g2.end && todayStr >= g2.start && todayStr <= g2.end) {
          detectedGelombang = "Gelombang 2";
        } else {
          if (g1 && g1.end && todayStr > g1.end) {
            detectedGelombang = "Gelombang 2";
          } else {
            detectedGelombang = "Gelombang 1";
          }
        }
      }
    } catch (e) {
      console.error("Error auto-detecting gelombang:", e);
    }
    mapped.gelombang = detectedGelombang;

    const { data: existing } = await supabase
      .from("student_applicants")
      .select("nisn, nik")
      .eq("school_id", schoolId)
      .or(`nisn.eq.${mapped.nisn},nik.eq.${mapped.nik}`)
      .maybeSingle();

    if (existing) {
      const field = existing.nisn === mapped.nisn ? "NISN" : "NIK";
      return {
        success: false as const,
        statusCode: 400 as const,
        message: `${field} ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.`
      };
    }

    const requestedJurusan = mapped.jurusan_1 || "";
    if (!requestedJurusan) {
      return {
        success: false as const,
        statusCode: 400 as const,
        message: "Pilihan Program Keahlian (Jurusan 1) wajib diisi."
      };
    }
    const jurusanName = requestedJurusan.includes(" (")
      ? requestedJurusan.split(" (")[0]
      : requestedJurusan;

    let targets: Record<string, number> = {
      "Teknik Jaringan Komputer & Telekomunikasi": 160,
      "Rekayasa Perangkat Lunak": 200,
      Animasi: 80,
      "Broadcasting & Perfilman": 120,
      "Teknik Elektronika": 80,
      "Desain Komunikasi Visual": 40
    };
    try {
      const { data: configRecord } = await supabase
        .from("landing_page_config")
        .select("config_value")
        .eq("config_key", "kuota_targets")
        .eq("school_id", schoolId)
        .single();
      if (configRecord && configRecord.config_value) {
        let cv = configRecord.config_value;
        if (typeof cv === "string") {
          try {
            cv = JSON.parse(cv);
          } catch (_e) {
            cv = {};
          }
        }
        targets = { ...targets, ...(cv as Record<string, number>) };
      }
    } catch (e) {
      console.error("Error fetching kuota targets for validation", e);
    }

    const target = targets[jurusanName] || 0;
    if (target > 0) {
      const { count: currentCount } = await supabase
        .from("student_applicants")
        .select("*", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .like("jurusan_1", `${jurusanName}%`)
        .is("deleted_at", null);

      if ((currentCount || 0) >= target) {
        return {
          success: false as const,
          statusCode: 400 as const,
          message: `Maaf, kuota untuk program keahlian ${jurusanName} sudah penuh. Silakan pilih jurusan lain.`
        };
      }
    }

    let savedRecord;
    try {
      const { data: insertData, error: dbErr } = await supabase
        .from("student_applicants")
        .insert(mapped)
        .select()
        .single();
      if (dbErr) throw dbErr;
      savedRecord = insertData;
    } catch (dbErr: unknown) {
      const pgErr = dbErr as { code?: string; details?: string; message?: string };
      console.error("Supabase CalonSiswa create DB failure.", pgErr?.message || String(dbErr));
      if (pgErr?.code === "23505") {
        const detail = pgErr?.details || pgErr?.message || "";
        if (detail.includes("nisn")) {
          return {
            success: false as const,
            statusCode: 400 as const,
            message: "NISN ini sudah terdaftar di sistem PPDB. Silakan periksa kembali."
          };
        }
        if (detail.includes("nik")) {
          return {
            success: false as const,
            statusCode: 400 as const,
            message: "NIK ini sudah terdaftar di sistem PPDB. Silakan periksa kembali."
          };
        }
      }
      return {
        success: false as const,
        statusCode: 500 as const,
        message: "Gagal memproses formulir pendaftaran: " + (pgErr?.message || String(dbErr))
      };
    }

    const registrationNo = `SPMB-${new Date().getFullYear()}-${String(savedRecord.id).padStart(5, "0")}`;
    const { error: registrationError } = await supabase
      .from("student_applicants")
      .update({ registration_no: registrationNo })
      .eq("id", savedRecord.id)
      .eq("school_id", schoolId);
    if (registrationError) throw registrationError;
    savedRecord = { ...savedRecord, registration_no: registrationNo };

    broadcast(
      {
        event: "NEW_APPLICANT",
        data: savedRecord
      },
      true
    );

    broadcast(
      {
        event: "NEW_APPLICANT_PUBLIC",
        data: {
          id: savedRecord.id,
          nama: savedRecord.nama,
          nisn: savedRecord.nisn,
          sekolah_asal: savedRecord.sekolah_asal,
          jurusan_1: savedRecord.jurusan_1,
          diterima_kelas: savedRecord.diterima_kelas,
          jenis_kelamin: savedRecord.jenis_kelamin,
          status: savedRecord.status,
          tgl_daftar: savedRecord.tgl_daftar
        }
      },
      false
    );

    return {
      success: true as const,
      statusCode: 201 as const,
      message: "Pendaftaran berhasil.",
      data: savedRecord
    };
  }
}
