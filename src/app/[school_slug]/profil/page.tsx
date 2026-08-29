import { SchoolProfileClient } from "@/components/features/school-profile/components/SchoolProfileClient";
import { getCached } from "@/server/db/redis";
import { pool } from "@/server/db/client";

interface PageProps {
  params: Promise<{ school_slug: string }>;
}

export default async function ProfilSekolahPublicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const schoolSlug = resolvedParams?.school_slug || "";

  let initialProfile: Record<string, unknown> = {};
  let schoolName = "";

  if (schoolSlug && schoolSlug !== "demo") {
    try {
      // 1. Try Redis cache for 0ms ultra-fast hydration
      const cached = await getCached<Record<string, unknown>>(`school_profile_${schoolSlug}`);
      if (cached && typeof cached === "object" && Object.keys(cached).length > 0) {
        initialProfile = cached;
        const identitasObj = cached.identitas as Record<string, unknown> | undefined;
        schoolName = ((cached.nama as string) || (identitasObj?.nama as string) || "");
      } else {
        // 2. Resolve school from schools table
        const schoolRes = await pool.query(
          `SELECT id, name, logo_url, address, phone, official_email, accreditation, npsn FROM schools WHERE slug = $1 LIMIT 1`,
          [schoolSlug]
        );
        let schoolUUID = "";
        let saasSchool: Record<string, unknown> | null = null;
        if (schoolRes.rows && schoolRes.rows.length > 0) {
          saasSchool = schoolRes.rows[0];
          schoolUUID = schoolRes.rows[0].id;
          schoolName = schoolRes.rows[0].name || "";
        }

        // 3. Query direct from PostgreSQL with UUID or Slug
        const profileRes = await pool.query(
          `SELECT * FROM school_profiles 
           WHERE school_id = $1 OR school_id = $2 
           ORDER BY updated_at DESC LIMIT 1`,
          [schoolUUID || schoolSlug, schoolSlug]
        );

        if (profileRes.rows && profileRes.rows.length > 0) {
          const raw = profileRes.rows[0];
          let pimpinanObj = raw.pimpinan;
          if (typeof pimpinanObj === "string" && (pimpinanObj.startsWith("{") || pimpinanObj.startsWith("["))) {
            try { pimpinanObj = JSON.parse(pimpinanObj); } catch (_e) {}
          }
          let fasilitasObj = raw.fasilitas;
          if (typeof fasilitasObj === "string" && (fasilitasObj.startsWith("[") || fasilitasObj.startsWith("{"))) {
            try { fasilitasObj = JSON.parse(fasilitasObj); } catch (_e) {}
          }
          let sosmedObj = raw.sosial_media;
          if (typeof sosmedObj === "string" && (sosmedObj.startsWith("{") || sosmedObj.startsWith("["))) {
            try { sosmedObj = JSON.parse(sosmedObj); } catch (_e) {}
          }

          initialProfile = {
            ...raw,
            pimpinan: pimpinanObj,
            fasilitas: fasilitasObj,
            sosial_media: sosmedObj,
            identitas: {
              nama: raw.nama || schoolName || '',
              npsn: raw.npsn || (saasSchool?.npsn as string) || '',
              akreditasi: raw.akreditasi || (saasSchool?.accreditation as string) || '',
              status: raw.status || 'Swasta',
              kurikulum: raw.kurikulum || 'Kurikulum Merdeka',
              tahun_berdiri: raw.tahun_berdiri || '',
              nis: raw.nis || '',
              nss: raw.nss || '',
              alamat: raw.alamat || (saasSchool?.address as string) || '',
              telepon: raw.telepon || (saasSchool?.phone as string) || '',
              email: raw.email || (saasSchool?.official_email as string) || ''
            },
            visi_misi: {
              visi: raw.visi || '',
              misi: raw.misi || ''
            }
          };
          schoolName = (raw.nama as string) || schoolName;
        } else if (schoolName || saasSchool) {
          initialProfile = {
            nama: schoolName,
            identitas: {
              nama: schoolName,
              npsn: (saasSchool?.npsn as string) || '',
              akreditasi: (saasSchool?.accreditation as string) || '',
              alamat: (saasSchool?.address as string) || '',
              telepon: (saasSchool?.phone as string) || '',
              email: (saasSchool?.official_email as string) || ''
            }
          };
        }

        if (Object.keys(initialProfile).length > 0) {
          const { setCached } = await import("@/server/db/redis");
          await setCached(`school_profile_${schoolSlug}`, initialProfile, 3600);
        }
      }
    } catch (_err) {
      // Fallback to client fetching
    }
  }

  return (
    <SchoolProfileClient
      initialProfile={Object.keys(initialProfile).length > 0 ? initialProfile : undefined}
      serverSchoolSlug={schoolSlug}
      initialSchoolName={schoolName}
    />
  );
}