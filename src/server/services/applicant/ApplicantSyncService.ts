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
        const calon_siswa_id = candidate.id;
        const {
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
          punya_kps,
          no_kps,
          punya_kip,
          no_kip,
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
          status_wali,
          telepon_ortu,
          sekolah_asal,
          tgl_lulus,
          diterima_tanggal,
          jurusan_1,
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

        const sanitizeStr = (val: unknown, fallback = "-"): string => {
          if (val === null || val === undefined) return fallback;
          const s = String(val).trim();
          return s.length > 0 ? s : fallback;
        };

        const nipdVal = candidate.nipd && String(candidate.nipd).trim() !== '-' && String(candidate.nipd).trim().length > 0
          ? String(candidate.nipd).trim()
          : null;

        const payload = {
          school_id: schoolId,
          calon_siswa_id,
          nama: sanitizeStr(nama, 'Siswa'),
          nisn: sanitizeStr(nisn),
          nik: sanitizeStr(nik),
          nipd: nipdVal,
          tempat_lahir: sanitizeStr(tempat_lahir),
          tgl_lahir: tgl_lahir || '2008-01-01',
          jenis_kelamin: jenis_kelamin || 'L',
          agama: sanitizeStr(agama, 'Islam'),
          kewarganegaraan: sanitizeStr(kewarganegaraan, 'WNI'),
          alamat: sanitizeStr(alamat),
          rt_rw: sanitizeStr(rt_rw, '00/00'),
          kelurahan: sanitizeStr(kelurahan),
          kecamatan: sanitizeStr(kecamatan),
          kode_pos: sanitizeStr(kode_pos),
          whatsapp: sanitizeStr(whatsapp),
          email: sanitizeStr(email),
          tinggal_dengan: sanitizeStr(tinggal_dengan),
          transportasi: sanitizeStr(transportasi),
          tinggi_badan: Number(tinggi_badan) || 0,
          berat_badan: Number(berat_badan) || 0,
          jarak_sekolah: sanitizeStr(jarak_sekolah),
          jarak_km: Number(jarak_km) || 0,
          waktu_jam: Number(waktu_jam) || 0,
          waktu_menit: Number(waktu_menit) || 0,
          jumlah_saudara: Number(jumlah_saudara) || 0,
          golongan_darah: sanitizeStr(golongan_darah),
          penyakit_diderita: sanitizeStr(penyakit_diderita),
          punya_kps: sanitizeStr(punya_kps, 'Tidak'),
          no_kps: sanitizeStr(no_kps),
          punya_kip: sanitizeStr(punya_kip, 'Tidak'),
          no_kip: sanitizeStr(no_kip),
          nama_ayah: sanitizeStr(nama_ayah),
          tempat_lahir_ayah: sanitizeStr(tempat_lahir_ayah),
          tgl_lahir_ayah: tgl_lahir_ayah || null,
          agama_ayah: sanitizeStr(agama_ayah),
          kewarganegaraan_ayah: sanitizeStr(kewarganegaraan_ayah, 'WNI'),
          pendidikan_ayah: sanitizeStr(pendidikan_ayah),
          pekerjaan_ayah: sanitizeStr(pekerjaan_ayah),
          penghasilan_ayah: sanitizeStr(penghasilan_ayah),
          alamat_ayah: sanitizeStr(alamat_ayah),
          rtrw_ayah: sanitizeStr(rtrw_ayah, '00/00'),
          kelurahan_ayah: sanitizeStr(kelurahan_ayah),
          kecamatan_ayah: sanitizeStr(kecamatan_ayah),
          kode_pos_ayah: sanitizeStr(kode_pos_ayah),
          status_ayah: sanitizeStr(status_ayah, 'Masih Hidup'),
          nama_ibu: sanitizeStr(nama_ibu),
          tempat_lahir_ibu: sanitizeStr(tempat_lahir_ibu),
          tgl_lahir_ibu: tgl_lahir_ibu || null,
          agama_ibu: sanitizeStr(agama_ibu),
          kewarganegaraan_ibu: sanitizeStr(kewarganegaraan_ibu, 'WNI'),
          pendidikan_ibu: sanitizeStr(pendidikan_ibu),
          pekerjaan_ibu: sanitizeStr(pekerjaan_ibu),
          penghasilan_ibu: sanitizeStr(penghasilan_ibu),
          alamat_ibu: sanitizeStr(alamat_ibu),
          rtrw_ibu: sanitizeStr(rtrw_ibu, '00/00'),
          kelurahan_ibu: sanitizeStr(kelurahan_ibu),
          kecamatan_ibu: sanitizeStr(kecamatan_ibu),
          kode_pos_ibu: sanitizeStr(kode_pos_ibu),
          status_ibu: sanitizeStr(status_ibu, 'Masih Hidup'),
          nama_wali: sanitizeStr(nama_wali),
          status_wali: sanitizeStr(status_wali, 'Masih Hidup'),
          telepon_ortu: sanitizeStr(telepon_ortu || whatsapp),
          sekolah_asal: sanitizeStr(sekolah_asal),
          tgl_lulus: tgl_lulus || '2026-06-30',
          diterima_kelas: cls,
          diterima_tanggal: diterima_tanggal || new Date().toISOString().split('T')[0],
          jurusan: jurusan_1 || 'Umum',
          periode: periode || '2026-2027',
          gelombang: gelombang || 'Gelombang 1',
          registration_no: sanitizeStr(registration_no)
        };

        const { data: existingSiswa } = await supabase
          .from("active_students")
          .select("id")
          .eq("school_id", schoolId)
          .or(`calon_siswa_id.eq.${calon_siswa_id}${nisn ? `,nisn.eq.${nisn}` : ''}`)
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
