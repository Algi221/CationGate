import { test, expect } from '@playwright/test';

// Configuration
const BASE_URL = 'https://cationgate.site';
const SCHOOL_SLUG = 'smktarunabhakti'; // As verified from config

test.describe('PPDB Full Flow', () => {

  test('1. Calon Siswa Registration Flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/${SCHOOL_SLUG}/daftar`);
    await expect(page).toHaveTitle(/PPDB/);
    
    // Fill forms
    await page.fill('input[name="nama"]', 'Test Siswa Automation');
    await page.fill('input[name="nisn"]', '0098765432');
    await page.fill('input[name="whatsapp"]', '081234567890');
    // Assuming simple flow, may need to click 'next'
    await page.click('button[type="submit"]');
    
    // Expect success message
    await expect(page.locator('text=Pendaftaran berhasil')).toBeVisible({ timeout: 10000 });
  });

  test('2. Admin School Flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/${SCHOOL_SLUG}/auth/login`);
    // Admin Credentials
    await page.fill('input[name="username"]', 'admin_smktarunabhakti'); // Example
    await page.fill('input[name="password"]', 'admin123'); // Example, assume standard password
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    await page.goto(`${BASE_URL}/${SCHOOL_SLUG}/dashboard/pendaftar`);
    await expect(page.locator('text=Test Siswa Automation')).toBeVisible({ timeout: 15000 });
  });

  test('3. Gatekeeper Flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/gatekeeper/auth/login`);
    await page.fill('input[name="username"]', 'gatekeeper_test');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/gatekeeper\/dashboard/);
  });
});
