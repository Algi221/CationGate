import { Hono, Context } from 'hono';
import { adminAuth } from '../middleware/auth';
import prisma from '../db/prisma';
import { broadcast } from '../ws/handler';
import { rateLimiter } from '../middleware/rate-limiter';
import { registerApplicantSchema, updateApplicantSchema } from '../validations/applicants';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRouter = new Hono();

export const syncCandidateToSiswaAktif = async (candidate: any): Promise<void> => {
  try {
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
        periode, gelombang, berkas_foto
      } = candidate;

      // Hapus data siswa aktif yatim (orphan) yang memiliki NISN atau NIK sama tetapi calon_siswa_id berbeda
      if (nisn) {
        const existingByNisn = await prisma.siswaAktif.findUnique({
          where: { nisn }
        });
        if (existingByNisn && existingByNisn.calon_siswa_id !== calon_siswa_id) {
          await prisma.siswaAktif.delete({
            where: { id: existingByNisn.id }
          });
        }
      }

      if (nik) {
        const existingByNik = await prisma.siswaAktif.findUnique({
          where: { nik }
        });
        if (existingByNik && existingByNik.calon_siswa_id !== calon_siswa_id) {
          await prisma.siswaAktif.delete({
            where: { id: existingByNik.id }
          });
        }
      }

      await prisma.siswaAktif.upsert({
        where: { calon_siswa_id },
        update: {
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
          periode, gelombang, berkas_foto
        },
        create: {
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
          periode, gelombang, berkas_foto
        }
      });
    } else {
      await prisma.siswaAktif.deleteMany({
        where: { calon_siswa_id: candidate.id }
      });
    }
  } catch (err) {
    console.error('Error syncing candidate to SiswaAktif:', err);
  }
};

export const syncAllExistingApprovedApplicants = async (): Promise<void> => {
  try {
    const approvedCandidates = await prisma.calonSiswa.findMany({
      where: { status: 'Approved' }
    });
    console.log(`[Startup-Sync] Ditemukan ${approvedCandidates.length} calon siswa berstatus Approved. Mensinkronkan ke SiswaAktif...`);
    for (const candidate of approvedCandidates) {
      await syncCandidateToSiswaAktif(candidate);
    }
    console.log(`[Startup-Sync] Sinkronisasi selesai.`);
  } catch (err: any) {
    console.error('Error syncing existing approved candidates to SiswaAktif:', err.message);
  }
};

/**
 * Otomatis menggugurkan pendaftar online yang tidak membayar dalam 24 jam.
 * Status diubah menjadi 'Rejected' dan di-broadcast lewat WebSocket.
 */
export const checkAndDisqualifyExpiredApplicants = async (): Promise<void> => {
  try {
    const batasWaktu = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 jam yang lalu

    // Cari pendaftar yang sudah expired
    const expiredApplicants = await prisma.calonSiswa.findMany({
      where: {
        status: 'Pending',
        payment_status: 'Unpaid',
        metode_pembayaran: {
          not: 'Bayar di Sekolah'
        },
        tgl_daftar: {
          lt: batasWaktu
        },
        deleted_at: null
      }
    });

    if (expiredApplicants.length > 0) {
      console.log(`[Auto-Gugur] Ditemukan ${expiredApplicants.length} pendaftar expired. Memproses...`);
      
      // Update di database
      await prisma.calonSiswa.updateMany({
        where: {
          status: 'Pending',
          payment_status: 'Unpaid',
          metode_pembayaran: {
            not: 'Bayar di Sekolah'
          },
          tgl_daftar: {
            lt: batasWaktu
          },
          deleted_at: null
        },
        data: {
          status: 'Rejected'
        }
      });

      for (const applicant of expiredApplicants) {
        const updatedApplicant = { ...applicant, status: 'Rejected' };
        // Kirim broadcast real-time via WebSocket
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
  } catch (err: any) {
    console.error('Error saat menjalankan penjadwal auto-gugur:', err.message);
  }
};

// Jalankan pengecekan setiap 30 detik
setInterval(() => {
  checkAndDisqualifyExpiredApplicants().catch(err => {
    console.error('Error in interval checkAndDisqualifyExpiredApplicants:', err);
  });
}, 30000);

// Pengecekan awal saat backend start
setTimeout(() => {
  checkAndDisqualifyExpiredApplicants().catch(err => {
    console.error('Error in timeout checkAndDisqualifyExpiredApplicants:', err);
  });
  syncAllExistingApprovedApplicants().catch(err => {
    console.error('Error in timeout syncAllExistingApprovedApplicants:', err);
  });
}, 2000);

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
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const validated = result.data;
    
    // Map Frontend body attributes to matching database fields
    const mapped: any = {
      nama: validated.nama || 'Calon Siswa',
      nisn: validated.nisn || Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      nik: validated.nik || Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
      tempat_lahir: validated.tempatLahir || '-',
      tgl_lahir: validated.tglLahir ? new Date(validated.tglLahir) : new Date("2010-01-01"),
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
      tinggi_badan: parseInt(validated.tinggiBadan as any) || 0,
      berat_badan: parseInt(validated.beratBadan as any) || 0,
      jarak_sekolah: validated.jarakSekolah,
      jarak_km: parseFloat(validated.jarakKm as any) || 0.0,
      waktu_jam: parseInt(validated.waktuJam as any) || 0,
      waktu_menit: parseInt(validated.waktuMenit as any) || 0,
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
      tgl_lahir_ayah: validated.tglLahirAyah ? new Date(validated.tglLahirAyah) : null,
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
      tgl_lahir_ibu: validated.tglLahirIbu ? new Date(validated.tglLahirIbu) : null,
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
      tgl_lahir_wali: validated.tglLahirWali ? new Date(validated.tglLahirWali) : null,
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
      tgl_lulus: validated.tglLulus ? new Date(validated.tglLulus) : new Date("2026-06-10"),
      no_ijazah: validated.noIjazah,
      no_skhun: validated.noSKHUN,
      no_peserta_un: validated.noPesertaUN,
      lama_belajar: parseInt(validated.lamaBelajar as any) || 3,
      pindahan_dari: validated.pindahanDari,
      alasan_pindah: validated.alasanPindah,
      diterima_kelas: validated.diterimaKelas || 'X (Sepuluh)',
      diterima_tanggal: validated.diterimaTanggal ? new Date(validated.diterimaTanggal) : null,
      jurusan_1: validated.jurusan1,
      alasan_memilih: validated.alasanMemilih,
      hobi: validated.hobi,
      cita_cita: validated.citaCita,
      nilai_us_teori: parseFloat(validated.nilaiUSTeori as any) || 0.0,
      nilai_us_praktik: parseFloat(validated.nilaiUSPraktik as any) || 0.0,
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
      berkas_foto: validated.berkasFotoBase64,
      bukti_bayar: validated.buktiBayar,
      metode_pembayaran: validated.metodePembayaran,
      status: 'Pending',
      payment_status: 'Unpaid',
      tgl_daftar: new Date()
    };

    // Auto-detect Gelombang based on config ranges and date
    let detectedGelombang = 'Gelombang 1';
    try {
      let gelombangConfig: any = null;
      const configRecord = await prisma.landingPageConfig.findUnique({
        where: { config_key: 'ppdb_gelombang_config' }
      });
      if (configRecord) {
        gelombangConfig = configRecord.config_value;
        if (typeof gelombangConfig === 'string') {
          gelombangConfig = JSON.parse(gelombangConfig);
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

    // Check for duplicate NISN or NIK in Prisma
    const existing = await prisma.calonSiswa.findFirst({
      where: {
        OR: [
          { nisn: mapped.nisn },
          { nik: mapped.nik }
        ]
      }
    });
    
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
      const configRecord = await prisma.landingPageConfig.findUnique({
        where: { config_key: "kuota_targets" }
      });
      if (configRecord && configRecord.config_value) {
        targets = { ...targets, ...(configRecord.config_value as Record<string, number>) };
      }
    } catch (e) {
      console.error("Error fetching kuota targets for validation", e);
    }

    const target = targets[jurusanName] || 0;
    if (target > 0) {
      const currentCount = await prisma.calonSiswa.count({
        where: {
          jurusan_1: {
            startsWith: jurusanName
          },
          deleted_at: null
        }
      });
      if (currentCount >= target) {
        return c.json({
          success: false,
          message: `Maaf, kuota untuk program keahlian ${jurusanName} sudah penuh. Silakan pilih jurusan lain.`
        }, 400);
      }
    }
    // === END QUOTA CHECK ===

    // === SCHEMA FIELD LENGTH AUDIT ===
    const SCHEMA_LIMITS: Record<string, number> = {
      nama: 150, nisn: 10, nipd: 20, nik: 16, tempat_lahir: 100, jenis_kelamin: 1,
      agama: 20, kewarganegaraan: 3, rt_rw: 10, kelurahan: 50, kecamatan: 50,
      kode_pos: 5, whatsapp: 15, email: 100, tinggal_dengan: 30, transportasi: 30,
      jarak_sekolah: 30, golongan_darah: 5, penyakit_diderita: 150, punya_kps: 5,
      no_kps: 30, punya_kip: 5, no_kip: 30, tahun_prestasi: 10, penyelenggara: 100,
      tahun_mulai_beasiswa: 10, tahun_selesai_beasiswa: 10, nama_ayah: 150,
      tempat_lahir_ayah: 100, agama_ayah: 20, kewarganegaraan_ayah: 3, pendidikan_ayah: 50,
      pekerjaan_ayah: 100, penghasilan_ayah: 50, rtrw_ayah: 10, kelurahan_ayah: 50,
      kecamatan_ayah: 50, kode_pos_ayah: 5, status_ayah: 30, nama_ibu: 150,
      tempat_lahir_ibu: 100, agama_ibu: 20, kewarganegaraan_ibu: 3, pendidikan_ibu: 50,
      pekerjaan_ibu: 100, penghasilan_ibu: 50, rtrw_ibu: 10, kelurahan_ibu: 50,
      kecamatan_ibu: 50, kode_pos_ibu: 5, status_ibu: 30, nama_wali: 150,
      tempat_lahir_wali: 100, agama_wali: 20, kewarganegaraan_wali: 3, pendidikan_wali: 50,
      pekerjaan_wali: 100, penghasilan_wali: 50, rtrw_wali: 10, kelurahan_wali: 50,
      kecamatan_wali: 50, kode_pos_wali: 5, status_wali: 30, telepon_ortu: 15,
      sekolah_asal: 150, no_ijazah: 50, no_skhun: 50, no_peserta_un: 50,
      pindahan_dari: 150, diterima_kelas: 20, jurusan_1: 50, cita_cita: 100,
      cita_cita_setelah_lulus: 100, pelajaran_disenangi: 100, perkelahian: 5,
      narkoba: 5, pelanggaran_lain: 5, periode: 20, gelombang: 20, metode_pembayaran: 50,
      status: 20, payment_status: 20, verified_by: 100, rejected_by: 100, deleted_by: 100
    };

    const FIELD_LABELS: Record<string, string> = {
      nama: "Nama Lengkap", nisn: "NISN", nipd: "NIPD", nik: "NIK", tempat_lahir: "Tempat Lahir",
      jenis_kelamin: "Jenis Kelamin", agama: "Agama", kewarganegaraan: "Kewarganegaraan",
      rt_rw: "RT/RW", kelurahan: "Kelurahan", kecamatan: "Kecamatan", kode_pos: "Kode Pos",
      whatsapp: "Nomor WhatsApp", email: "Email", tinggal_dengan: "Tinggal Dengan",
      transportasi: "Transportasi", jarak_sekolah: "Jarak Sekolah", golongan_darah: "Golongan Darah",
      penyakit_diderita: "Penyakit Diderita", punya_kps: "Status KPS", no_kps: "Nomor KPS",
      punya_kip: "Status KIP", no_kip: "Nomor KIP", tahun_prestasi: "Tahun Prestasi",
      penyelenggara: "Penyelenggara Prestasi", tahun_mulai_beasiswa: "Tahun Mulai Beasiswa",
      tahun_selesai_beasiswa: "Tahun Selesai Beasiswa", nama_ayah: "Nama Ayah",
      tempat_lahir_ayah: "Tempat Lahir Ayah", agama_ayah: "Agama Ayah", kewarganegaraan_ayah: "Kewarganegaraan Ayah",
      pendidikan_ayah: "Pendidikan Ayah", pekerjaan_ayah: "Pekerjaan Ayah", penghasilan_ayah: "Penghasilan Ayah",
      rtrw_ayah: "RT/RW Ayah", kelurahan_ayah: "Kelurahan Ayah", kecamatan_ayah: "Kecamatan Ayah",
      kode_pos_ayah: "Kode Pos Ayah", status_ayah: "Status Ayah", nama_ibu: "Nama Ibu",
      tempat_lahir_ibu: "Tempat Lahir Ibu", agama_ibu: "Agama Ibu", kewarganegaraan_ibu: "Kewarganegaraan Ibu",
      pendidikan_ibu: "Pendidikan Ibu", pekerjaan_ibu: "Pekerjaan Ibu", penghasilan_ibu: "Penghasilan Ibu",
      rtrw_ibu: "RT/RW Ibu", kelurahan_ibu: "Kelurahan Ibu", kecamatan_ibu: "Kecamatan Ibu",
      kode_pos_ibu: "Kode Pos Ibu", status_ibu: "Status Ibu", nama_wali: "Nama Wali",
      tempat_lahir_wali: "Tempat Lahir Wali", agama_wali: "Agama Wali", kewarganegaraan_wali: "Kewarganegaraan Wali",
      pendidikan_wali: "Pendidikan Wali", pekerjaan_wali: "Pekerjaan Wali", penghasilan_wali: "Penghasilan Wali",
      rtrw_wali: "RT/RW Wali", kelurahan_wali: "Kelurahan Wali", kecamatan_wali: "Kecamatan Wali",
      kode_pos_wali: "Kode Pos Wali", status_wali: "Status Wali", telepon_ortu: "Telepon Orang Tua",
      sekolah_asal: "Sekolah Asal", no_ijazah: "Nomor Ijazah", no_skhun: "Nomor SKHUN",
      no_peserta_un: "Nomor Peserta UN", pindahan_dari: "Sekolah Pindahan Dari",
      diterima_kelas: "Diterima di Kelas", jurusan_1: "Pilihan Jurusan", cita_cita: "Cita-cita",
      cita_cita_setelah_lulus: "Rencana Setelah Lulus", pelajaran_disenangi: "Pelajaran yang Disenangi"
    };

    for (const [key, maxLen] of Object.entries(SCHEMA_LIMITS)) {
      const value = mapped[key];
      if (typeof value === 'string' && value.length > maxLen) {
        const label = FIELD_LABELS[key] || key;
        return c.json({
          success: false,
          message: `Nilai pada kolom "${label}" terlalu panjang (maksimum ${maxLen} karakter, terisi ${value.length} karakter).`
        }, 400);
      }
    }
    // === END SCHEMA FIELD LENGTH AUDIT ===

    let savedRecord;
    try {
      savedRecord = await prisma.calonSiswa.create({
        data: mapped
      });
    } catch (dbErr: any) {
      console.error("Prisma CalonSiswa create DB failure. Mapped payload:", JSON.stringify(mapped, null, 2));
      throw dbErr;
    }

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

  } catch (err: any) {
    console.error('Registration API error:', err);
    if (err.code === '23505') {
      const detail = err.detail || '';
      if (detail.includes('nisn')) {
        return c.json({
          success: false,
          message: 'NISN ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.'
        }, 400);
      }
      if (detail.includes('nik')) {
        return c.json({
          success: false,
          message: 'NIK ini sudah terdaftar di sistem PPDB. Silakan periksa kembali.'
        }, 400);
      }
    }
    return c.json({
      success: false,
      message: 'Gagal memproses formulir pendaftaran: ' + err.message
    }, 500);
  }
});

// 2. PUBLIC: Fetch candidates with limited non-sensitive columns
// Return candidates with status 'Pending', 'Approved', or 'Rejected'.
// NISN is masked (only last 4 digits shown) to prevent sensitive data exposure.
appRouter.get('/public', async (c: Context) => {
  try {
    await checkAndDisqualifyExpiredApplicants();
    const rows = await prisma.calonSiswa.findMany({
      where: {
        status: {
          in: ['Pending', 'Approved', 'Rejected']
        },
        deleted_at: null
      },
      select: {
        id: true,
        nama: true,
        nisn: true,
        sekolah_asal: true,
        jurusan_1: true,
        diterima_kelas: true,
        jenis_kelamin: true,
        status: true,
        tgl_daftar: true,
        alasan_ditolak: true
      },
      orderBy: {
        tgl_daftar: 'desc'
      }
    });

    // Mask NISN: only show last 4 digits for privacy
    const sanitizedRows = rows.map((row) => ({
      ...row,
      nisn: row.nisn ? '******' + row.nisn.slice(-4) : null
    }));

    return c.json({
      success: true,
      data: sanitizedRows
    });
  } catch (err) {
    console.error('Fetch public applicants list error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil data pendaftar.'
    }, 500);
  }
});

// 3. ADMIN ONLY: Fetch all candidates with full columns (Protected)
// Optimasi: Kecualikan kolom bukti_bayar dan berkas_foto dari data list untuk menghemat bandwidth (Base64)
appRouter.get('/', adminAuth, async (c: Context) => {
  try {
    await checkAndDisqualifyExpiredApplicants();
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
      "periode", "gelombang", "metode_pembayaran", "status", "payment_status", "tgl_daftar", "verified_by", "rejected_by", "deleted_by"
    ];
    
    const selectFields = calonSiswaFields.reduce((acc: any, field: string) => {
      acc[field] = true;
      return acc;
    }, {});

    const rows = await prisma.calonSiswa.findMany({
      where: {
        deleted_at: null
      },
      select: selectFields,
      orderBy: {
        tgl_daftar: 'desc'
      }
    });

    return c.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Fetch admin applicants list error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil seluruh data pendaftar.'
    }, 500);
  }
});

// ADMIN ONLY: Fetch all trashed applicants (Protected)
appRouter.get('/trashed', adminAuth, async (c: Context) => {
  try {
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
      "periode", "gelombang", "metode_pembayaran", "status", "payment_status", "tgl_daftar", "deleted_at", "verified_by", "rejected_by", "deleted_by"
    ];
    const selectFields = calonSiswaFields.reduce((acc: any, field: string) => {
      acc[field] = true;
      return acc;
    }, {});

    const rows = await prisma.calonSiswa.findMany({
      where: {
        deleted_at: {
          not: null
        }
      },
      select: selectFields,
      orderBy: {
        deleted_at: 'desc'
      }
    });

    return c.json({
      success: true,
      data: rows
    });
  } catch (err: any) {
    console.error('Fetch trashed applicants list error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil data pendaftar terhapus: ' + err.message
    }, 500);
  }
});

// ADMIN ONLY: Restore applicant (Protected)
appRouter.post('/:id/restore', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const existing = await prisma.calonSiswa.findUnique({
      where: { id }
    });

    if (!existing) {
      return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
    }

    const updated = await prisma.calonSiswa.update({
      where: { id },
      data: { deleted_at: null, deleted_by: null }
    });

    await syncCandidateToSiswaAktif(updated);

    broadcast({
      event: 'APPLICANT_UPDATED',
      data: updated
    }, true);

    return c.json({
      success: true,
      message: 'Data calon siswa berhasil dipulihkan.',
      data: updated
    });
  } catch (err: any) {
    console.error('Restore applicant error:', err);
    return c.json({
      success: false,
      message: 'Gagal memulihkan data pendaftar: ' + err.message
    }, 500);
  }
});

// 4. ADMIN ONLY: Fetch full details of a specific applicant (Protected)
appRouter.get('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const applicant = await prisma.calonSiswa.findUnique({
      where: { id }
    });

    if (!applicant) {
      return c.json({
        success: false,
        message: 'Calon siswa tidak ditemukan.'
      }, 404);
    }

    return c.json({
      success: true,
      data: applicant
    });
  } catch (err) {
    console.error('Get applicant detail error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengambil detail pendaftar.'
    }, 500);
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
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const validated = result.data as any;

    // Fetch existing record first to keep unmodified fields intact (safe merge)
    const existingRecord = await prisma.calonSiswa.findUnique({
      where: { id }
    });

    if (!existingRecord) {
      return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
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
      return isNaN(d.getTime()) ? null : d;
    };

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
      hobi: f.hobi !== undefined ? f.hobi : (existingRecord as any).hobi,
      nilai_us_teori: parseNum(getVal('nilai_us_teori', ['nilai_us_teori', 'nilaiUSTeori'])),
      nilai_us_praktik: parseNum(getVal('nilai_us_praktik', ['nilai_us_praktik', 'nilaiUSPraktik'])),
      nilai_muatan_lokal: parseNum(getVal('nilai_muatan_lokal', ['nilai_muatan_lokal', 'nilaiMuatanLokal'])),
      kesulitan_belajar: getVal('kesulitan_belajar', ['kesulitan_belajar', 'kesulitanBelajar']),
      pelajaran_disenangi: getVal('pelajaran_disenangi', ['pelajaran_disenangi', 'pelajaranDisenangi']),
      cita_cita_setelah_lulus: getVal('cita_cita_setelah_lulus', ['cita_cita_setelah_lulus', 'citaCitaSetelahLulus']),
      periode: getVal('periode', ['periode']),
      berkas_foto: getVal('berkas_foto', ['berkas_foto', 'berkasFotoBase64']),
      bukti_bayar: getVal('bukti_bayar', ['bukti_bayar', 'buktiBayar']),
      metode_pembayaran: getVal('metode_pembayaran', ['metode_pembayaran', 'metodePembayaran']),
      payment_status: getVal('payment_status', ['payment_status', 'paymentStatus']),
      diterima_kelas: getVal('diterima_kelas', ['diterima_kelas', 'diterimaKelas']),
      diterima_tanggal: parseDate(getVal('diterima_tanggal', ['diterima_tanggal', 'diterimaTanggal'])),
      gelombang: getVal('gelombang', ['gelombang']),
      status: getVal('status', ['status']),
      kebutuhan_khusus: f.kebutuhanKhusus !== undefined ? f.kebutuhanKhusus : (existingRecord as any).kebutuhan_khusus,
      jenis_prestasi: f.jenisPrestasi !== undefined ? f.jenisPrestasi : (existingRecord as any).jenis_prestasi,
      tingkat_prestasi: f.tingkatPrestasi !== undefined ? f.tingkatPrestasi : (existingRecord as any).tingkat_prestasi,
      jenis_beasiswa: f.jenisBeasiswa !== undefined ? f.jenisBeasiswa : (existingRecord as any).jenis_beasiswa,
    };

    const updatedRecord = await prisma.calonSiswa.update({
      where: { id },
      data: fields
    });

    await syncCandidateToSiswaAktif(updatedRecord);

    broadcast({ event: 'APPLICANT_UPDATED', data: updatedRecord }, true);

    return c.json({ success: true, message: 'Data pendaftar berhasil diperbarui.', data: updatedRecord });

  } catch (err: any) {
    console.error('Update applicant error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui data pendaftar: ' + err.message }, 500);
  }
});

// 6. ADMIN ONLY: Approve/Verify or Reject applicant status (Protected)
appRouter.patch('/:id/status', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const { status, alasan_ditolak } = await c.req.json();

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return c.json({
        success: false,
        message: 'Status tidak valid. Harus Pending, Approved, atau Rejected.'
      }, 400);
    }

    const applicant = await prisma.calonSiswa.findUnique({
      where: { id }
    });

    if (!applicant) {
      return c.json({
        success: false,
        message: 'Calon siswa tidak ditemukan.'
      }, 404);
    }

    const admin = (c as any).get('admin');
    const adminName = admin ? (admin.nama || admin.username) : 'Sistem';

    const updateData: any = { status };
    if (status === 'Approved') {
      updateData.verified_by = adminName;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
      
      // Auto-pay on verification for offline TU payment method
      if (applicant.metode_pembayaran && applicant.metode_pembayaran.toLowerCase() === 'bayar di sekolah') {
        updateData.payment_status = 'Paid';
        if (!applicant.bukti_bayar) {
          updateData.bukti_bayar = 'Paid at TU';
        }
      }
    } else if (status === 'Rejected') {
      updateData.rejected_by = adminName;
      updateData.verified_by = null;
      updateData.alasan_ditolak = alasan_ditolak || null;
    } else if (status === 'Pending') {
      updateData.verified_by = null;
      updateData.rejected_by = null;
      updateData.alasan_ditolak = null;
    }

    const updatedRecord = await prisma.calonSiswa.update({
      where: { id },
      data: updateData
    });

    await syncCandidateToSiswaAktif(updatedRecord);

    // Broadcast websocket alert to all sessions immediately!
    broadcast({
      event: 'STATUS_UPDATE',
      data: {
        id: updatedRecord.id,
        nama: updatedRecord.nama,
        status: updatedRecord.status,
        alasan_ditolak: updatedRecord.alasan_ditolak
      }
    });

    return c.json({
      success: true,
      message: `Status calon siswa berhasil diperbarui menjadi ${status}.`,
      data: updatedRecord
    });

  } catch (err) {
    console.error('Update status error:', err);
    return c.json({
      success: false,
      message: 'Gagal memperbarui status pendaftar.'
    }, 500);
  }
});

// 6. ADMIN ONLY: Delete applicant (Protected)
appRouter.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const permanent = c.req.query('permanent') === 'true';

    if (permanent) {
      // Delete corresponding active student if exists
      await prisma.siswaAktif.deleteMany({
        where: { calon_siswa_id: id }
      });

      await prisma.calonSiswa.delete({
        where: { id }
      });

      // Broadcast delete alert
      broadcast({
        event: 'APPLICANT_DELETED',
        data: { id }
      });

      return c.json({
        success: true,
        message: 'Data calon siswa berhasil dihapus secara permanen.'
      });
    } else {
      const admin = (c as any).get('admin');
      const adminName = admin ? (admin.nama || admin.username) : 'Sistem';

      const updated = await prisma.calonSiswa.update({
        where: { id },
        data: { 
          deleted_at: new Date(),
          deleted_by: adminName
        }
      });

      // Remove corresponding active student if exists
      await prisma.siswaAktif.deleteMany({
        where: { calon_siswa_id: id }
      });

      // Broadcast delete alert so client removes it from active list
      broadcast({
        event: 'APPLICANT_DELETED',
        data: { id }
      });

      return c.json({
        success: true,
        message: 'Data calon siswa berhasil dipindahkan ke tempat sampah.'
      });
    }
  } catch (err: any) {
    console.error('Delete applicant error:', err);
    return c.json({
      success: false,
      message: 'Gagal menghapus data pendaftar: ' + err.message
    }, 500);
  }
});

// 7. PUBLIC: Check candidate payment status by NISN
appRouter.get('/check-payment/:nisn', rateLimiter({
  windowMs: 60 * 1000, // 1 menit
  max: 10,             // maks 10 cek per menit
  message: 'Terlalu banyak permintaan pengecekan status. Silakan coba lagi nanti.'
}), async (c: Context) => {
  try {
    const nisn = c.req.param('nisn');
    const record = await prisma.calonSiswa.findUnique({
      where: { nisn },
      select: {
        payment_status: true
      }
    });

    if (!record) {
      return c.json({ success: false, message: 'Pendaftar tidak ditemukan.' }, 404);
    }

    return c.json({
      success: true,
      payment_status: record.payment_status || 'Unpaid',
      xendit_invoice_url: ''
    });
  } catch (err) {
    console.error('Check payment error:', err);
    return c.json({ success: false, message: 'Gagal memeriksa status pembayaran.' }, 500);
  }
});

// 8. PUBLIC: Fetch public invoice data by NISN
appRouter.get('/public-invoice/:nisn', async (c: Context) => {
  try {
    const nisn = c.req.param('nisn');
    const record = await prisma.calonSiswa.findUnique({
      where: { nisn },
      select: {
        nama: true,
        nisn: true,
        jurusan_1: true,
        payment_status: true,
        tgl_daftar: true,
        metode_pembayaran: true,
        bukti_bayar: true,
        periode: true
      }
    });

    if (!record) {
      return c.json({ success: false, message: 'Pendaftar tidak ditemukan.' }, 404);
    }

    return c.json({
      success: true,
      data: {
        nama: record.nama,
        nisn: record.nisn,
        jurusan_1: record.jurusan_1,
        payment_status: record.payment_status,
        tgl_daftar: record.tgl_daftar,
        metode_pembayaran: record.metode_pembayaran,
        bukti_bayar: record.bukti_bayar,
        periode: record.periode
      }
    });
  } catch (err) {
    console.error('Fetch public invoice error:', err);
    return c.json({ success: false, message: 'Gagal mengambil data invoice.' }, 500);
  }
});

// 9. PUBLIC: Fetch public verification details by ID (for QR Code scanning)
appRouter.get('/verify/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const record = await prisma.calonSiswa.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        nisn: true,
        sekolah_asal: true,
        jenis_kelamin: true,
        tgl_lahir: true,
        status: true,
        tgl_daftar: true,
        jurusan_1: true,
        periode: true,
        alasan_ditolak: true
      }
    });

    if (!record) {
      return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
    }

    return c.json({
      success: true,
      data: {
        id: record.id,
        nama: record.nama,
        nisn: record.nisn,
        sekolah_asal: record.sekolah_asal || '',
        jenis_kelamin: record.jenis_kelamin || '',
        tgl_lahir: record.tgl_lahir || '',
        status: record.status || '',
        tgl_daftar: record.tgl_daftar || '',
        jurusan_1: record.jurusan_1 || '',
        periode: record.periode || '2026-2027',
        alasan_ditolak: record.alasan_ditolak || ''
      }
    });
  } catch (err) {
    console.error('Fetch public verification detail error:', err);
    return c.json({ success: false, message: 'Gagal mengambil data verifikasi.' }, 500);
  }
});

export default appRouter;
