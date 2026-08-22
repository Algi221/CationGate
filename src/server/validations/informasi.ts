import { z } from 'zod';

export const createInformasiSchema = z.object({
  judul: z.string().min(1, 'Judul wajib diisi.').max(255, 'Judul maksimal 255 karakter.'),
  konten: z.string().min(1, 'Konten wajib diisi.'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi.').refine(val => !isNaN(Date.parse(val)), {
    message: 'Format tanggal tidak valid.'
  }),
  foto_url: z.string().nullable().optional().refine(val => {
    if (!val) return true;

    if (val.startsWith('{')) {
      return val.length <= 20 * 1024 * 1024; 
    }

    return val.length <= 2000;
  }, {
    message: 'Media lampiran melebihi batas ukuran (maksimal 15MB).'
  })
});

export const updateInformasiSchema = createInformasiSchema.partial();
