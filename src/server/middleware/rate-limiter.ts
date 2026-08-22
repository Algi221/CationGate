import { createMiddleware } from 'hono/factory';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (config: RateLimitConfig) => {
  return createMiddleware(async (c, next) => {

    if (process.env.NODE_ENV !== 'production') {
      return await next();
    }

    const ip = c.req.header('x-forwarded-for') || 
               c.req.header('x-real-ip') || 
               '127.0.0.1';

    const now = Date.now();
    const clientData = ipRequestCounts.get(ip);

    if (!clientData || now > clientData.resetTime) {
      ipRequestCounts.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return await next();
    }

    if (clientData.count >= config.max) {
      return c.json({
        success: false,
        message: config.message || 'Waduh, terlalu banyak request dari perangkat Anda. Silakan coba beberapa saat lagi.'
      }, 429);
    }

    clientData.count++;
    return await next();
  });
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}, 60000); 

export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Terlalu banyak percobaan login/reset dari IP ini. Silakan coba lagi setelah 15 menit.'
});

export const registerLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, 
  max: 3, 
  message: 'Terlalu banyak percobaan pendaftaran dari IP ini. Silakan coba lagi setelah 1 jam.'
});
