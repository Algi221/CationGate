import { getSupabaseClient } from "../../db/supabase";

export class ApplicantSyncService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async syncCandidateToSiswaAktif(candidate: any): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const schoolId = candidate.school_id;

      if (!schoolId) {
        console.warn("Sync ignored: Candidate missing school_id", candidate.id);
        return;
      }

      const cls = String(candidate.diterima_kelas || candidate.diterimaKelas || "").trim();
      const hasAssignedClass = Boolean(
        cls &&
        cls !== "-" &&
        cls !== "X" &&
        cls !== "XI" &&
        cls !== "XII" &&
        cls !== "X (Sepuluh)" &&
        cls !== "XI (Sebelas)" &&
        cls !== "XII (Dua Belas)" &&
        !cls.toLowerCase().includes("belum") &&
        !cls.toLowerCase().includes("atur")
      );

      const isApproved = candidate.status === "Approved" || candidate.status === "Terverifikasi";

      if (isApproved && hasAssignedClass) {
        const {
          id: calon_siswa_id,
          nama,
          nisn,
          nik,
          tempat_lahir,
          tgl_lahir,
          jenis_kelamin,
          agama,
          kewarganegaraan,
          alamat,
          rt_rw,
          kelurahan,
          kecamatan,
          kode_pos,
          whatsapp,
          email,
          tinggal_dengan,
          transportasi,
          tinggi_badan,
          berat_badan,
          jarak_sekolah,
          jarak_km,
          waktu_jam,
          waktu_menit,
          jumlah_saudara,
          golongan_darah,
          penyakit_diderita,
          kebutuhan_khusus,
          punya_kps,
          no_kps,
          punya_kip,
          no_kip,
          jenis_prestasi,
          tingkat_prestasi,
          uraian_prestasi,
          tahun_prestasi,
          penyelenggara,
          jenis_beasiswa,
          uraian_beasiswa,
          tahun_mulai_beasiswa,
          tahun_selesai_beasiswa,
          nama_ayah,
          tempat_lahir_ayah,
          tgl_lahir_ayah,
          agama_ayah,
          kewarganegaraan_ayah,
          pendidikan_ayah,
          pekerjaan_ayah,
          penghasilan_ayah,
          alamat_ayah,
          rtrw_ayah,
          kelurahan_ayah,
          kecamatan_ayah,
          kode_pos_ayah,
          status_ayah,
          nama_ibu,
          tempat_lahir_ibu,
          tgl_lahir_ibu,
          agama_ibu,
          kewarganegaraan_ibu,
          pendidikan_ibu,
          pekerjaan_ibu,
          penghasilan_ibu,
          alamat_ibu,
          rtrw_ibu,
          kelurahan_ibu,
          kecamatan_ibu,
          kode_pos_ibu,
          status_ibu,
          nama_wali,
          tempat_lahir_wali,
          tgl_lahir_wali,
          agama_wali,
          kewarganegaraan_wali,
          pendidikan_wali,
          pekerjaan_wali,
          penghasilan_wali,
          alamat_wali,
          rtrw_wali,
          kelurahan_wali,
          kecamatan_wali,
          kode_pos_wali,
          status_wali,
          telepon_ortu,
          sekolah_asal,
          tgl_lulus,
          no_ijazah,
          no_skhun,
          no_peserta_un,
          lama_belajar,
          pindahan_dari,
          alasan_pindah,
          diterima_kelas,
          diterima_tanggal,
          jurusan_1,
          alasan_memilih,
          hobi,
          cita_cita,
          nilai_us_teori,
          nilai_us_praktik,
          nilai_muatan_lokal,
          cita_cita_setelah_lulus,
          pelajaran_disenangi,
          alasan_disenangi,
          kesulitan_belajar,
          perkelahian,
          ket_perkelahian,
          narkoba,
          ket_narkoba,
          pelanggaran_lain,
          ket_pelanggaran_lain,
          janji_taat,
          janji_sanksi,
          janji_akrab,
          janji_belajar,
          janji_nama_baik,
          periode,
          gelombang,
          registration_no
        } = candidate;

        if (nisn) {
          const { data: existingByNisn } = await supabase
            .from("active_students")
            .select("id, calon_siswa_id")
            .eq("nisn", nisn)
            .eq("school_id", schoolId)
            .maybeSingle();
          if (existingByNisn && existingByNisn.calon_siswa_id !== calon_siswa_id) {
            await supabase
              .from("active_students")
              .delete()
              .eq("id", existingByNisn.id)
              .eq("school_id", schoolId);
          }
        }

        if (nik) {
          const { data: existingByNik } = await supabase
            .from("active_students")
            .select("id, calon_siswa_id")
            .eq("nik", nik)
            .eq("school_id", schoolId)
            .maybeSingle();
          if (existingByNik && existingByNik.calon_siswa_id !== calon_siswa_id) {
            await supabase
              .from("active_students")
              .delete()
              .eq("id", existingByNik.id)
              .eq("school_id", schoolId);
          }
        }

        const payload = {
          school_id: schoolId,
          calon_siswa_id,
          nama,
          nisn,
          nik,
          tempat_lahir,
          tgl_lahir,
          jenis_kelamin,
          agama,
          kewarganegaraan,
          alamat,
          rt_rw,
          kelurahan,
          kecamatan,
          kode_pos,
          whatsapp,
          email,
          tinggal_dengan,
          transportasi,
          tinggi_badan,
          berat_badan,
          jarak_sekolah,
          jarak_km,
          waktu_jam,
          waktu_menit,
          jumlah_saudara,
          golongan_darah,
          penyakit_diderita,
          kebutuhan_khusus: kebutuhan_khusus ?? undefined,
          punya_kps,
          no_kps,
          punya_kip,
          no_kip,
          jenis_prestasi: jenis_prestasi ?? undefined,
          tingkat_prestasi: tingkat_prestasi ?? undefined,
          uraian_prestasi,
          tahun_prestasi,
          penyelenggara,
          jenis_beasiswa: jenis_beasiswa ?? undefined,
          uraian_beasiswa,
          tahun_mulai_beasiswa,
          tahun_selesai_beasiswa,
          nama_ayah,
          tempat_lahir_ayah,
          tgl_lahir_ayah,
          agama_ayah,
          kewarganegaraan_ayah,
          pendidikan_ayah,
          pekerjaan_ayah,
          penghasilan_ayah,
          alamat_ayah,
          rtrw_ayah,
          kelurahan_ayah,
          kecamatan_ayah,
          kode_pos_ayah,
          status_ayah,
          nama_ibu,
          tempat_lahir_ibu,
          tgl_lahir_ibu,
          agama_ibu,
          kewarganegaraan_ibu,
          pendidikan_ibu,
          pekerjaan_ibu,
          penghasilan_ibu,
          alamat_ibu,
          rtrw_ibu,
          kelurahan_ibu,
          kecamatan_ibu,
          kode_pos_ibu,
          status_ibu,
          nama_wali,
          tempat_lahir_wali,
          tgl_lahir_wali,
          agama_wali,
          kewarganegaraan_wali,
          pendidikan_wali,
          pekerjaan_wali,
          penghasilan_wali,
          alamat_wali,
          rtrw_wali,
          kelurahan_wali,
          kecamatan_wali,
          kode_pos_wali,
          status_wali,
          telepon_ortu,
          sekolah_asal,
          tgl_lulus,
          no_ijazah,
          no_skhun,
          no_peserta_un,
          lama_belajar,
          pindahan_dari,
          alasan_pindah,
          diterima_kelas,
          diterima_tanggal,
          jurusan: jurusan_1,
          alasan_memilih,
          hobi: hobi ?? undefined,
          cita_cita,
          nilai_us_teori,
          nilai_us_praktik,
          nilai_muatan_lokal,
          cita_cita_setelah_lulus,
          pelajaran_disenangi,
          alasan_disenangi,
          kesulitan_belajar,
          perkelahian,
          ket_perkelahian,
          narkoba,
          ket_narkoba,
          pelanggaran_lain,
          ket_pelanggaran_lain,
          janji_taat,
          janji_sanksi,
          janji_akrab,
          janji_belajar,
          janji_nama_baik,
          periode,
          gelombang,
          registration_no
        };

        const { data: existingSiswa } = await supabase
          .from("active_students")
          .select("id")
          .eq("calon_siswa_id", calon_siswa_id)
          .eq("school_id", schoolId)
          .maybeSingle();

        if (existingSiswa) {
          await supabase
            .from("active_students")
            .update(payload)
            .eq("id", existingSiswa.id)
            .eq("school_id", schoolId);
        } else {
          await supabase.from("active_students").insert(payload);
        }
      } else {
        // If not approved or class has not been assigned, delete from active_students
        await supabase
          .from("active_students")
          .delete()
          .eq("calon_siswa_id", candidate.id)
          .eq("school_id", schoolId);
      }
    } catch (err) {
      console.error("Error syncing candidate to SiswaAktif:", err);
    }
  }

  static async syncAllExistingApprovedApplicants(): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { data: approvedCandidates } = await supabase
        .from("student_applicants")
        .select("*")
        .eq("status", "Approved");

      if (approvedCandidates) {
        console.log(
          `[Startup-Sync] Ditemukan ${approvedCandidates.length} calon siswa berstatus Approved. Mensinkronkan ke SiswaAktif...`
        );
        for (const candidate of approvedCandidates) {
          await ApplicantSyncService.syncCandidateToSiswaAktif(candidate);
        }
        console.log(`[Startup-Sync] Sinkronisasi selesai.`);
      }
    } catch (err: unknown) {
      console.error(
        "Error syncing existing approved candidates to SiswaAktif:",
        (err as Error)?.message || String(err)
      );
    }
  }

  static async checkAndDisqualifyExpiredApplicants(): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const batasWaktu = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: expiredApplicants } = await supabase
        .from("student_applicants")
        .select("*")
        .eq("status", "Pending")
        .lt("tgl_daftar", batasWaktu)
        .is("deleted_at", null);

      if (expiredApplicants && expiredApplicants.length > 0) {
        console.log(`[Auto-Gugur] Ditemukan ${expiredApplicants.length} pendaftar expired. Memproses...`);

        for (const applicant of expiredApplicants) {
          await supabase
            .from("student_applicants")
            .update({ status: "Rejected" })
            .eq("id", applicant.id);
        }
      }
    } catch (err: unknown) {
      console.error(
        "Error saat menjalankan penjadwal auto-gugur:",
        (err as Error)?.message || String(err)
      );
    }
  }
}
