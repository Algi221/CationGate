import { z } from 'zod';
import { base64FileSchema } from './helpers';

export const confirmPaymentSchema = z.object({
  nisn: z.string()
    .length(10, 'NISN harus berisi 10 digit.')
    .regex(/^\d+$/, 'NISN hanya boleh berisi angka.'),
  bukti_bayar: base64FileSchema(3, ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']).nullable(),
  metode_pembayaran: z.string().min(1, 'Metode pembayaran tidak boleh kosong.')
});
