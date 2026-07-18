
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.FE_URL || 'http://localhost:3000';

test.describe('Frontend Functional Page Tests', () => {

  test('Page /auth/login should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/auth/login';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /daftar should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/daftar';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/admin should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/admin';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/informasi should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/informasi';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/informasi/[id] should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/informasi/1';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/kelola-ui should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/kelola-ui';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/pembagian-kelas should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/pembagian-kelas';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/pendaftar should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/pendaftar';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/profile should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/profile';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/settings should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/settings';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /dashboard/siswa-aktif should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/dashboard/siswa-aktif';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /data-pendaftar should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/data-pendaftar';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /forum should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/forum';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /invoice should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/invoice';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /jurusan/[code] should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/jurusan/1';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page / should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });


  test('Page /verify/[id] should load without crash', async ({ page: browserPage }) => {
    const targetUrl = BASE_URL + '/verify/1';
    const response = await browserPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Assert HTTP status is 200 or 304
    expect([200, 304, 301, 302]).toContain(response?.status() || 200);
    
    // Assert body is rendered
    const body = await browserPage.locator('body');
    await expect(body).toBeVisible();

    // Take screenshot
    await browserPage.screenshot({ path: `.omnitest/screenshots/page-${Date.now()}.png` });
  });

});
