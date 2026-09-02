import { getSupabaseClient } from '../../db/supabase';
import { pool } from '../../db/client';
import bcrypt from 'bcryptjs';
import { fontInMemSchools } from './SaasTypes';

export class SaasProvisioningService {
  static async registerSchool(data: {
    school_name: string;
    slug: string;
    email: string;
    phone?: string;
    address?: string;
    plan_type?: string;
    admin_name?: string;
    admin_username: string;
    admin_password: string;
    admin_email?: string;
  }) {
    const { school_name, slug, email, phone, address, plan_type, admin_name, admin_username, admin_password, admin_email } = data;

    if (!school_name || !slug || !email || !admin_username || !admin_password) {
      return { success: false as const, statusCode: 400 as const, message: 'Data tidak lengkap' };
    }

    const isTrial = plan_type === 'trial';
    const supabase = getSupabaseClient();

    // Check slug
    const { data: existingVerifiedSlug } = await supabase.from('schools').select('id').eq('slug', slug).maybeSingle();
    const { data: existingCandidateSlug } = await supabase.from('prospective_schools').select('id').eq('slug', slug).maybeSingle();

    // Check name
    const { data: existingVerifiedName } = await supabase.from('schools').select('id').ilike('name', school_name).maybeSingle();
    const { data: existingCandidateName } = await supabase.from('prospective_schools').select('id').ilike('name', school_name).maybeSingle();

    const slugExists = !!(existingVerifiedSlug || existingCandidateSlug || fontInMemSchools.has(slug));
    let nameExists = !!(existingVerifiedName || existingCandidateName);

    if (!nameExists) {
      for (const val of fontInMemSchools.values()) {
        if (val.name?.toLowerCase() === school_name.toLowerCase()) {
          nameExists = true;
          break;
        }
      }
    }

    if (slugExists || nameExists) {
      return {
        success: false as const,
        statusCode: 400 as const,
        message: slugExists 
          ? 'Subdomain URL sudah digunakan. Silakan pilih URL lain.' 
          : 'Nama sekolah sudah terdaftar. Hubungi kami jika ini adalah sekolah Anda.'
      };
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanAdminEmail = (admin_email || email).toLowerCase().trim();
    const cleanAdminUsername = (admin_username || email).trim();
    const cleanSchoolName = school_name.trim();
    const cleanSlug = slug.toLowerCase().trim();

    const fallbackId = Math.floor(Date.now() / 1000);
    const createdAtIso = new Date().toISOString();

    const newSchoolObj: Record<string, unknown> = {
      id: fallbackId,
      name: cleanSchoolName,
      slug: cleanSlug,
      official_email: cleanEmail,
      status: 'BELUM_KIRIM_VERIFIKASI',
      is_verified: false,
      plan_type: isTrial ? 'TRIAL' : 'YEARLY',
      admin_name: admin_name || cleanAdminUsername,
      created_at: createdAtIso,
      logo_url: ''
    };

    let insertedSchoolId: number | string | null = null;
    const { randomUUID } = await import('crypto');
    const generatedSchoolUUID = randomUUID();

    try {
      const { data: psData } = await supabase
        .from('prospective_schools')
        .upsert({
          name: cleanSchoolName,
          slug: cleanSlug,
          official_email: cleanEmail,
          status: 'BELUM_KIRIM_VERIFIKASI',
          is_verified: false,
          plan_type: isTrial ? 'TRIAL' : 'YEARLY',
          admin_name: admin_name || cleanAdminUsername,
          created_at: createdAtIso
        }, { onConflict: 'slug' })
        .select('*')
        .maybeSingle();

      if (psData && psData.id) {
        insertedSchoolId = psData.id;
        newSchoolObj.id = insertedSchoolId;
      }
    } catch (sbErr: unknown) {
      console.warn('Supabase client insert warning:', sbErr instanceof Error ? sbErr.message : String(sbErr));
    }

    if (!insertedSchoolId) {
      try {
        const pgRes = await pool.query(
          `INSERT INTO prospective_schools (name, slug, official_email, status, is_verified, plan_type, admin_name, created_at)
           VALUES ($1, $2, $3, 'BELUM_KIRIM_VERIFIKASI', false, $4, $5, NOW())
           ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, official_email = EXCLUDED.official_email
           RETURNING id`,
          [cleanSchoolName, cleanSlug, cleanEmail, isTrial ? 'TRIAL' : 'YEARLY', admin_name || cleanAdminUsername]
        );
        if (pgRes.rows && pgRes.rows.length > 0) {
          insertedSchoolId = pgRes.rows[0].id;
          newSchoolObj.id = insertedSchoolId;
        }
      } catch (pgErr: unknown) {
        console.error('PG Insert error during SaaS registration fallback:', pgErr instanceof Error ? pgErr.message : String(pgErr));
        return { success: false as const, statusCode: 500 as const, message: 'Gagal menyimpan data pendaftaran ke database' };
      }
    }

    newSchoolObj.school_uuid = generatedSchoolUUID;
    fontInMemSchools.set(cleanSlug, newSchoolObj);
    if (insertedSchoolId) {
      fontInMemSchools.set(String(insertedSchoolId), newSchoolObj);
    }

    // Try inserting into schools table (compatibility layer)
    try {
      await supabase.from('schools').upsert({
        name: cleanSchoolName,
        slug: cleanSlug,
        official_email: cleanEmail,
        status: 'UNVERIFIED',
        is_verified: false,
        plan_type: isTrial ? 'TRIAL' : 'YEARLY',
        admin_name: admin_name || cleanAdminUsername,
        created_at: createdAtIso
      }, { onConflict: 'slug' });
    } catch (_schoolsErr: unknown) {
      try {
        await pool.query(
          `INSERT INTO schools (name, slug, official_email, status, is_verified, plan_type, admin_name, created_at)
           VALUES ($1, $2, $3, 'UNVERIFIED', false, $4, $5, NOW())
           ON CONFLICT (slug) DO NOTHING`,
          [cleanSchoolName, cleanSlug, cleanEmail, isTrial ? 'TRIAL' : 'YEARLY', admin_name || cleanAdminUsername]
        );
      } catch (_e) {}
    }

    const hashedPassword = bcrypt.hashSync(admin_password, 10);
    const isUUID = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
    const adminSchoolRef = insertedSchoolId && isUUID(String(insertedSchoolId)) 
      ? String(insertedSchoolId) 
      : (generatedSchoolUUID || null);
    const finalAdminUsername = cleanAdminUsername || cleanAdminEmail;

    try {
      const payload: Record<string, unknown> = {
        username: finalAdminUsername,
        email: cleanAdminEmail,
        password_hash: hashedPassword,
        nama_lengkap: admin_name || cleanAdminUsername,
        role: 'superadmin'
      };
      if (adminSchoolRef) {
        payload.school_id = adminSchoolRef;
      }

      const { error: upsertErr } = await supabase.from('admin_users').upsert(payload, { onConflict: 'username' });
      if (upsertErr) {
        console.warn('Supabase admin_users upsert warning:', upsertErr.message);
        delete payload.school_id;
        await supabase.from('admin_users').upsert(payload, { onConflict: 'username' });
      }
    } catch (_adminErr: unknown) {
      try {
        await pool.query(
          `INSERT INTO admin_users (username, email, password_hash, nama_lengkap, role)
           VALUES ($1, $2, $3, $4, 'superadmin')
           ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, email = EXCLUDED.email`,
          [finalAdminUsername, cleanAdminEmail, hashedPassword, admin_name || cleanAdminUsername]
        );
      } catch (_e) {}
    }

    try {
      const targetSchoolRef = adminSchoolRef || String(insertedSchoolId || cleanSlug);
      const defaultConfigs = [
        { school_id: targetSchoolRef, config_key: 'ppdb_portal_status', config_value: 'closed', updated_at: createdAtIso },
        { school_id: targetSchoolRef, config_key: 'ppdb_title', config_value: cleanSchoolName, updated_at: createdAtIso },
        { school_id: targetSchoolRef, config_key: 'ppdb_email', config_value: cleanEmail, updated_at: createdAtIso },
        { school_id: targetSchoolRef, config_key: 'ppdb_phone', config_value: phone || '', updated_at: createdAtIso },
        { school_id: targetSchoolRef, config_key: 'ppdb_address', config_value: address || '', updated_at: createdAtIso },
      ];
      await supabase.from('landing_page_config').upsert(defaultConfigs, { onConflict: 'school_id,config_key' });
    } catch (_cfgErr) {}

    // Initialize default school_subscriptions (Free Trial 30 days)
    if (adminSchoolRef) {
      try {
        const trialExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from('school_subscriptions').insert({
          school_id: adminSchoolRef,
          plan_name: 'FREE',
          status: 'TRIAL',
          started_at: createdAtIso,
          expires_at: trialExpiry,
          amount_paid: 0
        });
      } catch (_subErr) {}
    }

    newSchoolObj.configs = {
      ppdb_portal_status: 'closed',
      ppdb_title: cleanSchoolName,
      ppdb_email: cleanEmail,
      ppdb_phone: phone || '',
      ppdb_address: address || ''
    };

    return { 
      success: true as const, 
      statusCode: 200 as const,
      school_id: newSchoolObj.id,
      slug: cleanSlug,
      message: 'Registrasi berhasil! Account instansi aktif.'
    };
  }
}
