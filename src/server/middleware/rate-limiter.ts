import { createMiddleware } from 'hono/factory';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (config: RateLimitConfig) => {
  return createMiddleware(async (c, next) => {
    // Allow bypassing only if explicitly turned off in env
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      return await next();
    }

    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
      c.req.header('x-real-ip') ||
      '127.0.0.1';

    const now = Date.now();
    const clientData = ipRequestCounts.get(ip);

    if (!clientData || now > clientData.resetTime) {
      ipRequestCounts.set(ip, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return await next();
    }

    if (clientData.count >= config.max) {
      const remainingSeconds = Math.max(1, Math.ceil((clientData.resetTime - now) / 1000));
      const remainingMinutes = Math.ceil(remainingSeconds / 60);
      const timeDisplay = remainingMinutes > 1 ? `${remainingMinutes} menit` : `${remainingSeconds} detik`;

      return c.json(
        {
          success: false,
          message:
            config.message ||
            `Terlalu banyak percobaan dari perangkat Anda. Silakan coba lagi dalam ${timeDisplay}.`,
          retryAfter: remainingSeconds,
        },
        429
      );
    }

    clientData.count++;
    return await next();
  });
};

// Periodic garbage collection for memory efficiency
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}, 60000);

export const authLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: 'Batas percobaan login/verifikasi terlampaui. Demi keamanan akun Anda, silakan coba lagi dalam beberapa menit.',
});

export const registerLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: 'Terlalu banyak percobaan pendaftaran dari IP ini. Silakan coba lagi setelah 1 jam.',
});
