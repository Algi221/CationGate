import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not defined!');
}

export const adminAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      message: 'Akses ditolak: Token otentikasi tidak ditemukan.'
    }, 401);
  }

  const token = authHeader.split(' ')[1];
  

  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set('admin', decoded);
    return await next();
  } catch (error) {
    return c.json({
      success: false,
      message: 'Akses ditolak: Session kedaluwarsa atau token tidak valid.'
    }, 401);
  }
});

export const superAdminAuth = createMiddleware(async (c, next) => {
  let authFailed = true;
  const res = await adminAuth(c, async () => {
    authFailed = false;
  });

  if (authFailed) {
    return res as Response;
  }

  const admin = c.get('admin') as any;
  if (admin && admin.role === 'superadmin') {
    return await next();
  } else {
    return c.json({
      success: false,
      message: 'Akses ditolak: Hanya superadmin yang dapat melakukan aksi ini.'
    }, 403);
  }
});
