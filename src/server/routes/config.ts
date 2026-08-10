import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { adminAuth } from '../middleware/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { configSaveSchema, singleConfigSchema } from '../validations/config';

const configRouter = new Hono();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function saveBase64File(base64Str: string, prefix: string, subfolder: string = 'jurusan'): string {
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

    const sizeInBytes = dataBuffer.length;
    if (sizeInBytes > 5 * 1024 * 1024) {
      console.warn(`File upload rejected: ${prefix} melebihi batas 5MB (${(sizeInBytes/1024/1024).toFixed(2)}MB)`);
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
    
    let ext = 'png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
    else if (contentType.includes('webp')) ext = 'webp';
    else if (contentType.includes('svg')) ext = 'svg';
    else if (contentType.includes('gif')) ext = 'gif';
    else if (contentType.includes('mp4')) ext = 'mp4';
    else if (contentType.includes('webm')) ext = 'webm';
    else if (contentType.includes('ogg')) ext = 'ogg';
    else if (contentType.includes('quicktime') || contentType.includes('mov')) ext = 'mov';
    
    const filename = `${prefix}_${Date.now()}.${ext}`;
    const dynamicTargetDir = path.join(process.cwd(), 'public', 'assets', subfolder, 'uploads');
    
    if (!fs.existsSync(dynamicTargetDir)) {
      fs.mkdirSync(dynamicTargetDir, { recursive: true });
    }
    const targetPath = path.join(dynamicTargetDir, filename);
    fs.writeFileSync(targetPath, dataBuffer);
    
    return `/assets/${subfolder}/uploads/${filename}`;
  } catch (err) {
    console.error(`Failed to save base64 for ${prefix}:`, err);
    return base64Str;
  }
}

function processMajorsConfig(majors: any[]): any[] {
  if (!Array.isArray(majors)) return majors;
  return majors.map((major) => {
    const updatedMajor = { ...major };
    if (updatedMajor.logo) {
      updatedMajor.logo = saveBase64File(updatedMajor.logo, `${major.code}_logo`);
    }
    if (updatedMajor.banner) {
      updatedMajor.banner = saveBase64File(updatedMajor.banner, `${major.code}_banner`);
    }
    if (updatedMajor.video) {
      updatedMajor.video = saveBase64File(updatedMajor.video, `${major.code}_video`);
    }
    if (updatedMajor.gallery && Array.isArray(updatedMajor.gallery)) {
      updatedMajor.gallery = updatedMajor.gallery.map((item: any, idx: number) => {
        if (item.url) {
          return {
            ...item,
            url: saveBase64File(item.url, `${major.code}_gallery_${idx}`)
          };
        }
        return item;
      });
    }
    return updatedMajor;
  });
}

// GET /api/config - Get all configurations (Public)
configRouter.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

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

    return c.json({
      success: true,
      data: configMap
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
      processedValue = processMajorsConfig(value);
    } else if (key === 'ppdb_logo_url') {
      processedValue = saveBase64File(value, 'school_logo', 'sekolah');
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

    const payload: any = {
      config_key: key,
      config_value: processedValue,
      updated_at: new Date().toISOString()
    };
    if (schoolId) payload.school_id = schoolId;

    const { error } = await supabase
      .from('landing_page_config')
      .upsert(payload, { onConflict: 'config_key' });
      
    if (error) throw error;

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
    const schoolId = c.req.query('school_id') || null;

    let query = supabase.from('ui_revisions')
      .select('id, changed_by, description, created_at')
      .order('created_at', { ascending: false });
    
    if (schoolId) query = query.eq('school_id', schoolId);

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
    const schoolId = c.req.query('school_id') || null;

    let processedConfigs = { ...configs };
    if (processedConfigs.ppdb_majors_config) {
      processedConfigs.ppdb_majors_config = processMajorsConfig(processedConfigs.ppdb_majors_config);
    }
    if (processedConfigs.ppdb_logo_url) {
      processedConfigs.ppdb_logo_url = saveBase64File(processedConfigs.ppdb_logo_url, 'school_logo', 'sekolah');
    }

    for (const [key, value] of Object.entries(processedConfigs)) {
      const payload: any = {
        config_key: key,
        config_value: value,
        updated_at: new Date().toISOString()
      };
      if (schoolId) payload.school_id = schoolId;

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
    if (schoolId) revPayload.school_id = schoolId;

    const { error: revError } = await supabase.from('ui_revisions').insert(revPayload);
    if (revError) throw revError;

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
    const schoolId = c.req.query('school_id') || null;

    let query = supabase.from('ui_revisions').select('*').eq('id', parseInt(revisionId));
    if (schoolId) query = query.eq('school_id', schoolId);
    const { data: revision, error } = await query.single();
    
    if (error || !revision) {
      return c.json({
        success: false,
        message: `Riwayat perubahan dengan ID ${revisionId} tidak ditemukan.`
      }, 404);
    }

    const { config_values, changed_by } = revision;
    const configs = typeof config_values === 'string' ? JSON.parse(config_values) : config_values;

    for (const [key, value] of Object.entries(configs)) {
      const payload: any = {
        config_key: key,
        config_value: value,
        updated_at: new Date().toISOString()
      };
      if (schoolId) payload.school_id = schoolId;
      await supabase.from('landing_page_config').upsert(payload, { onConflict: 'config_key' });
    }

    const admin = (c as any).get('admin');
    const adminName = admin?.nama || admin?.username || 'Administrator';
    
    const newRevPayload: any = {
      config_values: configs,
      changed_by: adminName,
      description: `Mengembalikan (Restore) tampilan ke versi riwayat #${revisionId} (dibuat oleh ${changed_by})`
    };
    if (schoolId) newRevPayload.school_id = schoolId;

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

export default configRouter;
