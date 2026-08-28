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
          `SELECT id, name, logo_url FROM schools WHERE slug = $1 LIMIT 1`,
          [schoolSlug]
        );
        let schoolUUID = "";
        if (schoolRes.rows && schoolRes.rows.length > 0) {
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
          initialProfile = profileRes.rows[0];
          schoolName = (initialProfile.nama as string) || schoolName;
        } else if (schoolName) {
          initialProfile = { nama: schoolName };
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