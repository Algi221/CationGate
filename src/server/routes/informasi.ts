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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fontInMemInformasi = new Map<string, any[]>();

function getAdminSchoolId(c: Context): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = c.get('admin') as any;
  return (
    c.req.query('school_slug') ||
    c.req.query('school_id') ||
    c.req.header('x-school-slug') ||
    admin?.school_id ||
    admin?.school_slug ||
    admin?.slug
  );
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

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str).trim());
    const resolved = await resolveSchoolUUID(rawSchoolId, fontInMemSchools);
    const targetUUID = resolved && isUUID(resolved) ? resolved : (isUUID(String(rawSchoolId)) ? String(rawSchoolId) : null);
    const numId = !isNaN(Number(resolved)) ? Number(resolved) : (!isNaN(Number(rawSchoolId)) ? Number(rawSchoolId) : null);

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allRows: any[] = [];
    const seenIds = new Set<string | number>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addRow = (item: any) => {
      if (!item) return;
      const key = item.id || `${item.judul}_${item.tanggal}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        allRows.push(item);
      }
    };

    // 1. Supabase (primary 'school_announcements')
    try {
      let query2 = supabase.from('school_announcements').select('*');
      if (targetUUID) {
        query2 = query2.eq('school_id', targetUUID);
      } else if (numId !== null) {
        query2 = query2.eq('school_id', numId);
      } else {
        query2 = query2.eq('school_id', rawSchoolId);
      }
      const { data: sbData2, error: err2 } = await query2.order('tanggal', { ascending: false }).order('created_at', { ascending: false });
      if (!err2 && sbData2 && Array.isArray(sbData2)) {
        sbData2.forEach(addRow);
      }
    } catch (_sbErr2) {}

    // Fallback Supabase 'informasi'
    try {
      let query = supabase.from('informasi').select('*');
      if (targetUUID) {
        query = query.eq('school_id', targetUUID);
      } else if (numId !== null) {
        query = query.eq('school_id', numId);
      } else {
        query = query.eq('school_id', rawSchoolId);
      }
      const { data: sbData, error } = await query.order('tanggal', { ascending: false }).order('created_at', { ascending: false });
      if (!error && sbData && Array.isArray(sbData)) {
        sbData.forEach(addRow);
      }
    } catch (_sbErr) {}

    // 2. Direct PostgreSQL
    try {
      const pgRes = await pool.query(
        `SELECT * FROM informasi 
         WHERE (CASE WHEN $1::integer IS NOT NULL THEN school_id::text = $1::text ELSE false END)
            OR school_id::text = $2 OR school_id::text = $3
         ORDER BY tanggal DESC, created_at DESC`,
        [numId, String(rawSchoolId), String(resolved || '')]
      );
      if (pgRes.rows && Array.isArray(pgRes.rows)) {
        pgRes.rows.forEach(addRow);
      }
    } catch (_pgErr) {}

    // 3. In-memory entries (for local newly created uncommitted rows)
    const memList1 = fontInMemInformasi.get(String(rawSchoolId)) || [];
    const memList2 = resolved ? (fontInMemInformasi.get(String(resolved)) || []) : [];
    [...memList1, ...memList2].forEach(addRow);

    // 4. Sanitize media - PRESERVE video & dokumen URLs intact
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizedRows = allRows.map((row: any) => {
      if (row.foto_url && typeof row.foto_url === 'string' && row.foto_url.startsWith('{')) {
        try {
          const parsed = JSON.parse(row.foto_url);
          return {
            ...row,
            foto_url: JSON.stringify({
              foto: parsed.foto || "",
              video: parsed.video || "", 
              video_name: parsed.video_name || "",
              dokumen: parsed.dokumen || "", 
              dokumen_name: parsed.dokumen_name || ""
            })
          };
        } catch (_e) {
          return row;
        }
      }
      return row;
    });

    // Sort newest first
    sanitizedRows.sort((a, b) => new Date(b.created_at || b.tanggal).getTime() - new Date(a.created_at || a.tanggal).getTime());

    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return c.json({ success: true, data: sanitizedRows });
  } catch (error: unknown) {
    console.error('Error fetching informasi:', error);
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
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
      // Check in-memory as fallback
      for (const list of fontInMemInformasi.values()) {
        const found = list.find((item) => item.id === id);
        if (found) {
          record = found;
          break;
        }
      }
    }

    if (!record) {
      return c.json({ success: false, message: 'Informasi tidak ditemukan.' }, 404);
    }

    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
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

    const rawSchoolId = getAdminSchoolId(c) || 'default';
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
      const { data, error } = await supabase.from('school_announcements').insert(insertData).select().maybeSingle();
      if (!error && data) savedRecord = data;
    } catch (_sbErr1) {}

    if (!savedRecord) {
      try {
        const { data, error } = await supabase.from('informasi').insert(insertData).select().maybeSingle();
        if (!error && data) savedRecord = data;
      } catch (_sbErr2) {}
    }

    if (!savedRecord) {
      try {
        const pgRes = await pool.query(
          `INSERT INTO school_announcements (school_id, judul, konten, tanggal, foto_url, created_at)
           VALUES ($1::text, $2, $3, $4, $5, NOW())
           RETURNING *`,
          [String(numSchoolId), judul, konten, insertData.tanggal, processedFotoUrl]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          savedRecord = pgRes.rows[0];
        }
      } catch (_pgErr1) {
        try {
          const pgRes2 = await pool.query(
            `INSERT INTO informasi (school_id, judul, konten, tanggal, foto_url, created_at)
             VALUES ($1::text, $2, $3, $4, $5, NOW())
             RETURNING *`,
            [String(numSchoolId), judul, konten, insertData.tanggal, processedFotoUrl]
          );
          if (pgRes2.rows && pgRes2.rows.length > 0) {
            savedRecord = pgRes2.rows[0];
          }
        } catch (pgErr2) {
          console.error('Pool insert to school_announcements/informasi failed:', pgErr2);
        }
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

    // Save to memory store under all relevant keys
    const keysToUpdate = new Set([String(rawSchoolId), String(targetSchoolId), String(numSchoolId)]);
    if (resolved) keysToUpdate.add(String(resolved));
    keysToUpdate.forEach((k) => {
      if (!fontInMemInformasi.has(k)) fontInMemInformasi.set(k, []);
      fontInMemInformasi.get(k)?.unshift(savedRecord);
    });

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

    const rawSchoolId = getAdminSchoolId(c);
    const resolved = rawSchoolId ? await resolveSchoolUUID(String(rawSchoolId), fontInMemSchools) : null;
    const targetSchoolId = resolved || String(rawSchoolId || '');
    const numSchoolId = !isNaN(Number(targetSchoolId)) ? Number(targetSchoolId) : null;

    const dataToUpdate: Record<string, unknown> = {};
    if (judul !== undefined) dataToUpdate.judul = judul;
    if (konten !== undefined) dataToUpdate.konten = konten;
    if (tanggal !== undefined) dataToUpdate.tanggal = new Date(tanggal).toISOString().split('T')[0];
    if (foto_url !== undefined) {
      dataToUpdate.foto_url = await processInformasiMedia(foto_url);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updatedRecord: any = null;

    try {
      let query = supabase.from('school_announcements').update(dataToUpdate).eq('id', id);
      if (numSchoolId !== null) {
        query = query.or(`school_id.eq.${numSchoolId},school_id.eq.${rawSchoolId}`);
      } else if (targetSchoolId) {
        query = query.eq('school_id', targetSchoolId);
      }
      const { data, error } = await query.select().maybeSingle();
      if (!error && data) updatedRecord = data;
    } catch (_sbErr1) {}

    if (!updatedRecord) {
      try {
        let query = supabase.from('informasi').update(dataToUpdate).eq('id', id);
        if (numSchoolId !== null) {
          query = query.or(`school_id.eq.${numSchoolId},school_id.eq.${rawSchoolId}`);
        } else if (targetSchoolId) {
          query = query.eq('school_id', targetSchoolId);
        }
        const { data, error } = await query.select().maybeSingle();
        if (!error && data) updatedRecord = data;
      } catch (_sbErr2) {}
    }

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
          try {
            const pgRes1 = await pool.query(
              `UPDATE school_announcements SET ${fields.join(', ')} 
               WHERE id = $1 AND (school_id::text = $${idx} OR school_id::text = $${idx + 1}) 
               RETURNING *`,
              [...values, String(numSchoolId || ''), String(rawSchoolId || '')]
            );
            if (pgRes1.rows && pgRes1.rows.length > 0) updatedRecord = pgRes1.rows[0];
          } catch (_pgErr1) {
            const pgRes2 = await pool.query(
              `UPDATE informasi SET ${fields.join(', ')} 
               WHERE id = $1 AND (school_id::text = $${idx} OR school_id::text = $${idx + 1}) 
               RETURNING *`,
              [...values, String(numSchoolId || ''), String(rawSchoolId || '')]
            );
            if (pgRes2.rows && pgRes2.rows.length > 0) updatedRecord = pgRes2.rows[0];
          }
        }
      } catch (pgErr) {
        console.error('Pool update to school_announcements/informasi failed:', pgErr);
      }
    }

    // Update in-memory stores safely per tenant
    const memKeys = [String(rawSchoolId || ''), String(targetSchoolId || ''), String(numSchoolId || '')].filter(Boolean);
    for (const key of memKeys) {
      const list = fontInMemInformasi.get(key);
      if (list) {
        const idx = list.findIndex((item) => item.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...dataToUpdate, ...updatedRecord };
          if (!updatedRecord) updatedRecord = list[idx];
        }
      }
    }

    return c.json({
      success: true,
      message: 'Informasi berhasil diperbarui.',
      data: updatedRecord || { id, ...dataToUpdate }
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
    const rawSchoolId = getAdminSchoolId(c);
    const resolved = rawSchoolId ? await resolveSchoolUUID(String(rawSchoolId), fontInMemSchools) : null;
    const targetSchoolId = resolved || String(rawSchoolId || '');
    const numSchoolId = !isNaN(Number(targetSchoolId)) ? Number(targetSchoolId) : null;

    const supabase = getSupabaseClient(c.req.header('Authorization'));

    try {
      let query = supabase.from('school_announcements').delete().eq('id', id);
      if (numSchoolId !== null) {
        query = query.or(`school_id.eq.${numSchoolId},school_id.eq.${rawSchoolId}`);
      } else if (targetSchoolId) {
        query = query.eq('school_id', targetSchoolId);
      }
      await query;
    } catch (_sbErr1) {}

    try {
      let query = supabase.from('informasi').delete().eq('id', id);
      if (numSchoolId !== null) {
        query = query.or(`school_id.eq.${numSchoolId},school_id.eq.${rawSchoolId}`);
      } else if (targetSchoolId) {
        query = query.eq('school_id', targetSchoolId);
      }
      await query;
    } catch (_sbErr2) {}

    try {
      await pool.query(
        `DELETE FROM school_announcements 
         WHERE id = $1 AND (school_id::text = $2 OR school_id::text = $3)`,
        [id, String(numSchoolId || ''), String(rawSchoolId || '')]
      );
    } catch (_pgErr1) {}

    try {
      await pool.query(
        `DELETE FROM informasi 
         WHERE id = $1 AND (school_id::text = $2 OR school_id::text = $3)`,
        [id, String(numSchoolId || ''), String(rawSchoolId || '')]
      );
    } catch (_pgErr2) {}

    // Remove from in-memory stores safely per tenant
    const memKeys = [String(rawSchoolId || ''), String(targetSchoolId || ''), String(numSchoolId || '')].filter(Boolean);
    for (const key of memKeys) {
      const list = fontInMemInformasi.get(key);
      if (list) {
        fontInMemInformasi.set(key, list.filter((item) => item.id !== id));
      }
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
