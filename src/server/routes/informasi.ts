import { Hono, Context } from 'hono';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '../db/supabase';
import { adminAuth } from '../middleware/auth';
import { createInformasiSchema, updateInformasiSchema } from '../validations/informasi';
import { isValidUUID, resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';

const router = new Hono();

async function saveBase64Media(base64Str: string, prefix: string): Promise<string> {
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
    const targetDir = path.join(process.cwd(), 'public', 'assets', 'informasi', 'uploads');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let ext = 'png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
    else if (contentType.includes('webp')) ext = 'webp';
    else if (contentType.includes('gif')) ext = 'gif';
    else if (contentType.includes('svg')) ext = 'svg';
    else if (contentType.includes('pdf')) ext = 'pdf';
    else if (contentType.includes('mp4')) ext = 'mp4';
    else if (contentType.includes('webm')) ext = 'webm';
    else if (contentType.includes('msword') || contentType.includes('wordprocessingml')) ext = 'docx';
    else if (contentType.includes('excel') || contentType.includes('spreadsheetml')) ext = 'xlsx';

    const filename = `${prefix}_${Date.now()}.${ext}`;
    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, dataBuffer);
    return `/assets/informasi/uploads/${filename}`;
  } catch (err) {
    console.warn('Failed to save base64 media:', err);
    return base64Str;
  }
}

async function processInformasiMedia(fotoUrl: string | null | undefined): Promise<string | null> {
  if (!fotoUrl) return null;
  if (!fotoUrl.startsWith('{')) {
    if (fotoUrl.startsWith('data:')) {
      return await saveBase64Media(fotoUrl, 'info_media');
    }
    return fotoUrl;
  }
  try {
    const media = JSON.parse(fotoUrl);
    if (media.foto && media.foto.startsWith('data:')) {
      media.foto = await saveBase64Media(media.foto, 'info_foto');
    }
    if (media.video && media.video.startsWith('data:')) {
      media.video = await saveBase64Media(media.video, 'info_video');
    }
    if (media.dokumen && media.dokumen.startsWith('data:')) {
      media.dokumen = await saveBase64Media(media.dokumen, 'info_dokumen');
    }
    return JSON.stringify(media);
  } catch (_e) {
    return fotoUrl;
  }
}

interface _InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: Date | string;
  foto_url: string | null;
  created_at: Date | string | null;
}

function getAdminSchoolId(c: Context): string | undefined {
  const admin = c.get('admin') as { school_id?: string } | undefined;
  return admin?.school_id;
}

router.get('/', async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const rawSchoolId = c.req.query('school_id') || null;

    let query = supabase.from('school_announcements').select('*').order('tanggal', { ascending: false }).order('created_at', { ascending: false });

    if (rawSchoolId) {
      let targetUUID: string | null = null;
      if (isValidUUID(rawSchoolId)) {
        targetUUID = rawSchoolId;
      } else {
        targetUUID = await resolveSchoolUUID(rawSchoolId, fontInMemSchools);
      }

      if (targetUUID && isValidUUID(targetUUID)) {
        query = query.eq('school_id', targetUUID);
      } else {
        // Return empty announcements safely without throwing invalid UUID syntax error (500)
        return c.json({
          success: true,
          data: []
        });
      }
    }

    const { data: rows, error } = await query;
    if (error) throw error;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizedRows = (rows || []).map((row: any) => {
      if (row.foto_url && row.foto_url.startsWith('{')) {
        try {
          const parsed = JSON.parse(row.foto_url);
          return {
            ...row,
            foto_url: JSON.stringify({
              foto: parsed.foto || "",
              video: "", 
              video_name: parsed.video_name || "",
              dokumen: "", 
              dokumen_name: parsed.dokumen_name || ""
            })
          };
        } catch (_e) {
          return row;
        }
      }
      return row;
    });

    return c.json({
      success: true,
      data: sanitizedRows
    });
  } catch (error: unknown) {
    console.error('Error fetching informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal mengambil data informasi.',
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

router.get('/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    if (isNaN(id) || id <= 0) {
      return c.json({
        success: false,
        message: 'ID tidak valid.'
      }, 400);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const rawSchoolId = c.req.query('school_id') || null;
    let query = supabase.from('school_announcements').select('*').eq('id', id);

    if (rawSchoolId) {
      const targetUUID = isValidUUID(rawSchoolId) ? rawSchoolId : await resolveSchoolUUID(rawSchoolId, fontInMemSchools);
      if (targetUUID && isValidUUID(targetUUID)) {
        query = query.eq('school_id', targetUUID);
      }
    }

    const { data: record, error } = await query.maybeSingle();

    if (error || !record) {
      return c.json({
        success: false,
        message: 'Informasi tidak ditemukan.'
      }, 404);
    }

    return c.json({
      success: true,
      data: record
    });
  } catch (error: unknown) {
    console.error('Error fetching informasi detail:', error);
    return c.json({
      success: false,
      message: 'Gagal mengambil detail informasi.',
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

router.post('/', adminAuth, async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = createInformasiSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const { judul, konten, tanggal, foto_url } = result.data;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const rawSchoolId = getAdminSchoolId(c);
    if (!rawSchoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    const targetUUID = isValidUUID(rawSchoolId) ? rawSchoolId : await resolveSchoolUUID(rawSchoolId, fontInMemSchools);
    const processedFotoUrl = await processInformasiMedia(foto_url);

    const insertData: Record<string, unknown> = {
      judul,
      konten,
      tanggal: new Date(tanggal).toISOString(),
      foto_url: processedFotoUrl
    };
    if (targetUUID && isValidUUID(targetUUID)) {
      insertData.school_id = targetUUID;
    }

    const { data: savedRecord, error } = await supabase.from('school_announcements').insert(insertData).select().single();
    if (error) throw error;

    return c.json({
      success: true,
      message: 'Informasi berhasil ditambahkan.',
      data: savedRecord
    }, 201);
  } catch (error: unknown) {
    console.error('Error creating informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal menambahkan informasi.',
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

router.put('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const body = await c.req.json();
    const result = updateInformasiSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const { judul, konten, tanggal, foto_url } = result.data;

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const rawSchoolId = getAdminSchoolId(c);
    if (!rawSchoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    const targetUUID = isValidUUID(rawSchoolId) ? rawSchoolId : await resolveSchoolUUID(rawSchoolId, fontInMemSchools);

    let checkQuery = supabase.from('school_announcements').select('id').eq('id', id);
    if (targetUUID && isValidUUID(targetUUID)) {
      checkQuery = checkQuery.eq('school_id', targetUUID);
    }

    const { data: checkExists } = await checkQuery.maybeSingle();

    if (!checkExists) {
      return c.json({
        success: false,
        message: 'Informasi tidak ditemukan.'
      }, 404);
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (judul !== undefined) dataToUpdate.judul = judul;
    if (konten !== undefined) dataToUpdate.konten = konten;
    if (tanggal !== undefined) dataToUpdate.tanggal = new Date(tanggal).toISOString();
    if (foto_url !== undefined) {
      dataToUpdate.foto_url = await processInformasiMedia(foto_url);
    }

    let updateQuery = supabase.from('school_announcements').update(dataToUpdate).eq('id', id);
    if (targetUUID && isValidUUID(targetUUID)) {
      updateQuery = updateQuery.eq('school_id', targetUUID);
    }

    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    return c.json({
      success: true,
      message: 'Informasi berhasil diperbarui.',
      data: updatedRecord
    });
  } catch (error: unknown) {
    console.error('Error updating informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal memperbarui informasi.',
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

router.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const rawSchoolId = getAdminSchoolId(c);
    if (!rawSchoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    const targetUUID = isValidUUID(rawSchoolId) ? rawSchoolId : await resolveSchoolUUID(rawSchoolId, fontInMemSchools);

    let query = supabase.from('school_announcements').delete().eq('id', id);
    if (targetUUID && isValidUUID(targetUUID)) {
      query = query.eq('school_id', targetUUID);
    }

    const { data, error } = await query.select();

    if (error || !data || data.length === 0) {
      return c.json({
        success: false,
        message: 'Informasi tidak ditemukan atau gagal dihapus.'
      }, 404);
    }

    return c.json({
      success: true,
      message: 'Informasi berhasil dihapus.'
    });
  } catch (error: unknown) {
    console.error('Error deleting informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal menghapus informasi.',
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

export default router;
