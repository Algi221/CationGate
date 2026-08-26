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
    const { username, password, rememberMe } = result.data;
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

    let ysboAuthenticated = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ysboUser: any = null;
    let ysbmoToken: string | null = null;

    const supabase = getSupabaseClient();

    const YSBO_API_URL = process.env.YSBO_API_URL;
    if (YSBO_API_URL) {
      try {
        const response = await fetch(YSBO_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            version: 'v1',
            apps_name: 'PPDB SMK Taruna Bhakti',
            username,
            password
          })
        });

        if (response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result: any = await response.json();
          if (result.status_code === 200 && result.data) {
            ysboAuthenticated = true;
            ysboUser = result.data;
            ysbmoToken = result.token || result.data.token || result.access_token || result.data.access_token || result.token_akses || result.data.token_akses || null;
          }
        }
      } catch (fetchErr: unknown) {
        console.warn('Koneksi API YSBMO gagal, beralih ke kredensial lokal:', fetchErr instanceof Error ? fetchErr.message : String(fetchErr));
      }
    }

    if (ysboAuthenticated && ysboUser) {
      const mappedRole = Number(ysboUser.level_akses) === 4 ? 'superadmin' : 'admin';
      const name = ysboUser.full_name || ysboUser.text || ysboUser.username || ysboUser.id || username;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const usernameKey = ysboUser.username || ysboUser.id || username;

      let checkQuery = supabase.from('admin_users').select('*').eq('username', usernameKey);
      if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
      const { data: existingUser } = await checkQuery.maybeSingle();

      if (existingUser) {
        let updateQuery = supabase.from('admin_users').update({
          password_hash: hashedPassword,
          nama_lengkap: name,
          role: mappedRole,
          updated_at: new Date().toISOString()
        }).eq('id', existingUser.id);
        if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
        await updateQuery;
      } else {
        const payload: Record<string, unknown> = {
          username: usernameKey,
          password_hash: hashedPassword,
          nama_lengkap: name,
          role: mappedRole
        };
        if (schoolId) payload.school_id = schoolId;
        await supabase.from('admin_users').insert(payload);
      }

      let fetchQuery = supabase.from('admin_users').select('*').eq('username', usernameKey);
      if (schoolId) fetchQuery = fetchQuery.eq('school_id', schoolId);
      const { data: finalUser } = await fetchQuery.single();

      const token = jwt.sign(
        {
          id: finalUser?.id || ysboUser.id || 1,
          username: finalUser?.username || usernameKey,
          nama: finalUser?.nama_lengkap || name,
          role: finalUser?.role || mappedRole,
          school_id: schoolId || undefined,
          isYSBMO: true
        },
        getJwtSecret(),
        { expiresIn: rememberMe ? '30d' : '7d' }
      );

      return c.json({
        success: true,
        token,
        admin: {
          id: finalUser?.id || ysboUser.id || 1,
          username: finalUser?.username || usernameKey,
          nama_lengkap: finalUser?.nama_lengkap || name,
          role: finalUser?.role || mappedRole,
          school_id: schoolId || undefined
        },
        ysbmoToken
      });
    }

    const cleanUsername = String(username).trim();

    // Check if this is a Gatekeeper platform account
    const gatekeeperUsers = ['algi', 'farel', 'jepan', 'husein', 'uno'];
    if (gatekeeperUsers.includes(cleanUsername.toLowerCase()) || cleanUsername.toLowerCase().endsWith('@cationgate.id')) {
      return c.json({
        success: false,
        message: 'Akun Gatekeeper (Platform Superadmin) silakan login di /gatekeeper/login.'
      }, 403);
    }

    const cleanPhone = cleanUsername.replace(/\D/g, '');
    const isPhoneNumber = cleanPhone.length >= 8;

    // 1. Try Supabase query with case-insensitive search
    let query = supabase.from('admin_users').select('*').or(`username.ilike.${cleanUsername},email.ilike.${cleanUsername}`);
    if (schoolId) query = query.eq('school_id', schoolId);
    let { data: adminUser } = await query.maybeSingle();

    // If query with schoolId returned nothing, retry without schoolId constraint
    if (!adminUser && schoolId) {
      const { data: userWithoutSchool } = await supabase
        .from('admin_users')
        .select('*')
        .or(`username.ilike.${cleanUsername},email.ilike.${cleanUsername}`)
        .maybeSingle();
      if (userWithoutSchool) adminUser = userWithoutSchool;
    }

    // 2. Direct PostgreSQL pool fallback (robust against connection/casing issues)
    if (!adminUser) {
      try {
        const pgRes = await pool.query(
          `SELECT id, username, email, password_hash, nama_lengkap, role, school_id
           FROM admin_users
           WHERE (LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1))
           LIMIT 1`,
          [cleanUsername]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          adminUser = pgRes.rows[0];
        }
      } catch (_pgErr) {}
    }

    // 3. Fallback: Lookup in schools by official email, slug, or phone
    if (!adminUser) {
      try {
        let schoolQuery = supabase
          .from('schools')
          .select('id, slug, official_email');
        
        if (isPhoneNumber) {
          schoolQuery = schoolQuery.or(`official_email.ilike.${cleanUsername},slug.ilike.${cleanUsername},whatsapp_number.ilike.%${cleanPhone}%,phone_number.ilike.%${cleanPhone}%`);
        } else {
          schoolQuery = schoolQuery.or(`official_email.ilike.${cleanUsername},slug.ilike.${cleanUsername}`);
        }

        const { data: school } = await schoolQuery.maybeSingle();

        if (school) {
          const { data: linkedAdmin } = await supabase
            .from('admin_users')
            .select('*')
            .or(`school_id.eq.${school.id},school_id.eq.${school.slug}`)
            .maybeSingle();
          if (linkedAdmin) adminUser = linkedAdmin;
        }
      } catch (_sErr) {}
    }

    // 4. Fallback: Lookup in prospective_schools
    if (!adminUser) {
      try {
        let psQuery = supabase
          .from('prospective_schools')
          .select('id, slug, official_email');
        
        if (isPhoneNumber) {
          psQuery = psQuery.or(`official_email.ilike.${cleanUsername},slug.ilike.${cleanUsername},contact_person_phone.ilike.%${cleanPhone}%`);
        } else {
          psQuery = psQuery.or(`official_email.ilike.${cleanUsername},slug.ilike.${cleanUsername}`);
        }

        const { data: ps } = await psQuery.maybeSingle();

        if (ps) {
          const { data: linkedAdmin } = await supabase
            .from('admin_users')
            .select('*')
            .or(`school_id.eq.${ps.id},school_id.eq.${ps.slug}`)
            .maybeSingle();
          if (linkedAdmin) adminUser = linkedAdmin;
        }
      } catch (_psErr) {}
    }

    if (!adminUser) {
      return c.json({ success: false, message: 'Username / Email atau Password salah' }, 401);
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

    return c.json({
      success: true,
      message: 'Asyik! Kamu berhasil login. Selamat datang!',
      token,
      school_slug: resolvedSlug,
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

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    const query = supabase.from('admin_users').select('*').eq('id', admin.id)
      .eq('school_id', schoolId);
    const { data: adminUser } = await query.single();

    if (!adminUser) {
      return c.json({
        success: false,
        message: 'Akun kamu tidak ditemukan di sistem kami.'
      }, 404);
    }

    const passwordMatch = bcrypt.compareSync(currentPassword, adminUser.password_hash);
    if (!passwordMatch) {
      return c.json({
        success: false,
        message: 'Password saat ini yang kamu masukkan salah. Silakan coba lagi.'
      }, 400);
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    const updateQuery = supabase.from('admin_users').update({ password_hash: newHash }).eq('id', admin.id)
      .eq('school_id', schoolId);

    await updateQuery;

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
    const schoolId = await requireTenantId(c);

    const query = supabase.from('admin_users').select('*').eq('id', admin.id)
      .eq('school_id', schoolId);
    const { data: existing } = await query.single();

    if (!existing) {
      return c.json({ success: false, message: 'Akun tidak ditemukan.' }, 404);
    }

    if (username && username !== existing.username) {
      const duplicateQuery = supabase.from('admin_users').select('id').eq('username', username)
        .eq('school_id', schoolId);
      const { data: duplicate } = await duplicateQuery.maybeSingle();
      if (duplicate) {
        return c.json({ success: false, message: 'Username sudah digunakan akun lain.' }, 400);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = {};
    if (nama_lengkap && nama_lengkap.trim()) dataToUpdate.nama_lengkap = nama_lengkap.trim();
    if (username && username.trim()) dataToUpdate.username = username.trim();
    if (foto_profil !== undefined) dataToUpdate.foto_profil = foto_profil;

    const updateQuery = supabase.from('admin_users').update(dataToUpdate).eq('id', admin.id)
      .eq('school_id', schoolId);
    const { data: updated, error } = await updateQuery.select('id, username, nama_lengkap, role, foto_profil').single();

    if (error) throw error;

    return c.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      admin: {
        username: updated.username,
        nama: updated.nama_lengkap,
        role: updated.role,
        foto_profil: updated.foto_profil
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return c.json({ success: false, message: 'Gagal memperbarui profil.' }, 500);
  }
});

export default authRouter;
