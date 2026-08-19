import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { adminAuth, requireTenantId, TenantError } from '../middleware/auth';
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
    
    // Limits: Image 8MB, Video 100MB
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
        try { fs.unlinkSync(tempPath); } catch (e) {} // ignore error if temp file already removed
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

    // If school_slug is provided, resolve it to school_id
    if (schoolSlug && !schoolId) {
      let tenantData = null;
      const { data: sData } = await supabase.from('schools').select('id').eq('slug', schoolSlug).maybeSingle();
      if (sData) tenantData = sData;
      else {
        const { data: pData } = await supabase.from('prospective_schools').select('id').eq('slug', schoolSlug).maybeSingle();
        if (pData) tenantData = pData;
        else {
          const { data: cData } = await supabase.from('calon_sekolah').select('id').eq('slug', schoolSlug).maybeSingle();
          if (cData) tenantData = cData;
        }
      }

      if (tenantData) {
        schoolId = tenantData.id;
      } else {
        return c.json({ success: true, data: {} });
      }
    }

    const cacheKey = schoolId ? `config_${schoolId}` : 'config_default';
    
    // 1. Try to get from Redis Cache first
    const cachedData = await getCached<Record<string, any>>(cacheKey);
    if (cachedData) {
      return c.json({
        success: true,
        data: cachedData,
        source: 'cache'
      });
    }

    let query = supabase.from('landing_page_config').select('*');
    if (schoolId) query = query.eq('school_id', schoolId);
    
    const { data: configs, error } = await query;
    if (error) {
      console.warn('Fetch config DB warning (using default config):', error.message);
      return c.json({
        success: true,
        data: {}
      });
    }

    const configMap: Record<string, any> = {};
    (configs || []).forEach((row: any) => {
      configMap[row.config_key] = row.config_value;
    });

    // 3. Save to Redis Cache (expire in 1 hour)
    await setCached(cacheKey, configMap, 3600);

    return c.json({
      success: true,
      data: configMap,
      source: 'db'
    });
  } catch (err: any) {
    console.warn('Fetch config DB exception (using default config):', err.message);
    return c.json({
      success: true,
      data: {}
    });
  }
});

// POST /api/config - Save or update configuration (Protected Admin)
configRouter.post('/', adminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const result = singleConfigSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: 'Parameter tidak valid: ' + result.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
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

    const payload: any = {
      config_key: key,
      config_value: processedValue,
      updated_at: new Date().toISOString(),
      school_id: schoolId
    };

    const { error } = await supabase
      .from('landing_page_config')
      .upsert(payload, { onConflict: 'config_key' });
      
    if (error) throw error;

    // Invalidate Redis cache
    const cacheKey = schoolId ? `config_${schoolId}` : 'config_default';
    await delCached(cacheKey);

    return c.json({
      success: true,
      message: 'Konfigurasi berhasil disimpan.'
    });
  } catch (err: any) {
    console.error('Save config DB error:', err.message);
    return c.json({
      success: false,
      message: 'Gagal menyimpan konfigurasi: ' + err.message
    }, 500);
  }
});

// GET /api/config/revisions - Fetch revision history log (Protected Admin)
configRouter.get('/revisions', adminAuth, async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    let query = supabase.from('ui_revisions')
      .select('id, changed_by, description, created_at')
      .order('created_at', { ascending: false })
      .eq('school_id', schoolId);

    const { data: revisions, error } = await query;
    if (error) throw error;

    return c.json({
      success: true,
      data: revisions
    });
  } catch (err: any) {
    console.error('Fetch revisions error:', err.message);
    return c.json({
      success: false,
      message: 'Gagal mengambil riwayat perubahan: ' + err.message
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
        message: 'Parameter tidak valid: ' + result.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
      }, 400);
    }

    const { configs, description } = result.data;
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = await requireTenantId(c);

    let processedConfigs = { ...configs };
    if (processedConfigs.ppdb_majors_config) {
      processedConfigs.ppdb_majors_config = await processMajorsConfig(processedConfigs.ppdb_majors_config);
    }
    if (processedConfigs.ppdb_logo_url) {
      processedConfigs.ppdb_logo_url = await saveBase64File(processedConfigs.ppdb_logo_url, 'school_logo', 'sekolah');
    }

    for (const [key, value] of Object.entries(processedConfigs)) {
      const payload: any = {
        config_key: key,
        config_value: value,
        updated_at: new Date().toISOString()
      };
      payload.school_id = schoolId;

      const { error } = await supabase.from('landing_page_config').upsert(payload, { onConflict: 'config_key' });
      if (error) throw error;
    }

    const admin = (c as any).get('admin');
    const adminName = admin?.nama || admin?.username || 'Administrator';
    
    const revPayload: any = {
      config_values: configs,
      changed_by: adminName,
      description: description || 'Melakukan pembaruan massal UI'
    };
    revPayload.school_id = schoolId;

    const { error: revError } = await supabase.from('ui_revisions').insert(revPayload);
    if (revError) throw revError;

    // Invalidate Redis cache
    const cacheKey = schoolId ? `config_${schoolId}` : 'config_default';
    await delCached(cacheKey);

    console.log('[SUCCESS] Configurations successfully saved to PostgreSQL database.');
    return c.json({
      success: true,
      message: 'Semua konfigurasi berhasil disimpan dan tercatat dalam riwayat perubahan.'
    });
  } catch (err: any) {
    console.error('[ERROR] Failed to parse/save configurations:', err);
    return c.json({
      success: false,
      message: `Gagal menyimpan konfigurasi: ${err.message || 'Error tidak diketahui'}`
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

    let query = supabase.from('ui_revisions').select('*').eq('id', parseInt(revisionId))
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
      } catch (e) {
        configs = {};
      }
    }

    for (const [key, value] of Object.entries(configs)) {
      const payload: any = {
        config_key: key,
        config_value: value,
        updated_at: new Date().toISOString()
      };
      payload.school_id = schoolId;
      await supabase.from('landing_page_config').upsert(payload, { onConflict: 'config_key' });
    }

    const admin = (c as any).get('admin');
    const adminName = admin?.nama || admin?.username || 'Administrator';
    
    const newRevPayload: any = {
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
  } catch (err: any) {
    console.error('Failed to restore configuration revision:', err);
    return c.json({
      success: false,
      message: `Gagal melakukan pemulihan konfigurasi: ${err.message}`
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
  } catch (err: any) {
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
        { onConflict: 'config_key' }
      )
      .select()
      .single();

    if (error) throw error;

    return c.json({ success: true, message: 'Registration fee updated', data });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 500);
  }
});

export default configRouter;
