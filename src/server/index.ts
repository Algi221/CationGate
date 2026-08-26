import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRouter from './routes/auth';
import appRouter from './routes/applicants';
import paymentRouter from './routes/payment';
import informasiRouter from './routes/informasi';
import configRouter from './routes/config';
import adminUsersRouter from './routes/admin-users';
import siswaAktifRouter from './routes/siswa-aktif';
import kuotaRouter from './routes/kuota';
import saasRouter from './routes/saas';
import dashboardRouter from './routes/dashboard';
import verifyRouter from './routes/verify';
import storageRouter from './routes/storage';
import mailerRouter from './routes/mailer';
import passwordRouter from './routes/password';
import chatbotRouter from './routes/chatbot';
import { secureHeaders } from 'hono/secure-headers';
import contactRoute from './routes/contact'
process.on('uncaughtException', (err) => {
  console.error('FATAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('FATAL UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

import { systemLogger } from './utils/systemLogger';

const app = new Hono().basePath('/api');

app.use('*', async (c, next) => {
  const originalJson = c.req.json.bind(c.req);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  c.req.json = async <T = any>() => {
    try {
      return await originalJson() as T;
    } catch (_err) {
      return {} as T;
    }
  };
  
  const start = Date.now();
  await next();
  const durationMs = Date.now() - start;

  try {
    const url = new URL(c.req.url);
    const host = c.req.header('host') || url.host || 'cationgate.site';
    const status = c.res.status || 200;
    
    let level: 'info' | 'warn' | 'error' = 'info';
    if (status >= 500) level = 'error';
    else if (status >= 400) level = 'warn';

    const method = c.req.method;
    const path = url.pathname + (url.search || '');

    systemLogger.addLog({
      method,
      status,
      host,
      request: path,
      durationMs,
      level,
      message: status >= 500 
        ? `Request returned status ${status} [${durationMs}ms]`
        : `--> ${method} ${path} ${status} ${durationMs}ms`
    });
  } catch (_logErr) {}
});

app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.endsWith('cationgate.site')) {
      return origin;
    }
    return origin;
  },
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

app.use('*', secureHeaders({
  xContentTypeOptions: true,
  xFrameOptions: 'SAMEORIGIN',
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://snap-assets.sandbox.midtrans.com", "https://api.sandbox.midtrans.com", "https://pay.google.com", "https://gwk.gopayapi.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:"],
      connectSrc: ["'self'", "https://api.sandbox.midtrans.com"],
      frameAncestors: ["'self'", "https://app.sandbox.midtrans.com"],
    },
  referrerPolicy: 'strict-origin-when-cross-origin',
  xXssProtection: '1; mode=block',
}));

import gatekeeperRouter from './routes/gatekeeper';

app.route('/auth', authRouter);
app.route('/gatekeeper', gatekeeperRouter);
app.route('/applicants', appRouter);
app.route('/payment', paymentRouter);
app.route('/informasi', informasiRouter);
app.route('/config', configRouter);
app.route('/admin/users', adminUsersRouter);
app.route('/siswa-aktif', siswaAktifRouter);
app.route('/kuota', kuotaRouter);
app.route('/saas', saasRouter);
app.route('/dashboard', dashboardRouter);
app.route('/verify', verifyRouter);
app.route('/storage', storageRouter);
app.route('/mailer', mailerRouter);
app.route('/password', passwordRouter);
app.route('/chatbot', chatbotRouter);
app.route('/contact', contactRoute)

app.get('/health', (c) => c.json({ status: 'OK', service: 'PPDB SMK Taruna Bhakti API Server v1.0.0 (Monolith)' }));

app.get('*', (c) => {
  if (c.req.path.startsWith('/api/')) return c.notFound();
  return c.html(`<!DOCTYPE html><html><body><script>window.location.href = '/'</script></body></html>`);
});

export default app;
