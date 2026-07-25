import { createMiddleware } from 'hono/factory';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (config: RateLimitConfig) => {
  return createMiddleware(async (c, next) => {
    // Basic IP detection from common headers or fallback
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

// Cleanup routine to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}, 60000); // clean up every minute
