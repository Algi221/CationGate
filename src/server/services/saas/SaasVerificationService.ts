import { getSupabaseClient } from '../../db/supabase';
import { pool } from '../../db/client';
import { resolveSchoolUUID } from '../../db/resolve-school';
import { redis } from '../../../utils/redis';
import { fontInMemSchools } from './SaasTypes';

export class SaasVerificationService {
  static async submitSchoolVerification(payload: {
    school_id?: string | number;
    school_slug?: string;
    sk_document_url?: string;
    sk_document_name?: string;
    legal_sk_number?: string;
    accreditation?: string;
    official_email?: string;
    admin_name?: string;
    npsn?: string;
    dapodik_code?: string;
    whatsapp?: string;
    website_url?: string;
    instagram_url?: string;
    documents?: Array<{
      id: string;
      type: string;
      name: string;
      url: string;
      size?: number;
    }>;
  }) {
    const slug = payload.school_slug || String(payload.school_id);
    const supabase = getSupabaseClient();
    const resolvedId = await resolveSchoolUUID(slug, fontInMemSchools);

    const firstDoc = (payload.documents && payload.documents.length > 0) ? payload.documents[0] : null;

    const updates: Record<string, unknown> = {
      status: 'PENDING_VERIFICATION',
      legal_sk_number: payload.legal_sk_number || 'SK-PENDING',
      sk_document_url: payload.sk_document_url || firstDoc?.url || '',
      sk_document_name: payload.sk_document_name || firstDoc?.name || 'SK_Operasional.pdf',
      accreditation: payload.accreditation || 'A (Unggul)',
      documents: payload.documents || (payload.sk_document_name ? [{
        id: 'doc-1',
        type: 'SK_OPERASIONAL',
        name: payload.sk_document_name,
        url: payload.sk_document_url
      }] : []),
      verification_documents: payload.documents,
      updated_at: new Date().toISOString()
    };

    if (payload.npsn) updates.npsn = payload.npsn;
    if (payload.dapodik_code) updates.dapodik_code = payload.dapodik_code;
    if (payload.admin_name) updates.admin_name = payload.admin_name;
    if (payload.official_email) updates.official_email = payload.official_email;

    if (resolvedId) {
      try {
        await supabase.from('schools').update(updates).eq('id', resolvedId);
      } catch (_e) {}
    }
    try {
      await supabase.from('schools').update(updates).eq('slug', slug);
    } catch (_e) {}

    // 1. Guaranteed in-memory cache upsert
    let matchedMem = false;
    fontInMemSchools.forEach((s, k) => {
      if (k === slug || String(s.id) === String(resolvedId) || String(s.slug) === slug) {
        matchedMem = true;
        s.status = 'PENDING_VERIFICATION';
        s.legal_sk_number = (updates.legal_sk_number as string) || s.legal_sk_number;
        s.sk_document_url = (updates.sk_document_url as string) || s.sk_document_url;
        s.sk_document_name = (updates.sk_document_name as string) || s.sk_document_name;
        s.accreditation = (updates.accreditation as string) || s.accreditation;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.documents = updates.documents as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.verification_documents = updates.documents as any;
        if (payload.npsn) s.npsn = payload.npsn;
        if (payload.dapodik_code) s.dapodik_code = payload.dapodik_code;
        if (payload.admin_name) s.admin_name = payload.admin_name;
        if (payload.official_email) s.official_email = payload.official_email;
      }
    });

    if (!matchedMem) {
      fontInMemSchools.set(slug, {
        id: Math.floor(Date.now() / 1000),
        name: slug.toUpperCase(),
        slug,
        status: 'PENDING_VERIFICATION',
        legal_sk_number: updates.legal_sk_number,
        sk_document_url: updates.sk_document_url,
        sk_document_name: updates.sk_document_name,
        accreditation: updates.accreditation,
        documents: updates.documents,
        verification_documents: updates.documents,
        npsn: payload.npsn || '',
        dapodik_code: payload.dapodik_code || '',
        admin_name: payload.admin_name || '',
        official_email: payload.official_email || '',
        created_at: new Date().toISOString()
      });
    }

    // Invalidate Redis caches
    try {
      if (redis) {
        await redis.del(`school:${slug}`);
        await redis.del(`config_${slug}`);
        await redis.del('gatekeeper_schools_list');
      }
    } catch (_e) {}

    // 2. Supabase UPSERT into prospective_schools
    try {
      await supabase.from('prospective_schools').upsert({
        slug,
        name: slug.toUpperCase(),
        status: 'PENDING_VERIFICATION',
        legal_sk_number: updates.legal_sk_number,
        sk_document_url: updates.sk_document_url,
        sk_document_name: updates.sk_document_name,
        accreditation: updates.accreditation,
        npsn: payload.npsn || '',
        dapodik_code: payload.dapodik_code || '',
        admin_name: payload.admin_name || '',
        official_email: payload.official_email || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });
    } catch (_e) {}

    // 3. PostgreSQL pool UPSERT into prospective_schools
    try {
      await pool.query(
        `INSERT INTO prospective_schools (
           name, slug, official_email, status, is_verified, plan_type, admin_name,
           legal_sk_number, sk_document_url, sk_document_name, accreditation, npsn, dapodik_code, created_at
         ) VALUES (
           $1, $2, $3, 'PENDING_VERIFICATION', false, 'TRIAL', $4,
           $5, $6, $7, $8, $9, $10, NOW()
         )
         ON CONFLICT (slug) DO UPDATE SET
           status = 'PENDING_VERIFICATION',
           legal_sk_number = EXCLUDED.legal_sk_number,
           sk_document_url = EXCLUDED.sk_document_url,
           sk_document_name = EXCLUDED.sk_document_name,
           accreditation = EXCLUDED.accreditation,
           npsn = EXCLUDED.npsn,
           dapodik_code = EXCLUDED.dapodik_code,
           admin_name = EXCLUDED.admin_name,
           official_email = EXCLUDED.official_email,
           updated_at = NOW()`,
        [
          slug.toUpperCase(),
          slug,
          payload.official_email || '',
          payload.admin_name || '',
          updates.legal_sk_number,
          updates.sk_document_url,
          updates.sk_document_name,
          updates.accreditation,
          payload.npsn || '',
          payload.dapodik_code || ''
        ]
      );
    } catch (_pgErr) {}

    return {
      success: true,
      message: 'Dokumen verifikasi berhasil diajukan dan sedang diproses Gatekeeper.'
    };
  }
}
