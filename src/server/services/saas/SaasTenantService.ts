import { getSupabaseClient } from '../../db/supabase';
import { pool } from '../../db/client';
import { redis } from '../../../utils/redis';
import { fontInMemSchools, checkThreeDayTakedown } from './SaasTypes';

export class SaasTenantService {
  static async getSchoolBySlug(slug: string) {
    const cleanSlug = (slug || '').trim().toLowerCase();
    if (!cleanSlug) {
      return {
        success: false,
        notFound: true,
        message: 'Slug atau identifier sekolah tidak boleh kosong.'
      };
    }

    try {
      const cached = await redis.get(`school:${cleanSlug}`);
      if (cached) return { success: true, data: cached };
    } catch (redisErr) {
      console.warn('Redis cache read error:', redisErr);
    }

    // 1. Direct PG pool check first (Direct Supabase PostgreSQL connection)
    try {
      const pgRes = await pool.query(
        `SELECT * FROM schools WHERE LOWER(slug) = $1 OR id::text = $1 LIMIT 1`,
        [cleanSlug]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        const verifiedData = pgRes.rows[0];
        try {
          await redis.setex(`school:${cleanSlug}`, 300, verifiedData);
        } catch (_e) {}
        return { success: true, data: verifiedData };
      }
    } catch (pgErr) {
      console.warn('PG pool query error in getSchoolBySlug (schools):', pgErr);
    }

    // 2. Direct PG pool check for prospective_schools
    try {
      const pgProspRes = await pool.query(
        `SELECT * FROM prospective_schools WHERE LOWER(slug) = $1 OR id::text = $1 LIMIT 1`,
        [cleanSlug]
      );
      if (pgProspRes.rows && pgProspRes.rows.length > 0) {
        const candidateData = pgProspRes.rows[0];
        checkThreeDayTakedown(candidateData);
        const memSchool = fontInMemSchools.get(cleanSlug);
        if (memSchool && memSchool.school_uuid) {
          candidateData.school_uuid = memSchool.school_uuid;
        }
        try {
          await redis.setex(`school:${cleanSlug}`, 300, candidateData);
        } catch (_e) {}
        return { success: true, data: candidateData };
      }
    } catch (pgProspErr) {
      console.warn('PG pool prospective_schools query error:', pgProspErr);
    }

    // 3. Fallback to Supabase JS client
    try {
      const supabase = getSupabaseClient();

      // Check verified 'schools' table
      const { data: verifiedData } = await supabase
        .from('schools')
        .select('*')
        .ilike('slug', cleanSlug)
        .maybeSingle();

      if (verifiedData) {
        try {
          await redis.setex(`school:${cleanSlug}`, 300, verifiedData);
        } catch (_e) {}
        return { success: true, data: verifiedData };
      }

      // Check candidate 'prospective_schools' table
      const { data: psData } = await supabase
        .from('prospective_schools')
        .select('*')
        .ilike('slug', cleanSlug)
        .maybeSingle();

      if (psData) {
        checkThreeDayTakedown(psData);
        const memSchool = fontInMemSchools.get(cleanSlug);
        if (memSchool && memSchool.school_uuid) {
          psData.school_uuid = memSchool.school_uuid;
        }
        try {
          await redis.setex(`school:${cleanSlug}`, 300, psData);
        } catch (_e) {}
        return { success: true, data: psData };
      }

      // Check legacy 'calon_sekolah' table
      const { data: csData } = await supabase
        .from('calon_sekolah')
        .select('*')
        .ilike('slug', cleanSlug)
        .maybeSingle();

      if (csData) {
        checkThreeDayTakedown(csData);
        return { success: true, data: csData };
      }
    } catch (sbErr) {
      console.warn('Supabase client getSchoolBySlug error:', sbErr);
    }

    // 4. Check in-memory fallback map
    const localSchool = fontInMemSchools.get(cleanSlug);
    if (localSchool) {
      checkThreeDayTakedown(localSchool);
      return { success: true, data: { ...localSchool } };
    }

    // 5. Default Seed Fallback ONLY for smktarunabhakti or demo
    if (cleanSlug === 'smktarunabhakti' || cleanSlug === 'demo') {
      return {
        success: true,
        data: {
          id: 1,
          name: cleanSlug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : 'SMK Demo Indonesia',
          slug: cleanSlug,
          status: 'FULL_VERIFIED',
          is_verified: true,
          logo_url: '/assets/logo_sekolah/logo_smktb.png'
        }
      };
    }

    return {
      success: false,
      notFound: true,
      message: `Sekolah atau URL '${slug}' belum terdaftar di CationGate.`
    };
  }

  static async checkEmailAvailability(email: string) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return { available: false, exists: false };

    let isTaken = false;

    // 1. Direct PG pool check
    try {
      const pgRes = await pool.query(
        `SELECT 1 FROM (
           SELECT email FROM schools WHERE LOWER(email) = $1
           UNION ALL
           SELECT official_email AS email FROM prospective_schools WHERE LOWER(official_email) = $1
           UNION ALL
           SELECT email FROM admin_users WHERE LOWER(email) = $1 OR LOWER(username) = $1
         ) t LIMIT 1`,
        [cleanEmail]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        isTaken = true;
      }
    } catch (_pgErr) {}

    // 2. Supabase checks
    if (!isTaken) {
      try {
        const supabase = getSupabaseClient();
        const { data: schoolMatch } = await supabase
          .from('schools')
          .select('id')
          .ilike('email', cleanEmail)
          .maybeSingle();

        const { data: candidateMatch } = await supabase
          .from('prospective_schools')
          .select('id')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        const { data: adminMatch } = await supabase
          .from('admin_users')
          .select('id')
          .ilike('email', cleanEmail)
          .maybeSingle();

        const { data: adminUserMatch } = await supabase
          .from('admin_users')
          .select('id')
          .ilike('username', cleanEmail)
          .maybeSingle();

        if (schoolMatch || candidateMatch || adminMatch || adminUserMatch) {
          isTaken = true;
        }
      } catch (_sbErr) {}
    }

    // 3. In-memory registered schools map check
    if (!isTaken) {
      for (const val of fontInMemSchools.values()) {
        const valObj = val as { email?: string; official_email?: string };
        if (valObj.email?.toLowerCase() === cleanEmail || valObj.official_email?.toLowerCase() === cleanEmail) {
          isTaken = true;
          break;
        }
      }
    }

    return { available: !isTaken, exists: isTaken };
  }

  static async checkSlugAvailability(slug: string) {
    const cleanSlug = String(slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');

    if (!cleanSlug || cleanSlug.length < 3) {
      return { available: false, exists: false, message: 'Subdomain minimal 3 karakter alfanumerik.' };
    }

    const reservedSlugs = [
      'admin', 'api', 'app', 'auth', 'dashboard', 'demo', 'gatekeeper',
      'login', 'register', 'root', 'superadmin', 'system', 'www', 'mail',
      'static', 'assets', 'cationgate'
    ];
    if (reservedSlugs.includes(cleanSlug)) {
      return { available: false, exists: true, message: 'Subdomain ini dicadangkan oleh sistem.' };
    }

    let isTaken = false;

    // 1. PostgreSQL direct check
    try {
      const pgRes = await pool.query(
        `SELECT id FROM schools WHERE LOWER(slug) = $1
         UNION
         SELECT id FROM prospective_schools WHERE LOWER(slug) = $1
         LIMIT 1`,
        [cleanSlug]
      );
      if (pgRes.rows && pgRes.rows.length > 0) {
        isTaken = true;
      }
    } catch (_pgErr) {}

    // 2. Supabase checks
    if (!isTaken) {
      try {
        const supabase = getSupabaseClient();
        const { data: schoolMatch } = await supabase
          .from('schools')
          .select('id')
          .eq('slug', cleanSlug)
          .maybeSingle();

        const { data: candidateMatch } = await supabase
          .from('prospective_schools')
          .select('id')
          .eq('slug', cleanSlug)
          .maybeSingle();

        if (schoolMatch || candidateMatch) {
          isTaken = true;
        }
      } catch (_sbErr) {}
    }

    // 3. In-memory map check
    if (!isTaken) {
      if (fontInMemSchools.has(cleanSlug)) {
        isTaken = true;
      }
    }

    return {
      available: !isTaken,
      exists: isTaken,
      message: isTaken ? 'Subdomain sudah digunakan sekolah lain.' : 'Subdomain tersedia.'
    };
  }
}
