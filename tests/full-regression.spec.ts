import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE = 'https://cationgate.site';
const SLUG = 'smktarunabhakti';

// Helper: login as admin
async function loginAsAdmin(page: Page) {
  await page.goto(`${BASE}/${SLUG}/auth/login`);
  await page.waitForLoadState('networkidle');
  await page.getByPlaceholder('Masukkan email').fill('superadmin_sekolah');
  await page.getByPlaceholder('Masukkan password').fill('admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
}

// Helper: screenshot
async function snap(page: Page, name: string) {
  const dir = path.join(process.cwd(), 'test-results', 'screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
}

// ─────────────────────────────────────────────
// 1. PUBLIC / LANDING PAGE
// ─────────────────────────────────────────────
test.describe('1. Landing Page & Public Routes', () => {
  test('1.1 Landing page loads', async ({ page }) => {
    await page.goto(`${BASE}/${SLUG}`);
    await expect(page).toHaveURL(new RegExp(SLUG));
    await snap(page, '01-landing');
  });

  test('1.2 Halaman pendaftaran', async ({ page }) => {
    await page.goto(`${BASE}/${SLUG}/daftar`);
    await expect(page.locator('body')).toBeVisible();
    await snap(page, '02-daftar');
  });

  test('1.3 Halaman profil', async ({ page }) => {
    await page.goto(`${BASE}/${SLUG}/profil`);
    await expect(page.locator('body')).toBeVisible();
    await snap(page, '03-profil');
  });

  test('1.4 Data pendaftar public', async ({ page }) => {
    await page.goto(`${BASE}/${SLUG}/data-pendaftar`);
    await expect(page.locator('body')).toBeVisible();
    await snap(page, '04-data-pendaftar');
  });

  test('1.5 Jurusan page', async ({ page }) => {
    await page.goto(`${BASE}/${SLUG}/jurusan/RPL`);
    await expect(page.locator('body')).toBeVisible();
    await snap(page, '05-jurusan');
  });
});

// ─────────────────────────────────────────────
// 2. AUTH & DASHBOARD
// ─────────────────────────────────────────────
test.describe('2. Admin Auth & Dashboard', () => {
  test('2.1 Login berhasil', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/.*\/dashboard/);
    await snap(page, '06-dashboard-home');
  });

  test('2.2 Dashboard pendaftar', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/pendaftar`);
    await page.waitForLoadState('networkidle');
    await snap(page, '07-dashboard-pendaftar');
  });

  test('2.3 Dashboard profil sekolah', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/profil-sekolah`);
    await page.waitForLoadState('networkidle');
    await snap(page, '08-dashboard-profil-sekolah');
  });

  test('2.4 Dashboard kelola UI', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/kelola-ui`);
    await page.waitForLoadState('networkidle');
    await snap(page, '09-dashboard-kelola-ui');
  });

  test('2.5 Dashboard informasi', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/informasi`);
    await page.waitForLoadState('networkidle');
    await snap(page, '10-dashboard-informasi');
  });

  test('2.6 Dashboard siswa aktif', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/siswa-aktif`);
    await page.waitForLoadState('networkidle');
    await snap(page, '11-dashboard-siswa-aktif');
  });

  test('2.7 Dashboard pembagian kelas', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/pembagian-kelas`);
    await page.waitForLoadState('networkidle');
    await snap(page, '12-dashboard-pembagian-kelas');
  });

  test('2.8 Dashboard config', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/config`);
    await page.waitForLoadState('networkidle');
    await snap(page, '13-dashboard-config');
  });

  test('2.9 Dashboard settings', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/settings`);
    await page.waitForLoadState('networkidle');
    await snap(page, '14-dashboard-settings');
  });

  test('2.10 Dashboard profile admin', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${BASE}/${SLUG}/dashboard/profile`);
    await page.waitForLoadState('networkidle');
    await snap(page, '15-dashboard-profile');
  });
});

// ─────────────────────────────────────────────
// 3. API CHECKS
// ─────────────────────────────────────────────
test.describe('3. API Security & Response', () => {
  test('3.1 Applicants API requires auth (401 without token)', async ({ request }) => {
    const res = await request.get(`${BASE}/api/applicants?school_id=smktarunabhakti`);
    expect(res.status()).toBe(401);
  });

  test('3.2 Activate endpoint requires auth', async ({ request }) => {
    const res = await request.post(`${BASE}/api/saas/activate`, {
      data: { code: 'test' }
    });
    expect(res.status()).toBe(401);
  });

  test('3.3 Export endpoint requires auth', async ({ request }) => {
    const res = await request.get(`${BASE}/api/applicants/export`);
    expect(res.status()).toBe(401);
  });
});
