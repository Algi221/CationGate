import { Hono, Context } from 'hono';
import prisma from '../db/prisma';
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
    const rows = await prisma.informasi.findMany({
      orderBy: [
        { tanggal: 'desc' },
        { created_at: 'desc' }
      ]
    }) as unknown as InformasiItem[];

    const sanitizedRows = rows.map((row) => {
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

    const record = await prisma.informasi.findUnique({
      where: { id }
    });

    if (!record) {
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

    const savedRecord = await prisma.informasi.create({
      data: {
        judul,
        konten,
        tanggal: new Date(tanggal),
        foto_url: foto_url || null
      }
    }) as unknown as InformasiItem;

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

    const checkExists = await prisma.informasi.findUnique({
      where: { id }
    });
    if (!checkExists) {
      return c.json({
        success: false,
        message: 'Informasi tidak ditemukan.'
      }, 404);
    }

    const dataToUpdate: any = {};
    if (judul !== undefined) dataToUpdate.judul = judul;
    if (konten !== undefined) dataToUpdate.konten = konten;
    if (tanggal !== undefined) dataToUpdate.tanggal = new Date(tanggal);
    if (foto_url !== undefined) dataToUpdate.foto_url = foto_url || null;

    const updatedRecord = await prisma.informasi.update({
      where: { id },
      data: dataToUpdate
    }) as unknown as InformasiItem;

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

    const checkExists = await prisma.informasi.findUnique({
      where: { id }
    });
    if (!checkExists) {
      return c.json({
        success: false,
        message: 'Informasi tidak ditemukan.'
      }, 404);
    }

    await prisma.informasi.delete({
      where: { id }
    });

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
