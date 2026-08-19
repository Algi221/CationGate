import { z } from 'zod';

const majorGalleryItemSchema = z.object({
  url: z.string().min(1),
  caption: z.string().max(300).optional().default('')
});

const majorCareerItemSchema = z.object({
  title: z.string().max(200),
  desc: z.string().max(1000)
});

const majorConfigSchema = z.object({
  code: z.string().min(1).max(20),
  title: z.string().min(1).max(200),
  desc: z.string().max(2000).optional().default(''),
  color: z.string().max(50).optional().default('#3b82f6'),
  logo: z.string().optional().default(''),
  banner: z.string().optional().default(''),
  video: z.string().optional().default(''),
  facilities: z.array(z.string()).optional().default([]),
  careers: z.array(majorCareerItemSchema).optional().default([]),
  gallery: z.array(majorGalleryItemSchema).optional().default([])
});

const alurItemSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1).max(200),
  desc: z.string().max(1000)
});

const faqItemSchema = z.object({
  q: z.string().min(1).max(500),
  a: z.string().min(1).max(2000)
});

const bankConfigSchema = z.object({
  bankName: z.string().min(1).max(100),
  accountNumber: z.string().min(1).max(50),
  accountHolder: z.string().min(1).max(200)
});

const partnerItemSchema = z.object({
  id: z.number().int(),
  name: z.string().max(200),
  logo: z.string().max(2000),
  url: z.string().max(2000),
  h: z.string().max(50)
});

const gelombangDetailSchema = z.object({
  start: z.string().max(50).optional().default(''),
  end: z.string().max(50).optional().default('')
});

const gelombangConfigSchema = z.object({
  gelombang1: gelombangDetailSchema.optional(),
  gelombang2: gelombangDetailSchema.optional()
});

export const configSaveSchema = z.object({
  configs: z.object({
    ppdb_hero_title: z.string().max(200).optional(),
    ppdb_hero_title_sub: z.string().max(300).optional(),
    ppdb_hero_subtitle: z.string().max(1000).optional(),
    ppdb_hero_media_url: z.string().optional(),
    ppdb_hero_media_type: z.enum(['video', 'image', 'none']).optional(),
    ppdb_phone: z.string().max(50).optional(),
    ppdb_email: z.string().max(100).optional(),
    ppdb_address: z.string().max(1000).optional(),
    ppdb_school_period: z.string().max(50).optional(),
    ppdb_wa_group_url: z.string().max(500).optional().nullable(),
    ppdb_wa_admin: z.string().max(50).optional(),
    ppdb_form_guideline: z.string().max(2000).optional(),
    ppdb_form_fee: z.string().max(50).optional(),
    ppdb_reg_cost: z.string().max(50).optional(),
    ppdb_bank_config: z.array(bankConfigSchema).or(bankConfigSchema).optional(),
    ppdb_alur_config: z.array(alurItemSchema).optional(),
    ppdb_faq_config: z.array(faqItemSchema).optional(),
    ppdb_gelombang_config: gelombangConfigSchema.optional(),
    ppdb_majors_config: z.array(majorConfigSchema).optional(),
    ppdb_partners_config: z.array(partnerItemSchema).optional(),
    ppdb_fields_config: z.record(z.string(), z.object({
      label: z.string(),
      required: z.boolean(),
      active: z.boolean()
    })).optional(),
    ppdb_portal_status: z.string().max(20).optional(),
    ppdb_telegram_config: z.object({
      botToken: z.string().optional(),
      chatId: z.string().optional()
    }).optional(),
    ppdb_session_timeout: z.string().max(20).optional(),
    ppdb_logo_url: z.string().optional(),
    ppdb_title: z.string().optional(),
    ppdb_footer_desc: z.string().optional(),
    ppdb_map_title: z.string().optional(),
    ppdb_map_url: z.string().optional(),
  }).passthrough(),
  description: z.string().max(1000).optional().default('Melakukan pembaruan massal UI')
});

export const singleConfigSchema = z.object({
  key: z.string().min(1).max(100).regex(/^ppdb_/, { message: 'Key harus diawali dengan ppdb_' }),
  value: z.any()
});
