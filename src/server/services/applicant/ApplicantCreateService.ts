import { getSupabaseClient } from "../../db/supabase";
import { pool } from "../../db/client";
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
      agama: (validated.agama || "Islam").slice(0, 50),
      kewarganegaraan: (validated.kewarganegaraan || "WNI").slice(0, 50),
      alamat: validated.alamat || "-",
      rt_rw: (validated.rtRw || "01/01").slice(0, 20),
      kelurahan: (validated.kelurahan || "-").slice(0, 50),
      kecamatan: (validated.kecamatan || "-").slice(0, 50),
      kode_pos: (validated.kodePos || "00000").slice(0, 20),
      whatsapp: (validated.whatsapp || "-").slice(0, 50),
      email: validated.email,
      tinggal_dengan: (validated.tinggalDengan || "-").slice(0, 50),
      transportasi: (validated.transportasi || "-").slice(0, 50),
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
      golongan_darah: (validated.golonganDarah || "-").slice(0, 50),
      penyakit_diderita: (validated.penyakitDiderita || "-").slice(0, 150),
      kebutuhan_khusus: validated.kebutuhanKhusus,
      punya_kps: (validated.punyaKPS || "Tidak").slice(0, 50),
      no_kps: (validated.noKPS || "-").slice(0, 50),
      punya_kip: (validated.punyaKIP || "Tidak").slice(0, 50),
      no_kip: (validated.noKIP || "-").slice(0, 50),
      jenis_prestasi: validated.jenisPrestasi,
      tingkat_prestasi: validated.tingkatPrestasi,
      uraian_prestasi: validated.uraianPrestasi,
      tahun_prestasi: (validated.tahunPrestasi || "-").slice(0, 50),
      penyelenggara: (validated.penyelenggara || "-").slice(0, 100),
      jenis_beasiswa: validated.jenisBeasiswa,
      uraian_beasiswa: validated.uraianBeasiswa,
      tahun_mulai_beasiswa: (validated.tahunMulaiBeasiswa || "-").slice(0, 50),
      tahun_selesai_beasiswa: (validated.tahunSelesaiBeasiswa || "-").slice(0, 50),
      nama_ayah: (validated.namaAyah || "-").slice(0, 150),
      tempat_lahir_ayah: (validated.tempatLahirAyah || "-").slice(0, 100),
      tgl_lahir_ayah: validated.tglLahirAyah
        ? new Date(validated.tglLahirAyah).toISOString()
        : null,
      agama_ayah: (validated.agamaAyah || "-").slice(0, 50),
      kewarganegaraan_ayah: (validated.kewarganegaraanAyah || "WNI").slice(0, 50),
      pendidikan_ayah: (validated.pendidikanAyah || "-").slice(0, 50),
      pekerjaan_ayah: (validated.pekerjaanAyah || "-").slice(0, 100),
      penghasilan_ayah: (validated.penghasilanAyah || "-").slice(0, 50),
      alamat_ayah: validated.alamatAyah,
      rtrw_ayah: (validated.rtrwAyah || "-").slice(0, 50),
      kelurahan_ayah: (validated.kelurahanAyah || "-").slice(0, 50),
      kecamatan_ayah: (validated.kecamatanAyah || "-").slice(0, 50),
      kode_pos_ayah: (validated.kodePosAyah || "00000").slice(0, 50),
      status_ayah: (validated.statusAyah || "Masih Hidup").slice(0, 50),
      nama_ibu: (validated.namaIbu || "-").slice(0, 150),
      tempat_lahir_ibu: (validated.tempatLahirIbu || "-").slice(0, 100),
      tgl_lahir_ibu: validated.tglLahirIbu
        ? new Date(validated.tglLahirIbu).toISOString()
        : null,
      agama_ibu: (validated.agamaIbu || "-").slice(0, 50),
      kewarganegaraan_ibu: (validated.kewarganegaraanIbu || "WNI").slice(0, 50),
      pendidikan_ibu: (validated.pendidikanIbu || "-").slice(0, 50),
      pekerjaan_ibu: (validated.pekerjaanIbu || "-").slice(0, 100),
      penghasilan_ibu: (validated.penghasilanIbu || "-").slice(0, 50),
      alamat_ibu: validated.alamatIbu,
      rtrw_ibu: (validated.rtrwIbu || "-").slice(0, 50),
      kelurahan_ibu: (validated.kelurahanIbu || "-").slice(0, 50),
      kecamatan_ibu: (validated.kecamatanIbu || "-").slice(0, 50),
      kode_pos_ibu: (validated.kodePosIbu || "00000").slice(0, 50),
      status_ibu: (validated.statusIbu || "Masih Hidup").slice(0, 50),
      nama_wali: (validated.namaWali || "-").slice(0, 150),
      tempat_lahir_wali: (validated.tempatLahirWali || "-").slice(0, 100),
      tgl_lahir_wali: validated.tglLahirWali
        ? new Date(validated.tglLahirWali).toISOString()
        : null,
      agama_wali: (validated.agamaWali || "-").slice(0, 50),
      kewarganegaraan_wali: (validated.kewarganegaraanWali || "WNI").slice(0, 50),
      pendidikan_wali: (validated.pendidikanWali || "-").slice(0, 50),
      pekerjaan_wali: (validated.pekerjaanWali || "-").slice(0, 100),
      penghasilan_wali: (validated.penghasilanWali || "-").slice(0, 50),
      alamat_wali: validated.alamatWali,
      rtrw_wali: (validated.rtrwWali || "-").slice(0, 50),
      kelurahan_wali: (validated.kelurahanWali || "-").slice(0, 50),
      kecamatan_wali: (validated.kecamatanWali || "-").slice(0, 50),
      kode_pos_wali: (validated.kodePosWali || "00000").slice(0, 50),
      status_wali: (validated.statusWali || "-").slice(0, 50),
      telepon_ortu: (validated.teleponOrtu || "-").slice(0, 50),
      sekolah_asal: (validated.sekolahAsal || "-").slice(0, 150),
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
      diterima_kelas: (validated.diterimaKelas || "X (Sepuluh)").slice(0, 100),
      diterima_tanggal: validated.diterimaTanggal
        ? new Date(validated.diterimaTanggal).toISOString()
        : null,
      jurusan_1: (validated.jurusan1 || "-").slice(0, 100),
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
      periode: (validated.periode || "2026-2027").slice(0, 50),
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
      console.warn("Supabase insert fallback to direct PostgreSQL pool:", pgErr?.message || String(dbErr));
      
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

      // Try PostgreSQL direct pool query
      try {
        const keys = Object.keys(mapped);
        const values = Object.values(mapped).map((val) =>
          typeof val === "object" && val !== null ? JSON.stringify(val) : val
        );
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
        const pgRes = await pool.query(
          `INSERT INTO calon_siswa (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`,
          values
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          savedRecord = pgRes.rows[0];
        }
      } catch (poolErr: unknown) {
        console.error("Pool query failed too:", poolErr);
      }

      if (!savedRecord) {
        return {
          success: false as const,
          statusCode: 500 as const,
          message: "Gagal memproses formulir pendaftaran: " + (pgErr?.message || String(dbErr))
        };
      }
    }

    const registrationNo = `SPMB-${new Date().getFullYear()}-${String(savedRecord.id).padStart(5, "0")}`;
    const { error: registrationError } = await supabase
      .from("student_applicants")
      .update({ registration_no: registrationNo })
      .eq("id", savedRecord.id)
      .eq("school_id", schoolId);
    if (registrationError) throw registrationError;
    savedRecord = { ...savedRecord, registration_no: registrationNo };

    return {
      success: true as const,
      statusCode: 201 as const,
      message: "Pendaftaran berhasil.",
      data: savedRecord
    };
  }
}
