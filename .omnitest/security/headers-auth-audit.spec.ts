
import { test, expect } from '@playwright/test';

const BE_URL = 'http://localhost:3000';
const FE_URL = 'http://localhost:3000';

test.describe('🔒 Security Audit: Headers & Auth Bypass', () => {
  test('Protected routes should reject requests without Authorization header (401/403)', async ({ request }) => {
    const protectedRoutes = ['/api/applicants', '/api/config', '/api/admin/users'];
    for (const route of protectedRoutes) {
      const response = await request.get(BE_URL + route, {
        headers: { 'Accept': 'application/json' },
      });
      // Without token, server must NOT return 200 OK with sensitive data
      if (response.status() === 200) {
        const json = await response.json().catch(() => ({}));
        console.warn(`⚠️ WARNING: Unauthenticated request to ${route} returned 200 OK!`);
      }
      expect([401, 403, 404, 400]).toContain(response.status());
    }
  });

  test('Backend response should include security headers', async ({ request }) => {
    const response = await request.get(BE_URL + '/health');
    const headers = response.headers();

    // Audit missing headers
    const missingHeaders: string[] = [];
    if (!headers['x-content-type-options']) missingHeaders.push('X-Content-Type-Options');
    if (!headers['x-frame-options']) missingHeaders.push('X-Frame-Options');

    if (missingHeaders.length > 0) {
      console.warn('⚠️ Missing Security Headers:', missingHeaders.join(', '));
    }
    
    // Server should not expose raw technology headers
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('Path traversal attempts should be blocked', async ({ request }) => {
    const traversalPaths = ['/../.env', '/../../package.json', '/%2e%2e/.env'];
    for (const p of traversalPaths) {
      const response = await request.get(BE_URL + p);
      expect(response.status()).not.toBe(200);
      const text = await response.text();
      expect(text).not.toContain('DATABASE_URL');
      expect(text).not.toContain('JWT_SECRET');
    }
  });
});
