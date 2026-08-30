import { SchoolLandingClient } from "@/components/features/school-landing/components/SchoolLandingClient";
import { getCached } from "@/server/db/redis";
import { pool } from "@/server/db/client";

interface PageProps {
  params: Promise<{ school_slug: string }>;
}

export default async function SchoolLandingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const schoolSlug = resolvedParams?.school_slug || "";

  const initialConfig: Record<string, unknown> = {};

  if (schoolSlug && schoolSlug !== "demo") {
    try {
      // 1. Try Redis cache for ultra-fast response (0ms)
      const cached = await getCached<Record<string, unknown>>(`config_${schoolSlug}`);
      if (cached && typeof cached === "object") {
        Object.assign(initialConfig, cached);
      }

      // 2. Query schools metadata and school_profiles to guarantee 100% complete data on SSR
      const schoolRes = await pool.query(
        `SELECT s.id, s.name, s.slug, s.logo_url, s.status, s.address, s.phone, s.official_email, s.accreditation,
                p.nama as profile_nama, p.logo_url as profile_logo, p.alamat as profile_alamat, p.fasilitas, p.sosial_media
         FROM schools s
         LEFT JOIN school_profiles p ON p.school_id = s.id OR p.school_id = s.slug
         WHERE s.slug = $1 OR s.id::text = $1
         LIMIT 1`,
        [schoolSlug]
      );

      let schoolRow = schoolRes.rows?.[0];
      if (!schoolRow) {
        // Check prospective_schools if newly registered
        const prospRes = await pool.query(
          `SELECT id, name, slug, logo_url, status, address, phone, official_email, accreditation
           FROM prospective_schools
           WHERE slug = $1 OR id::text = $1
           LIMIT 1`,
          [schoolSlug]
        );
        schoolRow = prospRes.rows?.[0];
      }

      if (schoolRow) {
        if (!initialConfig.ppdb_title) {
          initialConfig.ppdb_title = schoolRow.profile_nama || schoolRow.name || "";
        }
        if (!initialConfig.ppdb_logo_url && (schoolRow.profile_logo || schoolRow.logo_url)) {
          initialConfig.ppdb_logo_url = schoolRow.profile_logo || schoolRow.logo_url;
        }
        if (!initialConfig.ppdb_address && (schoolRow.profile_alamat || schoolRow.address)) {
          initialConfig.ppdb_address = schoolRow.profile_alamat || schoolRow.address;
        }
        initialConfig.school_id = schoolRow.id;
        initialConfig.school_status = schoolRow.status || "FULL_VERIFIED";
      }

      // 3. Direct server pool query for landing page config
      const pgRes = await pool.query(
        `SELECT config_key, config_value FROM landing_page_config 
         WHERE school_id::text = $1 
            OR school_id::text IN (SELECT id::text FROM schools WHERE slug = $1)
            OR school_id::text IN (SELECT id::text FROM prospective_schools WHERE slug = $1)
         ORDER BY updated_at ASC`,
        [schoolSlug]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        const { safeUnwrapConfigValue } = await import("@/server/routes/config");
        pgRes.rows.forEach((r: { config_key: string; config_value: unknown }) => {
          initialConfig[r.config_key] = safeUnwrapConfigValue(r.config_value);
        });
      }
    } catch (_err) {
      // Graceful fallback to client fetching
    }
  }

  return (
    <SchoolLandingClient
      initialData={Object.keys(initialConfig).length > 0 ? initialConfig : undefined}
      serverSchoolSlug={schoolSlug}
    />
  );
}
