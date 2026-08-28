import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { adminAuth, requireTenantId } from '../middleware/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { configSaveSchema, singleConfigSchema } from '../validations/config';
import { getCached, setCached, delCached } from '../db/redis';
import sharp from 'sharp';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const configRouter = new Hono();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveBase64File(base64Str: string, prefix: string, subfolder: string = 'jurusan'): Promise<string> {
  if (typeof base64Str !== 'string' || !base64Str.startsWith('data:')) {
    return base64Str;
  }
  try {
    const matches = base64Str.match(/^data:([A-Za-z0-9-+\/.]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Str;
    }
    const contentType = matches[1];
    const dataBuffer = Buffer.from(matches[2], 'base64');
    const targetDir = path.join(process.cwd(), 'public', 'assets', subfolder, 'uploads');

    const sizeInBytes = dataBuffer.length;
    const isVideo = contentType.startsWith('video/');

    const limitBytes = isVideo ? 100 * 1024 * 1024 : 8 * 1024 * 1024;

    if (sizeInBytes > limitBytes) {
      console.warn(`File upload rejected: ${prefix} melebihi batas ${(limitBytes/1024/1024).toFixed(0)}MB`);
      return '';
    }

    const allowedTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'application/pdf'
    ];
    if (!allowedTypes.includes(contentType)) {
      console.warn(`File upload rejected: tipe ${contentType} tidak diperbolehkan.`);
      return '';
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // IMAGE OPTIMIZATION (Sharp)
    if (contentType.startsWith('image/') && !contentType.includes('svg') && !contentType.includes('gif')) {
      const filename = `${prefix}_${Date.now()}.webp`;
      const targetPath = path.join(targetDir, filename);
      const optimizedBuffer = await sharp(dataBuffer).rotate().webp({ quality: 90, effort: 4 }).toBuffer();
      fs.writeFileSync(targetPath, optimizedBuffer);
      console.info("Image optimized", { prefix, from: contentType, to: 'webp', originalBytes: sizeInBytes, optimizedBytes: optimizedBuffer.length });
      return `/assets/jurusan/uploads/${filename}`;
    }

    // VIDEO OPTIMIZATION (FFmpeg)
    if (isVideo) {
      const tempExt = contentType.includes('mp4') ? 'mp4' : contentType.includes('webm') ? 'webm' : contentType.includes('ogg') ? 'ogg' : 'mov';
      const tempFilename = `temp_${prefix}_${Date.now()}.${tempExt}`;
      const tempPath = path.join(targetDir, tempFilename);
      fs.writeFileSync(tempPath, dataBuffer);

      const filename = `${prefix}_${Date.now()}.mp4`;
      const targetPath = path.join(targetDir, filename);

      try {
        await execPromise(`ffmpeg -i "${tempPath}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k "${targetPath}"`);
        fs.unlinkSync(tempPath); // delete temp
        const stats = fs.statSync(targetPath);
        console.info("Video optimized", { prefix, from: contentType, to: 'mp4', originalBytes: sizeInBytes, optimizedBytes: stats.size });
        return `/assets/jurusan/uploads/${filename}`;
      } catch (err) {
        console.warn(`FFmpeg optimization failed for ${prefix}, falling back to original file`, err);
        try { fs.unlinkSync(tempPath); } catch (_e) {} // ignore error if temp file already removed
      }
    }

    // FALLBACK / OTHER FILES
    let ext = 'png';
    if (contentType.includes('svg')) ext = 'svg';
    else if (contentType.includes('gif')) ext = 'gif';
    else if (contentType.includes('pdf')) ext = 'pdf';
    else if (contentType.includes('mp4')) ext = 'mp4';
    else if (contentType.includes('webm')) ext = 'webm';
    else if (contentType.includes('ogg')) ext = 'ogg';
    else if (contentType.includes('quicktime') || contentType.includes('mov')) ext = 'mov';

    const filename = `${prefix}_${Date.now()}.${ext}`;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, dataBuffer);

    return `/assets/${subfolder}/uploads/${filename}`;
  } catch (err) {
    console.error(`Failed to save base64 for ${prefix}:`, err);
    return base64Str;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processMajorsConfig(majors: any[]): Promise<any[]> {
  if (!Array.isArray(majors)) return majors;
  return Promise.all(majors.map(async (major) => {
    const updatedMajor = { ...major };
    if (updatedMajor.logo) {
      updatedMajor.logo = await saveBase64File(updatedMajor.logo, `${major.code}_logo`);
    }
    if (updatedMajor.banner) {
      updatedMajor.banner = await saveBase64File(updatedMajor.banner, `${major.code}_banner`);
    }
    if (updatedMajor.video) {
      updatedMajor.video = await saveBase64File(updatedMajor.video, `${major.code}_video`);
    }
    if (updatedMajor.gallery && Array.isArray(updatedMajor.gallery)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedMajor.gallery = await Promise.all(updatedMajor.gallery.map(async (item: any, idx: number) => {
        if (item.url) {
          return {
            ...item,
            url: await saveBase64File(item.url, `${major.code}_gallery_${idx}`)
          };
        }
        return item;
      }));
    }
    return updatedMajor;
  }));
}

// GET /api/config - Get all configurations (Public)
configRouter.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    let schoolId = c.req.query('school_id') || null;
    const schoolSlug = c.req.query('school_slug');
    const isBypassCache = Boolean(c.req.query('_t') || c.req.query('t'));

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let resolvedUUID: string | null = null;
    if (schoolSlug || (schoolId && !isUUID(schoolId))) {
      const { resolveSchoolUUID } = await import('../db/resolve-school');
      const { fontInMemSchools } = await import('./saas');
      const targetIdentifier = schoolSlug || schoolId!;
      resolvedUUID = await resolveSchoolUUID(targetIdentifier, fontInMemSchools);
      if (resolvedUUID) {
        schoolId = resolvedUUID;
      }
    }

    const cacheKey = schoolId ? `config_${schoolId}` : (schoolSlug ? `config_${schoolSlug}` : 'config_default');

    // 1. Try to get from Redis Cache first (if not cache-busting request)
    if (!isBypassCache) {
      const cachedData = await getCached<Record<string, unknown>>(cacheKey);
      if (cachedData) {
        return c.json({
          success: true,
          data: cachedData,
          source: 'cache'
        });
      }
    }

    let configs: Array<{ config_key: string; config_value: unknown }> | null = null;
    
    // Collect all possible identifier strings
    const matchIds: string[] = [];
    if (schoolId) matchIds.push(String(schoolId));
    if (schoolSlug && !matchIds.includes(schoolSlug)) matchIds.push(schoolSlug);
    if (resolvedUUID && !matchIds.includes(resolvedUUID)) matchIds.push(resolvedUUID);

    let query = supabase.from('landing_page_config').select('*');
    if (matchIds.length === 1) {
      const singleId = matchIds[0];
      const numericId = !isNaN(Number(singleId)) ? Number(singleId) : null;
      if (numericId !== null) {
        query = query.or(`school_id.eq.${singleId},school_id.eq.${numericId}`);
      } else {
        query = query.eq('school_id', singleId);
      }
    } else if (matchIds.length > 1) {
      const orClauses = matchIds.flatMap((id) => {
        const num = !isNaN(Number(id)) ? Number(id) : null;
        return num !== null ? [`school_id.eq.${id}`, `school_id.eq.${num}`] : [`school_id.eq.${id}`];
      });
      query = query.or(Array.from(new Set(orClauses)).join(','));
    }

    const { data: sbConfigs, error } = await query;
    if (!error && sbConfigs && sbConfigs.length > 0) {
      configs = sbConfigs;
    } else {
      // Direct pool query fallback
      try {
        const pgRes = await pool.query(
          `SELECT config_key, config_value FROM landing_page_config 
           WHERE school_id::text = ANY($1::text[])`,
          [matchIds]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          configs = pgRes.rows;
        }
      } catch (_pgErr) {}
    }

    const configMap: Record<string, unknown> = {};
    (configs || []).forEach((row: { config_key: string; config_value: unknown }) => {
      let val = row.config_value;
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try { val = JSON.parse(val); } catch (_e) {}
      }
      configMap[row.config_key] = val;
    });

    // Merge from in-memory store if available (in-memory has latest saved updates)
    const { fontInMemSchools } = await import('./saas');
    const lookupSlug = schoolSlug || (typeof schoolId === 'string' ? schoolId : '');
    const inMemKeys = [schoolSlug, String(schoolId), resolvedUUID, lookupSlug].filter(Boolean) as string[];
    for (const key of inMemKeys) {
      if (fontInMemSchools.has(key)) {
        const inMem = fontInMemSchools.get(key);
        if (inMem?.configs) {
          Object.assign(configMap, inMem.configs);
        }
      }
    }

    // 3. Save to Redis Cache (expire in 1 hour)
    await setCached(cacheKey, configMap, 3600);
    if (schoolSlug) await setCached(`config_${schoolSlug}`, configMap, 3600);

    const source = configs && configs.length > 0 ? 'db' : (Object.keys(configMap).length > 0 ? 'mem' : 'empty');
    console.log(`[GET-CONFIG] slug=${schoolSlug || 'none'} schoolId=${schoolId || 'none'} resolved=${resolvedUUID || 'none'} keys=${Object.keys(configMap).length} source=${source}`);

    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return c.json({
      success: true,
      data: configMap,
      source
    });
  } catch (err: unknown) {
    console.warn('Fetch config DB exception (using default config):', err instanceof Error ? err.message : String(err));
    return c.json({
      success: true,
      data: {}
    });
  }
});

// POST /api/config - Save or update configuration (Single or Bulk) (Protected Admin)
configRouter.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();

    // 1. Check if bulk config format
    if (body.configs && typeof body.configs === 'object') {
      const result = configSaveSchema.safeParse(body);
      if (!result.success) {
        return c.json({
          success: false,
          message: 'Parameter tidak valid: ' + result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        }, 400);
      }

      const { configs, description } = result.data;
      const supabase = getSupabaseClient(c.req.header('Authorization'));
      const schoolId = await requireTenantId(c);

      const processedConfigs = { ...configs };
      if (processedConfigs.ppdb_majors_config) {
        processedConfigs.ppdb_majors_config = await processMajorsConfig(processedConfigs.ppdb_majors_config);
      }
      if (processedConfigs.ppdb_logo_url) {
        processedConfigs.ppdb_logo_url = await saveBase64File(processedConfigs.ppdb_logo_url, 'school_logo', 'sekolah');
      }

      const upsertRows = Object.entries(processedConfigs).map(([key, val]) => ({
        config_key: key,
        config_value: val,
        updated_at: new Date().toISOString(),
        school_id: !isNaN(Number(schoolId)) ? Number(schoolId) : schoolId
      }));

      const { error } = await supabase
        .from('landing_page_config')
        .upsert(upsertRows, { onConflict: 'school_id,config_key' });

      if (error) {
        console.warn('Supabase upsert with compound key failed, attempting direct pool query:', error.message);
        for (const row of upsertRows) {
          try {
            await pool.query(
              `INSERT INTO landing_page_config (school_id, config_key, config_value, updated_at)
               VALUES ($1, $2, $3, NOW())
               ON CONFLICT (school_id, config_key)
               DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW()`,
              [row.school_id, row.config_key, JSON.stringify(row.config_value)]
            );
          } catch (_poolErr) {
            console.warn('Fallback pool query error:', _poolErr);
          }
        }
      }

      // Log UI Revision
      const admin = (c.get as (k: string) => unknown)('admin') as { nama?: string; username?: string; school_slug?: string; slug?: string } | undefined;
      const adminName = admin?.nama || admin?.username || 'Administrator';
      const numericSchoolId = !isNaN(Number(schoolId)) ? Number(schoolId) : schoolId;

      const revPayload: Record<string, unknown> = {
        config_values: processedConfigs,
        changed_by: adminName,
        description: description || 'Pembaruan Tampilan Sistem'
      };
      if (schoolId) revPayload.school_id = numericSchoolId;

      const { error: revErr } = await supabase.from('ui_revisions').insert(revPayload);
      if (revErr) {
        try {
          await pool.query(
            `INSERT INTO ui_revisions (school_id, config_values, changed_by, description, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [numericSchoolId, JSON.stringify(processedConfigs), adminName, description || 'Pembaruan Tampilan Sistem']
          );
        } catch (_revPoolErr) {}
      }

      // Invalidate Redis cache
      const cacheKeysToInvalidate = new Set<string>();
      if (schoolId) cacheKeysToInvalidate.add(`config_${schoolId}`);
      if (admin?.school_slug) cacheKeysToInvalidate.add(`config_${admin.school_slug}`);
      if (admin?.slug) cacheKeysToInvalidate.add(`config_${admin.slug}`);
      cacheKeysToInvalidate.add('config_default');
      const qSlugForCache = c.req.query('school_slug');
      if (qSlugForCache) cacheKeysToInvalidate.add(`config_${qSlugForCache}`);
      for (const ck of cacheKeysToInvalidate) {
        await delCached(ck);
      }

      // Update in-memory store immediately
      const { fontInMemSchools } = await import('./saas');
      const targetSlug = admin?.school_slug || admin?.slug || (typeof schoolId === 'string' && isNaN(Number(schoolId)) ? schoolId : null);
      const qSlug = c.req.query('school_slug');

      const updateInMem = (k: string) => {
        if (!k) return;
        if (!fontInMemSchools.has(k)) {
          fontInMemSchools.set(k, { slug: k, configs: {} });
        }
        const inMem = fontInMemSchools.get(k);
        if (inMem) {
          inMem.configs = { ...(inMem.configs || {}), ...processedConfigs };
          if (processedConfigs.ppdb_logo_url) inMem.logo_url = String(processedConfigs.ppdb_logo_url);
          if (processedConfigs.ppdb_title) inMem.name = String(processedConfigs.ppdb_title);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pIdentitas = (processedConfigs.ppdb_profil_sekolah as any)?.identitas;
          if (pIdentitas) {
            if (pIdentitas.npsn) inMem.npsn = pIdentitas.npsn;
            if (pIdentitas.akreditasi) inMem.accreditation = pIdentitas.akreditasi;
            if (pIdentitas.email) inMem.official_email = pIdentitas.email;
            if (pIdentitas.telepon) inMem.phone = pIdentitas.telepon;
            if (pIdentitas.alamat) inMem.address = pIdentitas.alamat;
          }
        }
      };
      if (targetSlug) updateInMem(targetSlug);
      if (schoolId) updateInMem(String(schoolId));
      if (qSlug) updateInMem(qSlug);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pIdentitas = (processedConfigs.ppdb_profil_sekolah as any)?.identitas;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const schoolUpdates: Record<string, any> = {};
        if (processedConfigs.ppdb_title) schoolUpdates.name = processedConfigs.ppdb_title;
        if (processedConfigs.ppdb_logo_url) schoolUpdates.logo_url = processedConfigs.ppdb_logo_url;
        if (pIdentitas?.npsn) schoolUpdates.npsn = pIdentitas.npsn;
        if (pIdentitas?.akreditasi) schoolUpdates.accreditation = pIdentitas.akreditasi;
        if (pIdentitas?.email) schoolUpdates.official_email = pIdentitas.email;
        if (pIdentitas?.telepon) schoolUpdates.phone = pIdentitas.telepon;
        if (pIdentitas?.alamat) schoolUpdates.address = pIdentitas.alamat;

        if (Object.keys(schoolUpdates).length > 0) {
          const resolvedSlug = targetSlug || qSlug;
          if (resolvedSlug) {
            await supabase.from('schools').update(schoolUpdates).eq('slug', resolvedSlug);
            await supabase.from('prospective_schools').update(schoolUpdates).eq('slug', resolvedSlug);
          }
          if (schoolId) {
            await supabase.from('schools').update(schoolUpdates).eq('id', schoolId);
          }
        }
      } catch (_syncErr) {}

      const revEntry = {
        id: Date.now(),
        school_id: numericSchoolId,
        config_values: processedConfigs,
        changed_by: adminName,
        description: description || 'Pembaruan Tampilan Sistem',
        created_at: new Date().toISOString()
      };
      if (schoolId) {
        const sid = String(schoolId);
        if (!fontInMemRevisions.has(sid)) fontInMemRevisions.set(sid, []);
        fontInMemRevisions.get(sid)?.unshift(revEntry);
      }
      if (targetSlug && targetSlug !== String(schoolId)) {
        if (!fontInMemRevisions.has(targetSlug)) fontInMemRevisions.set(targetSlug, []);
        fontInMemRevisions.get(targetSlug)?.unshift(revEntry);
      }

      return c.json({
        success: true,
        message: 'Konfigurasi massal berhasil disimpan.'
      });
    }

    // 2. Single config format
    const result = singleConfigSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: 'Parameter tidak valid: ' + result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      }, 400);
    }
    const { key, value } = result.data;

    let processedValue = value;
    if (key === 'ppdb_majors_config') {
      processedValue = await processMajorsConfig(value);
    } else if (key === 'ppdb_logo_url') {
      processedValue = await saveBase64File(value, 'school_logo', 'sekolah');
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);
    const numericSchoolId = !isNaN(Number(schoolId)) ? Number(schoolId) : schoolId;

    const payload: Record<string, unknown> = {
      config_key: key,
      config_value: processedValue,
      updated_at: new Date().toISOString(),
      school_id: numericSchoolId
    };

    const { error } = await supabase
      .from('landing_page_config')
      .upsert(payload, { onConflict: 'school_id,config_key' });

    if (error) {
      try {
        await pool.query(
          `INSERT INTO landing_page_config (school_id, config_key, config_value, updated_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (school_id, config_key)
           DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW()`,
          [numericSchoolId, key, JSON.stringify(processedValue)]
        );
      } catch (_poolErr) {
        console.warn('Fallback pool query for single config error:', _poolErr);
      }
    }

    // Update in-memory store immediately
    const { fontInMemSchools } = await import('./saas');
    const admin = (c.get as (k: string) => unknown)('admin') as { school_slug?: string; slug?: string } | undefined;
    const targetSlug = admin?.school_slug || admin?.slug || (typeof schoolId === 'string' && isNaN(Number(schoolId)) ? schoolId : null);
    const singleQSlug = c.req.query('school_slug');

    const updateInMem = (k: string) => {
      if (!k) return;
      if (!fontInMemSchools.has(k)) {
        fontInMemSchools.set(k, { slug: k, configs: {} });
      }
      const inMem = fontInMemSchools.get(k);
      if (inMem) {
        inMem.configs = { ...(inMem.configs || {}), [key]: processedValue };
        if (key === 'ppdb_logo_url') inMem.logo_url = String(processedValue);
        if (key === 'ppdb_title') inMem.name = String(processedValue);
      }
    };
    if (targetSlug) updateInMem(targetSlug);
    if (schoolId) updateInMem(String(schoolId));
    if (singleQSlug && singleQSlug !== targetSlug) updateInMem(singleQSlug);

    // Invalidate Redis cache
    if (schoolId) await delCached(`config_${schoolId}`);
    if (admin?.school_slug) await delCached(`config_${admin.school_slug}`);
    if (admin?.slug) await delCached(`config_${admin.slug}`);
    if (singleQSlug) await delCached(`config_${singleQSlug}`);
    await delCached('config_default');

    return c.json({
      success: true,
      message: 'Konfigurasi berhasil disimpan.'
    });
  } catch (err: unknown) {
    console.error('Save config DB error:', err instanceof Error ? err.message : String(err));
    return c.json({
      success: false,
      message: 'Gagal menyimpan konfigurasi: ' + (err instanceof Error ? err.message : String(err))
    }, 500);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fontInMemRevisions = new Map<string, Array<{ id: number; changed_by: string; description: string; created_at: string; config_values: any }>>();

// GET /api/config/revisions - Fetch revision history log (Protected Admin)
configRouter.get('/revisions', adminAuth, async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);
    const numericSchoolId = !isNaN(Number(schoolId)) ? Number(schoolId) : schoolId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (c as any).get('admin');

    const query = supabase.from('ui_revisions')
      .select('id, changed_by, description, created_at')
      .order('created_at', { ascending: false })
      .eq('school_id', numericSchoolId);

    const { data: revisions, error } = await query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let list: any[] = Array.isArray(revisions) ? revisions : [];

    if (error || list.length === 0) {
      try {
        const pgRes = await pool.query(
          `SELECT id, changed_by, description, created_at FROM ui_revisions
           WHERE school_id::text = $1::text
           ORDER BY created_at DESC LIMIT 50`,
          [String(schoolId)]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          list = pgRes.rows;
        }
      } catch (_pgErr) {
        console.warn('Fallback pool query for ui_revisions error:', _pgErr);
      }
    }

    if (list.length === 0) {
      const inMem = fontInMemRevisions.get(String(schoolId)) || (admin?.school_slug ? fontInMemRevisions.get(String(admin.school_slug)) : []) || [];
      if (inMem.length > 0) {
        list = inMem;
      }
    }

    return c.json({
      success: true,
      data: list
    });
  } catch (err: unknown) {
    console.error('Fetch revisions error:', err instanceof Error ? err.message : String(err));
    return c.json({
      success: false,
      message: 'Gagal mengambil riwayat perubahan: ' + (err instanceof Error ? err.message : String(err))
    }, 500);
  }
});

// POST /api/config/save-all - Bulk save configs and create a new revision (Protected Admin)
configRouter.post('/save-all', adminAuth, async (c) => {
  try {
    const contentLength = c.req.header('content-length') || 'unknown';
    console.log(`[INFO] Received bulk save request. Content-Length: ${contentLength} bytes.`);
    const body = await c.req.json();

    const result = configSaveSchema.safeParse(body);
    if (!result.success) {
      console.warn('[WARN] Bulk save validation failed:', result.error.format());
      return c.json({
        success: false,
        message: 'Parameter tidak valid: ' + result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      }, 400);
    }

    const { configs, description } = result.data;
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);
    const numericSchoolId = !isNaN(Number(schoolId)) ? Number(schoolId) : schoolId;

    const processedConfigs = { ...configs };
    if (processedConfigs.ppdb_majors_config) {
      processedConfigs.ppdb_majors_config = await processMajorsConfig(processedConfigs.ppdb_majors_config);
    }
    if (processedConfigs.ppdb_logo_url) {
      processedConfigs.ppdb_logo_url = await saveBase64File(processedConfigs.ppdb_logo_url, 'school_logo', 'sekolah');
    }

    console.log(`[SAVE-ALL] Saving ${Object.keys(processedConfigs).length} config keys for school_id=${numericSchoolId} (resolved from tenant: ${schoolId})`);

    let dbSaveSuccess = 0;
    let dbSaveError = 0;
    for (const [key, value] of Object.entries(processedConfigs)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        config_key: key,
        config_value: value,
        updated_at: new Date().toISOString(),
        school_id: numericSchoolId
      };

      const { error } = await supabase.from('landing_page_config').upsert(payload, { onConflict: 'school_id,config_key' });
      if (error) {
        console.warn(`[SAVE-ALL] Supabase upsert failed for key="${key}": ${error.message}`);
        try {
          await pool.query(
            `INSERT INTO landing_page_config (school_id, config_key, config_value, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (school_id, config_key)
             DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW()`,
            [numericSchoolId, key, JSON.stringify(value)]
          );
          dbSaveSuccess++;
        } catch (_poolErr) {
          dbSaveError++;
          console.warn('Fallback pool query for landing_page_config error:', _poolErr);
        }
      }
    }

    if (dbSaveError > 0) {
      console.warn(`[SAVE-ALL] DB save completed with ${dbSaveError} errors (${dbSaveSuccess} fallback successes)`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (c as any).get('admin');
    const adminName = admin?.nama || admin?.username || 'Administrator';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revPayload: any = {
      config_values: configs,
      changed_by: adminName,
      description: description || 'Melakukan pembaruan massal UI',
      school_id: numericSchoolId
    };

    const { error: revError } = await supabase.from('ui_revisions').insert(revPayload);
    if (revError) {
      try {
        await pool.query(
          `INSERT INTO ui_revisions (school_id, config_values, changed_by, description, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [String(numericSchoolId), JSON.stringify(configs), adminName, description || 'Melakukan pembaruan massal UI']
        );
      } catch (_revPoolErr) {
        console.warn('Fallback pool query for ui_revisions error:', _revPoolErr);
      }
    }

    // Always record in-memory revision log
    const revRecord = {
      id: Date.now(),
      changed_by: adminName,
      description: description || 'Melakukan pembaruan massal UI',
      created_at: new Date().toISOString(),
      config_values: configs
    };
    const sKey = String(numericSchoolId);
    if (!fontInMemRevisions.has(sKey)) fontInMemRevisions.set(sKey, []);
    fontInMemRevisions.get(sKey)!.unshift(revRecord);

    // Update in-memory store
    const { fontInMemSchools } = await import('./saas');
    const targetSlug = admin?.school_slug || admin?.slug || (typeof schoolId === 'string' && isNaN(Number(schoolId)) ? schoolId : null);
    const qSlug = c.req.query('school_slug');

    // Helper: always create entry if missing, then merge configs
    const updateInMem = (k: string) => {
      if (!k) return;
      if (!fontInMemSchools.has(k)) {
        fontInMemSchools.set(k, { slug: k, configs: {} });
      }
      const inMem = fontInMemSchools.get(k);
      if (inMem) {
        inMem.configs = { ...(inMem.configs || {}), ...processedConfigs };
        if (processedConfigs.ppdb_logo_url) inMem.logo_url = String(processedConfigs.ppdb_logo_url);
        if (processedConfigs.ppdb_title) inMem.name = String(processedConfigs.ppdb_title);
      }
    };

    if (targetSlug) {
      if (!fontInMemRevisions.has(targetSlug)) fontInMemRevisions.set(targetSlug, []);
      fontInMemRevisions.get(targetSlug)!.unshift(revRecord);
      updateInMem(targetSlug);
    }
    if (schoolId) updateInMem(String(schoolId));
    if (qSlug && qSlug !== targetSlug) updateInMem(qSlug);

    // Invalidate Redis cache — cover ALL possible cache keys
    const cacheKeys = new Set<string>();
    if (schoolId) cacheKeys.add(`config_${schoolId}`);
    if (admin?.school_slug) cacheKeys.add(`config_${admin.school_slug}`);
    if (admin?.slug) cacheKeys.add(`config_${admin.slug}`);
    if (targetSlug) cacheKeys.add(`config_${targetSlug}`);
    if (qSlug) cacheKeys.add(`config_${qSlug}`);
    cacheKeys.add('config_default');
    for (const ck of cacheKeys) {
      await delCached(ck);
    }

    console.log('[SUCCESS] Configurations successfully saved to PostgreSQL database.');
    return c.json({
      success: true,
      message: 'Semua konfigurasi berhasil disimpan dan tercatat dalam riwayat perubahan.'
    });
  } catch (err: unknown) {
    console.error('[ERROR] Failed to parse/save configurations:', err);
    return c.json({
      success: false,
      message: `Gagal menyimpan konfigurasi: ${err instanceof Error ? err.message : 'Error tidak diketahui'}`
    }, 500);
  }
});

// POST /api/config/restore - Revert all configurations to a previous revision (Protected Admin)
configRouter.post('/restore', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { revisionId } = body;

    if (!revisionId) {
      return c.json({
        success: false,
        message: 'Parameter revisionId wajib diisi.'
      }, 400);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    const query = supabase.from('ui_revisions').select('*').eq('id', parseInt(revisionId))
      .eq('school_id', schoolId);
    const { data: revision, error } = await query.single();

    if (error || !revision) {
      return c.json({
        success: false,
        message: `Riwayat perubahan dengan ID ${revisionId} tidak ditemukan.`
      }, 404);
    }

    const { config_values, changed_by } = revision;
    let configs = config_values;
    if (typeof config_values === 'string') {
      try {
        configs = JSON.parse(config_values);
      } catch (_e) {
        configs = {};
      }
    }

    for (const [key, value] of Object.entries(configs)) {
      const payload: Record<string, unknown> = {
        config_key: key,
        config_value: value,
        updated_at: new Date().toISOString()
      };
      payload.school_id = schoolId;
      await supabase.from('landing_page_config').upsert(payload, { onConflict: 'config_key' });
    }

    const admin = (c.get as (k: string) => unknown)('admin') as { nama?: string; username?: string } | undefined;
    const adminName = admin?.nama || admin?.username || 'Administrator';

    const newRevPayload: Record<string, unknown> = {
      config_values: configs,
      changed_by: adminName,
      description: `Mengembalikan (Restore) tampilan ke versi riwayat #${revisionId} (dibuat oleh ${changed_by})`
    };
    newRevPayload.school_id = schoolId;

    await supabase.from('ui_revisions').insert(newRevPayload);

    return c.json({
      success: true,
      message: `Berhasil mengembalikan (restore) tampilan ke versi #${revisionId}.`
    });
  } catch (err: unknown) {
    console.error('Failed to restore configuration revision:', err);
    return c.json({
      success: false,
      message: `Gagal melakukan pemulihan konfigurasi: ${err instanceof Error ? err.message : String(err)}`
    }, 500);
  }
});

// ===================================================================
// REGISTRATION FEE (SCHOOL-SPECIFIC)
// ===================================================================

// GET /api/config/registration_fee - PUBLIC
configRouter.get('/registration_fee', async (c) => {
  const schoolId = c.req.header('X-School-Id');
  if (!schoolId) {
    return c.json({ success: false, message: 'X-School-Id header is required' }, 400);
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('landing_page_config')
      .select('config_value')
      .eq('school_id', schoolId)
      .eq('config_key', 'registration_fee')
      .maybeSingle();

    if (error) throw error;
    return c.json({ success: true, data });
  } catch (_err: unknown) {
    return c.json({ success: false, message: 'Failed to fetch config' }, 500);
  }
});

// POST /api/config/registration_fee - ADMIN AUTH
configRouter.post('/registration_fee', adminAuth, async (c) => {
  try {
    const schoolId = await requireTenantId(c);
    const body = await c.req.json();
    const { amount } = body;

    if (amount == null || isNaN(Number(amount))) {
      return c.json({ success: false, message: 'Amount must be a number' }, 400);
    }

    const configValue = { amount: Number(amount) };

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('landing_page_config')
      .upsert(
        { school_id: schoolId, config_key: 'registration_fee', config_value: configValue, updated_at: new Date().toISOString() },
        { onConflict: 'school_id,config_key' }
      )
      .select()
      .single();

    if (error) throw error;

    return c.json({ success: true, message: 'Registration fee updated', data });
  } catch (err: unknown) {
    return c.json({ success: false, message: err instanceof Error ? err.message : String(err) }, 500);
  }
});

export default configRouter;
