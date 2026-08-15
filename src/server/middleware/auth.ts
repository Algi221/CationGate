import { createMiddleware } from 'hono/factory';
import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined!');
  }
  return secret;
};

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
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    if (!decoded.school_id) {
      return c.json({ success: false, message: 'Akses ditolak: Data tenant tidak ditemukan dalam token.' }, 401);
    }
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

export const gatekeeperAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Akses ditolak: Token otentikasi tidak ditemukan.' }, 401);
  }

  try {
    const decoded = jwt.verify(authHeader.slice(7), getJwtSecret()) as any;
    if (decoded.isGatekeeper !== true || decoded.role !== 'gatekeeper') {
      return c.json({ success: false, message: 'Akses ditolak: Token bukan gatekeeper.' }, 403);
    }
    c.set('gatekeeper', decoded);
    return await next();
  } catch {
    return c.json({ success: false, message: 'Akses ditolak: Session kedaluwarsa atau token tidak valid.' }, 401);
  }
});

/**
 * SECURITY: Extracts school_id ONLY from the verified JWT token.
 * Never uses query parameters — prevents tenant impersonation attacks.
 * Returns 404 (not 403) so attackers can't tell if a record exists.
 */
export const requireTenantId = async (c: any): Promise<string> => {
  const admin = c.get('admin') as any;
  if (!admin?.school_id) {
    throw new TenantError();
  }

  // Resolve to UUID if needed (handles legacy integer IDs)
  const { resolveSchoolUUID } = await import('../db/resolve-school');
  const { fontInMemSchools } = await import('../routes/saas');
  const resolved = await resolveSchoolUUID(String(admin.school_id), fontInMemSchools);
  
  if (!resolved) {
    throw new TenantError();
  }
  return resolved;
};

/**
 * Custom error class for missing tenant context.
 * Route handlers should catch this and return c.json({ success: false }, 404).
 */
export class TenantError extends Error {
  constructor() {
    super('Tenant not found');
    this.name = 'TenantError';
  }
}
