import { z } from "zod";

export const step1LegalitasSchema = z.object({
  npsn: z
    .string()
    .min(1, "NPSN wajib diisi")
    .regex(/^\d{8,10}$/, "NPSN harus berupa 8-10 digit angka"),
  dapodik_code: z.string().optional(),
  legal_sk_number: z
    .string()
    .min(3, "Nomor SK Izin Operasional minimal 3 karakter"),
  accreditation: z.string().min(1, "Peringkat akreditasi wajib dipilih"),
  admin_name: z
    .string()
    .min(2, "Nama Kepala Sekolah / Penanggung Jawab minimal 2 karakter"),
});

export const step2KontakSchema = z.object({
  official_email: z
    .string()
    .min(1, "Email resmi instansi wajib diisi")
    .email("Format email resmi tidak valid"),
  whatsapp: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+-\s]{8,20}$/.test(val),
      "Format nomor WhatsApp tidak valid (minimal 8 digit)"
    ),
  website_url: z.string().optional(),
  instagram_url: z.string().optional(),
});

export const schoolVerificationSchema = step1LegalitasSchema.merge(step2KontakSchema);

export type Step1LegalitasFormValues = z.infer<typeof step1LegalitasSchema>;
export type Step2KontakFormValues = z.infer<typeof step2KontakSchema>;
export type SchoolVerificationFormValues = z.infer<typeof schoolVerificationSchema>;
