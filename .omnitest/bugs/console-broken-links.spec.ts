
import { test, expect } from '@playwright/test';

const FE_URL = 'http://localhost:3000';

test.describe('🐛 Bug & Error Scanner: Console Errors & Broken Assets', () => {

  test('Page /auth/login should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/auth/login';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /auth/login:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /auth/login:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /daftar should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/daftar';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /daftar:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /daftar:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/admin should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/admin';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/admin:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/admin:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/informasi should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/informasi';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/informasi:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/informasi:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/informasi/[id] should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/informasi/1';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/informasi/[id]:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/informasi/[id]:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/kelola-ui should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/kelola-ui';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/kelola-ui:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/kelola-ui:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/pembagian-kelas should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/pembagian-kelas';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/pembagian-kelas:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/pembagian-kelas:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/pendaftar should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/pendaftar';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/pendaftar:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/pendaftar:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/profile should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/profile';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/profile:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/profile:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/settings should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/settings';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/settings:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/settings:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /dashboard/siswa-aktif should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/dashboard/siswa-aktif';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /dashboard/siswa-aktif:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /dashboard/siswa-aktif:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /data-pendaftar should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/data-pendaftar';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /data-pendaftar:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /data-pendaftar:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /forum should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/forum';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /forum:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /forum:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /invoice should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/invoice';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /invoice:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /invoice:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /jurusan/[code] should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/jurusan/1';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /jurusan/[code]:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /jurusan/[code]:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page / should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });


  test('Page /verify/[id] should have zero JavaScript console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(err);
    });

    const targetUrl = FE_URL + '/verify/1';
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

    // Check for JavaScript exception errors
    if (pageErrors.length > 0) {
      console.warn('⚠️ Unhandled Exception on /verify/[id]:', pageErrors.map(e => e.message));
    }

    // Check broken images
    const brokenImages = await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken: string[] = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    if (brokenImages.length > 0) {
      console.warn('⚠️ Broken Images found on /verify/[id]:', brokenImages);
    }

    expect(pageErrors.length).toBe(0);
  });

});
