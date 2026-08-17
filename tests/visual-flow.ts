import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE = 'https://cationgate.site';
const SLUG = 'smktarunabhakti';
const SHOT_DIR = path.join(process.cwd(), 'test-results', 'live-shots');
if (!fs.existsSync(SHOT_DIR)) fs.mkdirSync(SHOT_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  let i = 1;

  async function shot(label: string) {
    const file = path.join(SHOT_DIR, `${String(i++).padStart(2,'0')}-${label}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`📸 ${file}`);
  }

  // ═══════════════════════════════════════
  // FASE 1: LANDING PAGE
  // ═══════════════════════════════════════
  console.log('\n🌐 FASE 1: Landing Page');
  await page.goto(`${BASE}/${SLUG}`);
  await page.waitForLoadState('networkidle');
  await shot('landing-page');

  // ═══════════════════════════════════════
  // FASE 2: HALAMAN DAFTAR
  // ═══════════════════════════════════════
  console.log('\n📝 FASE 2: Halaman Daftar');
  await page.goto(`${BASE}/${SLUG}/daftar`);
  await page.waitForLoadState('networkidle');
  await shot('daftar-page');

  // ═══════════════════════════════════════
  // FASE 3: PROFIL SEKOLAH
  // ═══════════════════════════════════════
  console.log('\n🏫 FASE 3: Profil Sekolah');
  await page.goto(`${BASE}/${SLUG}/profil`);
  await page.waitForLoadState('networkidle');
  await shot('profil-sekolah');

  // ═══════════════════════════════════════
  // FASE 4: DATA PENDAFTAR PUBLIC
  // ═══════════════════════════════════════
  console.log('\n📊 FASE 4: Data Pendaftar Public');
  await page.goto(`${BASE}/${SLUG}/data-pendaftar`);
  await page.waitForLoadState('networkidle');
  await shot('data-pendaftar');

  // ═══════════════════════════════════════
  // FASE 5: LOGIN ADMIN
  // ═══════════════════════════════════════
  console.log('\n🔐 FASE 5: Login Admin');
  await page.goto(`${BASE}/${SLUG}/auth/login`);
  await page.waitForLoadState('networkidle');
  await shot('login-page');

  // Login
  await page.getByPlaceholder('Masukkan email').fill('superadmin_sekolah');
  await page.getByPlaceholder('Masukkan password').fill('admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await shot('dashboard-home');

  // ═══════════════════════════════════════
  // FASE 6: DASHBOARD MODULES
  // ═══════════════════════════════════════
  console.log('\n📋 FASE 6: Dashboard Modules');
  const dashModules = [
    ['pendaftar', 'Dashboard Pendaftar'],
    ['informasi', 'Dashboard Informasi'],
    ['kelola-ui', 'Dashboard Kelola UI'],
    ['profil-sekolah', 'Dashboard Profil Sekolah'],
    ['siswa-aktif', 'Dashboard Siswa Aktif'],
    ['pembagian-kelas', 'Dashboard Pembagian Kelas'],
    ['config', 'Dashboard Config'],
    ['settings', 'Dashboard Settings'],
    ['profile', 'Dashboard Profile Admin'],
  ];

  for (const [mod, label] of dashModules) {
    console.log(`  → ${label}`);
    await page.goto(`${BASE}/${SLUG}/dashboard/${mod}`);
    await page.waitForLoadState('networkidle');
    await shot(`dash-${mod}`);
  }

  // ═══════════════════════════════════════
  // SELESAI
  // ═══════════════════════════════════════
  console.log('\n✅ SEMUA FASE SELESAI!');
  console.log(`📸 ${i-1} screenshot tersimpan di ${SHOT_DIR}`);

  await browser.close();
})();
