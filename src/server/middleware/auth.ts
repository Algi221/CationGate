import { createMiddleware } from 'hono/factory';
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
      message: 'Akses ditolak: Sesi Anda tidak valid atau telah berakhir.'
    }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    if (!decoded.school_id) {
      const fallbackSchool = c.req.query('school_id') || c.req.query('school_slug') || c.req.header('x-school-id') || decoded.school_slug || decoded.slug;
      if (fallbackSchool) {
        decoded.school_id = fallbackSchool;
      }
    }
    c.set('admin', decoded);
    return await next();
  } catch (_error) {
    return c.json({
      message: 'Akses ditolak: Sesi Anda tidak valid atau telah berakhir.'
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = c.get('admin') as any;
  if (admin && (admin.role === 'superadmin' || admin.role === 'admin' || !admin.role)) {
    return await next();
  } else {
    return c.json({
      message: 'Akses ditolak: Anda tidak memiliki izin untuk tindakan ini.'
    }, 403);
  }
});

export const gatekeeperAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    token = c.req.header('x-gatekeeper-token') || c.req.query('token') || null;
  }

  if (!token) {
    return c.json({ success: false, message: 'Akses ditolak: Sesi Anda tidak valid atau telah berakhir.' }, 401);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    if (decoded.isGatekeeper !== true && decoded.role !== 'gatekeeper' && decoded.role !== 'superadmin') {
      return c.json({ success: false, message: 'Akses ditolak: Anda tidak memiliki izin untuk tindakan ini.' }, 403);
    }
    c.set('gatekeeper', decoded);
    return await next();
  } catch {
    return c.json({ success: false, message: 'Akses ditolak: Sesi Anda tidak valid atau telah berakhir.' }, 401);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requireTenantId = async (c: any): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = c.get('admin') as any;
  const identifier =
    admin?.school_id ||
    admin?.school_slug ||
    admin?.slug ||
    c.req.query('school_id') ||
    c.req.query('school_slug') ||
    c.req.header('x-school-slug');

  if (!identifier) {
    throw new TenantError();
  }

  const { resolveSchoolUUID } = await import('../db/resolve-school');
  const { fontInMemSchools } = await import('../routes/saas');
  const resolved = await resolveSchoolUUID(String(identifier), fontInMemSchools);

  return resolved || String(identifier);
};
export class TenantError extends Error {
  constructor() {
    super('Tenant not found');
    this.name = 'TenantError';
  }
}
