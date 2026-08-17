import { test, expect } from '@playwright/test';

const BASE_URL = 'https://cationgate.site';
const SLUG = 'smktarunabhakti';

test.describe('Dashboard Admin Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login flow
    await page.goto(`${BASE_URL}/${SLUG}/auth/login`);
    await page.fill('input[name="username"]', 'superadmin_sekolah');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('Test All Dashboard Modules', async ({ page }) => {
    const modules = [
      'pendaftar', 
      'informasi', 
      'kelola-ui', 
      'profil-sekolah', 
      'siswa-aktif'
    ];

    for (const mod of modules) {
      await page.goto(`${BASE_URL}/${SLUG}/dashboard/${mod}`);
      await expect(page).toHaveURL(new RegExp(`.*\\/${mod}`));
      // Check if critical UI elements exist
      await expect(page.locator('h1, h2')).toBeVisible();
    }
  });

  test('Test CRUD - Add School Info', async ({ page }) => {
    await page.goto(`${BASE_URL}/${SLUG}/dashboard/profil-sekolah`);
    // Check if form is interactive
    const saveButton = page.locator('text=Simpan Perubahan');
    await expect(saveButton).toBeVisible();
  });
});
