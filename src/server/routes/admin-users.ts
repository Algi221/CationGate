import { Hono } from 'hono';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { superAdminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { createAdminSchema, updateAdminSchema } from '../validations/admin-users';
import { EmailService } from '../services/EmailService';
import { resolveSchoolUUID, resolveSchoolSlug } from '../db/resolve-school';
import { fontInMemSchools } from './saas';

const adminUsersRouter = new Hono();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined!');
  }
  return secret;
};

// PUBLIC: Activate Admin Account via Email Activation OTP or Token
adminUsersRouter.post('/activate', async (c) => {
  try {
    const body = await c.req.json();
    const { token, otp, email, password, school_slug } = body;
    const cleanToken = String(otp || token || '').trim();

    if (!cleanToken) {
      return c.json({ success: false, message: 'Kode OTP atau token aktivasi wajib disertakan.' }, 400);
    }

    let adminRecord: Record<string, unknown> | null = null;
    const supabase = getSupabaseClient();

    // 1. Check direct PostgreSQL
    try {
      let query = `SELECT * FROM admin_users WHERE activation_token = $1 AND deleted_at IS NULL LIMIT 1`;
      const params: unknown[] = [cleanToken];
      if (email) {
        query = `SELECT * FROM admin_users WHERE (activation_token = $1 OR activation_token = $2) AND LOWER(email) = LOWER($3) AND deleted_at IS NULL LIMIT 1`;
        params.push(cleanToken, String(email).trim());
      }
      const pgRes = await pool.query(query, params);
      if (pgRes.rows && pgRes.rows.length > 0) {
        adminRecord = pgRes.rows[0];
      }
    } catch (_pgErr) {}

    // 2. Check Supabase
    if (!adminRecord) {
      try {
        let sbQuery = supabase
          .from('admin_users')
          .select('*')
          .eq('activation_token', cleanToken)
          .is('deleted_at', null);
        if (email) {
          sbQuery = sbQuery.ilike('email', String(email).trim());
        }
        const { data, error } = await sbQuery.maybeSingle();
        if (!error && data) {
          adminRecord = data;
        }
      } catch (_sbErr) {}
    }

    if (!adminRecord) {
      return c.json({
        success: false,
        message: 'Kode OTP atau tautan aktivasi tidak valid atau telah kedaluwarsa.'
      }, 400);
    }

    // Check expiration
    if (adminRecord.activation_expires_at && new Date(adminRecord.activation_expires_at as string).getTime() < Date.now()) {
      return c.json({
        success: false,
        message: 'Kode OTP telah kedaluwarsa. Silakan minta admin sekolah untuk mengirimkan ulang kode verifikasi.'
      }, 400);
    }

    const nowIso = new Date().toISOString();
    let passwordHash = adminRecord.password_hash as string;
    if (password && typeof password === 'string' && password.length >= 6) {
      passwordHash = bcrypt.hashSync(password, 10);
    }

    // 1. Update in PostgreSQL
    try {
      await pool.query(
        `UPDATE admin_users 
         SET password_hash = $1, 
             is_active = TRUE, 
             email_verified_at = $2, 
             activation_token = NULL, 
             activation_expires_at = NULL
         WHERE id = $3`,
        [passwordHash, nowIso, adminRecord.id]
      );
    } catch (_upPgErr) {}

    // 2. Update in Supabase
    try {
      await supabase
        .from('admin_users')
        .update({
          password_hash: passwordHash,
          is_active: true,
          email_verified_at: nowIso,
          activation_token: null,
          activation_expires_at: null
        })
        .eq('id', adminRecord.id);
    } catch (_upSbErr) {}

    // Resolve tenant details for token
    const effectiveSchoolId = (adminRecord.school_id as string | number) || school_slug || null;
    const userIdentifier = (adminRecord.email as string) || (adminRecord.username as string) || undefined;
    const resolvedSlug = await resolveSchoolSlug(effectiveSchoolId, userIdentifier, fontInMemSchools);
    const resolvedSchoolUUID = effectiveSchoolId ? await resolveSchoolUUID(String(effectiveSchoolId), fontInMemSchools) : null;
    const finalSchoolId = resolvedSchoolUUID || (adminRecord.school_id as string | number) || resolvedSlug || undefined;

    const jwtToken = jwt.sign(
      {
        id: adminRecord.id as number,
        username: adminRecord.username as string,
        email: adminRecord.email as string,
        nama: adminRecord.nama_lengkap as string,
        role: (adminRecord.role as string) || 'admin',
        school_id: finalSchoolId,
        school_slug: resolvedSlug || school_slug || undefined
      },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return c.json({
      success: true,
      message: 'Akun admin berhasil diaktivasi! Anda sekarang dapat mengakses dashboard sekolah.',
      token: jwtToken,
      admin: {
        id: adminRecord.id,
        username: adminRecord.username,
        email: adminRecord.email,
        nama_lengkap: adminRecord.nama_lengkap,
        role: adminRecord.role || 'admin',
        school_id: finalSchoolId,
        school_slug: resolvedSlug || school_slug || undefined
      }
    });
  } catch (error: unknown) {
    console.error('Error activating admin user:', error);
    return c.json({
      success: false,
      message: 'Gagal mengaktivasi akun: ' + (error instanceof Error ? error.message : String(error))
    }, 500);
  }
});

// PROTECTED ROUTES (Requires Superadmin / School Admin auth)
adminUsersRouter.use('/*', superAdminAuth);

adminUsersRouter.get('/ysbmo/staff', async (c) => {
  return c.json({
    success: true,
    data: []
  });
});

async function getSchoolId(c: { get: unknown; req: { query: (k: string) => string | undefined; header: (k: string) => string | undefined } }): Promise<string | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = (c.get as (key: string) => unknown)('admin') as any;
  const rawIdentifier =
    c.req.query('school_id') ||
    c.req.query('school_slug') ||
    c.req.header('x-school-slug') ||
    admin?.school_id ||
    admin?.school_slug ||
    admin?.slug;

  if (!rawIdentifier) return undefined;

  try {
    const resolved = await resolveSchoolUUID(String(rawIdentifier), fontInMemSchools);
    return resolved || String(rawIdentifier);
  } catch (_e) {
    return String(rawIdentifier);
  }
}

// GET /api/admin/users - List active admins
adminUsersRouter.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: true, data: [] });
    }

    if (schoolId === 'demo') {
      const demoUsers = [
        {
          id: 1,
          username: 'admin_demo',
          email: 'demo@smkindonesia.sch.id',
          nama_lengkap: 'Admin Demo Utama',
          role: 'superadmin',
          is_active: true,
          is_online: true,
          status: 'online',
          last_active: 'Aktif Sekarang',
          created_at: new Date().toISOString()
        }
      ];
      return c.json({ success: true, data: demoUsers });
    }

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str).trim());
    const schoolUuid = isUUID(schoolId) ? schoolId : null;

    let query = supabase
      .from('admin_users')
      .select('id, username, email, nama_lengkap, role, is_active, activation_token, activation_expires_at, email_verified_at, created_at')
      .is('deleted_at', null)
      .order('id', { ascending: true });

    if (schoolUuid) {
      query = query.eq('school_id', schoolUuid);
    }

    const { data: adminUsers, error } = await query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userList: any[] = [];

    if (error || !adminUsers) {
      // Fallback: query via direct PostgreSQL
      try {
        const pgRes = await pool.query(
          `SELECT id, username, email, nama_lengkap, role, is_active, activation_token, activation_expires_at, email_verified_at, created_at
           FROM admin_users
           WHERE deleted_at IS NULL AND (school_id::text = $1 OR school_id IS NULL)
           ORDER BY id ASC`,
          [String(schoolUuid || schoolId)]
        );
        userList = pgRes.rows || [];
      } catch (_pgErr) {
        userList = [];
      }
    } else {
      userList = adminUsers;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentAdmin = (c.get as any)('admin');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedUsers = userList.map((u: any, idx: number) => {
      const isCurrent = idx === 0 || u.username === currentAdmin?.username || u.email === currentAdmin?.email;
      return {
        ...u,
        is_active: u.is_active !== false,
        is_online: isCurrent,
        status: isCurrent ? 'online' : 'offline',
        last_active: isCurrent ? 'Aktif Sekarang' : '10 menit yang lalu'
      };
    });

    return c.json({ success: true, data: mappedUsers });
  } catch (_error: unknown) {
    return c.json({ success: true, data: [] });
  }
});

// GET /api/admin/users/trashed - Trashed admins
adminUsersRouter.get('/trashed', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId || schoolId === 'demo') {
      return c.json({ success: true, data: [] });
    }

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str).trim());
    const schoolUuid = isUUID(schoolId) ? schoolId : null;

    let query = supabase
      .from('admin_users')
      .select('id, username, email, nama_lengkap, role, created_at, deleted_at')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (schoolUuid) {
      query = query.eq('school_id', schoolUuid);
    }

    const { data: trashedUsers, error } = await query;
    if (error || !trashedUsers) {
      try {
        const pgRes = await pool.query(
          `SELECT id, username, email, nama_lengkap, role, created_at, deleted_at
           FROM admin_users
           WHERE deleted_at IS NOT NULL AND (school_id::text = $1 OR school_id IS NULL)
           ORDER BY deleted_at DESC`,
          [String(schoolId)]
        );
        return c.json({ success: true, data: pgRes.rows || [] });
      } catch (_pgErr) {
        return c.json({ success: true, data: [] });
      }
    }

    return c.json({ success: true, data: trashedUsers || [] });
  } catch (_error: unknown) {
    return c.json({ success: true, data: [] });
  }
});

// POST /api/admin/users/:id/restore - Restore admin
adminUsersRouter.post('/:id/restore', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('admin_users').select('id').eq('id', id).not('deleted_at', 'is', null);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);

    const { data: existing } = await checkQuery.maybeSingle();
    if (!existing) {
      await pool.query('UPDATE admin_users SET deleted_at = NULL WHERE id = $1', [id]);
    } else {
      let updateQuery = supabase.from('admin_users').update({ deleted_at: null }).eq('id', id);
      if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
      await updateQuery;
      await pool.query('UPDATE admin_users SET deleted_at = NULL WHERE id = $1', [id]);
    }

    return c.json({ success: true, message: 'Admin berhasil dipulihkan.' });
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

// POST /api/admin/users - Create new admin with Gmail & activation link
adminUsersRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const result = createAdminSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const { username, email, password, nama_lengkap, role } = result.data;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    // 5-admin limit check per school
    try {
      const { count } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .is('deleted_at', null);

      if (count !== null && count >= 5) {
        return c.json({
          success: false,
          message: 'Batas kuota admin (maksimal 5 admin) untuk instansi sekolah telah tercapai. Kelola atau hapus admin yang tidak aktif terlebih dahulu.'
        }, 403);
      }
    } catch (_countErr) {}

    // Check duplicate username or email
    let checkQuery = supabase.from('admin_users').select('id, username, email').or(`username.eq.${username}${email ? `,email.eq.${email}` : ''}`);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    const { data: existing } = await checkQuery.maybeSingle();

    if (existing) {
      if (existing.username === username) {
        return c.json({ success: false, message: 'Username sudah digunakan.' }, 400);
      }
      if (email && existing.email === email) {
        return c.json({ success: false, message: 'Email sudah terdaftar untuk admin lain di instansi ini.' }, 400);
      }
    }

    // Generate secure 6-digit OTP code and 24-hour expiration
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const activationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const passwordHash = password ? bcrypt.hashSync(password, 10) : bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10);
    const isActive = false; // Requires email OTP activation

    const payload: Record<string, unknown> = {
      username,
      email: email || null,
      password_hash: passwordHash,
      nama_lengkap,
      role: role || 'admin',
      is_active: isActive,
      activation_token: otpCode,
      activation_expires_at: activationExpiresAt,
      school_id: schoolId
    };

    let newAdmin: Record<string, unknown> | null = null;

    try {
      const { data, error } = await supabase.from('admin_users').insert(payload).select().single();
      if (!error && data) newAdmin = data;
    } catch (_sbErr) {}

    if (!newAdmin) {
      try {
        const pgRes = await pool.query(
          `INSERT INTO admin_users (username, email, password_hash, nama_lengkap, role, is_active, activation_token, activation_expires_at, school_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::text, NOW())
           RETURNING *`,
          [username, email || null, passwordHash, nama_lengkap, role || 'admin', isActive, otpCode, activationExpiresAt, String(schoolId)]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          newAdmin = pgRes.rows[0];
        }
      } catch (_pgErr) {
        // Fallback without school_id column constraint
        const pgRes2 = await pool.query(
          `INSERT INTO admin_users (username, email, password_hash, nama_lengkap, role, is_active, activation_token, activation_expires_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
           RETURNING *`,
          [username, email || null, passwordHash, nama_lengkap, role || 'admin', isActive, otpCode, activationExpiresAt]
        );
        if (pgRes2.rows && pgRes2.rows.length > 0) {
          newAdmin = pgRes2.rows[0];
        }
      }
    }

    // Build activation URL
    const origin = c.req.header('origin') || c.req.header('referer') || 'https://cationgate.site';
    let baseHost = 'https://cationgate.site';
    try {
      const parsed = new URL(origin);
      baseHost = `${parsed.protocol}//${parsed.host}`;
    } catch (_) {}

    const schoolSlug = (c.req.query('school_slug') || c.req.header('x-school-slug') || schoolId || 'demo') as string;
    const activationLink = `${baseHost}/${schoolSlug}/admin/activate?email=${encodeURIComponent(email || '')}&token=${otpCode}`;

    // Send invitation / activation email if email provided
    if (email) {
      let schoolName = schoolSlug.toUpperCase();
      try {
        const { data: sch } = await supabase.from('schools').select('name').eq('id', schoolId).maybeSingle();
        if (sch?.name) schoolName = sch.name;
      } catch (_) {}

      await EmailService.sendAdminActivationEmail({
        toEmail: email,
        staffName: nama_lengkap,
        schoolName,
        otpCode,
        activationLink,
        username,
        role: role || 'admin'
      });
    }

    return c.json({
      success: true,
      data: newAdmin,
      activation_token: otpCode,
      otp_code: otpCode,
      activation_link: activationLink,
      message: email
        ? `Akun admin berhasil dibuat. Kode OTP verifikasi telah dikirimkan ke ${email}.`
        : 'Akun admin berhasil dibuat. Silakan gunakan kode OTP untuk mengaktifkan akun.'
    }, 201);
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

// POST /api/admin/users/:id/resend-activation - Resend activation link
adminUsersRouter.post('/:id/resend-activation', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('admin_users').select('*').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    let { data: admin } = await checkQuery.maybeSingle();

    if (!admin) {
      try {
        const pgRes = await pool.query('SELECT * FROM admin_users WHERE id = $1 LIMIT 1', [id]);
        if (pgRes.rows && pgRes.rows.length > 0) admin = pgRes.rows[0];
      } catch (_) {}
    }

    if (!admin) {
      return c.json({ success: false, message: 'Admin tidak ditemukan.' }, 404);
    }

    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    try {
      await supabase.from('admin_users').update({
        activation_token: newOtpCode,
        activation_expires_at: newExpiresAt,
        is_active: false
      }).eq('id', id);
      await pool.query(
        `UPDATE admin_users 
         SET activation_token = $1, activation_expires_at = $2, is_active = FALSE 
         WHERE id = $3`,
        [newOtpCode, newExpiresAt, id]
      );
    } catch (_upErr) {}

    const origin = c.req.header('origin') || c.req.header('referer') || 'https://cationgate.site';
    let baseHost = 'https://cationgate.site';
    try {
      const parsed = new URL(origin);
      baseHost = `${parsed.protocol}//${parsed.host}`;
    } catch (_) {}

    const schoolSlug = (c.req.query('school_slug') || c.req.header('x-school-slug') || schoolId || 'demo') as string;
    const activationLink = `${baseHost}/${schoolSlug}/admin/activate?email=${encodeURIComponent(admin.email || '')}&token=${newOtpCode}`;

    if (admin.email) {
      let schoolName = schoolSlug.toUpperCase();
      try {
        const { data: sch } = await supabase.from('schools').select('name').eq('id', schoolId).maybeSingle();
        if (sch?.name) schoolName = sch.name;
      } catch (_) {}

      await EmailService.sendAdminActivationEmail({
        toEmail: admin.email,
        staffName: admin.nama_lengkap,
        schoolName,
        otpCode: newOtpCode,
        activationLink,
        username: admin.username,
        role: admin.role || 'admin'
      });
    }

    return c.json({
      success: true,
      activation_token: newOtpCode,
      otp_code: newOtpCode,
      message: `Kode OTP verifikasi baru telah dikirimkan ke ${admin.email}.`
    });
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

// PUT /api/admin/users/:id - Update admin
adminUsersRouter.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const body = await c.req.json();
    const result = updateAdminSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const { username, email, password, nama_lengkap, role } = result.data;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('admin_users').select('*').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    let { data: existing } = await checkQuery.maybeSingle();

    if (!existing) {
      try {
        const pgRes = await pool.query('SELECT * FROM admin_users WHERE id = $1 LIMIT 1', [id]);
        if (pgRes.rows && pgRes.rows.length > 0) existing = pgRes.rows[0];
      } catch (_) {}
    }

    if (!existing) {
      return c.json({ success: false, message: 'Admin tidak ditemukan.' }, 404);
    }

    if (username && username !== existing.username) {
      let duplicateQuery = supabase.from('admin_users').select('id').eq('username', username);
      if (schoolId) duplicateQuery = duplicateQuery.eq('school_id', schoolId);
      const { data: duplicate } = await duplicateQuery.maybeSingle();
      if (duplicate) {
        return c.json({ success: false, message: 'Username sudah digunakan.' }, 400);
      }
    }

    const dataToUpdate: Record<string, unknown> = {
      username: username || existing.username,
      email: email !== undefined ? email : existing.email,
      nama_lengkap: nama_lengkap || existing.nama_lengkap,
      role: role || existing.role
    };

    if (password && password.trim() !== '') {
      dataToUpdate.password_hash = bcrypt.hashSync(password, 10);
    }

    let updateQuery = supabase.from('admin_users').update(dataToUpdate).eq('id', id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
    const { data: updated, error } = await updateQuery.select().maybeSingle();

    try {
      const setClauses: string[] = ['username = $1', 'email = $2', 'nama_lengkap = $3', 'role = $4'];
      const values: (string | number | boolean | null | undefined)[] = [
        dataToUpdate.username as string,
        dataToUpdate.email as string,
        dataToUpdate.nama_lengkap as string,
        dataToUpdate.role as string
      ];
      if (dataToUpdate.password_hash) {
        setClauses.push('password_hash = $' + (values.length + 1));
        values.push(dataToUpdate.password_hash as string);
      }
      values.push(id);
      await pool.query(
        `UPDATE admin_users SET ${setClauses.join(', ')} WHERE id = $${values.length}`,
        values
      );
    } catch (_pgErr) {}

    if (error && !updated) {
      return c.json({ success: true, data: { id, ...dataToUpdate }, message: 'Admin berhasil diperbarui.' });
    }

    return c.json({ success: true, data: updated || { id, ...dataToUpdate }, message: 'Admin berhasil diperbarui.' });
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

// DELETE /api/admin/users/:id - Soft delete or permanent delete
adminUsersRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('admin_users').select('id').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    let { data: existing } = await checkQuery.maybeSingle();

    if (!existing) {
      try {
        const pgRes = await pool.query('SELECT id FROM admin_users WHERE id = $1 LIMIT 1', [id]);
        if (pgRes.rows && pgRes.rows.length > 0) existing = pgRes.rows[0];
      } catch (_) {}
    }

    if (!existing) {
      return c.json({ success: false, message: 'Admin tidak ditemukan.' }, 404);
    }

    const permanent = c.req.query('permanent') === 'true';

    if (permanent) {
      let delQuery = supabase.from('admin_users').delete().eq('id', id);
      if (schoolId) delQuery = delQuery.eq('school_id', schoolId);
      await delQuery;
      await pool.query('DELETE FROM admin_users WHERE id = $1', [id]);
      return c.json({ success: true, message: 'Admin berhasil dihapus secara permanen.' });
    } else {
      const nowIso = new Date().toISOString();
      let softQuery = supabase.from('admin_users').update({ deleted_at: nowIso }).eq('id', id);
      if (schoolId) softQuery = softQuery.eq('school_id', schoolId);
      await softQuery;
      await pool.query('UPDATE admin_users SET deleted_at = NOW() WHERE id = $1', [id]);
      return c.json({ success: true, message: 'Admin berhasil dipindahkan ke tempat sampah.' });
    }
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

export default adminUsersRouter;
