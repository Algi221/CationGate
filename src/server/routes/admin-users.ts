import { Hono } from 'hono';
import { superAdminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import bcrypt from 'bcryptjs';
import { createAdminSchema, updateAdminSchema } from '../validations/admin-users';

const adminUsersRouter = new Hono();

adminUsersRouter.use('/*', superAdminAuth);

// Legacy YSBMO Staff Route (Returns empty array for standalone admin management)
adminUsersRouter.get('/ysbmo/staff', async (c) => {
  return c.json({
    success: true,
    data: []
  });
});

// Ambil semua data admin yang aktif (tidak dihapus)
adminUsersRouter.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = ((c as any).get('admin') as any)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let query = supabase.from('admin_users').select('id, username, nama_lengkap, role, created_at').is('deleted_at', null).order('id', { ascending: true });
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: adminUsers, error } = await query;
    if (error) throw error;

    return c.json({ success: true, data: adminUsers });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Ambil data admin yang ada di tempat sampah (trash)
adminUsersRouter.get('/trashed', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = ((c as any).get('admin') as any)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let query = supabase.from('admin_users')
      .select('id, username, nama_lengkap, role, created_at, deleted_at')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: trashedUsers, error } = await query;
    if (error) throw error;

    return c.json({ success: true, data: trashedUsers });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Pulihkan admin dari tempat sampah
adminUsersRouter.post('/:id/restore', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = ((c as any).get('admin') as any)?.school_id;
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
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Tambah admin baru
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
    const schoolId = ((c as any).get('admin') as any)?.school_id;
    if (!schoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    let checkQuery = supabase.from('admin_users').select('id').eq('username', username);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    const { data: existing } = await checkQuery.maybeSingle();

    if (existing) {
      return c.json({ success: false, message: 'Username sudah digunakan.' }, 400);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const payload: any = {
      username,
      password_hash: passwordHash,
      nama_lengkap,
      role: role || 'admin'
    };
    if (schoolId) payload.school_id = schoolId;

    const { data: newAdmin, error } = await supabase.from('admin_users').insert(payload).select().single();
    if (error) throw error;

    return c.json({ success: true, data: newAdmin, message: 'Admin berhasil ditambahkan.' });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
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
    const schoolId = ((c as any).get('admin') as any)?.school_id;
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

    const dataToUpdate: any = {
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
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Hapus admin (Soft delete by default, Permanent if query ?permanent=true)
adminUsersRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = ((c as any).get('admin') as any)?.school_id;
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
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default adminUsersRouter;
