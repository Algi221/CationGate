import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
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

    let adminUser: any = null;
    let ysboAuthenticated = false;
    let ysboUser: any = null;
    let ysbmoToken: string | null = null;

    // Cek login YSBMO
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
          console.log('[YSBMO Auth Response]', JSON.stringify(result));
          if (result.status_code === 200 && result.data) {
            ysboAuthenticated = true;
            ysboUser = result.data;
            ysbmoToken = result.token || result.data.token || result.access_token || result.data.access_token || result.token_akses || result.data.token_akses || null;
            console.log(`[YSBMO Auth] Login berhasil untuk user: ${username}, token found: ${!!ysbmoToken}`);
          }
        }
      } catch (fetchErr: any) {
        console.warn('Koneksi API YSBMO gagal, beralih ke kredensial lokal:', fetchErr.message);
      }
    }

    if (ysboAuthenticated && ysboUser) {
      // Pemetaan level akses (4 = superadmin, selain itu = admin)
      const mappedRole = Number(ysboUser.level_akses) === 4 ? 'superadmin' : 'admin';
      const name = ysboUser.full_name || ysboUser.text || ysboUser.username || ysboUser.id || username;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const usernameKey = ysboUser.username || ysboUser.id || username;

      // Sinkronisasi data user YSBMO ke database lokal
      adminUser = await prisma.adminUser.upsert({
        where: { username: usernameKey },
        update: {
          password_hash: hashedPassword,
          nama_lengkap: name,
          role: mappedRole,
          ysbmo_token: ysbmoToken || undefined
        },
        create: {
          username: usernameKey,
          password_hash: hashedPassword,
          nama_lengkap: name,
          role: mappedRole,
          ysbmo_token: ysbmoToken
        }
      });
    }

    // Jika tidak terotentikasi lewat YSBMO, cari di database lokal
    if (!adminUser) {
      adminUser = await prisma.adminUser.findUnique({
        where: { username }
      });
    }

    if (!adminUser) {
      return c.json({
        success: false,
        message: 'Waduh, username atau password yang kamu masukkan salah. Coba periksa lagi ya.'
        }, 401);
      }

      // Verifikasi password lokal (jika tidak login lewat YSBMO)
      if (!ysboAuthenticated) {
        const passwordMatch = bcrypt.compareSync(password, adminUser.password_hash);
        if (!passwordMatch) {
          return c.json({
            success: false,
            message: 'Waduh, username atau password yang kamu masukkan salah. Coba periksa lagi ya.'
          }, 401);
        }
      }

      // Buat token JWT
      const token = jwt.sign(
        {
          id: adminUser.id,
          username: adminUser.username,
          nama: adminUser.nama_lengkap,
          role: adminUser.role
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

    // Find user using Prisma
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: admin.id }
    });

    if (!adminUser) {
      return c.json({
        success: false,
        message: 'Akun kamu tidak ditemukan di sistem kami.'
      }, 404);
    }

    // Verify current password hash
    const passwordMatch = bcrypt.compareSync(currentPassword, adminUser.password_hash);
    if (!passwordMatch) {
      return c.json({
        success: false,
        message: 'Password saat ini yang kamu masukkan salah. Silakan coba lagi.'
      }, 400);
    }

    // Hash new password and update in database using Prisma
    const newHash = bcrypt.hashSync(newPassword, 10);
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password_hash: newHash }
    });

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

    const existing = await prisma.adminUser.findUnique({ where: { id: admin.id } });
    if (!existing) {
      return c.json({ success: false, message: 'Akun tidak ditemukan.' }, 404);
    }

    // Cek username conflict
    if (username && username !== existing.username) {
      const duplicate = await prisma.adminUser.findUnique({ where: { username } });
      if (duplicate) {
        return c.json({ success: false, message: 'Username sudah digunakan akun lain.' }, 400);
      }
    }

    const dataToUpdate: any = {};
    if (nama_lengkap && nama_lengkap.trim()) dataToUpdate.nama_lengkap = nama_lengkap.trim();
    if (username && username.trim()) dataToUpdate.username = username.trim();
    if (foto_profil !== undefined) dataToUpdate.foto_profil = foto_profil;

    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: dataToUpdate,
      select: { id: true, username: true, nama_lengkap: true, role: true, foto_profil: true }
    });

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
