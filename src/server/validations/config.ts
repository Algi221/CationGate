import { z } from 'zod';

const majorGalleryItemSchema = z.object({
  url: z.string().optional().default(''),
  caption: z.string().max(1000).optional().default('')
});

const majorCareerItemSchema = z.object({
  title: z.string().optional().default(''),
  desc: z.string().optional().default('')
});

const majorConfigSchema = z.object({
  code: z.string().optional().default(''),
  title: z.string().optional().default(''),
  desc: z.string().optional().default(''),
  color: z.string().optional().default('#3b82f6'),
  logo: z.string().optional().default(''),
  banner: z.string().optional().default(''),
  video: z.string().optional().default(''),
  facilities: z.array(z.string()).optional().default([]),
  careers: z.array(majorCareerItemSchema.passthrough()).optional().default([]),
  gallery: z.array(majorGalleryItemSchema.passthrough()).optional().default([])
}).passthrough();

const alurItemSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  title: z.string().optional().default(''),
  desc: z.string().optional().default('')
}).passthrough();

const faqItemSchema = z.object({
  q: z.string().optional().default(''),
  a: z.string().optional().default('')
}).passthrough();

const bankConfigSchema = z.object({
  bankName: z.string().optional().default(''),
  accountNumber: z.string().optional().default(''),
  accountHolder: z.string().optional().default('')
}).passthrough();

const partnerItemSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().optional().default(''),
  logo: z.string().optional().default(''),
  url: z.string().optional().default(''),
  h: z.string().optional().default('h-12')
}).passthrough();

const gelombangDetailSchema = z.object({
  start: z.string().optional().default(''),
  end: z.string().optional().default('')
}).passthrough();

const gelombangConfigSchema = z.object({
  gelombang1: gelombangDetailSchema.optional(),
  gelombang2: gelombangDetailSchema.optional()
}).passthrough();

export const configSaveSchema = z.object({
  configs: z.object({
    ppdb_hero_title: z.string().optional(),
    ppdb_hero_title_sub: z.string().optional(),
    ppdb_hero_subtitle: z.string().optional(),
    ppdb_hero_media_url: z.string().optional(),
    ppdb_hero_media_type: z.enum(['video', 'image', 'none']).optional(),
    ppdb_phone: z.string().optional(),
    ppdb_email: z.string().optional(),
    ppdb_address: z.string().optional(),
    ppdb_school_period: z.string().optional(),
    ppdb_wa_group_url: z.string().optional().nullable(),
    ppdb_wa_admin: z.string().optional(),
    ppdb_form_guideline: z.string().optional(),
    ppdb_form_fee: z.union([z.string(), z.number()]).optional(),
    ppdb_reg_cost: z.union([z.string(), z.number()]).optional(),
    ppdb_bank_config: z.array(bankConfigSchema).or(bankConfigSchema).optional(),
    ppdb_alur_config: z.array(alurItemSchema).optional(),
    ppdb_faq_config: z.array(faqItemSchema).optional(),
    ppdb_gelombang_config: gelombangConfigSchema.optional(),
    ppdb_majors_config: z.array(majorConfigSchema).optional(),
    ppdb_partners_config: z.array(partnerItemSchema).optional(),
    ppdb_fields_config: z.record(z.string(), z.any()).optional(),
    ppdb_portal_status: z.string().optional(),
    ppdb_telegram_config: z.object({
      botToken: z.string().optional(),
      chatId: z.string().optional()
    }).passthrough().optional(),
    ppdb_session_timeout: z.string().optional(),
    ppdb_logo_url: z.string().optional(),
    ppdb_title: z.string().optional(),
    ppdb_footer_desc: z.string().optional(),
    ppdb_map_title: z.string().optional(),
    ppdb_map_url: z.string().optional(),
    ppdb_landing_active: z.union([z.boolean(), z.string()]).optional()
  }).passthrough(),
  description: z.string().optional().default('Melakukan pembaruan massal UI')
});

export const singleConfigSchema = z.object({
  key: z.string().min(1).max(100).regex(/^ppdb_/, { message: 'Key harus diawali dengan ppdb_' }),
  value: z.any()
});
