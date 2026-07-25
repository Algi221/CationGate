import { Hono, Context } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { adminAuth } from '../middleware/auth';
import { broadcast } from '../ws/handler';
import { createInformasiSchema, updateInformasiSchema } from '../validations/informasi';

const router = new Hono();

interface InformasiItem {
  id: number;
  judul: string;
  konten: string;
  tanggal: Date | string;
  foto_url: string | null;
  created_at: Date | string | null;
}

// GET / - Public route to fetch all information (sanitized/lightweight list)
router.get('/', async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

    let query = supabase.from('informasi').select('*').order('tanggal', { ascending: false }).order('created_at', { ascending: false });
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: rows, error } = await query;
    if (error) throw error;

    const sanitizedRows = (rows || []).map((row: any) => {
      if (row.foto_url && row.foto_url.startsWith('{')) {
        try {
          const parsed = JSON.parse(row.foto_url);
          return {
            ...row,
            foto_url: JSON.stringify({
              foto: parsed.foto || "",
              video: "", // strip large video data from list response
              video_name: parsed.video_name || "",
              dokumen: "", // strip large document data from list response
              dokumen_name: parsed.dokumen_name || ""
            })
          };
        } catch (e) {
          return row;
        }
      }
      return row;
    });

    return c.json({
      success: true,
      data: sanitizedRows
    });
  } catch (error: any) {
    console.error('Error fetching informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal mengambil data informasi.',
      error: error.message
    }, 500);
  }
});

// GET /:id - Public route to fetch single information by ID (returns full media payload)
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
    const schoolId = c.req.query('school_id') || null;
    let query = supabase.from('informasi').select('*').eq('id', id);
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: record, error } = await query.single();

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
  } catch (error: any) {
    console.error('Error fetching informasi detail:', error);
    return c.json({
      success: false,
      message: 'Gagal mengambil detail informasi.',
      error: error.message
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
    const schoolId = c.req.query('school_id') || null;

    const insertData: any = {
      judul,
      konten,
      tanggal: new Date(tanggal).toISOString(),
      foto_url: foto_url || null
    };
    if (schoolId) insertData.school_id = schoolId;

    const { data: savedRecord, error } = await supabase.from('informasi').insert(insertData).select().single();
    if (error) throw error;

    broadcast({ event: 'REFRESH_INFORMASI', data: null });

    return c.json({
      success: true,
      message: 'Informasi berhasil ditambahkan.',
      data: savedRecord
    }, 201);
  } catch (error: any) {
    console.error('Error creating informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal menambahkan informasi.',
      error: error.message
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
    const schoolId = c.req.query('school_id') || null;

    let checkQuery = supabase.from('informasi').select('id').eq('id', id);
    if (schoolId) checkQuery = checkQuery.eq('school_id', schoolId);
    
    const { data: checkExists } = await checkQuery.single();

    if (!checkExists) {
      return c.json({
        success: false,
        message: 'Informasi tidak ditemukan.'
      }, 404);
    }

    const dataToUpdate: any = {};
    if (judul !== undefined) dataToUpdate.judul = judul;
    if (konten !== undefined) dataToUpdate.konten = konten;
    if (tanggal !== undefined) dataToUpdate.tanggal = new Date(tanggal).toISOString();
    if (foto_url !== undefined) dataToUpdate.foto_url = foto_url || null;

    let updateQuery = supabase.from('informasi').update(dataToUpdate).eq('id', id);
    if (schoolId) updateQuery = updateQuery.eq('school_id', schoolId);
    
    const { data: updatedRecord, error } = await updateQuery.select().single();
    if (error) throw error;

    broadcast({ event: 'REFRESH_INFORMASI', data: null });

    return c.json({
      success: true,
      message: 'Informasi berhasil diperbarui.',
      data: updatedRecord
    });
  } catch (error: any) {
    console.error('Error updating informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal memperbarui informasi.',
      error: error.message
    }, 500);
  }
});

// DELETE /:id - Admin route to delete information
router.delete('/:id', adminAuth, async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id') || null;

    let query = supabase.from('informasi').delete().eq('id', id);
    if (schoolId) query = query.eq('school_id', schoolId);
    
    const { data, error } = await query.select();

    if (error || !data || data.length === 0) {
      return c.json({
        success: false,
        message: 'Informasi tidak ditemukan atau gagal dihapus.'
      }, 404);
    }

    broadcast({ event: 'REFRESH_INFORMASI', data: null });

    return c.json({
      success: true,
      message: 'Informasi berhasil dihapus.'
    });
  } catch (error: any) {
    console.error('Error deleting informasi:', error);
    return c.json({
      success: false,
      message: 'Gagal menghapus informasi.',
      error: error.message
    }, 500);
  }
});

export default router;
