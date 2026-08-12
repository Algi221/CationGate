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
import { secureHeaders } from 'hono/secure-headers';

process.on('uncaughtException', (err) => {
  console.error('FATAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('FATAL UNHANDLED REJECTION at:', promise, 'reason:', reason);
});


// Initialize Hono App
const app = new Hono().basePath('/api');

// Safe JSON body parser middleware
app.use('*', async (c, next) => {
  const originalJson = c.req.json.bind(c.req);
  c.req.json = async <T = any>() => {
    try {
      return await originalJson() as T;
    } catch (err) {
      return {} as T;
    }
  };
  await next();
});

// Logger & CORS Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Security headers middleware
app.use('*', secureHeaders({
  xContentTypeOptions: true,
  xFrameOptions: 'SAMEORIGIN',
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    fontSrc: ["'self'", "https:"],
    connectSrc: ["'self'"],
    frameAncestors: ["'self'"],
  },
  referrerPolicy: 'strict-origin-when-cross-origin',
  xXssProtection: '1; mode=block',
}));

import gatekeeperRouter from './routes/gatekeeper';

// Route mappings
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

// Standard API health check
app.get('/health', (c) => c.json({ status: 'OK', service: 'PPDB SMK Taruna Bhakti API Server v1.0.0 (Monolith)' }));

export default app;
