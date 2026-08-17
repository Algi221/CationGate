import { test, expect } from '@playwright/test';

test('Full PPDB Flow - Calon Siswa & Admin', async ({ page, context }) => {
  // 1. Calon Siswa: Buka landing
  await page.goto('https://cationgate.site/smk');
  await expect(page).toHaveTitle(/PPDB SMK/);
  
  // 2. Klik Daftar
  await page.click('text=Daftar');
  await page.fill('input[name="nama"]', 'Test Siswa');
  await page.fill('input[name="nisn"]', '1234567890');
  await page.fill('input[name="whatsapp"]', '081234567890');
  // ... continue filling ...
  await page.click('button[type="submit"]');

  // 3. Admin: Login & Verifikasi
  const adminPage = await context.newPage();
  await adminPage.goto('https://cationgate.site/login');
  await adminPage.fill('input[name="username"]', 'admin_smk');
  await adminPage.fill('input[name="password"]', 'admin123');
  await adminPage.click('button[type="submit"]');
  
  // 4. Verifikasi Realtime
  await adminPage.goto('https://cationgate.site/smk/dashboard/pendaftar');
  await expect(adminPage.locator('text=Test Siswa')).toBeVisible();
});
