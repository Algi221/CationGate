import { test, expect } from '@playwright/test';

const BASE = 'https://cationgate.site';
const SCHOOL_SLUG = 'smktarunabhakti';

test.describe('Gatekeeper & SaaS Full Flow', () => {
  test('Gatekeeper Login and Dashboard', async ({ page }) => {
    // Navigate to gatekeeper login
    await page.goto(`${BASE}/gatekeeper/auth/login`);
    
    // Login
    await page.fill('input[type="text"]', 'gatekeeper_test');
    await page.fill('input[type="password"]', 'admin123');
    // Use the custom Button component click
    await page.getByRole('button', { name: 'Lanjutkan' }).click();
    
    // Validate Dashboard
    await expect(page).toHaveURL(/.*\/gatekeeper\/dashboard/);
    await expect(page.locator('h1')).toBeVisible();
    await page.screenshot({ path: 'test-results/gatekeeper-dash.png' });
  });

  test('Saas Activation Check', async ({ request }) => {
    const res = await request.post(`${BASE}/api/saas/activate`, {
      data: { code: 'INVALID_CODE' }
    });
    // Should be 401 (unauthorized) as we don't have a token
    expect(res.status()).toBe(401);
  });
});
