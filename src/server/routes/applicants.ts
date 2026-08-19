import { Hono, Context } from 'hono';
import { adminAuth, requireTenantId } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import { broadcast } from '../ws/handler';
import { rateLimiter } from '../middleware/rate-limiter';
import { registerApplicantSchema, updateApplicantSchema } from '../validations/applicants';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';
import { timingSafeEqual } from 'crypto';
import _fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRouter = new Hono();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const syncCandidateToSiswaAktif = async (candidate: any): Promise<void> => {
  try {
    const supabase = getSupabaseClient(); // Background service role
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

      // Hapus data siswa aktif yatim (orphan) yang memiliki NISN atau NIK sama tetapi calon_siswa_id berbeda
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
};

export const syncAllExistingApprovedApplicants = async (): Promise<void> => {
  try {
    const supabase = getSupabaseClient();
    const { data: approvedCandidates } = await supabase.from('student_applicants').select('*').eq('status', 'Approved');
    
    if (approvedCandidates) {
      console.log(`[Startup-Sync] Ditemukan ${approvedCandidates.length} calon siswa berstatus Approved. Mensinkronkan ke SiswaAktif...`);
      for (const candidate of approvedCandidates) {
        await syncCandidateToSiswaAktif(candidate);
      }
      console.log(`[Startup-Sync] Sinkronisasi selesai.`);
    }
  } catch (err: unknown) {
    console.error('Error syncing existing approved candidates to SiswaAktif:', (err as any).message);
  }
};

export const checkAndDisqualifyExpiredApplicants = async (): Promise<void> => {
  try {
    const supabase = getSupabaseClient();
    // Auto-gugur: pendaftar yang masih Pending lebih dari 30 hari tanpa aksi admin
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
    console.error('Error saat menjalankan penjadwal auto-gugur:', (err as any).message);
  }
};

// Jalankan pengecekan setiap 30 detik
// setInterval(() => {
//   checkAndDisqualifyExpiredApplicants().catch(err => {
//     console.error('Error in interval checkAndDisqualifyExpiredApplicants:', err);
//   });
// }, 30000);

// Pengecekan awal saat backend start
// setTimeout(() => {
//   checkAndDisqualifyExpiredApplicants().catch(err => {
//     console.error('Error in timeout checkAndDisqualifyExpiredApplicants:', err);
//   });
//   syncAllExistingApprovedApplicants().catch(err => {
//     console.error('Error in timeout syncAllExistingApprovedApplicants:', err);
//   });
// }, 2000);

// 1. PUBLIC: Register a student applicant (Calon Siswa)
appRouter.post('/', rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 menit
  max: 5,                  // maks 5 registrasi per IP
  message: 'Batas pendaftaran online terlampaui. Silakan coba lagi beberapa saat lagi.'
}), async (c: Context) => {
  try {
    const f = await c.req.json();
    
    const result = registerApplicantSchema.safeParse(f);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => (err as any).message)
      }, 400);
    }
    const validated = result.data;
    
    const supabase = getSupabaseClient();
    const schoolSlug = c.req.query('school_slug');
    if (!schoolSlug) {
      return c.json({ success: false, message: 'Parameter school_slug wajib disertakan.' }, 400);
    }
    
    // Resolve to actual UUID
    const schoolId = await resolveSchoolUUID(schoolSlug, fontInMemSchools);
    if (!schoolId) {
      return c.json({ success: false, message: 'Sekolah tidak ditemukan.' }, 404);
    }

    // Map Frontend body attributes to matching database fields
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
      physical_doc_verified: false,
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
      return c.json({
        success: false,
        message: `${field} ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.`
      }, 400);
    }

    // === QUOTA CHECK ===
    const requestedJurusan = mapped.jurusan_1 || '';
    if (!requestedJurusan) {
      return c.json({ success: false, message: 'Pilihan Program Keahlian (Jurusan 1) wajib diisi.' }, 400);
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
        return c.json({
          success: false,
          message: `Maaf, kuota untuk program keahlian ${jurusanName} sudah penuh. Silakan pilih jurusan lain.`
        }, 400);
      }
    }
    // === END QUOTA CHECK ===

    let savedRecord;
    try {
      const { data: insertData, error: dbErr } = await supabase.from('student_applicants').insert(mapped).select().single();
      if (dbErr) throw dbErr;
      savedRecord = insertData;
    } catch (dbErr: unknown) {
      console.error("Supabase CalonSiswa create DB failure.", (dbErr as any).message);
      if ((dbErr as any).code === '23505') {
        const detail = (dbErr as any).details || (dbErr as any).message || '';
        if (detail.includes('nisn')) {
          return c.json({ success: false, message: 'NISN ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.' }, 400);
        }
        if (detail.includes('nik')) {
          return c.json({ success: false, message: 'NIK ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.' }, 400);
        }
      }
      return c.json({ success: false, message: 'Gagal memproses formulir pendaftaran: ' + (dbErr as any).message }, 500);
    }

    // The database id is unique and avoids count+1 collisions under concurrent registration.
    const registrationNo = `SPMB-${new Date().getFullYear()}-${String(savedRecord.id).padStart(5, '0')}`;
    const { error: registrationError } = await supabase.from('student_applicants')
      .update({ registration_no: registrationNo }).eq('id', savedRecord.id).eq('school_id', schoolId);
    if (registrationError) throw registrationError;
    savedRecord = { ...savedRecord, registration_no: registrationNo };

    // Broadcast websocket notification to active admins!
    broadcast({
      event: 'NEW_APPLICANT',
      data: savedRecord
    }, true);

    // Broadcast sanitized version to public
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

    return c.json({
      success: true,
      message: 'Pendaftaran berhasil.',
      data: savedRecord
    }, 201);

  } catch (err: unknown) {
    console.error('Registration API error:', err);
    return c.json({ success: false, message: 'Gagal memproses formulir pendaftaran: ' + (err as any).message }, 500);
  }
});

import { ApplicantController } from '../controllers/ApplicantController';

// 2. PUBLIC: Fetch candidates with limited non-sensitive columns
appRouter.get('/public', ApplicantController.getAll);

// 3. ADMIN ONLY: Fetch all candidates with full columns (Protected)
// Optimasi: Kecualikan kolom bukti_bayar dan berkas_foto dari data list untuk menghemat bandwidth (Base64)
appRouter.get('/', adminAuth, async (c: Context) => {
  try {
    await checkAndDisqualifyExpiredApplicants();
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

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
      "periode", "gelombang", "registration_no", "status", "physical_doc_verified", "physical_doc_verified_by", "physical_doc_verified_at", "physical_docs_checklist", "tgl_daftar", "verified_by", "rejected_by", "deleted_by"
    ];
    
    const query = supabase.from('student_applicants')
      .select(calonSiswaFields.join(','))
      .is('deleted_at', null)
      .order('tgl_daftar', { ascending: false })
      .eq('school_id', schoolId);
    
    const { data: rows, error } = await query;
    if (process.env.NODE_ENV !== 'production' && (!rows || rows.length === 0)) {
      // Development-only fallback seed data
      const defaultSeed = [
        { id: 252610466, nama: "Elisa Pratiwi", nisn: "0091234567", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 3 Depok", sekolahAsal: "SMPN 3 Depok", jurusan_1: "Desain Komunikasi Visual", jurusan1: "Desain Komunikasi Visual", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() },
        { id: 252610429, nama: "Rani Nugroho", nisn: "0092345678", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 2 Depok", sekolahAsal: "SMPN 2 Depok", jurusan_1: "Teknik Jaringan Komputer & Telekomunikasi", jurusan1: "Teknik Jaringan Komputer & Telekomunikasi", status: "Approved", gelombang: "Gelombang 2", tgl_daftar: new Date().toISOString() },
        { id: 252610430, nama: "Rizky Kusuma", nisn: "0093456789", jenis_kelamin: "L", jenisKelamin: "L", sekolah_asal: "SMPN 3 Depok", sekolahAsal: "SMPN 3 Depok", jurusan_1: "Desain Komunikasi Visual", jurusan1: "Desain Komunikasi Visual", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() },
        { id: 252610431, nama: "Dewi Kusuma", nisn: "0094567890", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 4 Depok", sekolahAsal: "SMPN 4 Depok", jurusan_1: "Broadcasting & Perfilman", jurusan1: "Broadcasting & Perfilman", status: "Approved", gelombang: "Gelombang 2", tgl_daftar: new Date().toISOString() },
        { id: 252610432, nama: "Jasmine Pratama", nisn: "0095678901", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 7 Depok", sekolahAsal: "SMPN 7 Depok", jurusan_1: "Teknik Elektronika", jurusan1: "Teknik Elektronika", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() },
        { id: 252610433, nama: "Fitri Wijaya", nisn: "0096789012", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMP IT Al-Hikmah", sekolahAsal: "SMP IT Al-Hikmah", jurusan_1: "Animasi", jurusan1: "Animasi", status: "Approved", gelombang: "Gelombang 2", tgl_daftar: new Date().toISOString() },
        { id: 252610434, nama: "Mahendra Santoso", nisn: "0097890123", jenis_kelamin: "L", jenisKelamin: "L", sekolah_asal: "SMK Taruna Bhakti", sekolahAsal: "SMK Taruna Bhakti", jurusan_1: "Rekayasa Perangkat Lunak", jurusan1: "Rekayasa Perangkat Lunak", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() }
      ];
      return c.json({ success: true, data: defaultSeed });
    }

    if (error) throw error;
    return c.json({ success: true, data: rows || [] });
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Fetch applicants list error:', err);
      return c.json({ success: false, message: 'Gagal mengambil data calon siswa.' }, 500);
    }
    const defaultSeed = [
      { id: 252610466, nama: "Elisa Pratiwi", nisn: "0091234567", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 3 Depok", sekolahAsal: "SMPN 3 Depok", jurusan_1: "Desain Komunikasi Visual", jurusan1: "Desain Komunikasi Visual", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() },
      { id: 252610429, nama: "Rani Nugroho", nisn: "0092345678", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 2 Depok", sekolahAsal: "SMPN 2 Depok", jurusan_1: "Teknik Jaringan Komputer & Telekomunikasi", jurusan1: "Teknik Jaringan Komputer & Telekomunikasi", status: "Approved", gelombang: "Gelombang 2", tgl_daftar: new Date().toISOString() },
      { id: 252610430, nama: "Rizky Kusuma", nisn: "0093456789", jenis_kelamin: "L", jenisKelamin: "L", sekolah_asal: "SMPN 3 Depok", sekolahAsal: "SMPN 3 Depok", jurusan_1: "Desain Komunikasi Visual", jurusan1: "Desain Komunikasi Visual", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() },
      { id: 252610431, nama: "Dewi Kusuma", nisn: "0094567890", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 4 Depok", sekolahAsal: "SMPN 4 Depok", jurusan_1: "Broadcasting & Perfilman", jurusan1: "Broadcasting & Perfilman", status: "Approved", gelombang: "Gelombang 2", tgl_daftar: new Date().toISOString() },
      { id: 252610432, nama: "Jasmine Pratama", nisn: "0095678901", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMPN 7 Depok", sekolahAsal: "SMPN 7 Depok", jurusan_1: "Teknik Elektronika", jurusan1: "Teknik Elektronika", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() },
      { id: 252610433, nama: "Fitri Wijaya", nisn: "0096789012", jenis_kelamin: "P", jenisKelamin: "P", sekolah_asal: "SMP IT Al-Hikmah", sekolahAsal: "SMP IT Al-Hikmah", jurusan_1: "Animasi", jurusan1: "Animasi", status: "Approved", gelombang: "Gelombang 2", tgl_daftar: new Date().toISOString() },
      { id: 252610434, nama: "Mahendra Santoso", nisn: "0097890123", jenis_kelamin: "L", jenisKelamin: "L", sekolah_asal: "SMK Taruna Bhakti", sekolahAsal: "SMK Taruna Bhakti", jurusan_1: "Rekayasa Perangkat Lunak", jurusan1: "Rekayasa Perangkat Lunak", status: "Approved", gelombang: "Gelombang 1", tgl_daftar: new Date().toISOString() }
    ];
    return c.json({ success: true, data: defaultSeed });
  }
});

// ADMIN ONLY: Fetch all trashed applicants (Protected)
appRouter.get('/trashed', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

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
      "periode", "gelombang", "registration_no", "status", "physical_doc_verified", "physical_doc_verified_by", "physical_doc_verified_at", "physical_docs_checklist", "tgl_daftar", "deleted_at", "verified_by", "rejected_by", "deleted_by"
    ];
    
    const query = supabase.from('student_applicants')
      .select(calonSiswaFields.join(','))
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
      .eq('school_id', schoolId);
    
    const { data: rows, error } = await query;
    if (error) throw error;

    return c.json({ success: true, data: rows });
  } catch (err: unknown) {
    console.error('Fetch trashed applicants list error:', err);
    return c.json({ success: false, message: 'Gagal mengambil data pendaftar terhapus: ' + (err as any).message }, 500);
  }
});

// ADMIN ONLY: Export candidates to Excel via streaming (Protected)
appRouter.get('/export', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Calon Siswa');

    worksheet.columns = [
      { header: 'No. Pendaftaran', key: 'registration_no', width: 20 },
      { header: 'Nama Lengkap', key: 'nama', width: 30 },
      { header: 'NISN', key: 'nisn', width: 15 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
      { header: 'Sekolah Asal', key: 'sekolah_asal', width: 25 },
      { header: 'Program Keahlian (Jurusan)', key: 'jurusan_1', width: 30 },
      { header: 'No. WhatsApp', key: 'whatsapp', width: 18 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Status Seleksi', key: 'status', width: 15 },
      { header: 'Verifikasi Berkas Fisik', key: 'physical_doc_verified', width: 22 },
      { header: 'Diverifikasi Oleh', key: 'physical_doc_verified_by', width: 20 },
      { header: 'Tanggal Daftar', key: 'tgl_daftar', width: 20 }
    ];

    // Styling header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' }
    };

    // Streaming approach
    const stream = new ReadableStream({
      async start(controller) {
        const BATCH_SIZE = 100;
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          const query = supabase.from('student_applicants')
            .select('*')
            .is('deleted_at', null)
            .order('tgl_daftar', { ascending: false })
            .eq('school_id', schoolId)
            .range(offset, offset + BATCH_SIZE - 1);

          const { data, error } = await query;
          if (error) {
            console.error('Error fetching batch:', error);
            controller.error(error);
            return;
          }

          if (!data || data.length === 0) {
            hasMore = false;
          } else {
            for (const row of data) {
              worksheet.addRow({
                registration_no: row.registration_no || '-',
                nama: row.nama || '-',
                nisn: row.nisn || '-',
                nik: row.nik || '-',
                jenis_kelamin: row.jenis_kelamin === 'L' ? 'Laki-laki' : row.jenis_kelamin === 'P' ? 'Perempuan' : row.jenis_kelamin,
                sekolah_asal: row.sekolah_asal || '-',
                jurusan_1: row.jurusan_1 || '-',
                whatsapp: row.whatsapp || '-',
                email: row.email || '-',
                status: row.status || 'Pending',
                physical_doc_verified: row.physical_doc_verified ? 'Sudah Diterima' : 'Belum Diterima',
                physical_doc_verified_by: row.physical_doc_verified_by || '-',
                tgl_daftar: row.tgl_daftar ? new Date(row.tgl_daftar).toLocaleString('id-ID') : '-'
              });
            }
            offset += BATCH_SIZE;
            if (data.length < BATCH_SIZE) hasMore = false;
          }
        }

        const buffer = await workbook.xlsx.writeBuffer();
        controller.enqueue(buffer);
        controller.close();
      }
    });

    const filename = `Data_Calon_Siswa_${new Date().toISOString().split('T')[0]}.xlsx`;
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err: unknown) {
    console.error('Export Excel error:', err);
    return c.json({ success: false, message: 'Gagal mengekspor data: ' + (err as any).message }, 500);
  }
});

// ADMIN ONLY: Restore applicant (Protected)
appRouter.post('/:id/restore', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    const query = supabase.from('student_applicants').select('*').eq('id', id)
      .eq('school_id', schoolId);
    const { data: existing } = await query.single();

    if (!existing) {
      return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
    }

    let updateQuery = supabase.from('student_applicants').update({ deleted_at: null, deleted_by: null }).eq('id', id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
    const { data: updated, error } = await updateQuery.select().single();
    if (error) throw error;

    await syncCandidateToSiswaAktif(updated);

    broadcast({ event: 'APPLICANT_UPDATED', data: updated }, true);

    return c.json({ success: true, message: 'Data calon siswa berhasil dipulihkan.', data: updated });
  } catch (err: unknown) {
    console.error('Restore applicant error:', err);
    return c.json({ success: false, message: 'Gagal memulihkan data pendaftar: ' + (err as any).message }, 500);
  }
});

// 4. ADMIN ONLY: Fetch full details of a specific applicant (Protected)
appRouter.get('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    const query = supabase.from('student_applicants').select('*').eq('id', id)
      .eq('school_id', schoolId);
    
    const { data: applicant, error } = await query.single();

    if (error || !applicant) {
      return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
    }

    return c.json({ success: true, data: applicant });
  } catch (err) {
    console.error('Get applicant detail error:', err);
    return c.json({ success: false, message: 'Gagal mengambil detail pendaftar.' }, 500);
  }
});

appRouter.put('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const f = await c.req.json();

    const result = updateApplicantSchema.safeParse(f);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => (err as any).message)
      }, 400);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validated = result.data as any;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    const query = supabase.from('student_applicants').select('*').eq('id', id)
      .eq('school_id', schoolId);
    const { data: existingRecord } = await query.single();

    if (!existingRecord) {
      return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      kebutuhan_khusus: f.kebutuhanKhusus !== undefined ? f.kebutuhanKhusus : (existingRecord as any).kebutuhan_khusus,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jenis_prestasi: f.jenisPrestasi !== undefined ? f.jenisPrestasi : (existingRecord as any).jenis_prestasi,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tingkat_prestasi: f.tingkatPrestasi !== undefined ? f.tingkatPrestasi : (existingRecord as any).tingkat_prestasi,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jenis_beasiswa: f.jenisBeasiswa !== undefined ? f.jenisBeasiswa : (existingRecord as any).jenis_beasiswa,
    };

    const updateQuery = supabase.from('student_applicants').update(fields).eq('id', id).eq('school_id', schoolId);
    
    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    await syncCandidateToSiswaAktif(updatedRecord);
    broadcast({ event: 'APPLICANT_UPDATED', data: updatedRecord }, true);

    return c.json({ success: true, message: 'Data pendaftar berhasil diperbarui.', data: updatedRecord });
  } catch (err: unknown) {
    console.error('Update applicant error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui data pendaftar: ' + (err as any).message }, 500);
  }
});

// 6. ADMIN ONLY: Approve/Verify or Reject applicant status (Protected)
appRouter.patch('/:id/status', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { status, alasan_ditolak } = await c.req.json();

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return c.json({ success: false, message: 'Status tidak valid. Harus Pending, Approved, atau Rejected.' }, 400);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = c.get('admin') as any;
    const schoolId = await requireTenantId(c);

    const query = supabase.from('student_applicants').select('*').eq('id', id)
      .eq('school_id', schoolId);
    const { data: applicant } = await query.single();

    if (!applicant) {
      return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
    }

    const adminName = admin ? (admin.nama || admin.username) : 'Sistem';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };
    if (status === 'Approved') {
      updateData.verified_by = adminName;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
    } else if (status === 'Rejected') {
      updateData.rejected_by = adminName;
      updateData.verified_by = null;
      updateData.alasan_ditolak = alasan_ditolak || null;
    } else if (status === 'Pending') {
      updateData.verified_by = null;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
    }

    const updateQuery = supabase.from('student_applicants').update(updateData).eq('id', id)
      .eq('school_id', schoolId);
    
    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    await syncCandidateToSiswaAktif(updatedRecord);

    broadcast({
      event: 'STATUS_UPDATE',
      data: {
        id: updatedRecord.id,
        nama: updatedRecord.nama,
        status: updatedRecord.status,
        alasan_ditolak: updatedRecord.alasan_ditolak
      }
    });

    return c.json({ success: true, message: `Status calon siswa berhasil diperbarui menjadi ${status}.`, data: updatedRecord });
  } catch (err) {
    console.error('Update status error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui status pendaftar.' }, 500);
  }
});

// 6. ADMIN ONLY: Delete applicant (Protected)
appRouter.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const permanent = c.req.query('permanent') === 'true';
    
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    if (permanent) {
      const saDeleteQuery = supabase.from('active_students').delete().eq('calon_siswa_id', id).eq('school_id', schoolId);
      await saDeleteQuery;

      const csDeleteQuery = supabase.from('student_applicants').delete().eq('id', id).eq('school_id', schoolId);
      await csDeleteQuery;

      broadcast({ event: 'APPLICANT_DELETED', data: { id } });
      return c.json({ success: true, message: 'Data calon siswa berhasil dihapus secara permanen.' });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = (c as any).get('admin');
      const adminName = admin ? (admin.nama || admin.username) : 'Sistem';

      const csUpdateQuery = supabase.from('student_applicants').update({ deleted_at: new Date().toISOString(), deleted_by: adminName }).eq('id', id).eq('school_id', schoolId);
      await csUpdateQuery;

      const saDeleteQuery = supabase.from('active_students').delete().eq('calon_siswa_id', id).eq('school_id', schoolId);
      await saDeleteQuery;

      broadcast({ event: 'APPLICANT_DELETED', data: { id } });
      return c.json({ success: true, message: 'Data calon siswa berhasil dipindahkan ke tempat sampah.' });
    }
  } catch (err: unknown) {
    console.error('Delete applicant error:', err);
    return c.json({ success: false, message: 'Gagal menghapus data pendaftar: ' + (err as any).message }, 500);
  }
});

// 7. ADMIN ONLY: Verifikasi Berkas Fisik (Physical Document Verification)
appRouter.patch('/:id/physical-doc', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { verified, checklist } = await c.req.json();
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = c.get('admin') as any;
    const schoolId = await requireTenantId(c);
    const adminName = admin ? (admin.nama || admin.username) : 'Admin';

    let isVerified = Boolean(verified);
    const finalChecklist = checklist;

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
    if (finalChecklist) {
      updateData.physical_docs_checklist = finalChecklist;
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

    return c.json({ success: true, message: 'Status verifikasi berkas fisik berhasil diperbarui.', data: updatedRecord });
  } catch (err: unknown) {
    console.error('Update physical doc status error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui status verifikasi berkas fisik: ' + (err as any).message }, 500);
  }
});

// 8. PUBLIC: Get registration card data by NISN (untuk Kartu SPMB)
appRouter.get('/registration-card/:nisn', async (c: Context) => {
  try {
    const nisn = c.req.param('nisn');
    const supabase = getSupabaseClient();
    const schoolSlug = c.req.query('school_slug');
    const schoolId = schoolSlug ? await resolveSchoolUUID(schoolSlug, fontInMemSchools) : null;

    let query = supabase.from('student_applicants')
      .select('id, nama, nisn, registration_no, jurusan_1, sekolah_asal, jenis_kelamin, status, tgl_daftar, gelombang, periode, physical_doc_verified, physical_docs_checklist')
      .eq('nisn', nisn);
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: record, error } = await query.single();
    if (error || !record) {
      return c.json({ success: false, message: 'Pendaftar tidak ditemukan.' }, 404);
    }

    return c.json({ success: true, data: record });
  } catch (err) {
    console.error('Fetch registration card error:', err);
    return c.json({ success: false, message: 'Gagal mengambil data kartu pendaftaran.' }, 500);
  }
});

// 9. PUBLIC: POST Verify applicant identity before revealing details
appRouter.post('/verify/:id', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,                  // maks 5 percobaan
  message: 'Batas verifikasi terlampaui. Silakan coba lagi 15 menit lagi.'
}), async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { nik } = await c.req.json();
    const supabase = getSupabaseClient();
    const schoolSlug = c.req.query('school_slug');

    // 1. Resolve school ID/UUID
    const schoolId = await resolveSchoolUUID(schoolSlug || '', fontInMemSchools);
    if (!schoolId) return c.json({ success: false, message: 'Sekolah tidak ditemukan.' }, 404);

    // 2. Fetch + Check NIK
    const { data: applicant } = await supabase.from('student_applicants')
      .select('id, nama, nisn, nik, tgl_lahir, status, tgl_daftar, jurusan_1, alasan_ditolak')
      .eq('id', id)
      .eq('school_id', schoolId)
      .single();

    if (!applicant || applicant.nik !== nik) {
      return c.json({ success: false, message: 'Data pendaftar tidak ditemukan atau NIK tidak sesuai.' }, 404);
    }

    return c.json({ success: true, data: applicant });
  } catch (_err: unknown) {
    return c.json({ success: false, message: 'Kesalahan server verifikasi.' }, 500);
  }
});

export default appRouter;
