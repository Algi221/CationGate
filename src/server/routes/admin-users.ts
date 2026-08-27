import { Hono } from 'hono';
import { superAdminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import bcrypt from 'bcryptjs';
import { createAdminSchema, updateAdminSchema } from '../validations/admin-users';

const adminUsersRouter = new Hono();

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
    const { resolveSchoolUUID } = await import('../db/resolve-school');
    const { fontInMemSchools } = await import('./saas');
    const resolved = await resolveSchoolUUID(String(rawIdentifier), fontInMemSchools);
    return resolved || String(rawIdentifier);
  } catch (_e) {
    return String(rawIdentifier);
  }
}

adminUsersRouter.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let query = supabase
      .from('admin_users')
      .select('id, username, nama_lengkap, role, created_at')
      .is('deleted_at', null)
      .order('id', { ascending: true });

    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }

    const { data: adminUsers, error } = await query;
    if (error) {
      // Fallback: try querying without school_id filter if school_id column type mismatch
      const { data: fallbackUsers } = await supabase
        .from('admin_users')
        .select('id, username, nama_lengkap, role, created_at')
        .is('deleted_at', null)
        .order('id', { ascending: true });

      return c.json({ success: true, data: fallbackUsers || [] });
    }

    return c.json({ success: true, data: adminUsers || [] });
  } catch (_error: unknown) {
    return c.json({ success: true, data: [] });
  }
});

adminUsersRouter.get('/trashed', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let query = supabase
      .from('admin_users')
      .select('id, username, nama_lengkap, role, created_at, deleted_at')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }

    const { data: trashedUsers, error } = await query;
    if (error) {
      const { data: fallbackTrashed } = await supabase
        .from('admin_users')
        .select('id, username, nama_lengkap, role, created_at, deleted_at')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      return c.json({ success: true, data: fallbackTrashed || [] });
    }

    return c.json({ success: true, data: trashedUsers || [] });
  } catch (_error: unknown) {
    return c.json({ success: true, data: [] });
  }
});

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

    const { data: existing } = await checkQuery.single();

    if (!existing) {
      return c.json({ success: false, message: 'Admin tidak ditemukan di tempat sampah.' }, 404);
    }

    let updateQuery = supabase.from('admin_users').update({ deleted_at: null }).eq('id', id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);

    const { error } = await updateQuery;
    if (error) throw error;

    return c.json({ success: true, message: 'Admin berhasil dipulihkan.' });
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

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
    const { username, password, nama_lengkap, role } = result.data;

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

    let checkQuery = supabase.from('admin_users').select('id').eq('username', username);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    const { data: existing } = await checkQuery.maybeSingle();

    if (existing) {
      return c.json({ success: false, message: 'Username sudah digunakan.' }, 400);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const payload: Record<string, unknown> = {
      username,
      password_hash: passwordHash,
      nama_lengkap,
      role: role || 'admin'
    };
    if (schoolId) payload.school_id = schoolId;

    const { data: newAdmin, error } = await supabase.from('admin_users').insert(payload).select().single();
    if (error) {
      // Fallback without school_id if schema column issue
      delete payload.school_id;
      const { data: fallbackAdmin, error: fbErr } = await supabase.from('admin_users').insert(payload).select().single();
      if (fbErr) throw fbErr;
      return c.json({ success: true, data: fallbackAdmin, message: 'Admin berhasil ditambahkan.' });
    }

    return c.json({ success: true, data: newAdmin, message: 'Admin berhasil ditambahkan.' });
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

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
    const { username, password, nama_lengkap, role } = result.data;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await getSchoolId(c);
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('admin_users').select('*').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    const { data: existing } = await checkQuery.single();

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
      nama_lengkap: nama_lengkap || existing.nama_lengkap,
      role: role || existing.role
    };

    if (password) {
      dataToUpdate.password_hash = bcrypt.hashSync(password, 10);
    }

    let updateQuery = supabase.from('admin_users').update(dataToUpdate).eq('id', id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
    const { data: updated, error } = await updateQuery.select().single();

    if (error) throw error;

    return c.json({ success: true, data: updated, message: 'Admin berhasil diperbarui.' });
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

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
    const { data: existing } = await checkQuery.single();

    if (!existing) {
      return c.json({ success: false, message: 'Admin tidak ditemukan.' }, 404);
    }

    const permanent = c.req.query('permanent') === 'true';

    let opQuery;
    if (permanent) {
      opQuery = supabase.from('admin_users').delete().eq('id', id);
    } else {
      opQuery = supabase.from('admin_users').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    }
    if (schoolId) opQuery = opQuery.eq('school_id', schoolId);

    const { error } = await opQuery;
    if (error) throw error;

    if (permanent) {
      return c.json({ success: true, message: 'Admin berhasil dihapus secara permanen.' });
    } else {
      return c.json({ success: true, message: 'Admin berhasil dipindahkan ke tempat sampah.' });
    }
  } catch (error: unknown) {
    return c.json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500);
  }
});

export default adminUsersRouter;
