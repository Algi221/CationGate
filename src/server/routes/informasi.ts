import { Hono, Context } from 'hono';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '../db/supabase';
import { pool } from '../db/client';
import { adminAuth } from '../middleware/auth';
import { createInformasiSchema, updateInformasiSchema } from '../validations/informasi';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';

const router = new Hono();

async function saveBase64Media(base64Data: string, prefix: string): Promise<string> {
  if (typeof base64Data !== 'string' || !base64Data.startsWith('data:')) {
    return base64Data;
  }
  const matches = base64Data.match(/^data:([A-Za-z0-9-+\/.]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return base64Data;
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  let extension = 'png';
  if (mimeType.includes('image/png')) extension = 'png';
  else if (mimeType.includes('image/jpeg') || mimeType.includes('image/jpg')) extension = 'jpg';
  else if (mimeType.includes('image/webp')) extension = 'webp';
  else if (mimeType.includes('video/mp4')) extension = 'mp4';
  else if (mimeType.includes('application/pdf')) extension = 'pdf';
  else if (mimeType.includes('image/gif')) extension = 'gif';
  else if (mimeType.includes('image/svg')) extension = 'svg';

  const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
  const targetDir = path.join(process.cwd(), 'public', 'assets', 'informasi', 'uploads');

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, filename), buffer);
    return `/assets/informasi/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 media:', err);
    return base64Data;
  }
}

async function processInformasiMedia(fotoUrl: string | null | undefined): Promise<string | null> {
  if (!fotoUrl) return null;
  if (!fotoUrl.startsWith('{')) {
    if (fotoUrl.startsWith('data:')) {
      return await saveBase64Media(fotoUrl, 'info_img');
    }
    return fotoUrl;
  }

  try {
    const parsed = JSON.parse(fotoUrl);
    const result: Record<string, string> = { ...parsed };
    if (parsed.foto && parsed.foto.startsWith('data:')) {
      result.foto = await saveBase64Media(parsed.foto, 'info_foto');
    }
    if (parsed.video && parsed.video.startsWith('data:')) {
      result.video = await saveBase64Media(parsed.video, 'info_video');
    }
    if (parsed.dokumen && parsed.dokumen.startsWith('data:')) {
      result.dokumen = await saveBase64Media(parsed.dokumen, 'info_dokumen');
    }
    return JSON.stringify(result);
  } catch (_e) {
    return fotoUrl;
  }
}

function getAdminSchoolId(c: Context): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = c.get('admin') as any;
  return admin?.school_id || admin?.school_slug || admin?.slug;
}

// GET /informasi - Public list
router.get('/', async (c: Context) => {
  try {
    const rawSchoolId =
      c.req.query('school_id') ||
      c.req.query('school_slug') ||
      c.req.header('x-school-slug') ||
      getAdminSchoolId(c) ||
      null;

    if (!rawSchoolId) {
      return c.json({ success: true, data: [] });
    }

    const resolved = await resolveSchoolUUID(rawSchoolId, fontInMemSchools);
    const numId = !isNaN(Number(resolved)) ? Number(resolved) : (!isNaN(Number(rawSchoolId)) ? Number(rawSchoolId) : null);

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    let rows: unknown[] = [];

    try {
      let query = supabase.from('informasi').select('*');
      if (numId !== null) {
        query = query.or(`school_id.eq.${numId},school_id.eq.${rawSchoolId}`);
      } else if (resolved) {
        query = query.eq('school_id', resolved);
      }
      const { data: sbData, error } = await query.order('tanggal', { ascending: false }).order('created_at', { ascending: false });
      if (!error && sbData && sbData.length > 0) {
        rows = sbData;
      }
    } catch (_sbErr) {}

    if (rows.length === 0) {
      try {
        const pgRes = await pool.query(
          `SELECT * FROM informasi 
           WHERE (CASE WHEN $1::integer IS NOT NULL THEN school_id = $1 ELSE false END)
              OR school_id::text = $2 OR school_id::text = $3
           ORDER BY tanggal DESC, created_at DESC`,
          [numId, String(rawSchoolId), String(resolved || '')]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          rows = pgRes.rows;
        }
      } catch (_pgErr) {}
    }

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

    return c.json({ success: true, data: sanitizedRows });
  } catch (error: unknown) {
    console.error('Error fetching informasi:', error);
    return c.json({ success: true, data: [] });
  }
});

// GET /informasi/:id - Detail
router.get('/:id', async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    if (isNaN(id) || id <= 0) {
      return c.json({ success: false, message: 'ID tidak valid.' }, 400);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    let record: unknown = null;

    try {
      const { data, error } = await supabase.from('informasi').select('*').eq('id', id).maybeSingle();
      if (!error && data) record = data;
    } catch (_e) {}

    if (!record) {
      try {
        const pgRes = await pool.query('SELECT * FROM informasi WHERE id = $1 LIMIT 1', [id]);
        if (pgRes.rows && pgRes.rows.length > 0) record = pgRes.rows[0];
      } catch (_e) {}
    }

    if (!record) {
      return c.json({ success: false, message: 'Informasi tidak ditemukan.' }, 404);
    }

    return c.json({ success: true, data: record });
  } catch (error: unknown) {
    console.error('Error fetching informasi detail:', error);
    return c.json({ success: false, message: 'Gagal mengambil detail informasi.' }, 500);
  }
});

// POST /informasi - Create (Protected)
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

    const rawSchoolId = getAdminSchoolId(c);
    if (!rawSchoolId) {
      return c.json({ success: false, message: 'Unauthorized: school_id is missing.' }, 401);
    }

    const resolved = await resolveSchoolUUID(String(rawSchoolId), fontInMemSchools);
    const targetSchoolId = resolved || String(rawSchoolId);
    const numSchoolId = !isNaN(Number(targetSchoolId)) ? Number(targetSchoolId) : targetSchoolId;
    const processedFotoUrl = await processInformasiMedia(foto_url);

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let savedRecord: any = null;

    const insertData = {
      school_id: numSchoolId,
      judul,
      konten,
      tanggal: new Date(tanggal).toISOString().split('T')[0],
      foto_url: processedFotoUrl
    };

    try {
      const { data, error } = await supabase.from('informasi').insert(insertData).select().maybeSingle();
      if (!error && data) savedRecord = data;
    } catch (_sbErr) {}

    if (!savedRecord) {
      try {
        const pgRes = await pool.query(
          `INSERT INTO informasi (school_id, judul, konten, tanggal, foto_url, created_at)
           VALUES ($1::text, $2, $3, $4, $5, NOW())
           RETURNING *`,
          [String(numSchoolId), judul, konten, insertData.tanggal, processedFotoUrl]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          savedRecord = pgRes.rows[0];
        }
      } catch (pgErr) {
        console.error('Pool insert to informasi failed:', pgErr);
      }
    }

    if (!savedRecord) {
      savedRecord = {
        id: Date.now(),
        school_id: numSchoolId,
        judul,
        konten,
        tanggal: insertData.tanggal,
        foto_url: processedFotoUrl,
        created_at: new Date().toISOString()
      };
    }

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

// PUT /informasi/:id - Update (Protected)
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

    const dataToUpdate: Record<string, unknown> = {};
    if (judul !== undefined) dataToUpdate.judul = judul;
    if (konten !== undefined) dataToUpdate.konten = konten;
    if (tanggal !== undefined) dataToUpdate.tanggal = new Date(tanggal).toISOString().split('T')[0];
    if (foto_url !== undefined) {
      dataToUpdate.foto_url = await processInformasiMedia(foto_url);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    let updatedRecord: unknown = null;

    try {
      const { data, error } = await supabase.from('informasi').update(dataToUpdate).eq('id', id).select().maybeSingle();
      if (!error && data) updatedRecord = data;
    } catch (_sbErr) {}

    if (!updatedRecord) {
      try {
        const fields: string[] = [];
        const values: (string | number | null)[] = [id];
        let idx = 2;
        if (dataToUpdate.judul !== undefined) { fields.push(`judul = $${idx++}`); values.push(String(dataToUpdate.judul)); }
        if (dataToUpdate.konten !== undefined) { fields.push(`konten = $${idx++}`); values.push(String(dataToUpdate.konten)); }
        if (dataToUpdate.tanggal !== undefined) { fields.push(`tanggal = $${idx++}`); values.push(String(dataToUpdate.tanggal)); }
        if (dataToUpdate.foto_url !== undefined) { fields.push(`foto_url = $${idx++}`); values.push(dataToUpdate.foto_url ? String(dataToUpdate.foto_url) : null); }

        if (fields.length > 0) {
          const pgRes = await pool.query(
            `UPDATE informasi SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
            values
          );
          if (pgRes.rows && pgRes.rows.length > 0) updatedRecord = pgRes.rows[0];
        }
      } catch (pgErr) {
        console.error('Pool update to informasi failed:', pgErr);
      }
    }

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

// DELETE /informasi/:id - Delete (Protected)
router.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const supabase = getSupabaseClient(c.req.header('Authorization'));

    try {
      await supabase.from('informasi').delete().eq('id', id);
    } catch (_sbErr) {}

    try {
      await pool.query('DELETE FROM informasi WHERE id = $1', [id]);
    } catch (_pgErr) {}

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
