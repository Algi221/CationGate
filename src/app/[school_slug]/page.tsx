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
      } else {
        // 2. Direct server pool query for instant SSR
        const pgRes = await pool.query(
          `SELECT config_key, config_value FROM landing_page_config 
           WHERE school_id::text = $1 
              OR school_id::text IN (SELECT id::text FROM schools WHERE slug = $1)`,
          [schoolSlug]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          pgRes.rows.forEach((r: { config_key: string; config_value: unknown }) => {
            let val = r.config_value;
            if (typeof val === "string" && (val.startsWith("{") || val.startsWith("["))) {
              try { val = JSON.parse(val); } catch (_) {}
            }
            initialConfig[r.config_key] = val;
          });
        }
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
