import { Hono, Context } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import { updateSiswaAktifSchema } from '../validations/siswa-aktif';
import { pool } from '../db/client';

const siswaAktifRouter = new Hono();

function getAdminSchool(c: Context): { school_id?: string; nama_lengkap?: string; username?: string } | undefined {
  return (c.get as (k: string) => unknown)('admin') as { school_id?: string; nama_lengkap?: string; username?: string } | undefined;
}

async function getEffectiveSchoolIdentifiers(c: Context): Promise<{ schoolId: string | null; uuidOnly: string[]; allMatchIds: string[] }> {
  const admin = getAdminSchool(c);
  const identifier = admin?.school_id || (admin as { school_slug?: string })?.school_slug || c.req.query('school_slug') || c.req.query('school_id') || c.req.header('x-school-slug');
  if (!identifier) return { schoolId: null, uuidOnly: [], allMatchIds: [] };
  const { resolveAllSchoolIdentifiers, isValidUUID } = await import('../db/resolve-school');
  const { fontInMemSchools } = await import('../routes/saas');
  const allMatchIds = await resolveAllSchoolIdentifiers(String(identifier), fontInMemSchools);
  if (!allMatchIds.includes(String(identifier))) allMatchIds.push(String(identifier));
  const uuidOnly = allMatchIds.filter(isValidUUID);
  return { schoolId: String(identifier), uuidOnly, allMatchIds };
}

// 1. GET ALL ACTIVE STUDENTS FOR SCHOOL
siswaAktifRouter.get('/', adminAuth, async (c: Context) => {
  try {
    const { schoolId, uuidOnly, allMatchIds } = await getEffectiveSchoolIdentifiers(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    // If no valid UUID resolved for this school in Supabase, return [] cleanly without crashing
    if (uuidOnly.length === 0) {
      return c.json({
        success: true,
        data: []
      });
    }

    try {
      const supabase = getSupabaseClient(c.req.header('Authorization'));
      const query = supabase
        .from('active_students')
        .select('*')
        .in('school_id', uuidOnly)
        .order('nama', { ascending: true });

      const { data: rows, error } = await query;
      if (error) throw error;

      return c.json({
        success: true,
        data: rows || []
      });
    } catch (sbErr) {
      console.warn('Supabase fetch active_students fallback to PostgreSQL pool:', sbErr);
      try {
        const pgRes = await pool.query(
          'SELECT * FROM active_students WHERE school_id::text = ANY($1::text[]) ORDER BY nama ASC',
          [allMatchIds]
        );
        return c.json({
          success: true,
          data: pgRes.rows || []
        });
      } catch (_pgErr) {
        return c.json({
          success: true,
          data: []
        });
      }
    }
  } catch (err: unknown) {
    console.error('Fetch active students error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil data siswa aktif: ' + (err instanceof Error ? err.message : String(err))
    }, 500);
  }
});

// 2. GET ACTIVE STUDENT DETAIL
siswaAktifRouter.get('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { schoolId, uuidOnly, allMatchIds } = await getEffectiveSchoolIdentifiers(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));
        const { data: record, error } = await supabase
          .from('active_students')
          .select('*')
          .eq('id', id)
          .in('school_id', uuidOnly)
          .maybeSingle();

        if (!error && record) {
          return c.json({
            success: true,
            data: record
          });
        }
      } catch (_sbErr) {}
    }

    try {
      const pgRes = await pool.query(
        'SELECT * FROM active_students WHERE id = $1 AND school_id::text = ANY($2::text[])',
        [id, allMatchIds]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        return c.json({
          success: true,
          data: pgRes.rows[0]
        });
      }
    } catch (_pgErr) {}

    return c.json({ success: false, message: 'Siswa aktif tidak ditemukan.' }, 404);
  } catch (err: unknown) {
    console.error('Get active student detail error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil detail siswa aktif: ' + (err instanceof Error ? err.message : String(err))
    }, 500);
  }
});

// 3. UPDATE ACTIVE STUDENT
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

    const { schoolId, uuidOnly, allMatchIds } = await getEffectiveSchoolIdentifiers(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let existingRecord: Record<string, unknown> | null = null;
    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));
        const { data } = await supabase
          .from('active_students')
          .select('*')
          .eq('id', id)
          .in('school_id', uuidOnly)
          .maybeSingle();
        existingRecord = data;
      } catch (_e) {}
    }

    if (!existingRecord) {
      try {
        const pgCheck = await pool.query('SELECT * FROM active_students WHERE id = $1 AND school_id::text = ANY($2::text[])', [id, allMatchIds]);
        if (pgCheck.rows && pgCheck.rows.length > 0) {
          existingRecord = pgCheck.rows[0];
        }
      } catch (_pgE) {}
    }

    if (!existingRecord) {
      return c.json({ success: false, message: 'Siswa aktif tidak ditemukan.' }, 404);
    }

    const getVal = (dbKey: string, feKeys: string[]) => {
      for (const k of feKeys) {
        if (validated[k] !== undefined) return validated[k];
      }
      if (validated[dbKey] !== undefined) return validated[dbKey];
      return existingRecord ? existingRecord[dbKey] : null;
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
    const fields: Record<string, any> = {
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
      tinggi_badan: parseInt(String(getVal('tinggi_badan', ['tinggi_badan', 'tinggiBadan']) || '0')) || 0,
      berat_badan: parseInt(String(getVal('berat_badan', ['berat_badan', 'beratBadan']) || '0')) || 0,
      jarak_sekolah: getVal('jarak_sekolah', ['jarak_sekolah', 'jarakSekolah']),
      jarak_km: parseNum(getVal('jarak_km', ['jarak_km', 'jarakKm'])) || 0,
      waktu_jam: parseInt(String(getVal('waktu_jam', ['waktu_jam', 'waktuJam']) || '0')) || 0,
      waktu_menit: parseInt(String(getVal('waktu_menit', ['waktu_menit', 'waktuMenit']) || '0')) || 0,
      jumlah_saudara: parseInt(String(getVal('jumlah_saudara', ['jumlah_saudara', 'jumlahSaudara']) || '0')) || 0,
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
      lama_belajar: parseInt(String(getVal('lama_belajar', ['lama_belajar', 'lamaBelajar']) || '3')) || 3,
      pindahan_dari: getVal('pindahan_dari', ['pindahan_dari', 'pindahanDari']),
      alasan_pindah: getVal('alasan_pindah', ['alasan_pindah', 'alasanPindah']),
      diterima_kelas: getVal('diterima_kelas', ['diterima_kelas', 'diterimaKelas']),
      diterima_tanggal: parseDate(getVal('diterima_tanggal', ['diterima_tanggal', 'diterimaTanggal'])),
      jurusan: getVal('jurusan', ['jurusan']),
      alasan_memilih: getVal('alasan_memilih', ['alasan_memilih', 'alasanMemilih']),
      cita_cita: getVal('cita_cita', ['cita_cita', 'citaCita']),
      hobi: f.hobi !== undefined ? f.hobi : (existingRecord ? existingRecord.hobi : null),
      nilai_us_teori: parseNum(getVal('nilai_us_teori', ['nilai_us_teori', 'nilaiUSTeori'])),
      nilai_us_praktik: parseNum(getVal('nilai_us_praktik', ['nilai_us_praktik', 'nilaiUSPraktik'])),
      nilai_muatan_lokal: parseNum(getVal('nilai_muatan_lokal', ['nilai_muatan_lokal', 'nilaiMuatanLokal'])),
      kesulitan_belajar: getVal('kesulitan_belajar', ['kesulitan_belajar', 'kesulitanBelajar']),
      pelajaran_disenangi: getVal('pelajaran_disenangi', ['pelajaran_disenangi', 'pelajaranDisenangi']),
      cita_cita_setelah_lulus: getVal('cita_cita_setelah_lulus', ['cita_cita_setelah_lulus', 'citaCitaSetelahLulus']),
      periode: getVal('periode', ['periode']),
      gelombang: getVal('gelombang', ['gelombang']),
      berkas_foto: getVal('berkas_foto', ['berkas_foto', 'berkasFotoBase64']),
      kebutuhan_khusus: f.kebutuhanKhusus !== undefined ? f.kebutuhanKhusus : (existingRecord ? existingRecord.kebutuhan_khusus : null),
      jenis_prestasi: f.jenisPrestasi !== undefined ? f.jenisPrestasi : (existingRecord ? existingRecord.jenis_prestasi : null),
      tingkat_prestasi: f.tingkatPrestasi !== undefined ? f.tingkatPrestasi : (existingRecord ? existingRecord.tingkat_prestasi : null),
      jenis_beasiswa: f.jenisBeasiswa !== undefined ? f.jenisBeasiswa : (existingRecord ? existingRecord.jenis_beasiswa : null),
    };

    let updatedRecord: Record<string, unknown> | null = null;
    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));
        const { data, error } = await supabase
          .from('active_students')
          .update(fields)
          .eq('id', id)
          .in('school_id', uuidOnly)
          .select()
          .single();
        if (!error && data) updatedRecord = data;
      } catch (_sbErr) {}
    }

    if (!updatedRecord) {
      try {
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        const setClauses = keys.map((k, idx) => `"${k}" = $${idx + 1}`).join(', ');
        const pgRes = await pool.query(
          `UPDATE active_students SET ${setClauses} WHERE id = $${keys.length + 1} AND school_id::text = ANY($${keys.length + 2}::text[]) RETURNING *`,
          [...values, id, allMatchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          updatedRecord = pgRes.rows[0];
        }
      } catch (_pgE) {}
    }

    return c.json({
      success: true,
      message: 'Data siswa aktif berhasil diperbarui.',
      data: updatedRecord || { id, ...fields }
    });
  } catch (err: unknown) {
    console.error('Update active student error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui data siswa aktif: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// 4. DELETE ACTIVE STUDENT
siswaAktifRouter.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { schoolId, uuidOnly, allMatchIds } = await getEffectiveSchoolIdentifiers(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));
        const { data: student } = await supabase
          .from('active_students')
          .select('*')
          .eq('id', id)
          .in('school_id', uuidOnly)
          .maybeSingle();

        await supabase.from('active_students').delete().eq('id', id).in('school_id', uuidOnly);

        if (student?.calon_siswa_id) {
          await supabase.from('student_applicants').update({
            status: 'Pending',
            diterima_kelas: null,
            diterima_tanggal: null,
            verified_by: null,
            rejected_by: null
          }).eq('id', student.calon_siswa_id).in('school_id', uuidOnly);
        }
      } catch (_sbErr) {}
    }

    try {
      await pool.query('DELETE FROM active_students WHERE id = $1 AND school_id::text = ANY($2::text[])', [id, allMatchIds]);
    } catch (_pgE) {}

    return c.json({
      success: true,
      message: 'Siswa aktif berhasil dihapus dan status pendaftar dikembalikan ke Pending.'
    });
  } catch (err: unknown) {
    console.error('Delete active student error:', err);
    return c.json({ success: false, message: 'Gagal menghapus siswa aktif: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// 5. GENERATE NIPD
siswaAktifRouter.post('/generate-nipd', adminAuth, async (c: Context) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const periode = body.periode;
    const startSequenceStr = body.startSequenceStr;

    const { schoolId, uuidOnly, allMatchIds } = await getEffectiveSchoolIdentifiers(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let students: Array<{ id: number; nama: string; diterima_tanggal?: string; calon_siswa_id?: number }> = [];
    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));
        let query = supabase.from('active_students').select('id, nama, diterima_tanggal, nipd, calon_siswa_id').in('school_id', uuidOnly);
        if (periode) query = query.eq('periode', periode);
        query = query.order('nama', { ascending: true });
        const { data } = await query;
        if (data) students = data;
      } catch (_e) {}
    }

    if (students.length === 0) {
      try {
        let pgSql = 'SELECT id, nama, diterima_tanggal, nipd, calon_siswa_id FROM active_students WHERE school_id::text = ANY($1::text[])';
        const pgParams: unknown[] = [allMatchIds];
        if (periode) {
          pgSql += ' AND periode = $2';
          pgParams.push(periode);
        }
        pgSql += ' ORDER BY nama ASC';
        const pgRes = await pool.query(pgSql, pgParams);
        students = pgRes.rows || [];
      } catch (_pgE) {}
    }

    let startSequence = 1;
    if (startSequenceStr && !isNaN(parseInt(startSequenceStr))) {
      startSequence = parseInt(startSequenceStr);
    }

    let currentSequence = startSequence;
    let updatesCount = 0;

    for (const student of students) {
      const year = student.diterima_tanggal ? new Date(student.diterima_tanggal).getFullYear() : new Date().getFullYear();
      const sequenceFormatted = String(currentSequence).padStart(3, '0');
      const nipd = `${year}${sequenceFormatted}`;

      if (uuidOnly.length > 0) {
        try {
          const supabase = getSupabaseClient(c.req.header('Authorization'));
          await supabase.from('active_students').update({ nipd }).eq('id', student.id).in('school_id', uuidOnly);

          if (student.calon_siswa_id) {
            await supabase.from('student_applicants').update({ nipd }).eq('id', student.calon_siswa_id).in('school_id', uuidOnly);
          }
        } catch (_sbErr) {}
      }

      try {
        await pool.query('UPDATE active_students SET nipd = $1 WHERE id = $2 AND school_id::text = ANY($3::text[])', [nipd, student.id, allMatchIds]);
        if (student.calon_siswa_id) {
          await pool.query('UPDATE calon_siswa SET nipd = $1 WHERE id = $2 AND school_id::text = ANY($3::text[])', [nipd, student.calon_siswa_id, allMatchIds]);
        }
      } catch (_pgE) {}

      currentSequence++;
      updatesCount++;
    }

    return c.json({
      success: true,
      message: `Berhasil men-generate NIPD untuk ${updatesCount} siswa secara berurutan.`
    });
  } catch (err: unknown) {
    console.error('Generate NIPD error:', err);
    return c.json({ success: false, message: 'Gagal men-generate NIPD: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// 6. MUTASI JURUSAN
siswaAktifRouter.post('/:id/mutasi', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { jurusan_baru, diterima_kelas_baru } = await c.req.json();

    if (!jurusan_baru) {
      return c.json({ success: false, message: 'Jurusan baru wajib diisi.' }, 400);
    }

    const admin = getAdminSchool(c);
    const { schoolId, uuidOnly, allMatchIds } = await getEffectiveSchoolIdentifiers(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let student: Record<string, unknown> | null = null;
    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));
        const { data } = await supabase.from('active_students').select('*').eq('id', id).in('school_id', uuidOnly).maybeSingle();
        student = data;
      } catch (_e) {}
    }

    if (!student) {
      try {
        const pgCheck = await pool.query('SELECT * FROM active_students WHERE id = $1 AND school_id::text = ANY($2::text[])', [id, allMatchIds]);
        if (pgCheck.rows && pgCheck.rows.length > 0) student = pgCheck.rows[0];
      } catch (_pgE) {}
    }

    if (!student) {
      return c.json({ success: false, message: 'Siswa tidak ditemukan.' }, 404);
    }

    const jurusanAsal = (student.jurusan as string) || "";
    let updatedSiswa: Record<string, unknown> | null = null;

    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));
        const { data, error } = await supabase.from('active_students').update({
          jurusan: jurusan_baru,
          diterima_kelas: diterima_kelas_baru || student.diterima_kelas,
          nipd: null
        }).eq('id', id).in('school_id', uuidOnly).select().single();
        if (!error) updatedSiswa = data;

        const primaryUUID = uuidOnly[0];
        const mutasiPayload: Record<string, unknown> = {
          siswa_aktif_id: id,
          jurusan_asal: jurusanAsal,
          jurusan_tujuan: jurusan_baru,
          dilakukan_oleh: admin?.nama_lengkap || admin?.username || 'Admin',
          school_id: primaryUUID
        };
        await supabase.from('student_transfers').insert(mutasiPayload);

        if (student.calon_siswa_id) {
          await supabase.from('student_applicants').update({
            jurusan_1: jurusan_baru,
            diterima_kelas: diterima_kelas_baru || student.diterima_kelas,
            nipd: null
          }).eq('id', student.calon_siswa_id).in('school_id', uuidOnly);
        }
      } catch (_sbErr) {}
    }

    if (!updatedSiswa) {
      try {
        const pgRes = await pool.query(
          'UPDATE active_students SET jurusan = $1, diterima_kelas = $2, nipd = NULL WHERE id = $3 AND school_id::text = ANY($4::text[]) RETURNING *',
          [jurusan_baru, diterima_kelas_baru || student.diterima_kelas, id, allMatchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) updatedSiswa = pgRes.rows[0];
      } catch (_pgE) {}
    }

    return c.json({
      success: true,
      message: `Siswa berhasil dimutasi ke jurusan ${jurusan_baru}. Silakan jalankan Generate NIPD ulang untuk menyesuaikan nomor urut.`,
      data: updatedSiswa || { id, jurusan: jurusan_baru }
    });
  } catch (err: unknown) {
    console.error('Mutasi error:', err);
    return c.json({ success: false, message: 'Gagal mutasi siswa: ' + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// 7. BULK IMPORT EXCEL DATA
siswaAktifRouter.post('/import', adminAuth, async (c: Context) => {
  try {
    const { schoolId, uuidOnly, allMatchIds } = await getEffectiveSchoolIdentifiers(c);
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
    if (rawStudents.length > 3000) {
      return c.json({ success: false, message: 'Batas maksimal per impor adalah 3.000 data siswa.' }, 400);
    }

    const targetSchoolUUID = uuidOnly[0] || schoolId;

    const sanitizeField = (val: unknown, maxLen = 255): string | null => {
      if (val === null || val === undefined) return null;
      let str = String(val).trim();
      if (!str) return null;
      if (/^[=+\-@\t\r]/.test(str)) {
        str = str.replace(/^[=+\-@\t\r]+/, '');
      }
      str = str.replace(/<[^>]*>?/gm, '');
      return str.slice(0, maxLen).trim() || null;
    };

    // Normalize and sanitize fields for each student
    const sanitizedStudents = rawStudents.map((s) => {
      const rawJk = String(s.jenis_kelamin || s.jk || s.gender || '').trim().toLowerCase();
      let normalizedJk = 'L';
      if (rawJk.startsWith('p')) normalizedJk = 'P';

      const nama = sanitizeField(s.nama || s.nama_lengkap || s.namaLengkap, 150) || '';
      const nisn = sanitizeField(s.nisn, 20) || '-';
      const nik = sanitizeField(s.nik, 25) || '-';
      const nipd = sanitizeField(s.nipd, 35) || '-';
      const jurusan = sanitizeField(s.jurusan || s.jurusan_1 || s.jurusan1 || s.prodi, 100) || 'Umum';
      const kelas = sanitizeField(s.diterima_kelas || s.diterimaKelas || s.kelas || s.rombel, 50);
      const periode = sanitizeField(s.periode || s.tahun_ajaran || s.angkatan, 20) || '2026-2027';

      return {
        school_id: targetSchoolUUID,
        nama,
        nisn,
        nik,
        nipd,
        jurusan,
        diterima_kelas: kelas,
        periode,
        jenis_kelamin: normalizedJk,
        tempat_lahir: sanitizeField(s.tempat_lahir, 100) || '-',
        tgl_lahir: sanitizeField(s.tgl_lahir, 30) || '2000-01-01',
        agama: sanitizeField(s.agama, 50) || '-',
        alamat: sanitizeField(s.alamat, 500) || '-',
        rt_rw: sanitizeField(s.rt_rw, 20) || '00/00',
        kelurahan: sanitizeField(s.kelurahan, 100) || '-',
        kecamatan: sanitizeField(s.kecamatan, 100) || '-',
        kode_pos: sanitizeField(s.kode_pos, 10) || '-',
        whatsapp: sanitizeField(s.whatsapp, 25) || '-',
        email: sanitizeField(s.email, 100) || '-',
        sekolah_asal: sanitizeField(s.sekolah_asal, 150) || '-',
        nama_ayah: sanitizeField(s.nama_ayah, 150) || '-',
        pekerjaan_ayah: sanitizeField(s.pekerjaan_ayah, 100) || '-',
        penghasilan_ayah: sanitizeField(s.penghasilan_ayah, 50) || '-',
        nama_ibu: sanitizeField(s.nama_ibu, 150) || '-',
        pekerjaan_ibu: sanitizeField(s.pekerjaan_ibu, 100) || '-',
        penghasilan_ibu: sanitizeField(s.penghasilan_ibu, 50) || '-',
        telepon_ortu: sanitizeField(s.telepon_ortu, 25) || '-',
        diterima_tanggal: sanitizeField(s.diterima_tanggal, 30) || new Date().toISOString().split('T')[0],
        tinggi_badan: 0,
        berat_badan: 0,
        jarak_sekolah: '-',
        jarak_km: 0,
        waktu_jam: 0,
        waktu_menit: 0,
        jumlah_saudara: 0,
        golongan_darah: '-',
        tinggal_dengan: '-',
        transportasi: '-',
        tgl_lulus: '2026-01-01',
      };
    }).filter(s => s.nama.length > 0);

    let totalImported = 0;
    let supabaseSuccess = false;

    if (uuidOnly.length > 0) {
      try {
        const supabase = getSupabaseClient(c.req.header('Authorization'));

        // Fetch existing students for this school to distinguish insert vs update
        const { data: existingRows, error: checkErr } = await supabase
          .from('active_students')
          .select('id, nisn, nik')
          .in('school_id', uuidOnly);

        if (checkErr) throw checkErr;

        const existingMap = new Map<string, number>();
        if (Array.isArray(existingRows)) {
          existingRows.forEach((r) => {
            if (r.nisn && r.nisn !== '-') existingMap.set(`nisn:${r.nisn.trim()}`, r.id);
            if (r.nik && r.nik !== '-') existingMap.set(`nik:${r.nik.trim()}`, r.id);
          });
        }

        const toInsert: Array<Record<string, unknown>> = [];
        const toUpdate: Array<{ id: number; data: Record<string, unknown> }> = [];

        for (const st of sanitizedStudents) {
          const existingId = (st.nisn && st.nisn !== '-' ? existingMap.get(`nisn:${st.nisn}`) : null) ||
                             (st.nik && st.nik !== '-' ? existingMap.get(`nik:${st.nik}`) : null);
          if (existingId) {
            toUpdate.push({ id: existingId, data: st });
          } else {
            toInsert.push(st);
          }
        }

        // Execute inserts in batch
        if (toInsert.length > 0) {
          const insertBatchSize = 100;
          for (let i = 0; i < toInsert.length; i += insertBatchSize) {
            const chunk = toInsert.slice(i, i + insertBatchSize);
            const { data, error } = await supabase.from('active_students').insert(chunk).select('id');
            if (error) throw error;
            totalImported += data?.length || chunk.length;
          }
        }

        // Execute updates
        for (const item of toUpdate) {
          const { error } = await supabase
            .from('active_students')
            .update(item.data)
            .eq('id', item.id)
            .in('school_id', uuidOnly);
          if (!error) totalImported++;
        }

        supabaseSuccess = true;
      } catch (sbError) {
        console.warn('Supabase batch import error, falling back to direct PostgreSQL pool:', sbError instanceof Error ? sbError.message : sbError);
      }
    }

    // Direct PostgreSQL Pool Fallback if Supabase was unsuccessful
    if (!supabaseSuccess) {
      try {
        const pgExisting = await pool.query(
          'SELECT id, nisn, nik FROM active_students WHERE school_id::text = ANY($1::text[])',
          [allMatchIds]
        );
        const pgMap = new Map<string, number>();
        if (pgExisting.rows) {
          pgExisting.rows.forEach((r) => {
            if (r.nisn && r.nisn !== '-') pgMap.set(`nisn:${String(r.nisn).trim()}`, r.id);
            if (r.nik && r.nik !== '-') pgMap.set(`nik:${String(r.nik).trim()}`, r.id);
          });
        }

        totalImported = 0;
        for (const st of sanitizedStudents) {
          const existingId = (st.nisn && st.nisn !== '-' ? pgMap.get(`nisn:${st.nisn}`) : null) ||
                             (st.nik && st.nik !== '-' ? pgMap.get(`nik:${st.nik}`) : null);

          const keys = Object.keys(st);
          const values = Object.values(st);

          if (existingId) {
            const setClauses = keys.map((k, idx) => `"${k}" = $${idx + 1}`).join(', ');
            await pool.query(
              `UPDATE active_students SET ${setClauses} WHERE id = $${keys.length + 1} AND school_id::text = ANY($${keys.length + 2}::text[])`,
              [...values, existingId, allMatchIds]
            );
          } else {
            const colNames = keys.map((k) => `"${k}"`).join(', ');
            const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
            await pool.query(
              `INSERT INTO active_students (${colNames}) VALUES (${placeholders})`,
              values
            );
          }
          totalImported++;
        }
      } catch (pgError) {
        console.error('PostgreSQL direct pool import error:', pgError);
      }
    }

    return c.json({
      success: true,
      message: `Berhasil mengimpor ${totalImported} data siswa aktif.`,
      count: totalImported,
    });
  } catch (err: unknown) {
    console.error('Import active students error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengimpor data siswa: ' + (err instanceof Error ? err.message : (err as { message?: string })?.message || JSON.stringify(err))
    }, 500);
  }
});

export default siswaAktifRouter;
