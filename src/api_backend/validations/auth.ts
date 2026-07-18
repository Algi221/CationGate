import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username tidak boleh kosong.'),
  password: z.string().min(1, 'Password tidak boleh kosong.')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini tidak boleh kosong.'),
  newPassword: z.string().min(6, 'Password baru minimal harus 6 karakter.')
});
