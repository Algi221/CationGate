import { Hono, Context } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import { broadcast } from '../ws/handler';
import { updateSiswaAktifSchema } from '../validations/siswa-aktif';

const siswaAktifRouter = new Hono();

function getAdminSchool(c: Context): { school_id?: string; nama_lengkap?: string; username?: string } | undefined {
  return (c.get as (k: string) => unknown)('admin') as { school_id?: string; nama_lengkap?: string; username?: string } | undefined;
}

siswaAktifRouter.get('/', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = getAdminSchool(c)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    const siswaAktifFields = [
      "id", "calon_siswa_id", "nama", "nisn", "nik", "tempat_lahir", "tgl_lahir", "jenis_kelamin", "agama", "kewarganegaraan",
      "alamat", "rt_rw", "kelurahan", "kecamatan", "kode_pos", "whatsapp", "email", "tinggal_dengan", "transportasi",
      "tinggi_badan", "berat_badan", "jarak_sekolah", "jarak_km", "waktu_jam", "waktu_menit", "jumlah_saudara", "golongan_darah",
      "penyakit_diderita", "kebutuhan_khusus", "punya_kps", "no_kps", "punya_kip", "no_kip",
      "jenis_prestasi", "tingkat_prestasi", "uraian_prestasi", "tahun_prestasi", "penyelenggara",
      "jenis_beasiswa", "uraian_beasiswa", "tahun_mulai_beasiswa", "tahun_selesai_beasiswa",
      "nama_ayah", "tempat_lahir_ayah", "tgl_lahir_ayah", "agama_ayah", "kewarganegaraan_ayah", "pendidikan_ayah", "pekerjaan_ayah", "penghasilan_ayah", "alamat_ayah", "rtrw_ayah", "kelurahan_ayah", "kecamatan_ayah", "kode_pos_ayah", "status_ayah",
      "nama_ibu", "tempat_lahir_ibu", "tgl_lahir_ibu", "agama_ibu", "kewarganegaraan_ibu", "pendidikan_ibu", "pekerjaan_ibu", "penghasilan_ibu", "alamat_ibu", "rtrw_ibu", "kelurahan_ibu", "kecamatan_ibu", "kode_pos_ibu", "status_ibu",
      "nama_wali", "tempat_lahir_wali", "tgl_lahir_wali", "agama_wali", "kewarganegaraan_wali", "pendidikan_wali", "pekerjaan_wali", "penghasilan_wali", "alamat_wali", "rtrw_wali", "kelurahan_wali", "kecamatan_wali", "kode_pos_wali", "status_wali",
      "telepon_ortu", "sekolah_asal", "tgl_lulus", "no_ijazah", "no_skhun", "no_peserta_un", "lama_belajar", "pindahan_dari", "alasan_pindah", "diterima_kelas", "diterima_tanggal",
      "jurusan", "alasan_memilih", "cita_cita", "hobi", "nilai_us_teori", "nilai_us_praktik", "nilai_muatan_lokal", "kesulitan_belajar", "pelajaran_disenangi", "cita_cita_setelah_lulus", "periode", "gelombang",
      "nipd", "created_at"
    ];

    let query = supabase.from('active_students').select(siswaAktifFields.join(', ')).order('nama', { ascending: true });
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: rows, error } = await query;
    if (error) throw error;

    return c.json({
      success: true,
      data: rows
    });
  } catch (err: unknown) {
    console.error('Fetch active students error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil data siswa aktif: ' + (err instanceof Error ? err.message : String(err))
    }, 500);
  }
});

siswaAktifRouter.get('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = getAdminSchool(c)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let query = supabase.from('active_students').select('*').eq('id', id);
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: record, error } = await query.single();

    if (error || !record) {
      return c.json({
        success: false,
        message: 'Siswa aktif tidak ditemukan.'
      }, 404);
    }

    return c.json({
      success: true,
      data: record
    });
  } catch (err: unknown) {
    console.error('Get active student detail error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil detail siswa aktif: ' + (err instanceof Error ? err.message : String(err))
    }, 500);
  }
});

siswaAktifRouter.put('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const f = await c.req.json();

    const result = updateSiswaAktifSchema.safeParse(f);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const validated = result.data as Record<string, unknown>;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = getAdminSchool(c)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('active_students').select('*').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);

    const { data: existingRecord } = await checkQuery.single();

    if (!existingRecord) {
      return c.json({ success: false, message: 'Siswa aktif tidak ditemukan.' }, 404);
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
      jenis_kelamin: getVal('jenis_kelamin', ['jenis_kelamin', 'jenisKelamin']),
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
      diterima_kelas: getVal('diterima_kelas', ['diterima_kelas', 'diterimaKelas']),
      diterima_tanggal: parseDate(getVal('diterima_tanggal', ['diterima_tanggal', 'diterimaTanggal'])),
      jurusan: getVal('jurusan', ['jurusan']),
      alasan_memilih: getVal('alasan_memilih', ['alasan_memilih', 'alasanMemilih']),
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
      gelombang: getVal('gelombang', ['gelombang']),
      berkas_foto: getVal('berkas_foto', ['berkas_foto', 'berkasFotoBase64']),
      kebutuhan_khusus: f.kebutuhanKhusus !== undefined ? f.kebutuhanKhusus : (existingRecord as Record<string, unknown>).kebutuhan_khusus,
      jenis_prestasi: f.jenisPrestasi !== undefined ? f.jenisPrestasi : (existingRecord as Record<string, unknown>).jenis_prestasi,
      tingkat_prestasi: f.tingkatPrestasi !== undefined ? f.tingkatPrestasi : (existingRecord as Record<string, unknown>).tingkat_prestasi,
      jenis_beasiswa: f.jenisBeasiswa !== undefined ? f.jenisBeasiswa : (existingRecord as Record<string, unknown>).jenis_beasiswa,
    };

    let updateQuery = supabase.from('active_students').update(fields).eq('id', id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);

    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    broadcast({ event: 'STUDENT_UPDATED', data: updatedRecord }, true);

    return c.json({
      success: true,
      message: 'Data siswa aktif berhasil diperbarui.',
      data: updatedRecord
    });
  } catch (err: unknown) {
    console.error('Update active student error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui data siswa aktif: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

siswaAktifRouter.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = getAdminSchool(c)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('active_students').select('*').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);

    const { data: student } = await checkQuery.single();

    if (!student) {
      return c.json({ success: false, message: 'Siswa aktif tidak ditemukan.' }, 404);
    }

    let delQuery = supabase.from('active_students').delete().eq('id', id);
    if (schoolId) delQuery = delQuery.eq('school_id', schoolId);
    await delQuery;

    if (student.calon_siswa_id) {
      let updateCSQuery = supabase.from('student_applicants').update({
        status: 'Pending',
        diterima_kelas: null,
        diterima_tanggal: null,
        verified_by: null,
        rejected_by: null
      }).eq('id', student.calon_siswa_id);
      if (schoolId) updateCSQuery = updateCSQuery.eq('school_id', schoolId);

      const { data: updatedApplicant } = await updateCSQuery.select().single();

      if (updatedApplicant) {
        broadcast({ event: 'APPLICANT_UPDATED', data: updatedApplicant });
      }
    }

    broadcast({
      event: 'STUDENT_DELETED',
      data: { id }
    });

    return c.json({
      success: true,
      message: 'Siswa aktif berhasil dihapus dan status pendaftar dikembalikan ke Pending.'
    });
  } catch (err: unknown) {
    console.error('Delete active student error:', err);
    return c.json({ success: false, message: 'Gagal menghapus siswa aktif: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

siswaAktifRouter.post('/generate-nipd', adminAuth, async (c: Context) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const periode = body.periode;
    const startSequenceStr = body.startSequenceStr;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = getAdminSchool(c)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let query = supabase.from('active_students').select('id, nama, diterima_tanggal, nipd, calon_siswa_id');
    if (schoolId) query = query.eq('school_id', schoolId);
    if (periode) query = query.eq('periode', periode);
    query = query.order('nama', { ascending: true });

    const { data: students, error } = await query;
    if (error) throw error;

    let startSequence = 1;
    if (startSequenceStr && !isNaN(parseInt(startSequenceStr))) {
      startSequence = parseInt(startSequenceStr);
    }

    let currentSequence = startSequence;
    let updatesCount = 0;

    for (const student of (students || [])) {
      const year = student.diterima_tanggal ? new Date(student.diterima_tanggal).getFullYear() : new Date().getFullYear();
      const sequenceFormatted = String(currentSequence).padStart(3, '0');
      const nipd = `${year}${sequenceFormatted}`;

      let updateSA = supabase.from('active_students').update({ nipd }).eq('id', student.id);
      if (schoolId) updateSA = updateSA.eq('school_id', schoolId);
      await updateSA;

      if (student.calon_siswa_id) {
        let updateCS = supabase.from('student_applicants').update({ nipd }).eq('id', student.calon_siswa_id);
        if (schoolId) updateCS = updateCS.eq('school_id', schoolId);
        await updateCS;
      }

      currentSequence++;
      updatesCount++;
    }

    broadcast({ event: 'STUDENT_NIPD_GENERATED', data: { count: updatesCount } }, true);

    return c.json({
      success: true,
      message: `Berhasil men-generate NIPD untuk ${updatesCount} siswa secara berurutan.`
    });
  } catch (err: unknown) {
    console.error('Generate NIPD error:', err);
    return c.json({ success: false, message: 'Gagal men-generate NIPD: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// 6. ADMIN ONLY: Mutasi Jurusan
siswaAktifRouter.post('/:id/mutasi', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { jurusan_baru, diterima_kelas_baru } = await c.req.json();

    if (!jurusan_baru) {
      return c.json({ success: false, message: 'Jurusan baru wajib diisi.' }, 400);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const admin = getAdminSchool(c);
    const schoolId = admin?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('active_students').select('*').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);

    const { data: student } = await checkQuery.single();

    if (!student) {
      return c.json({ success: false, message: 'Siswa tidak ditemukan.' }, 404);
    }

    const jurusanAsal = student.jurusan || "";

    // 1. Update SiswaAktif
    let updateSA = supabase.from('active_students').update({
      jurusan: jurusan_baru,
      diterima_kelas: diterima_kelas_baru || student.diterima_kelas,
      nipd: null
    }).eq('id', id);
    if (schoolId) updateSA = updateSA.eq('school_id', schoolId);
    const { data: updatedSiswa, error: errSA } = await updateSA.select().single();
    if (errSA) throw errSA;

    // 2. Insert MutasiHistory
    const mutasiPayload: Record<string, unknown> = {
      siswa_aktif_id: id,
      jurusan_asal: jurusanAsal,
      jurusan_tujuan: jurusan_baru,
      dilakukan_oleh: admin?.nama_lengkap || admin?.username || 'Admin'
    };
    if (schoolId) mutasiPayload.school_id = schoolId;
    await supabase.from('student_transfers').insert(mutasiPayload);

    // 3. Update CalonSiswa if linked
    if (updatedSiswa.calon_siswa_id) {
      let updateCS = supabase.from('student_applicants').update({
        jurusan_1: jurusan_baru,
        diterima_kelas: diterima_kelas_baru || student.diterima_kelas,
        nipd: null
      }).eq('id', updatedSiswa.calon_siswa_id);
      if (schoolId) updateCS = updateCS.eq('school_id', schoolId);
      await updateCS;
    }

    broadcast({ event: 'STUDENT_UPDATED', data: updatedSiswa }, true);

    return c.json({
      success: true,
      message: `Siswa berhasil dimutasi ke jurusan ${jurusan_baru}. Silakan jalankan Generate NIPD ulang untuk menyesuaikan nomor urut.`,
      data: updatedSiswa
    });
  } catch (err: unknown) {
    console.error('Mutasi error:', err);
    return c.json({ success: false, message: 'Gagal mutasi siswa: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// 8. ADMIN ONLY: Import Excel Data (Bulk Import with Chunking & Field Normalization)
siswaAktifRouter.post('/import', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = getAdminSchool(c)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    const body = await c.req.json();
    if (!body || !Array.isArray(body.students)) {
      return c.json({ success: false, message: 'Invalid payload. Expected an array of students.' }, 400);
    }

    const rawStudents: Record<string, unknown>[] = body.students;
    if (rawStudents.length === 0) {
      return c.json({ success: false, message: 'Array data siswa kosong.' }, 400);
    }

    // Normalize and sanitize fields for each student
    const sanitizedStudents = rawStudents.map((s) => {
      const rawJk = String(s.jenis_kelamin || s.jk || s.gender || '').trim().toLowerCase();
      let normalizedJk = '';
      if (rawJk.startsWith('l')) normalizedJk = 'Laki-laki';
      else if (rawJk.startsWith('p')) normalizedJk = 'Perempuan';

      const nama = String(s.nama || s.nama_lengkap || s.namaLengkap || '').trim();
      const nisn = String(s.nisn || '').trim();
      const nik = s.nik ? String(s.nik).trim() : null;
      const nipd = s.nipd ? String(s.nipd).trim() : null;
      const jurusan = String(s.jurusan || s.jurusan_1 || s.jurusan1 || s.prodi || '').trim();
      const kelas = String(s.diterima_kelas || s.diterimaKelas || s.kelas || s.rombel || '').trim() || null;
      const periode = String(s.periode || s.tahun_ajaran || s.angkatan || '2026-2027').trim();

      return {
        school_id: schoolId,
        nama,
        nisn,
        nik,
        nipd,
        jurusan,
        diterima_kelas: kelas,
        periode,
        jenis_kelamin: normalizedJk,
        tempat_lahir: s.tempat_lahir ? String(s.tempat_lahir).trim() : null,
        tgl_lahir: s.tgl_lahir ? String(s.tgl_lahir).trim() : null,
        agama: s.agama ? String(s.agama).trim() : null,
        alamat: s.alamat ? String(s.alamat).trim() : null,
        rt_rw: s.rt_rw ? String(s.rt_rw).trim() : null,
        kelurahan: s.kelurahan ? String(s.kelurahan).trim() : null,
        kecamatan: s.kecamatan ? String(s.kecamatan).trim() : null,
        kode_pos: s.kode_pos ? String(s.kode_pos).trim() : null,
        whatsapp: s.whatsapp ? String(s.whatsapp).trim() : null,
        email: s.email ? String(s.email).trim() : null,
        sekolah_asal: s.sekolah_asal ? String(s.sekolah_asal).trim() : null,
        nama_ayah: s.nama_ayah ? String(s.nama_ayah).trim() : null,
        pekerjaan_ayah: s.pekerjaan_ayah ? String(s.pekerjaan_ayah).trim() : null,
        penghasilan_ayah: s.penghasilan_ayah ? String(s.penghasilan_ayah).trim() : null,
        nama_ibu: s.nama_ibu ? String(s.nama_ibu).trim() : null,
        pekerjaan_ibu: s.pekerjaan_ibu ? String(s.pekerjaan_ibu).trim() : null,
        penghasilan_ibu: s.penghasilan_ibu ? String(s.penghasilan_ibu).trim() : null,
        telepon_ortu: s.telepon_ortu ? String(s.telepon_ortu).trim() : null,
        diterima_tanggal: s.diterima_tanggal ? String(s.diterima_tanggal).trim() : new Date().toISOString().split('T')[0],
      };
    }).filter(s => s.nama.length > 0);

    // Process in chunks of 200 items to prevent database timeout and payload overflow
    const chunkSize = 200;
    let totalInserted = 0;

    for (let i = 0; i < sanitizedStudents.length; i += chunkSize) {
      const chunk = sanitizedStudents.slice(i, i + chunkSize);
      const { data, error } = await supabase
        .from('active_students')
        .insert(chunk)
        .select('id');

      if (error) {
        console.error('Supabase batch insert error during import:', error);
        throw error;
      }
      totalInserted += data?.length || 0;
    }

    // Broadcast WebSocket event to update clients
    broadcast({ event: 'siswa_aktif_update', data: { school_id: schoolId } });

    return c.json({
      success: true,
      message: `Berhasil mengimpor ${totalInserted} data siswa aktif.`,
      count: totalInserted,
    });
  } catch (err: unknown) {
    console.error('Import active students error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengimpor data siswa: ' + (err instanceof Error ? err.message : String(err))
    }, 500);
  }
});

export default siswaAktifRouter;
