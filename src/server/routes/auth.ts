import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseClient } from '../db/supabase';
import dotenv from 'dotenv';
import { adminAuth } from '../middleware/auth';
import { sendTelegramNotification } from '../utils/telegram';
import { loginSchema, changePasswordSchema } from '../validations/auth';
import { rateLimiter } from '../middleware/rate-limiter';

dotenv.config();

const authRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not defined!');
}

authRouter.post('/login', rateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Batas percobaan login terlampaui. Silakan coba lagi dalam 1 menit.'
}), async (c) => {
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
    const { username, password } = result.data;
    const schoolId = c.req.query('school_id') || null;

    let adminUser: any = null;
    let ysboAuthenticated = false;
    let ysboUser: any = null;
    let ysbmoToken: string | null = null;
    
    // Default supabase client (Service Role since login needs to access auth tables directly)
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
          const result: any = await response.json();
          if (result.status_code === 200 && result.data) {
            ysboAuthenticated = true;
            ysboUser = result.data;
            ysbmoToken = result.token || result.data.token || result.access_token || result.data.access_token || result.token_akses || result.data.token_akses || null;
          }
        }
      } catch (fetchErr: any) {
        console.warn('Koneksi API YSBMO gagal, beralih ke kredensial lokal:', fetchErr.message);
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
          ysbmo_token: ysbmoToken || undefined
        }).eq('id', existingUser.id);
        if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
        const { data } = await updateQuery.select().single();
        adminUser = data;
      } else {
        const payload: any = {
          username: usernameKey,
          password_hash: hashedPassword,
          nama_lengkap: name,
          role: mappedRole,
          ysbmo_token: ysbmoToken
        };
        if (schoolId) payload.school_id = schoolId;
        const { data } = await supabase.from('admin_users').insert(payload).select().single();
        adminUser = data;
      }
    }

    if (!adminUser) {
      let query = supabase.from('admin_users').select('*').eq('username', username);
      if (schoolId) query = query.eq('school_id', schoolId);
      const { data } = await query.maybeSingle();
      adminUser = data;
    }

    if (!adminUser) {
      return c.json({
        success: false,
        message: 'Waduh, username atau password yang kamu masukkan salah. Coba periksa lagi ya.'
      }, 401);
    }

    if (!ysboAuthenticated) {
      const passwordMatch = bcrypt.compareSync(password, adminUser.password_hash);
      if (!passwordMatch) {
        return c.json({
          success: false,
          message: 'Waduh, username atau password yang kamu masukkan salah. Coba periksa lagi ya.'
        }, 401);
      }
    }

    const token = jwt.sign(
      {
        id: adminUser.id,
        username: adminUser.username,
        nama: adminUser.nama_lengkap,
        role: adminUser.role,
        school_id: adminUser.school_id || schoolId
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    const timeString = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const notificationMessage = `<b>Notifikasi Login Baru Sistem PPDB</b>\n` +
      `------------------------------------\n` +
      `<b>Nama Lengkap:</b> ${adminUser.nama_lengkap}\n` +
      `<b>Username:</b> ${adminUser.username}\n` +
      `<b>Peran (Role):</b> ${adminUser.role}\n` +
      `<b>Waktu:</b> ${timeString} WIB\n` +
      `------------------------------------`;

    sendTelegramNotification(notificationMessage).catch((err) => {
      console.error('[Telegram Bot] Gagal mengirim notifikasi login:', err);
    });

    return c.json({
      success: true,
      message: 'Asyik! Kamu berhasil login. Selamat datang!',
      token,
      admin: {
        username: adminUser.username,
        nama: adminUser.nama_lengkap,
        role: adminUser.role,
        foto_profil: adminUser.foto_profil
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
    const admin = (c as any).get('admin');
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
    const schoolId = c.req.query('school_id') || null;

    let query = supabase.from('admin_users').select('*').eq('id', admin.id);
    if (schoolId) query = query.eq('school_id', schoolId);
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
    let updateQuery = supabase.from('admin_users').update({ password_hash: newHash }).eq('id', admin.id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
    
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
    const admin = (c as any).get('admin');
    const body = await c.req.json();
    const { nama_lengkap, username, foto_profil } = body as {
      nama_lengkap?: string;
      username?: string;
      foto_profil?: string;
    };

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

    let query = supabase.from('admin_users').select('*').eq('id', admin.id);
    if (schoolId) query = query.eq('school_id', schoolId);
    const { data: existing } = await query.single();

    if (!existing) {
      return c.json({ success: false, message: 'Akun tidak ditemukan.' }, 404);
    }

    if (username && username !== existing.username) {
      let duplicateQuery = supabase.from('admin_users').select('id').eq('username', username);
      if (schoolId) duplicateQuery = duplicateQuery.eq('school_id', schoolId);
      const { data: duplicate } = await duplicateQuery.maybeSingle();
      if (duplicate) {
        return c.json({ success: false, message: 'Username sudah digunakan akun lain.' }, 400);
      }
    }

    const dataToUpdate: any = {};
    if (nama_lengkap && nama_lengkap.trim()) dataToUpdate.nama_lengkap = nama_lengkap.trim();
    if (username && username.trim()) dataToUpdate.username = username.trim();
    if (foto_profil !== undefined) dataToUpdate.foto_profil = foto_profil;

    let updateQuery = supabase.from('admin_users').update(dataToUpdate).eq('id', admin.id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
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
