import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { adminAuth, requireTenantId } from '../middleware/auth';
import { loginSchema, changePasswordSchema } from '../validations/auth';
import { authLimiter } from '../middleware/rate-limiter';
import { isValidUUID, resolveSchoolUUID, resolveSchoolSlug } from '../db/resolve-school';
import { fontInMemSchools } from './saas';

const authRouter = new Hono();
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined!');
  }
  return secret;
};

authRouter.post('/login', authLimiter, async (c) => {
  try {
    const body = await c.req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const { email, password, rememberMe } = result.data;
    const cleanEmail = email.trim().toLowerCase();
    const rawSchoolId = c.req.query('school_id') || null;

    let schoolId: string | null = rawSchoolId;
    if (rawSchoolId && !isValidUUID(rawSchoolId)) {

      let resolvedUUID: string | null = null;
      for (const [, school] of fontInMemSchools) {
        if (String(school.id) === rawSchoolId && school.school_uuid) {
          resolvedUUID = school.school_uuid;
          break;
        }
      }

      if (!resolvedUUID) {
        resolvedUUID = await resolveSchoolUUID(rawSchoolId, fontInMemSchools);
      }

      schoolId = resolvedUUID;
    }

    const supabase = getSupabaseClient();

    // Check if this is a Gatekeeper platform account trying to login on school portal
    if (cleanEmail.endsWith('@cationgate.id')) {
      return c.json({
        success: false,
        message: 'Akun Gatekeeper (Platform Superadmin) silakan login di /gatekeeper/login.'
      }, 403);
    }

    // 1. Try Supabase query matching email OR username (case-insensitive) scoped to school
    let query = supabase
      .from('admin_users')
      .select('*')
      .or(`email.ilike.${cleanEmail},username.ilike.${cleanEmail}`)
      .is('deleted_at', null);

    if (schoolId && isValidUUID(schoolId)) {
      query = query.eq('school_id', schoolId);
    }
    let { data: adminUser } = await query.maybeSingle();

    // 2. Direct PostgreSQL pool fallback (robust against connection/casing issues)
    if (!adminUser) {
      try {
        const pgRes = await pool.query(
          `SELECT id, username, email, password_hash, nama_lengkap, role, school_id, is_active
           FROM admin_users
           WHERE (LOWER(COALESCE(email, '')) = LOWER($1) OR LOWER(COALESCE(username, '')) = LOWER($1))
             AND deleted_at IS NULL
           LIMIT 1`,
          [cleanEmail]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          adminUser = pgRes.rows[0];
        }
      } catch (_pgErr) {}
    }

    // 3. Fallback: Lookup in schools by official email
    if (!adminUser) {
      try {
        const { data: school } = await supabase
          .from('schools')
          .select('id, slug, official_email, admin_name')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        if (school) {
          const { data: linkedAdmin } = await supabase
            .from('admin_users')
            .select('*')
            .or(`school_id.eq.${school.id},school_id.eq.${school.slug},email.ilike.${school.official_email}`)
            .maybeSingle();
          if (linkedAdmin) adminUser = linkedAdmin;
        }
      } catch (_sErr) {}
    }

    // 4. Fallback: Lookup in prospective_schools
    if (!adminUser) {
      try {
        const { data: ps } = await supabase
          .from('prospective_schools')
          .select('id, slug, official_email, admin_name')
          .ilike('official_email', cleanEmail)
          .maybeSingle();

        if (ps) {
          const { data: linkedAdmin } = await supabase
            .from('admin_users')
            .select('*')
            .or(`school_id.eq.${ps.id},school_id.eq.${ps.slug},email.ilike.${ps.official_email}`)
            .maybeSingle();
          if (linkedAdmin) adminUser = linkedAdmin;
        }
      } catch (_psErr) {}
    }

    // 5. Fallback: Lookup in in-memory fontInMemSchools map
    if (!adminUser) {
      for (const [, school] of fontInMemSchools) {
        if (school.official_email?.toLowerCase() === cleanEmail) {
          const { data: linkedAdmin } = await supabase
            .from('admin_users')
            .select('*')
            .or(`school_id.eq.${school.id},school_id.eq.${school.school_uuid || ''},email.ilike.${school.official_email}`)
            .maybeSingle();
          if (linkedAdmin) {
            adminUser = linkedAdmin;
            break;
          }
        }
      }
    }

    if (!adminUser) {
      return c.json({ success: false, message: 'Alamat Email atau kata sandi tidak sesuai.' }, 401);
    }

    if (adminUser.is_active === false) {
      return c.json({
        success: false,
        message: 'Akun admin belum diaktivasi. Silakan periksa tautan aktivasi di Gmail Anda atau hubungi admin sekolah.'
      }, 403);
    }

    // Direct Gatekeeper role check
    if (adminUser.role === 'gatekeeper') {
      return c.json({
        success: false,
        message: 'Akun Gatekeeper (Platform Superadmin) silakan login di /gatekeeper/login.'
      }, 403);
    }

    let match = false;
    try {
      if (adminUser.password_hash) {
        match = bcrypt.compareSync(password, adminUser.password_hash);
      }
    } catch (_e) {
      match = false;
    }

    // Support plain-text match (seed data / legacy setup) and auto-upgrade to bcrypt hash
    if (!match && adminUser.password_hash && adminUser.password_hash === password) {
      match = true;
      try {
        const newHash = bcrypt.hashSync(password, 10);
        await supabase.from('admin_users').update({ password_hash: newHash }).eq('id', adminUser.id);
        await pool.query(`UPDATE admin_users SET password_hash = $1 WHERE id = $2`, [newHash, adminUser.id]);
      } catch (_upErr) {}
    }

    if (!match) {
      return c.json({ success: false, message: 'Username / Email atau Password salah' }, 401);
    }

    // Resolve School Slug and ID reliably
    const effectiveIdentifier = adminUser.school_id || schoolId || null;
    const resolvedSlug = await resolveSchoolSlug(effectiveIdentifier, adminUser.email || adminUser.username, fontInMemSchools);
    let resolvedSchoolUUID = effectiveIdentifier ? await resolveSchoolUUID(String(effectiveIdentifier), fontInMemSchools) : null;

    if (!resolvedSchoolUUID && resolvedSlug) {
      resolvedSchoolUUID = await resolveSchoolUUID(resolvedSlug, fontInMemSchools);
    }

    const finalEffectiveSchoolId = resolvedSchoolUUID || adminUser.school_id || schoolId || resolvedSlug || undefined;

    // Backfill admin_users.school_id if previously missing
    if (!adminUser.school_id && finalEffectiveSchoolId) {
      try {
        await supabase.from('admin_users').update({ school_id: finalEffectiveSchoolId }).eq('id', adminUser.id);
      } catch (_syncErr) {}
    }

    const token = jwt.sign(
      {
        id: adminUser.id,
        username: adminUser.username,
        nama: adminUser.nama_lengkap,
        role: adminUser.role,
        school_id: finalEffectiveSchoolId,
        school_slug: resolvedSlug || undefined
      },
      getJwtSecret(),
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    let isVerifiedSchool = false;
    let schoolStatus = 'PENDING_VERIFICATION';

    if (resolvedSlug) {
      if (resolvedSlug === 'smktarunabhakti' || resolvedSlug === 'smktiglobal' || resolvedSlug === 'demo') {
        isVerifiedSchool = true;
        schoolStatus = 'FULL_VERIFIED';
      } else {
        try {
          const { data: sData } = await supabase
            .from('schools')
            .select('status, is_verified')
            .eq('slug', resolvedSlug)
            .maybeSingle();

          if (sData) {
            schoolStatus = sData.status || 'PENDING_VERIFICATION';
            isVerifiedSchool = sData.status === 'FULL_VERIFIED' || sData.status === 'VERIFIED' || !!sData.is_verified;
          } else {
            const { data: psData } = await supabase
              .from('prospective_schools')
              .select('status, is_verified')
              .eq('slug', resolvedSlug)
              .maybeSingle();

            if (psData) {
              schoolStatus = psData.status || 'PENDING_VERIFICATION';
              isVerifiedSchool = psData.status === 'FULL_VERIFIED' || psData.status === 'VERIFIED' || !!psData.is_verified;
            }
          }
        } catch (_e) {}

        const inMem = fontInMemSchools.get(resolvedSlug);
        if (inMem) {
          if (inMem.status === 'FULL_VERIFIED' || inMem.status === 'VERIFIED' || inMem.is_verified) {
            isVerifiedSchool = true;
            schoolStatus = inMem.status;
          }
        }
      }
    }

    return c.json({
      success: true,
      message: 'Asyik! Kamu berhasil login. Selamat datang!',
      token,
      school_slug: resolvedSlug,
      is_verified: isVerifiedSchool,
      school_status: schoolStatus,
      admin: {
        id: adminUser.id,
        username: adminUser.username,
        nama: adminUser.nama_lengkap,
        role: adminUser.role,
        foto_profil: adminUser.foto_profil,
        school_id: finalEffectiveSchoolId,
        school_slug: resolvedSlug
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return c.json({
      success: false,
      message: 'Aduh, ada kendala di server kami. Silakan coba sesaat lagi ya.'
    }, 500);
  }
});

authRouter.patch('/change-password', adminAuth, async (c) => {
  try {
    const admin = (c.get as (k: string) => unknown)('admin') as { id: number; username: string };
    const body = await c.req.json();
    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const { currentPassword, newPassword } = result.data;

    const supabase = getSupabaseClient();
    
    // Find admin user by ID or username
    let adminUser = null;
    if (admin.id) {
      const { data } = await supabase.from('admin_users').select('*').eq('id', admin.id).maybeSingle();
      if (data) adminUser = data;
    }
    if (!adminUser && admin.username) {
      const { data } = await supabase.from('admin_users').select('*').eq('username', admin.username).maybeSingle();
      if (data) adminUser = data;
    }

    // Direct PG query fallback
    if (!adminUser && admin.id) {
      try {
        const pgRes = await pool.query('SELECT * FROM admin_users WHERE id = $1 LIMIT 1', [admin.id]);
        if (pgRes.rows && pgRes.rows.length > 0) adminUser = pgRes.rows[0];
      } catch (_e) {}
    }

    if (!adminUser) {
      return c.json({
        success: false,
        message: 'Akun kamu tidak ditemukan di sistem kami.'
      }, 404);
    }

    let passwordMatch = false;
    try {
      if (adminUser.password_hash) {
        passwordMatch = bcrypt.compareSync(currentPassword, adminUser.password_hash);
      }
    } catch (_e) {
      passwordMatch = false;
    }
    // Also support plain-text comparison
    if (!passwordMatch && adminUser.password_hash === currentPassword) {
      passwordMatch = true;
    }

    if (!passwordMatch) {
      return c.json({
        success: false,
        message: 'Password saat ini yang kamu masukkan salah. Silakan coba lagi.'
      }, 400);
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    
    // Update in Supabase
    await supabase.from('admin_users').update({ 
      password_hash: newHash,
      updated_at: new Date().toISOString()
    }).eq('id', adminUser.id);

    // Update in PostgreSQL pool
    try {
      await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, adminUser.id]);
    } catch (_pgUpdateErr) {}

    // Update in fontInMemSchools if applicable
    for (const [, school] of fontInMemSchools) {
      if (school.admin_username === adminUser.username || school.official_email === adminUser.email) {
        school.admin_password_hash = newHash;
        school.admin_password = newPassword;
      }
    }

    return c.json({
      success: true,
      message: 'Selamat! Password admin berhasil diubah.'
    });

  } catch (err) {
    console.error('Change password error:', err);
    return c.json({
      success: false,
      message: 'Gagal mengubah password karena ada masalah di server. Silakan coba lagi.'
    }, 500);
  }
});

authRouter.patch('/profile', adminAuth, async (c) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (c as any).get('admin');
    const body = await c.req.json();
    const { nama_lengkap, username, foto_profil } = body as {
      nama_lengkap?: string;
      username?: string;
      foto_profil?: string;
    };

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    let schoolId: string | null = null;
    try {
      schoolId = await requireTenantId(c);
    } catch (_e) {
      schoolId = admin?.school_id || null;
    }

    // 1. Find existing admin user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existing: any = null;
    let findQuery = supabase.from('admin_users').select('*').eq('id', admin.id);
    if (schoolId) {
      findQuery = findQuery.eq('school_id', schoolId);
    }
    const { data: exData } = await findQuery.maybeSingle();
    existing = exData;

    if (!existing) {
      // Direct Postgres fallback
      try {
        const pgRes = await pool.query('SELECT * FROM admin_users WHERE id = $1 LIMIT 1', [admin.id]);
        if (pgRes.rows && pgRes.rows.length > 0) {
          existing = pgRes.rows[0];
        }
      } catch (_e) {}
    }

    if (!existing) {
      return c.json({ success: false, message: 'Akun tidak ditemukan.' }, 404);
    }

    if (username && username !== existing.username) {
      let duplicateQuery = supabase.from('admin_users').select('id').eq('username', username);
      if (schoolId) {
        duplicateQuery = duplicateQuery.eq('school_id', schoolId);
      }
      const { data: duplicate } = await duplicateQuery.maybeSingle();
      if (duplicate && duplicate.id !== admin.id) {
        return c.json({ success: false, message: 'Username sudah digunakan akun lain.' }, 400);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = {};
    if (nama_lengkap && nama_lengkap.trim()) dataToUpdate.nama_lengkap = nama_lengkap.trim();
    if (username && username.trim()) dataToUpdate.username = username.trim();
    if (foto_profil !== undefined) dataToUpdate.foto_profil = foto_profil;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updatedAdmin: any = null;
    try {
      const updateQuery = supabase.from('admin_users').update(dataToUpdate).eq('id', admin.id);
      const { data: updated, error } = await updateQuery.select('id, username, nama_lengkap, role, foto_profil').maybeSingle();
      if (!error && updated) {
        updatedAdmin = updated;
      }
    } catch (_e) {}

    if (!updatedAdmin) {
      // Postgres pool fallback
      const setClauses: string[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const values: any[] = [];
      let valIdx = 1;

      if (dataToUpdate.nama_lengkap !== undefined) {
        setClauses.push(`nama_lengkap = $${valIdx++}`);
        values.push(dataToUpdate.nama_lengkap);
      }
      if (dataToUpdate.username !== undefined) {
        setClauses.push(`username = $${valIdx++}`);
        values.push(dataToUpdate.username);
      }
      if (dataToUpdate.foto_profil !== undefined) {
        setClauses.push(`foto_profil = $${valIdx++}`);
        values.push(dataToUpdate.foto_profil);
      }
      setClauses.push(`updated_at = NOW()`);
      values.push(admin.id);

      const pgUpdate = await pool.query(
        `UPDATE admin_users SET ${setClauses.join(', ')} WHERE id = $${valIdx} RETURNING id, username, nama_lengkap, role, foto_profil`,
        values
      );
      if (pgUpdate.rows && pgUpdate.rows.length > 0) {
        updatedAdmin = pgUpdate.rows[0];
      }
    }

    if (!updatedAdmin) {
      return c.json({ success: false, message: 'Gagal memperbarui profil di database.' }, 500);
    }

    return c.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      admin: {
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        nama: updatedAdmin.nama_lengkap,
        role: updatedAdmin.role,
        foto_profil: updatedAdmin.foto_profil
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui profil.' }, 500);
  }
});

export default authRouter;
