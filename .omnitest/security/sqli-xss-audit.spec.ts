
import { test, expect } from '@playwright/test';

const BE_URL = 'http://localhost:5000';

test.describe('🔒 Security Audit: SQL Injection & XSS Sanitization', () => {
  const sqliPayloads = [
    "' OR 1=1 --",
    "\"; DROP TABLE users; --",
    "1' UNION SELECT 1,2,3 --",
    "admin' --",
  ];

  const xssPayloads = [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert(1)>",
    "javascript:alert(1)",
  ];

  test('SQL Injection payloads should be sanitized (no 500 error or SQL dump in response)', async ({ request }) => {
    for (const payload of sqliPayloads) {
      const response = await request.post(BE_URL + '/api/auth/login', {
        data: { username: payload, password: payload },
        headers: { 'Content-Type': 'application/json' },
      });

      // Server must NOT crash with 500 Internal Server Error
      expect(response.status()).not.toBe(500);

      const bodyText = await response.text();
      // Server must NOT return raw SQL syntax error dumps
      expect(bodyText.toLowerCase()).not.toContain('syntax error');
      expect(bodyText.toLowerCase()).not.toContain('pg_query');
      expect(bodyText.toLowerCase()).not.toContain('mysql_fetch');
      expect(bodyText.toLowerCase()).not.toContain('prismaclient');
    }
  });

  test('XSS payloads in POST requests should not be reflected unescaped', async ({ request }) => {
    for (const payload of xssPayloads) {
      const response = await request.post(BE_URL + '/api/applicants', {
        data: { nama_lengkap: payload, email: 'test@test.com' },
        headers: { 'Content-Type': 'application/json' },
      });

      const bodyText = await response.text();
      // Script tags must be escaped if returned
      expect(bodyText).not.toContain('<script>alert');
    }
  });
});
