import { Hono, Context } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import { broadcast } from '../ws/handler';
import { updateSiswaAktifSchema } from '../validations/siswa-aktif';

const siswaAktifRouter = new Hono();

// 1. ADMIN ONLY: Fetch all active students
// Optimasi: Kecualikan kolom berkas_foto dari data list untuk menghemat bandwidth (Base64)
siswaAktifRouter.get('/', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

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
  } catch (err: any) {
    console.error('Fetch active students error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil data siswa aktif: ' + err.message
    }, 500);
  }
});

// 2. ADMIN ONLY: Fetch details of a specific active student
siswaAktifRouter.get('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

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
  } catch (err: any) {
    console.error('Get active student detail error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil detail siswa aktif: ' + err.message
    }, 500);
  }
});

// 3. ADMIN ONLY: Update active student details
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
    const validated = result.data as any;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

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
      return (existingRecord as any)[dbKey];
    };

    const parseNum = (val: any) => {
      if (val === undefined || val === null || val === '') return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    const parseDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

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
      kebutuhan_khusus: f.kebutuhanKhusus !== undefined ? f.kebutuhanKhusus : (existingRecord as any).kebutuhan_khusus,
      jenis_prestasi: f.jenisPrestasi !== undefined ? f.jenisPrestasi : (existingRecord as any).jenis_prestasi,
      tingkat_prestasi: f.tingkatPrestasi !== undefined ? f.tingkatPrestasi : (existingRecord as any).tingkat_prestasi,
      jenis_beasiswa: f.jenisBeasiswa !== undefined ? f.jenisBeasiswa : (existingRecord as any).jenis_beasiswa,
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
  } catch (err: any) {
    console.error('Update active student error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui data siswa aktif: ' + err.message }, 500);
  }
});

// 4. ADMIN ONLY: Delete/Remove active student
siswaAktifRouter.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

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
  } catch (err: any) {
    console.error('Delete active student error:', err);
    return c.json({ success: false, message: 'Gagal menghapus siswa aktif: ' + err.message }, 500);
  }
});

// 5. ADMIN ONLY: Generate NIPD for all active students sequentially
siswaAktifRouter.post('/generate-nipd', adminAuth, async (c: Context) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const periode = body.periode;
    const startSequenceStr = body.startSequenceStr;
    
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

    let defaultPrefix = "2627";
    if (periode && typeof periode === "string") {
      const parts = periode.split("-");
      if (parts.length === 2 && parts[0].length === 4 && parts[1].length === 4) {
        defaultPrefix = parts[0].slice(-2) + parts[1].slice(-2);
      }
    }

    let currentSequence = 1;
    if (startSequenceStr) {
      currentSequence = parseInt(startSequenceStr);
      if (isNaN(currentSequence)) currentSequence = 1;
    }

    let query = supabase.from('active_students').select('*');
    if (schoolId) query = query.eq('school_id', schoolId);
    const { data: students, error } = await query;
    if (error) throw error;

    const jurusanOrderMap: { [key: string]: number } = {
      'TE': 1, 'Teknik Elektronika': 1,
      'RPL': 2, 'Rekayasa Perangkat Lunak': 2,
      'TJKT': 3, 'Teknik Jaringan Komputer & Telekomunikasi': 3, 'TKJ': 3,
      'BC': 4, 'Broadcasting & Perfilman': 4, 'PSPT': 4,
      'ANM': 5, 'Animasi': 5,
      'DKV': 6, 'Desain Komunikasi Visual': 6
    };

    const getJurusanOrder = (jurusan: string) => {
      const j = (jurusan || "").trim();
      if (jurusanOrderMap[j]) return jurusanOrderMap[j];
      for (const key in jurusanOrderMap) {
        if (j.toLowerCase().includes(key.toLowerCase())) return jurusanOrderMap[key];
      }
      return 99; // others at the end
    };

    const sortedStudents = (students || []).sort((a: any, b: any) => {
      const jOrderA = getJurusanOrder(a.jurusan);
      const jOrderB = getJurusanOrder(b.jurusan);
      if (jOrderA !== jOrderB) return jOrderA - jOrderB;
      return (a.nama || '').localeCompare(b.nama || '');
    });

    let updatesCount = 0;
    
    // Instead of massive concurrent fetches which can cause rate limiting,
    // we use sequential updates, or you could build a batch RPC. For now, sequential is safe.
    for (const student of sortedStudents) {
      const seqString = currentSequence.toString().padStart(5, '0');
      const nipd = `${defaultPrefix}${seqString}`;
      
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
  } catch (err: any) {
    console.error('Generate NIPD error:', err);
    return c.json({ success: false, message: 'Gagal men-generate NIPD: ' + err.message }, 500);
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
    const schoolId = c.req.query('school_id') || null;

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
    const admin = c.get('admin') as any;
    const mutasiPayload: any = {
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
  } catch (err: any) {
    console.error('Mutasi error:', err);
    return c.json({ success: false, message: 'Gagal mutasi siswa: ' + err.message }, 500);
  }
});

export default siswaAktifRouter;
