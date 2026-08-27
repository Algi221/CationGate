import { z } from 'zod';

export const createAdminSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal harus 3 karakter.')
    .max(50, 'Username maksimal 50 karakter.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore.'),
  email: z.string()
    .email('Format email tidak valid (contoh: panitia@gmail.com).')
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(6, 'Password minimal harus 6 karakter.')
    .optional()
    .or(z.literal('')),
  nama_lengkap: z.string()
    .min(1, 'Nama lengkap wajib diisi.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  role: z.enum(['admin', 'superadmin', 'panitia', 'viewer']).optional().default('admin')
});

export const updateAdminSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal harus 3 karakter.')
    .max(50, 'Username maksimal 50 karakter.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore.')
    .optional(),
  email: z.string()
    .email('Format email tidak valid.')
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(6, 'Password minimal harus 6 karakter.')
    .optional()
    .or(z.literal('')),
  nama_lengkap: z.string()
    .min(1, 'Nama lengkap wajib diisi.')
    .max(100, 'Nama lengkap maksimal 100 karakter.')
    .optional(),
  role: z.enum(['admin', 'superadmin', 'panitia', 'viewer']).optional()
});
