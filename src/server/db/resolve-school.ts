import { getSupabaseClient } from './supabase';
import { pool } from './client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

export async function resolveSchoolUUID(
  schoolIdOrSlug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inMemSchools?: Map<string, any>
): Promise<string | null> {
  if (!schoolIdOrSlug) return null;

  const strVal = String(schoolIdOrSlug).trim();

  // 1. Direct valid UUID check
  if (isValidUUID(strVal)) {
    return strVal;
  }

  // 2. Check in-memory map
  if (inMemSchools) {
    const directMem = inMemSchools.get(strVal);
    if (directMem) {
      if (directMem.school_uuid && isValidUUID(String(directMem.school_uuid))) {
        return String(directMem.school_uuid);
      }
      if (directMem.id) return String(directMem.id);
    }
    for (const [slug, school] of inMemSchools) {
      if (
        String(school.id) === strVal ||
        String(school.school_uuid) === strVal ||
        slug === strVal ||
        school.slug === strVal ||
        school.official_email?.toLowerCase() === strVal.toLowerCase() ||
        school.email?.toLowerCase() === strVal.toLowerCase()
      ) {
        if (school.school_uuid && isValidUUID(String(school.school_uuid))) {
          return String(school.school_uuid);
        }
        if (school.id) return String(school.id);
      }
    }
  }

  const supabase = getSupabaseClient();
  const isNumeric = !isNaN(Number(strVal)) && Number(strVal) > 0;

  // 3. Check 'schools' table in Supabase
  try {
    if (isNumeric) {
      const { data } = await supabase.from('schools').select('id, slug').eq('id', Number(strVal)).maybeSingle();
      if (data?.id) return String(data.id);
    }
    const { data: slugData } = await supabase.from('schools').select('id, slug').eq('slug', strVal).maybeSingle();
    if (slugData?.id) return String(slugData.id);
  } catch (_sbErr) {}

  // 4. Check 'prospective_schools' table in Supabase
  try {
    if (isNumeric) {
      const { data } = await supabase.from('prospective_schools').select('id, slug').eq('id', Number(strVal)).maybeSingle();
      if (data?.id) return String(data.id);
    }
    const { data: slugData } = await supabase.from('prospective_schools').select('id, slug').eq('slug', strVal).maybeSingle();
    if (slugData?.id) return String(slugData.id);
  } catch (_sbErr) {}

  // 5. Direct Postgres pool check
  try {
    const pgRes = await pool.query(
      `SELECT id::text FROM schools WHERE slug = $1 OR (CASE WHEN $2 = true THEN id = $3::integer ELSE false END) OR LOWER(official_email) = LOWER($1)
       UNION ALL
       SELECT id::text FROM prospective_schools WHERE slug = $1 OR (CASE WHEN $2 = true THEN id = $3::integer ELSE false END) OR LOWER(official_email) = LOWER($1)
       LIMIT 1`,
      [strVal, isNumeric, isNumeric ? Number(strVal) : 0]
    );
    if (pgRes.rows && pgRes.rows.length > 0 && pgRes.rows[0].id) {
      return String(pgRes.rows[0].id);
    }
  } catch (_pgErr) {}

  // Fallback for demo
  if (strVal === 'demo') {
    return 'demo';
  }

  return strVal || null;
}

export async function resolveSchoolSlug(
  schoolIdentifier?: string | number | null,
  userEmailOrUsername?: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inMemSchools?: Map<string, any>
): Promise<string | null> {
  const cleanId = schoolIdentifier ? String(schoolIdentifier).trim() : '';
  const cleanEmail = userEmailOrUsername ? String(userEmailOrUsername).trim().toLowerCase() : '';

  // 1. Check in-memory map
  if (inMemSchools) {
    if (cleanId) {
      const direct = inMemSchools.get(cleanId);
      if (direct?.slug) return direct.slug;
    }
    for (const [slug, school] of inMemSchools) {
      if (
        (cleanId && (String(school.id) === cleanId || String(school.school_uuid) === cleanId || slug === cleanId || school.slug === cleanId)) ||
        (cleanEmail && (school.official_email?.toLowerCase() === cleanEmail || school.email?.toLowerCase() === cleanEmail || school.admin_name?.toLowerCase() === cleanEmail))
      ) {
        return school.slug || slug;
      }
    }
  }

  const supabase = getSupabaseClient();
  const isNumeric = cleanId && !isNaN(Number(cleanId)) && Number(cleanId) > 0;

  // 2. Query Supabase 'schools'
  try {
    if (cleanId) {
      if (isNumeric) {
        const { data } = await supabase.from('schools').select('slug').eq('id', Number(cleanId)).maybeSingle();
        if (data?.slug) return data.slug;
      } else if (isValidUUID(cleanId)) {
        const { data } = await supabase.from('schools').select('slug').eq('id', cleanId).maybeSingle();
        if (data?.slug) return data.slug;
      }
      const { data: slugMatch } = await supabase.from('schools').select('slug').eq('slug', cleanId).maybeSingle();
      if (slugMatch?.slug) return slugMatch.slug;
    }
    if (cleanEmail) {
      const { data: emailMatch } = await supabase.from('schools').select('slug').ilike('official_email', cleanEmail).maybeSingle();
      if (emailMatch?.slug) return emailMatch.slug;
    }
  } catch (_e) {}

  // 3. Query Supabase 'prospective_schools'
  try {
    if (cleanId) {
      if (isNumeric) {
        const { data } = await supabase.from('prospective_schools').select('slug').eq('id', Number(cleanId)).maybeSingle();
        if (data?.slug) return data.slug;
      }
      const { data: slugMatch } = await supabase.from('prospective_schools').select('slug').eq('slug', cleanId).maybeSingle();
      if (slugMatch?.slug) return slugMatch.slug;
    }
    if (cleanEmail) {
      const { data: emailMatch } = await supabase.from('prospective_schools').select('slug').ilike('official_email', cleanEmail).maybeSingle();
      if (emailMatch?.slug) return emailMatch.slug;
    }
  } catch (_e) {}

  // 4. Query PostgreSQL direct pool
  try {
    const pgRes = await pool.query(
      `SELECT slug FROM schools 
       WHERE ($1 <> '' AND slug = $1)
          OR ($2 = true AND id = $3::integer)
          OR ($4 <> '' AND LOWER(official_email) = $4)
       UNION ALL
       SELECT slug FROM prospective_schools 
       WHERE ($1 <> '' AND slug = $1)
          OR ($2 = true AND id = $3::integer)
          OR ($4 <> '' AND LOWER(official_email) = $4)
       LIMIT 1`,
      [cleanId, isNumeric, isNumeric ? Number(cleanId) : 0, cleanEmail]
    );
    if (pgRes.rows && pgRes.rows.length > 0 && pgRes.rows[0].slug) {
      return pgRes.rows[0].slug;
    }
  } catch (_pgErr) {}

  return null;
}

export async function resolveAllSchoolIdentifiers(
  schoolIdentifier?: string | number | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inMemSchools?: Map<string, any>
): Promise<string[]> {
  if (!schoolIdentifier) return [];
  const strVal = String(schoolIdentifier).trim();
  if (!strVal) return [];

  const ids = new Set<string>([strVal]);
  const isNumeric = !isNaN(Number(strVal)) && Number(strVal) > 0;

  // 1. In-memory check
  if (inMemSchools) {
    for (const [slug, school] of inMemSchools) {
      if (
        slug === strVal ||
        String(school.id) === strVal ||
        String(school.school_uuid) === strVal ||
        school.slug === strVal
      ) {
        if (slug) ids.add(slug);
        if (school.slug) ids.add(school.slug);
        if (school.id) ids.add(String(school.id));
        if (school.school_uuid) ids.add(String(school.school_uuid));
      }
    }
  }

  // 2. Direct Postgres pool check across schools & prospective_schools
  try {
    const pgRes = await pool.query(
      `SELECT id::text, slug FROM schools 
       WHERE slug = $1 OR (CASE WHEN $2 = true THEN id = $3::integer ELSE false END)
       UNION ALL
       SELECT id::text, slug FROM prospective_schools 
       WHERE slug = $1 OR (CASE WHEN $2 = true THEN id = $3::integer ELSE false END)`,
      [strVal, isNumeric, isNumeric ? Number(strVal) : 0]
    );
    if (pgRes.rows && Array.isArray(pgRes.rows)) {
      pgRes.rows.forEach((r) => {
        if (r.id) ids.add(String(r.id));
        if (r.slug) ids.add(String(r.slug));
      });
    }
  } catch (_pgErr) {}

  // 3. Supabase fallback
  const supabase = getSupabaseClient();
  try {
    const { data: sData } = await supabase
      .from('schools')
      .select('id, slug')
      .or(`slug.eq.${strVal}${isNumeric ? `,id.eq.${Number(strVal)}` : ''}`);
    if (sData && Array.isArray(sData)) {
      sData.forEach((s) => {
        if (s.id) ids.add(String(s.id));
        if (s.slug) ids.add(String(s.slug));
      });
    }
  } catch (_sbErr) {}

  try {
    const { data: psData } = await supabase
      .from('prospective_schools')
      .select('id, slug')
      .or(`slug.eq.${strVal}${isNumeric ? `,id.eq.${Number(strVal)}` : ''}`);
    if (psData && Array.isArray(psData)) {
      psData.forEach((ps) => {
        if (ps.id) ids.add(String(ps.id));
        if (ps.slug) ids.add(String(ps.slug));
      });
    }
  } catch (_sbErr2) {}

  return Array.from(ids);
}
