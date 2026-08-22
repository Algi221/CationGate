import { getSupabaseClient } from "../db/supabase";
import { broadcast } from "../ws/handler";
import { resolveSchoolUUID } from "../db/resolve-school";
import { fontInMemSchools } from "../routes/saas";
import { registerApplicantSchema, updateApplicantSchema } from "../validations/applicants";

export class ApplicantService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async syncCandidateToSiswaAktif(candidate: any): Promise<void> {
    try {
      const supabase = getSupabaseClient(); 
      const schoolId = candidate.school_id;

      if (!schoolId) {
        console.warn('Sync ignored: Candidate missing school_id', candidate.id);
        return;
      }

      if (candidate.status === 'Approved') {
        const {
          id: calon_siswa_id,
          nama, nisn, nik, tempat_lahir, tgl_lahir, jenis_kelamin, agama, kewarganegaraan,
          alamat, rt_rw, kelurahan, kecamatan, kode_pos, whatsapp, email, tinggal_dengan, transportasi,
          tinggi_badan, berat_badan, jarak_sekolah, jarak_km, waktu_jam, waktu_menit, jumlah_saudara, golongan_darah,
          penyakit_diderita, kebutuhan_khusus, punya_kps, no_kps, punya_kip, no_kip,
          jenis_prestasi, tingkat_prestasi, uraian_prestasi, tahun_prestasi, penyelenggara,
          jenis_beasiswa, uraian_beasiswa, tahun_mulai_beasiswa, tahun_selesai_beasiswa,
          nama_ayah, tempat_lahir_ayah, tgl_lahir_ayah, agama_ayah, kewarganegaraan_ayah, pendidikan_ayah, pekerjaan_ayah, penghasilan_ayah, alamat_ayah, rtrw_ayah, kelurahan_ayah, kecamatan_ayah, kode_pos_ayah, status_ayah,
          nama_ibu, tempat_lahir_ibu, tgl_lahir_ibu, agama_ibu, kewarganegaraan_ibu, pendidikan_ibu, pekerjaan_ibu, penghasilan_ibu, alamat_ibu, rtrw_ibu, kelurahan_ibu, kecamatan_ibu, kode_pos_ibu, status_ibu,
          nama_wali, tempat_lahir_wali, tgl_lahir_wali, agama_wali, kewarganegaraan_wali, pendidikan_wali, pekerjaan_wali, penghasilan_wali, alamat_wali, rtrw_wali, kelurahan_wali, kecamatan_wali, kode_pos_wali, status_wali,
          telepon_ortu, sekolah_asal, tgl_lulus, no_ijazah, no_skhun, no_peserta_un, lama_belajar, pindahan_dari, alasan_pindah,
          diterima_kelas, diterima_tanggal,
          jurusan_1, alasan_memilih,
          hobi, cita_cita, nilai_us_teori, nilai_us_praktik, nilai_muatan_lokal, cita_cita_setelah_lulus, pelajaran_disenangi, alasan_disenangi, kesulitan_belajar,
          perkelahian, ket_perkelahian, narkoba, ket_narkoba, pelanggaran_lain, ket_pelanggaran_lain, janji_taat, janji_sanksi, janji_akrab, janji_belajar, janji_nama_baik,
          periode, gelombang, registration_no
        } = candidate;

        if (nisn) {
          const { data: existingByNisn } = await supabase.from('active_students').select('id, calon_siswa_id').eq('nisn', nisn).eq('school_id', schoolId).maybeSingle();
          if (existingByNisn && existingByNisn.calon_siswa_id !== calon_siswa_id) {
            await supabase.from('active_students').delete().eq('id', existingByNisn.id).eq('school_id', schoolId);
          }
        }

        if (nik) {
          const { data: existingByNik } = await supabase.from('active_students').select('id, calon_siswa_id').eq('nik', nik).eq('school_id', schoolId).maybeSingle();
          if (existingByNik && existingByNik.calon_siswa_id !== calon_siswa_id) {
            await supabase.from('active_students').delete().eq('id', existingByNik.id).eq('school_id', schoolId);
          }
        }

        const payload = {
          school_id: schoolId,
          calon_siswa_id,
          nama, nisn, nik, tempat_lahir, tgl_lahir, jenis_kelamin, agama, kewarganegaraan,
          alamat, rt_rw, kelurahan, kecamatan, kode_pos, whatsapp, email, tinggal_dengan, transportasi,
          tinggi_badan, berat_badan, jarak_sekolah, jarak_km, waktu_jam, waktu_menit, jumlah_saudara, golongan_darah,
          penyakit_diderita, kebutuhan_khusus: kebutuhan_khusus ?? undefined, punya_kps, no_kps, punya_kip, no_kip,
          jenis_prestasi: jenis_prestasi ?? undefined, tingkat_prestasi: tingkat_prestasi ?? undefined, uraian_prestasi, tahun_prestasi, penyelenggara,
          jenis_beasiswa: jenis_beasiswa ?? undefined, uraian_beasiswa, tahun_mulai_beasiswa, tahun_selesai_beasiswa,
          nama_ayah, tempat_lahir_ayah, tgl_lahir_ayah, agama_ayah, kewarganegaraan_ayah, pendidikan_ayah, pekerjaan_ayah, penghasilan_ayah, alamat_ayah, rtrw_ayah, kelurahan_ayah, kecamatan_ayah, kode_pos_ayah, status_ayah,
          nama_ibu, tempat_lahir_ibu, tgl_lahir_ibu, agama_ibu, kewarganegaraan_ibu, pendidikan_ibu, pekerjaan_ibu, penghasilan_ibu, alamat_ibu, rtrw_ibu, kelurahan_ibu, kecamatan_ibu, kode_pos_ibu, status_ibu,
          nama_wali, tempat_lahir_wali, tgl_lahir_wali, agama_wali, kewarganegaraan_wali, pendidikan_wali, pekerjaan_wali, penghasilan_wali, alamat_wali, rtrw_wali, kelurahan_wali, kecamatan_wali, kode_pos_wali, status_wali,
          telepon_ortu, sekolah_asal, tgl_lulus, no_ijazah, no_skhun, no_peserta_un, lama_belajar, pindahan_dari, alasan_pindah,
          diterima_kelas, diterima_tanggal,
          jurusan: jurusan_1, alasan_memilih,
          hobi: hobi ?? undefined, cita_cita, nilai_us_teori, nilai_us_praktik, nilai_muatan_lokal, cita_cita_setelah_lulus, pelajaran_disenangi, alasan_disenangi, kesulitan_belajar,
          perkelahian, ket_perkelahian, narkoba, ket_narkoba, pelanggaran_lain, ket_pelanggaran_lain, janji_taat, janji_sanksi, janji_akrab, janji_belajar, janji_nama_baik,
          periode, gelombang, registration_no
        };

        const { data: existingSiswa } = await supabase.from('active_students').select('id').eq('calon_siswa_id', calon_siswa_id).eq('school_id', schoolId).maybeSingle();

        if (existingSiswa) {
          await supabase.from('active_students').update(payload).eq('id', existingSiswa.id).eq('school_id', schoolId);
        } else {
          await supabase.from('active_students').insert(payload);
        }
      } else {
        await supabase.from('active_students').delete().eq('calon_siswa_id', candidate.id).eq('school_id', schoolId);
      }
    } catch (err) {
      console.error('Error syncing candidate to SiswaAktif:', err);
    }
  }

  static async syncAllExistingApprovedApplicants(): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { data: approvedCandidates } = await supabase.from('student_applicants').select('*').eq('status', 'Approved');

      if (approvedCandidates) {
        console.log(`[Startup-Sync] Ditemukan ${approvedCandidates.length} calon siswa berstatus Approved. Mensinkronkan ke SiswaAktif...`);
        for (const candidate of approvedCandidates) {
          await ApplicantService.syncCandidateToSiswaAktif(candidate);
        }
        console.log(`[Startup-Sync] Sinkronisasi selesai.`);
      }
    } catch (err: unknown) {
      console.error('Error syncing existing approved candidates to SiswaAktif:', (err as Error)?.message || String(err));
    }
  }

  static async checkAndDisqualifyExpiredApplicants(): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const batasWaktu = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: expiredApplicants } = await supabase.from('student_applicants')
        .select('*')
        .eq('status', 'Pending')
        .lt('tgl_daftar', batasWaktu)
        .is('deleted_at', null);

      if (expiredApplicants && expiredApplicants.length > 0) {
        console.log(`[Auto-Gugur] Ditemukan ${expiredApplicants.length} pendaftar expired. Memproses...`);

        for (const applicant of expiredApplicants) {
          await supabase.from('student_applicants')
            .update({ status: 'Rejected' })
            .eq('id', applicant.id);

          const updatedApplicant = { ...applicant, status: 'Rejected' };
          broadcast({
            event: 'STATUS_UPDATE',
            data: {
              id: updatedApplicant.id,
              nama: updatedApplicant.nama,
              status: 'Rejected'
            }
          });
          broadcast({
            event: 'APPLICANT_UPDATED',
            data: updatedApplicant
          });
        }
      }
    } catch (err: unknown) {
      console.error('Error saat menjalankan penjadwal auto-gugur:', (err as Error)?.message || String(err));
    }
  }

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
      return { success: false as const, statusCode: 400 as const, message: 'Parameter school_slug wajib disertakan.' };
    }

    const schoolId = await resolveSchoolUUID(schoolSlug, fontInMemSchools);
    if (!schoolId) {
      return { success: false as const, statusCode: 404 as const, message: 'Sekolah tidak ditemukan.' };
    }

    const supabase = getSupabaseClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: any = {
      school_id: schoolId,
      nama: validated.nama || 'Calon Siswa',
      nisn: validated.nisn || Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      nik: validated.nik || Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
      tempat_lahir: validated.tempatLahir || '-',
      tgl_lahir: validated.tglLahir ? new Date(validated.tglLahir).toISOString() : new Date("2010-01-01").toISOString(),
      jenis_kelamin: validated.jenisKelamin === 'L' || validated.jenisKelamin === 'Laki-laki' ? 'L' : 'P',
      agama: validated.agama || 'Islam',
      kewarganegaraan: validated.kewarganegaraan || 'WNI',
      alamat: validated.alamat || '-',
      rt_rw: validated.rtRw || '01/01',
      kelurahan: validated.kelurahan || '-',
      kecamatan: validated.kecamatan || '-',
      kode_pos: validated.kodePos || '00000',
      whatsapp: validated.whatsapp || '-',
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
      tgl_lahir_ayah: validated.tglLahirAyah ? new Date(validated.tglLahirAyah).toISOString() : null,
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
      tempat_lahir_ibu: validated.tempatLahirIbu || '',
      tgl_lahir_ibu: validated.tglLahirIbu ? new Date(validated.tglLahirIbu).toISOString() : null,
      agama_ibu: validated.agamaIbu || '',
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
      tgl_lahir_wali: validated.tglLahirWali ? new Date(validated.tglLahirWali).toISOString() : null,
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
      sekolah_asal: validated.sekolahAsal || '-',
      tgl_lulus: validated.tglLulus ? new Date(validated.tglLulus).toISOString() : new Date("2026-06-10").toISOString(),
      no_ijazah: validated.noIjazah,
      no_skhun: validated.noSKHUN,
      no_peserta_un: validated.noPesertaUN,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lama_belajar: parseInt(validated.lamaBelajar as any) || 3,
      pindahan_dari: validated.pindahanDari,
      alasan_pindah: validated.alasanPindah,
      diterima_kelas: validated.diterimaKelas || 'X (Sepuluh)',
      diterima_tanggal: validated.diterimaTanggal ? new Date(validated.diterimaTanggal).toISOString() : null,
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
      perkelahian: validated.perkelahian === 'Pernah' || validated.perkelahian === 'Ya' ? 'Ya' : 'Tidak',
      ket_perkelahian: validated.ketPerkelahian,
      narkoba: validated.narkoba === 'Pernah' || validated.narkoba === 'Ya' ? 'Ya' : 'Tidak',
      ket_narkoba: validated.ketNarkoba,
      pelanggaran_lain: validated.pelanggaranLain === 'Pernah' || validated.pelanggaranLain === 'Ya' ? 'Ya' : 'Tidak',
      ket_pelanggaran_lain: validated.ketPelanggaranLain,
      janji_taat: validated.janjiTaat === 'Sanggup' || validated.janjiTaat === true,
      janji_sanksi: validated.janjiSanksi === 'Sanggup' || validated.janjiSanksi === true,
      janji_akrab: validated.janjiAkrab === 'Sanggup' || validated.janjiAkrab === true,
      janji_belajar: validated.janjiBelajar === 'Sanggup' || validated.janjiBelajar === true,
      janji_nama_baik: validated.janjiNamaBaik === 'Sanggup' || validated.janjiNamaBaik === true,
      periode: validated.periode,
      status: 'Pending',
      tgl_daftar: new Date().toISOString()
    };

    // Auto-detect Gelombang based on config ranges and date
    let detectedGelombang = 'Gelombang 1';
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let gelombangConfig: any = null;
      const { data: configRecord } = await supabase.from('landing_page_config').select('config_value').eq('config_key', 'ppdb_gelombang_config').eq('school_id', schoolId).single();
      if (configRecord && configRecord.config_value) {
        gelombangConfig = configRecord.config_value;
        if (typeof gelombangConfig === 'string') {
          try {
            gelombangConfig = JSON.parse(gelombangConfig);
          } catch (_e) {
            gelombangConfig = {};
          }
        }
      }

      if (gelombangConfig) {
        const todayStr = new Date().toISOString().split('T')[0];
        const g1 = gelombangConfig.gelombang1;
        const g2 = gelombangConfig.gelombang2;

        if (g1 && g1.start && g1.end && todayStr >= g1.start && todayStr <= g1.end) {
          detectedGelombang = 'Gelombang 1';
        } else if (g2 && g2.start && g2.end && todayStr >= g2.start && todayStr <= g2.end) {
          detectedGelombang = 'Gelombang 2';
        } else {
          if (g1 && g1.end && todayStr > g1.end) {
            detectedGelombang = 'Gelombang 2';
          } else {
            detectedGelombang = 'Gelombang 1';
          }
        }
      }
    } catch (e) {
      console.error("Error auto-detecting gelombang:", e);
    }
    mapped.gelombang = detectedGelombang;

    // Check for duplicate NISN or NIK in Supabase
    const { data: existing } = await supabase.from('student_applicants')
      .select('nisn, nik')
      .eq('school_id', schoolId)
      .or(`nisn.eq.${mapped.nisn},nik.eq.${mapped.nik}`)
      .maybeSingle();

    if (existing) {
      const field = existing.nisn === mapped.nisn ? 'NISN' : 'NIK';
      return {
        success: false as const,
        statusCode: 400 as const,
        message: `${field} ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.`
      };
    }

    // Quota Check
    const requestedJurusan = mapped.jurusan_1 || '';
    if (!requestedJurusan) {
      return { success: false as const, statusCode: 400 as const, message: 'Pilihan Program Keahlian (Jurusan 1) wajib diisi.' };
    }
    const jurusanName = requestedJurusan.includes(' (') ? requestedJurusan.split(' (')[0] : requestedJurusan;

    let targets: Record<string, number> = {
      "Teknik Jaringan Komputer & Telekomunikasi": 160,
      "Rekayasa Perangkat Lunak": 200,
      "Animasi": 80,
      "Broadcasting & Perfilman": 120,
      "Teknik Elektronika": 80,
      "Desain Komunikasi Visual": 40,
    };
    try {
      const { data: configRecord } = await supabase.from('landing_page_config').select('config_value').eq('config_key', 'kuota_targets').eq('school_id', schoolId).single();
      if (configRecord && configRecord.config_value) {
        let cv = configRecord.config_value;
        if (typeof cv === 'string') {
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
      const { count: currentCount } = await supabase.from('student_applicants')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .like('jurusan_1', `${jurusanName}%`)
        .is('deleted_at', null);

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
      const { data: insertData, error: dbErr } = await supabase.from('student_applicants').insert(mapped).select().single();
      if (dbErr) throw dbErr;
      savedRecord = insertData;
    } catch (dbErr: unknown) {
      const pgErr = dbErr as { code?: string; details?: string; message?: string };
      console.error("Supabase CalonSiswa create DB failure.", pgErr?.message || String(dbErr));
      if (pgErr?.code === '23505') {
        const detail = pgErr?.details || pgErr?.message || '';
        if (detail.includes('nisn')) {
          return { success: false as const, statusCode: 400 as const, message: 'NISN ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.' };
        }
        if (detail.includes('nik')) {
          return { success: false as const, statusCode: 400 as const, message: 'NIK ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.' };
        }
      }
      return { success: false as const, statusCode: 500 as const, message: 'Gagal memproses formulir pendaftaran: ' + (pgErr?.message || String(dbErr)) };
    }

    const registrationNo = `SPMB-${new Date().getFullYear()}-${String(savedRecord.id).padStart(5, '0')}`;
    const { error: registrationError } = await supabase.from('student_applicants')
      .update({ registration_no: registrationNo }).eq('id', savedRecord.id).eq('school_id', schoolId);
    if (registrationError) throw registrationError;
    savedRecord = { ...savedRecord, registration_no: registrationNo };

    broadcast({
      event: 'NEW_APPLICANT',
      data: savedRecord
    }, true);

    broadcast({
      event: 'NEW_APPLICANT_PUBLIC',
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
    }, false);

    return {
      success: true as const,
      statusCode: 201 as const,
      message: 'Pendaftaran berhasil.',
      data: savedRecord
    };
  }

  static async getPublicApplicants(schoolIdOrSlug?: string, authToken?: string) {
    if (!schoolIdOrSlug) {
      return { success: true, data: [] };
    }

    const resolvedId = await resolveSchoolUUID(String(schoolIdOrSlug), fontInMemSchools);
    if (!resolvedId) {
      return { success: true, data: [] };
    }

    const supabase = getSupabaseClient(authToken);
    const { data, error } = await supabase
      .from("student_applicants")
      .select("id, nama, nisn, status, tgl_daftar, jurusan_1, sekolah_asal, diterima_kelas, jenis_kelamin")
      .eq("school_id", resolvedId)
      .in("status", ["Pending", "Approved", "Rejected", "Terverifikasi"])
      .is("deleted_at", null)
      .order("tgl_daftar", { ascending: false });

    if (error) {
      console.warn('Fetch public applicants Supabase query warning:', error.message);
      return { success: true, data: [] };
    }

    const sanitizedRows = (data || []).map((row) => ({
      ...row,
      nisn: row.nisn ? '******' + row.nisn.slice(-4) : null
    }));

    return { success: true, data: sanitizedRows };
  }

  static async getAdminApplicants(schoolId: string, authToken?: string) {
    await ApplicantService.checkAndDisqualifyExpiredApplicants();
    const supabase = getSupabaseClient(authToken);

    const calonSiswaFields = [
      "id", "nama", "nisn", "nipd", "nik", "tempat_lahir", "tgl_lahir", "jenis_kelamin", "agama", "kewarganegaraan",
      "alamat", "rt_rw", "kelurahan", "kecamatan", "kode_pos", "whatsapp", "email", "tinggal_dengan", "transportasi",
      "tinggi_badan", "berat_badan", "jarak_sekolah", "jarak_km", "waktu_jam", "waktu_menit", "jumlah_saudara", "golongan_darah",
      "penyakit_diderita", "kebutuhan_khusus", "punya_kps", "no_kps", "punya_kip", "no_kip",
      "jenis_prestasi", "tingkat_prestasi", "uraian_prestasi", "tahun_prestasi", "penyelenggara",
      "jenis_beasiswa", "uraian_beasiswa", "tahun_mulai_beasiswa", "tahun_selesai_beasiswa",
      "nama_ayah", "tempat_lahir_ayah", "tgl_lahir_ayah", "agama_ayah", "kewarganegaraan_ayah", "pendidikan_ayah", "pekerjaan_ayah", "penghasilan_ayah", "alamat_ayah", "rtrw_ayah", "kelurahan_ayah", "kecamatan_ayah", "kode_pos_ayah", "status_ayah",
      "nama_ibu", "tempat_lahir_ibu", "tgl_lahir_ibu", "agama_ibu", "kewarganegaraan_ibu", "pendidikan_ibu", "pekerjaan_ibu", "penghasilan_ibu", "alamat_ibu", "rtrw_ibu", "kelurahan_ibu", "kecamatan_ibu", "kode_pos_ibu", "status_ibu",
      "nama_wali", "tempat_lahir_wali", "tgl_lahir_wali", "agama_wali", "kewarganegaraan_wali", "pendidikan_wali", "pekerjaan_wali", "penghasilan_wali", "alamat_wali", "rtrw_wali", "kelurahan_wali", "kecamatan_wali", "kode_pos_wali", "status_wali",
      "telepon_ortu", "sekolah_asal", "tgl_lulus", "no_ijazah", "no_skhun", "no_peserta_un", "lama_belajar", "pindahan_dari", "alasan_pindah", "diterima_kelas", "diterima_tanggal",
      "jurusan_1", "alasan_memilih", "hobi", "cita_cita", "nilai_us_teori", "nilai_us_praktik", "nilai_muatan_lokal", "cita_cita_setelah_lulus", "pelajaran_disenangi", "alasan_disenangi", "kesulitan_belajar",
      "perkelahian", "ket_perkelahian", "narkoba", "ket_narkoba", "pelanggaran_lain", "ket_pelanggaran_lain",
      "janji_taat", "janji_sanksi", "janji_akrab", "janji_belajar", "janji_nama_baik",
      "periode", "gelombang", "registration_no", "status", "tgl_daftar", "verified_by", "rejected_by", "deleted_by"
    ];

    const query = supabase.from('student_applicants')
      .select(calonSiswaFields.join(','))
      .is('deleted_at', null)
      .order('tgl_daftar', { ascending: false })
      .eq('school_id', schoolId);

    const { data: rows, error } = await query;
    if (error) throw error;
    return rows || [];
  }

  static async getTrashedApplicants(schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);

    const calonSiswaFields = [
      "id", "nama", "nisn", "nik", "tempat_lahir", "tgl_lahir", "jenis_kelamin", "agama", "kewarganegaraan",
      "alamat", "rt_rw", "kelurahan", "kecamatan", "kode_pos", "whatsapp", "email", "tinggal_dengan", "transportasi",
      "tinggi_badan", "berat_badan", "jarak_sekolah", "jarak_km", "waktu_jam", "waktu_menit", "jumlah_saudara", "golongan_darah",
      "penyakit_diderita", "kebutuhan_khusus", "punya_kps", "no_kps", "punya_kip", "no_kip",
      "jenis_prestasi", "tingkat_prestasi", "uraian_prestasi", "tahun_prestasi", "penyelenggara",
      "jenis_beasiswa", "uraian_beasiswa", "tahun_mulai_beasiswa", "tahun_selesai_beasiswa",
      "nama_ayah", "tempat_lahir_ayah", "tgl_lahir_ayah", "agama_ayah", "kewarganegaraan_ayah", "pendidikan_ayah", "pekerjaan_ayah", "penghasilan_ayah", "alamat_ayah", "rtrw_ayah", "kelurahan_ayah", "kecamatan_ayah", "kode_pos_ayah", "status_ayah",
      "nama_ibu", "tempat_lahir_ibu", "tgl_lahir_ibu", "agama_ibu", "kewarganegaraan_ibu", "pendidikan_ibu", "pekerjaan_ibu", "penghasilan_ibu", "alamat_ibu", "rtrw_ibu", "kelurahan_ibu", "kecamatan_ibu", "kode_pos_ibu", "status_ibu",
      "nama_wali", "tempat_lahir_wali", "tgl_lahir_wali", "agama_wali", "kewarganegaraan_wali", "pendidikan_wali", "pekerjaan_wali", "penghasilan_wali", "alamat_wali", "rtrw_wali", "kelurahan_wali", "kecamatan_wali", "kode_pos_wali", "status_wali",
      "telepon_ortu", "sekolah_asal", "tgl_lulus", "no_ijazah", "no_skhun", "no_peserta_un", "lama_belajar", "pindahan_dari", "alasan_pindah", "diterima_kelas", "diterima_tanggal",
      "jurusan_1", "alasan_memilih", "hobi", "cita_cita", "nilai_us_teori", "nilai_us_praktik", "nilai_muatan_lokal", "cita_cita_setelah_lulus", "pelajaran_disenangi", "alasan_disenangi", "kesulitan_belajar",
      "perkelahian", "ket_perkelahian", "narkoba", "ket_narkoba", "pelanggaran_lain", "ket_pelanggaran_lain",
      "janji_taat", "janji_sanksi", "janji_akrab", "janji_belajar", "janji_nama_baik",
      "periode", "gelombang", "registration_no", "status", "tgl_daftar", "deleted_at", "verified_by", "rejected_by", "deleted_by"
    ];

    const query = supabase.from('student_applicants')
      .select(calonSiswaFields.join(','))
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
      .eq('school_id', schoolId);

    const { data: rows, error } = await query;
    if (error) throw error;
    return rows || [];
  }

  static async restoreApplicant(id: number, schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);

    const query = supabase.from('student_applicants').select('*').eq('id', id).eq('school_id', schoolId);
    const { data: existing } = await query.single();
    if (!existing) return null;

    let updateQuery = supabase.from('student_applicants').update({ deleted_at: null, deleted_by: null }).eq('id', id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
    const { data: updated, error } = await updateQuery.select().single();
    if (error) throw error;

    await ApplicantService.syncCandidateToSiswaAktif(updated);
    broadcast({ event: 'APPLICANT_UPDATED', data: updated }, true);
    return updated;
  }

  static async getApplicantById(id: number, schoolId: string, authToken?: string) {
    const supabase = getSupabaseClient(authToken);
    const query = supabase.from('student_applicants').select('*').eq('id', id).eq('school_id', schoolId);
    const { data: applicant, error } = await query.single();
    if (error || !applicant) return null;
    return applicant;
  }

  static async updateApplicant(id: number, schoolId: string, rawBody: unknown, authToken?: string) {
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
    const query = supabase.from('student_applicants').select('*').eq('id', id).eq('school_id', schoolId);
    const { data: existingRecord } = await query.single();
    if (!existingRecord) {
      return { success: false as const, statusCode: 404 as const, message: 'Calon siswa tidak ditemukan.' };
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
      if (val === undefined || val === null || val === '') return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: any = {
      nama: getVal('nama', ['nama']),
      nisn: getVal('nisn', ['nisn']),
      nik: getVal('nik', ['nik']),
      tempat_lahir: getVal('tempat_lahir', ['tempat_lahir', 'tempatLahir']),
      tgl_lahir: parseDate(getVal('tgl_lahir', ['tgl_lahir', 'tglLahir'])),
      jenis_kelamin: (() => {
        const jk = getVal('jenis_kelamin', ['jenis_kelamin', 'jenisKelamin']);
        if (jk === 'Laki-laki') return 'L';
        if (jk === 'Perempuan') return 'P';
        return jk;
      })(),
      agama: getVal('agama', ['agama']),
      kewarganegaraan: getVal('kewarganegaraan', ['kewarganegaraan']),
      alamat: getVal('alamat', ['alamat']),
      rt_rw: getVal('rt_rw', ['rt_rw', 'rtRw']),
      kelurahan: getVal('kelurahan', ['kelurahan']),
      kecamatan: getVal('kecamatan', ['kecamatan']),
      kode_pos: getVal('kode_pos', ['kode_pos', 'kodePos']),
      whatsapp: getVal('whatsapp', ['whatsapp']),
      email: getVal('email', ['email']),
      tinggal_dengan: getVal('tinggal_dengan', ['tinggal_dengan', 'tinggalDengan']),
      transportasi: getVal('transportasi', ['transportasi']),
      tinggi_badan: parseInt(getVal('tinggi_badan', ['tinggi_badan', 'tinggiBadan'])) || 0,
      berat_badan: parseInt(getVal('berat_badan', ['berat_badan', 'beratBadan'])) || 0,
      jarak_sekolah: getVal('jarak_sekolah', ['jarak_sekolah', 'jarakSekolah']),
      jarak_km: parseNum(getVal('jarak_km', ['jarak_km', 'jarakKm'])) || 0,
      waktu_jam: parseInt(getVal('waktu_jam', ['waktu_jam', 'waktuJam'])) || 0,
      waktu_menit: parseInt(getVal('waktu_menit', ['waktu_menit', 'waktuMenit'])) || 0,
      jumlah_saudara: parseInt(getVal('jumlah_saudara', ['jumlah_saudara', 'jumlahSaudara'])) || 0,
      golongan_darah: getVal('golongan_darah', ['golongan_darah', 'golonganDarah']),
      penyakit_diderita: getVal('penyakit_diderita', ['penyakit_diderita', 'penyakitDiderita']),
      punya_kps: getVal('punya_kps', ['punya_kps', 'punyaKPS']),
      no_kps: getVal('no_kps', ['no_kps', 'noKPS']),
      punya_kip: getVal('punya_kip', ['punya_kip', 'punyaKIP']),
      no_kip: getVal('no_kip', ['no_kip', 'noKIP']),
      nama_ayah: getVal('nama_ayah', ['nama_ayah', 'namaAyah']),
      tempat_lahir_ayah: getVal('tempat_lahir_ayah', ['tempat_lahir_ayah', 'tempatLahirAyah']),
      tgl_lahir_ayah: parseDate(getVal('tgl_lahir_ayah', ['tgl_lahir_ayah', 'tglLahirAyah'])),
      agama_ayah: getVal('agama_ayah', ['agama_ayah', 'agamaAyah']),
      kewarganegaraan_ayah: getVal('kewarganegaraan_ayah', ['kewarganegaraan_ayah', 'kewarganegaraanAyah']),
      pendidikan_ayah: getVal('pendidikan_ayah', ['pendidikan_ayah', 'pendidikanAyah']),
      pekerjaan_ayah: getVal('pekerjaan_ayah', ['pekerjaan_ayah', 'pekerjaanAyah']),
      penghasilan_ayah: getVal('penghasilan_ayah', ['penghasilan_ayah', 'penghasilanAyah']),
      alamat_ayah: getVal('alamat_ayah', ['alamat_ayah', 'alamatAyah']),
      rtrw_ayah: getVal('rtrw_ayah', ['rtrw_ayah', 'rtrwAyah']),
      kelurahan_ayah: getVal('kelurahan_ayah', ['kelurahan_ayah', 'kelurahanAyah']),
      kecamatan_ayah: getVal('kecamatan_ayah', ['kecamatan_ayah', 'kecamatanAyah']),
      kode_pos_ayah: getVal('kode_pos_ayah', ['kode_pos_ayah', 'kodePosAyah']),
      status_ayah: getVal('status_ayah', ['status_ayah', 'statusAyah']),
      nama_ibu: getVal('nama_ibu', ['nama_ibu', 'namaIbu']),
      tempat_lahir_ibu: getVal('tempat_lahir_ibu', ['tempat_lahir_ibu', 'tempatLahirIbu']),
      tgl_lahir_ibu: parseDate(getVal('tgl_lahir_ibu', ['tgl_lahir_ibu', 'tglLahirIbu'])),
      agama_ibu: getVal('agama_ibu', ['agama_ibu', 'agamaIbu']),
      kewarganegaraan_ibu: getVal('kewarganegaraan_ibu', ['kewarganegaraan_ibu', 'kewarganegaraanIbu']),
      pendidikan_ibu: getVal('pendidikan_ibu', ['pendidikan_ibu', 'pendidikanIbu']),
      pekerjaan_ibu: getVal('pekerjaan_ibu', ['pekerjaan_ibu', 'pekerjaanIbu']),
      penghasilan_ibu: getVal('penghasilan_ibu', ['penghasilan_ibu', 'penghasilanIbu']),
      alamat_ibu: getVal('alamat_ibu', ['alamat_ibu', 'alamatIbu']),
      rtrw_ibu: getVal('rtrw_ibu', ['rtrw_ibu', 'rtrwIbu']),
      kelurahan_ibu: getVal('kelurahan_ibu', ['kelurahan_ibu', 'kelurahanIbu']),
      kecamatan_ibu: getVal('kecamatan_ibu', ['kecamatan_ibu', 'kecamatanIbu']),
      kode_pos_ibu: getVal('kode_pos_ibu', ['kode_pos_ibu', 'kodePosIbu']),
      status_ibu: getVal('status_ibu', ['status_ibu', 'statusIbu']),
      nama_wali: getVal('nama_wali', ['nama_wali', 'namaWali']),
      tempat_lahir_wali: getVal('tempat_lahir_wali', ['tempat_lahir_wali', 'tempatLahirWali']),
      tgl_lahir_wali: parseDate(getVal('tgl_lahir_wali', ['tgl_lahir_wali', 'tglLahirWali'])),
      agama_wali: getVal('agama_wali', ['agama_wali', 'agamaWali']),
      kewarganegaraan_wali: getVal('kewarganegaraan_wali', ['kewarganegaraan_wali', 'kewarganegaraanWali']),
      pendidikan_wali: getVal('pendidikan_wali', ['pendidikan_wali', 'pendidikanWali']),
      pekerjaan_wali: getVal('pekerjaan_wali', ['pekerjaan_wali', 'pekerjaanWali']),
      penghasilan_wali: getVal('penghasilan_wali', ['penghasilan_wali', 'penghasilanWali']),
      alamat_wali: getVal('alamat_wali', ['alamat_wali', 'alamatWali']),
      rtrw_wali: getVal('rtrw_wali', ['rtrw_wali', 'rtrwWali']),
      kelurahan_wali: getVal('kelurahan_wali', ['kelurahan_wali', 'kelurahanWali']),
      kecamatan_wali: getVal('kecamatan_wali', ['kecamatan_wali', 'kecamatanWali']),
      kode_pos_wali: getVal('kode_pos_wali', ['kode_pos_wali', 'kodePosWali']),
      status_wali: getVal('status_wali', ['status_wali', 'statusWali']),
      telepon_ortu: getVal('telepon_ortu', ['telepon_ortu', 'teleponOrtu']),
      sekolah_asal: getVal('sekolah_asal', ['sekolah_asal', 'sekolahAsal']),
      tgl_lulus: parseDate(getVal('tgl_lulus', ['tgl_lulus', 'tglLulus'])),
      no_ijazah: getVal('no_ijazah', ['no_ijazah', 'noIjazah']),
      no_skhun: getVal('no_skhun', ['no_skhun', 'noSKHUN']),
      no_peserta_un: getVal('no_peserta_un', ['no_peserta_un', 'noPesertaUN']),
      lama_belajar: parseInt(getVal('lama_belajar', ['lama_belajar', 'lamaBelajar'])) || 3,
      pindahan_dari: getVal('pindahan_dari', ['pindahan_dari', 'pindahanDari']),
      alasan_pindah: getVal('alasan_pindah', ['alasan_pindah', 'alasanPindah']),
      jurusan_1: getVal('jurusan_1', ['jurusan_1', 'jurusan1']),
      alasan_memilih: getVal('alasan_memilih', ['alasan_memilih', 'alasanMinatKeahlian', 'alasanMemilih']),
      cita_cita: getVal('cita_cita', ['cita_cita', 'citaCita']),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hobi: f.hobi !== undefined ? f.hobi : (existingRecord as any).hobi,
      nilai_us_teori: parseNum(getVal('nilai_us_teori', ['nilai_us_teori', 'nilaiUSTeori'])),
      nilai_us_praktik: parseNum(getVal('nilai_us_praktik', ['nilai_us_praktik', 'nilaiUSPraktik'])),
      nilai_muatan_lokal: parseNum(getVal('nilai_muatan_lokal', ['nilai_muatan_lokal', 'nilaiMuatanLokal'])),
      kesulitan_belajar: getVal('kesulitan_belajar', ['kesulitan_belajar', 'kesulitanBelajar']),
      pelajaran_disenangi: getVal('pelajaran_disenangi', ['pelajaran_disenangi', 'pelajaranDisenangi']),
      cita_cita_setelah_lulus: getVal('cita_cita_setelah_lulus', ['cita_cita_setelah_lulus', 'citaCitaSetelahLulus']),
      periode: getVal('periode', ['periode']),
      diterima_kelas: getVal('diterima_kelas', ['diterima_kelas', 'diterimaKelas']),
      diterima_tanggal: parseDate(getVal('diterima_tanggal', ['diterima_tanggal', 'diterimaTanggal'])),
      gelombang: getVal('gelombang', ['gelombang']),
      status: getVal('status', ['status']),
      kebutuhan_khusus: f.kebutuhanKhusus !== undefined ? f.kebutuhanKhusus : (existingRecord as Record<string, unknown>).kebutuhan_khusus,
      jenis_prestasi: f.jenisPrestasi !== undefined ? f.jenisPrestasi : (existingRecord as Record<string, unknown>).jenis_prestasi,
      tingkat_prestasi: f.tingkatPrestasi !== undefined ? f.tingkatPrestasi : (existingRecord as Record<string, unknown>).tingkat_prestasi,
      jenis_beasiswa: f.jenisBeasiswa !== undefined ? f.jenisBeasiswa : (existingRecord as Record<string, unknown>).jenis_beasiswa,
    };

    const updateQuery = supabase.from('student_applicants').update(fields).eq('id', id).eq('school_id', schoolId);
    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    await ApplicantService.syncCandidateToSiswaAktif(updatedRecord);
    broadcast({ event: 'APPLICANT_UPDATED', data: updatedRecord }, true);

    return {
      success: true as const,
      statusCode: 200 as const,
      message: 'Data pendaftar berhasil diperbarui.',
      data: updatedRecord
    };
  }

  static async updateApplicantStatus(id: number, schoolId: string, status: string, alasanDitolak?: string, adminName: string = 'Sistem', authToken?: string) {
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return { success: false as const, statusCode: 400 as const, message: 'Status tidak valid. Harus Pending, Approved, atau Rejected.' };
    }

    const supabase = getSupabaseClient(authToken);
    const query = supabase.from('student_applicants').select('*').eq('id', id).eq('school_id', schoolId);
    const { data: applicant } = await query.single();
    if (!applicant) {
      return { success: false as const, statusCode: 404 as const, message: 'Calon siswa tidak ditemukan.' };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };
    if (status === 'Approved') {
      updateData.verified_by = adminName;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
    } else if (status === 'Rejected') {
      updateData.rejected_by = adminName;
      updateData.verified_by = null;
      updateData.alasan_ditolak = alasanDitolak || null;
    } else if (status === 'Pending') {
      updateData.verified_by = null;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
    }

    const updateQuery = supabase.from('student_applicants').update(updateData).eq('id', id).eq('school_id', schoolId);
    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    await ApplicantService.syncCandidateToSiswaAktif(updatedRecord);

    broadcast({
      event: 'STATUS_UPDATE',
      data: {
        id: updatedRecord.id,
        nama: updatedRecord.nama,
        status: updatedRecord.status,
        alasan_ditolak: updatedRecord.alasan_ditolak
      }
    });

    return {
      success: true as const,
      statusCode: 200 as const,
      message: `Status calon siswa berhasil diperbarui menjadi ${status}.`,
      data: updatedRecord
    };
  }

  static async deleteApplicant(id: number, schoolId: string, permanent: boolean, adminName: string = 'Sistem', authToken?: string) {
    const supabase = getSupabaseClient(authToken);

    if (permanent) {
      await supabase.from('active_students').delete().eq('calon_siswa_id', id).eq('school_id', schoolId);
      await supabase.from('student_applicants').delete().eq('id', id).eq('school_id', schoolId);
      broadcast({ event: 'APPLICANT_DELETED', data: { id } });
      return { success: true as const, message: 'Data calon siswa berhasil dihapus secara permanen.' };
    } else {
      await supabase.from('student_applicants').update({ deleted_at: new Date().toISOString(), deleted_by: adminName }).eq('id', id).eq('school_id', schoolId);
      await supabase.from('active_students').delete().eq('calon_siswa_id', id).eq('school_id', schoolId);
      broadcast({ event: 'APPLICANT_DELETED', data: { id } });
      return { success: true as const, message: 'Data calon siswa berhasil dipindahkan ke tempat sampah.' };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async verifyPhysicalDoc(id: number, schoolId: string, verified: boolean, checklist: any, adminName: string = 'Admin', authToken?: string) {
    const supabase = getSupabaseClient(authToken);
    let isVerified = Boolean(verified);

    if (checklist) {
      const requiredDocs = ['kk', 'akta', 'ijazah', 'ktp_ortu', 'pas_foto', 'bukti_bayar'];
      isVerified = requiredDocs.every(doc => checklist[doc] === true);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      physical_doc_verified: isVerified,
      physical_doc_verified_by: isVerified ? adminName : null,
      physical_doc_verified_at: isVerified ? new Date().toISOString() : null,
    };
    if (checklist) {
      updateData.physical_docs_checklist = checklist;
    }

    const query = supabase.from('student_applicants').update(updateData).eq('id', id).eq('school_id', schoolId);
    const { data: updatedRecord, error } = await query.select().single();
    if (error) throw error;

    broadcast({
      event: 'PHYSICAL_DOC_VERIFIED',
      data: {
        id: updatedRecord.id,
        physical_doc_verified: updatedRecord.physical_doc_verified,
        physical_doc_verified_by: updatedRecord.physical_doc_verified_by,
        physical_docs_checklist: updatedRecord.physical_docs_checklist
      }
    });

    return updatedRecord;
  }

  static async getRegistrationCard(nisn: string, schoolSlug?: string) {
    const supabase = getSupabaseClient();
    const schoolId = schoolSlug ? await resolveSchoolUUID(schoolSlug, fontInMemSchools) : null;

    let query = supabase.from('student_applicants')
      .select('id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist')
      .eq('nisn', nisn);
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: record, error } = await query.single();
    if (error || !record) return null;
    return record;
  }

  static async verifyApplicantIdentity(id: number, nik: string, schoolSlug: string) {
    const schoolId = await resolveSchoolUUID(schoolSlug, fontInMemSchools);
    if (!schoolId) return { notFoundSchool: true };

    const supabase = getSupabaseClient();
    const { data: applicant } = await supabase.from('student_applicants')
      .select('id, nama, nisn, nik, tgl_lahir, status, tgl_daftar, jurusan_1, alasan_ditolak')
      .eq('id', id)
      .eq('school_id', schoolId)
      .single();

    if (!applicant || applicant.nik !== nik) {
      return null;
    }
    return applicant;
  }
}
