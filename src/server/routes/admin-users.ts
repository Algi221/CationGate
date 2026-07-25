import { Hono } from 'hono';
import { superAdminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import bcrypt from 'bcryptjs';
import { createAdminSchema, updateAdminSchema } from '../validations/admin-users';

const adminUsersRouter = new Hono();

adminUsersRouter.use('/*', superAdminAuth);

// Ambil data staff/guru dari API YSBMO
adminUsersRouter.get('/ysbmo/staff', async (c) => {
  try {
    const manualToken = c.req.header('X-YSBMO-Token') || c.req.query('ysbmo_token');
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

    let ysbmoToken: string | null | undefined = manualToken;
    if (!ysbmoToken) {
      let query = supabase.from('admin_users').select('ysbmo_token').not('ysbmo_token', 'is', null).order('id', { ascending: false }).limit(1);
      if (schoolId) query = query.eq('school_id', schoolId);
      const { data } = await query.single();
      ysbmoToken = data?.ysbmo_token;
    }

    if (!ysbmoToken) {
      return c.json({
        success: false,
        code: 'NO_TOKEN',
        message: 'Token YSBMO tidak ditemukan. Silakan masukkan token secara manual atau login ulang menggunakan akun YSBMO.'
      }, 400);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const xApiKey = `SARPRAS-STARBHAK${year}${month}`;

    const headers: Record<string, string> = {
      'x-api-key': xApiKey,
      'Content-Type': 'application/json'
    };

    const cleanToken = ysbmoToken.replace(/^Basic\s+/i, '');
    headers['Authorization'] = `Basic ${cleanToken}`;

    const response = await fetch('https://be-skol.yayasansetyabhakti.org:5203/api/v1/masterdata/list-staff', {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errText = await response.text();
      return c.json({
        success: false,
        message: `Koneksi API YSBMO mengembalikan status ${response.status}: ${errText}`
      }, 400);
    }

    const result = await response.json();
    
    if (manualToken) {
      const currentAdmin = (c as any).get('admin');
      if (currentAdmin && currentAdmin.id) {
        try {
          let updateQuery = supabase.from('admin_users').update({ ysbmo_token: cleanToken }).eq('id', currentAdmin.id);
          if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
          await updateQuery;
        } catch (dbErr: any) {
          console.warn('Gagal menyimpan token manual ke DB:', dbErr.message);
        }
      }
    }

    return c.json({
      success: true,
      data: result.data || result
    });
  } catch (error: any) {
    console.error('[YSBMO API Route Error]', error);
    return c.json({
      success: false,
      message: `Terjadi kesalahan saat mengambil data staff YSBMO: ${error.message}`
    }, 500);
  }
});

// Ambil semua data admin yang aktif (tidak dihapus)
adminUsersRouter.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

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
    const schoolId = c.req.query('school_id') || null;

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
    const schoolId = c.req.query('school_id') || null;

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
    const schoolId = c.req.query('school_id') || null;

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
    const schoolId = c.req.query('school_id') || null;

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
    const schoolId = c.req.query('school_id') || null;

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
