import { Hono } from 'hono';
import { superAdminAuth } from '../middleware/auth';
import prisma from '../db/prisma';
import bcrypt from 'bcryptjs';
import { createAdminSchema, updateAdminSchema } from '../validations/admin-users';

const adminUsersRouter = new Hono();

adminUsersRouter.use('/*', superAdminAuth);

// Ambil data staff/guru dari API YSBMO
adminUsersRouter.get('/ysbmo/staff', async (c) => {
  try {
    const manualToken = c.req.header('X-YSBMO-Token') || c.req.query('ysbmo_token');

    // Cari token di DB jika tidak dikirim secara manual
    let ysbmoToken: string | null | undefined = manualToken;
    if (!ysbmoToken) {
      const latestAdminWithToken = await prisma.adminUser.findFirst({
        where: {
          ysbmo_token: { not: null }
        },
        orderBy: {
          id: 'desc'
        }
      });
      ysbmoToken = latestAdminWithToken?.ysbmo_token;
    }

    if (!ysbmoToken) {
      return c.json({
        success: false,
        code: 'NO_TOKEN',
        message: 'Token YSBMO tidak ditemukan. Silakan masukkan token secara manual atau login ulang menggunakan akun YSBMO.'
      }, 400);
    }

    // Hitung api key berdasarkan bulan/tahun
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const xApiKey = `SARPRAS-STARBHAK${year}${month}`;

    const headers: Record<string, string> = {
      'x-api-key': xApiKey,
      'Content-Type': 'application/json'
    };

    // Bersihkan prefix Basic jika ada, lalu bangun ulang untuk standardisasi
    const cleanToken = ysbmoToken.replace(/^Basic\s+/i, '');
    headers['Authorization'] = `Basic ${cleanToken}`;

    console.log(`[YSBMO API Call] URL: https://be-skol.yayasansetyabhakti.org:5203/api/v1/masterdata/list-staff`);
    console.log(`[YSBMO API Call] Headers:`, {
      'x-api-key': xApiKey,
      'Authorization': `Basic ${cleanToken.substring(0, 8)}...`
    });

    const response = await fetch('https://be-skol.yayasansetyabhakti.org:5203/api/v1/masterdata/list-staff', {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[YSBMO API Error] Status ${response.status}:`, errText);
      return c.json({
        success: false,
        message: `Koneksi API YSBMO mengembalikan status ${response.status}: ${errText}`
      }, 400);
    }

    const result = await response.json();
    
    // Jika token manual terbukti valid dan berhasil, simpan ke database admin saat ini
    if (manualToken) {
      const currentAdmin = (c as any).get('admin');
      if (currentAdmin && currentAdmin.id) {
        try {
          await prisma.adminUser.update({
            where: { id: currentAdmin.id },
            data: { ysbmo_token: cleanToken }
          });
          console.log(`[YSBMO API] Token manual berhasil disimpan ke database untuk admin ID: ${currentAdmin.id}`);
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
    const adminUsers = await prisma.adminUser.findMany({
      where: {
        deleted_at: null
      },
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        role: true,
        created_at: true
      },
      orderBy: {
        id: 'asc'
      }
    });
    return c.json({ success: true, data: adminUsers });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Ambil data admin yang ada di tempat sampah (trash)
adminUsersRouter.get('/trashed', async (c) => {
  try {
    const trashedUsers = await prisma.adminUser.findMany({
      where: {
        deleted_at: { not: null }
      },
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        role: true,
        created_at: true,
        deleted_at: true
      },
      orderBy: {
        deleted_at: 'desc'
      }
    });
    return c.json({ success: true, data: trashedUsers });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Pulihkan admin dari tempat sampah
adminUsersRouter.post('/:id/restore', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const existing = await prisma.adminUser.findFirst({
      where: {
        id,
        deleted_at: { not: null }
      }
    });
    if (!existing) {
      return c.json({ success: false, message: 'Admin tidak ditemukan di tempat sampah.' }, 404);
    }

    await prisma.adminUser.update({
      where: { id },
      data: { deleted_at: null }
    });

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

    // Cek duplikasi username
    const existing = await prisma.adminUser.findUnique({
      where: { username }
    });
    if (existing) {
      return c.json({ success: false, message: 'Username sudah digunakan.' }, 400);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newAdmin = await prisma.adminUser.create({
      data: {
        username,
        password_hash: passwordHash,
        nama_lengkap,
        role: role || 'admin'
      }
    });

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

    const existing = await prisma.adminUser.findUnique({
      where: { id }
    });
    if (!existing) {
      return c.json({ success: false, message: 'Admin tidak ditemukan.' }, 404);
    }

    // Cek jika username baru tabrakan dengan admin lain
    if (username && username !== existing.username) {
      const duplicate = await prisma.adminUser.findUnique({
        where: { username }
      });
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

    const updated = await prisma.adminUser.update({
      where: { id },
      data: dataToUpdate
    });

    return c.json({ success: true, data: updated, message: 'Admin berhasil diperbarui.' });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Hapus admin (Soft delete by default, Permanent if query ?permanent=true)
adminUsersRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const existing = await prisma.adminUser.findUnique({
      where: { id }
    });
    if (!existing) {
      return c.json({ success: false, message: 'Admin tidak ditemukan.' }, 404);
    }

    const permanent = c.req.query('permanent') === 'true';

    if (permanent) {
      await prisma.adminUser.delete({
        where: { id }
      });
      return c.json({ success: true, message: 'Admin berhasil dihapus secara permanen.' });
    } else {
      await prisma.adminUser.update({
        where: { id },
        data: { deleted_at: new Date() }
      });
      return c.json({ success: true, message: 'Admin berhasil dipindahkan ke tempat sampah.' });
    }
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default adminUsersRouter;
