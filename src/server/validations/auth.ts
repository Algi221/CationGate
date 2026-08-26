import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Harap masukkan alamat email akun Anda.')
    .email('Format alamat email tidak valid.')
    .max(100, 'Alamat email maksimal 100 karakter.')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Kata sandi tidak boleh kosong.')
    .max(100, 'Kata sandi maksimal 100 karakter.'),
  rememberMe: z.boolean().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini tidak boleh kosong.'),
  newPassword: z.string().min(6, 'Password baru minimal harus 6 karakter.')
});

export const forgotPasswordSendOtpSchema = z.object({
  email: z.string().email('Format alamat email tidak valid.').trim().toLowerCase(),
  type: z.literal('forgot-password').default('forgot-password')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Format alamat email tidak valid.').trim().toLowerCase(),
  otp: z.string().length(6, 'Kode OTP harus tepat 6 digit angka.').regex(/^\d{6}$/, 'Kode OTP hanya berupa angka.'),
  newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter.').max(100, 'Kata sandi maksimal 100 karakter.')
});
