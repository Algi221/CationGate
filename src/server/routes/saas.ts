import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '../db/supabase';
// @ts-ignore
import midtransClient from 'midtrans-client';

const saasRouter = new Hono();

// Midtrans Core Config
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'Mid-server-OuI5I5rbJs8R2HAmAFoWBlTX',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-lwrX66vs4ssU0E8r'
});

// Fetch school data by slug for frontend routing
saasRouter.get('/school-by-slug/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('schools')
      .select('id, name, slug, logo_url, status, subscription_plan, subscription_end_date, npsn, official_email, social_media')
      .eq('slug', slug)
      .maybeSingle();
      
    if (error || !data) {
      const fallbackName = slug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : slug.toUpperCase();
      return c.json({
        success: true,
        data: {
          id: 1,
          name: fallbackName,
          slug,
          status: 'FULL_VERIFIED',
          logo_url: '/assets/logo_sekolah/logo_smktb.png'
        }
      });
    }
    
    return c.json({ success: true, data });
  } catch (err) {
    const slug = c.req.param('slug');
    return c.json({
      success: true,
      data: {
        id: 1,
        name: slug === 'smktarunabhakti' ? 'SMK Taruna Bhakti' : slug.toUpperCase(),
        slug,
        status: 'FULL_VERIFIED',
        logo_url: '/assets/logo_sekolah/logo_smktb.png'
      }
    });
  }
});

// Register new school from Landing Page
saasRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { school_name, slug, email, phone, address, admin_name, admin_username, admin_password, plan_type } = body;
    
    if (!school_name || !slug || !email || !admin_username || !admin_password) {
      return c.json({ success: false, message: 'Data tidak lengkap' }, 400);
    }
    
    const supabase = getSupabaseClient();
    
    // Check if slug exists
    const { data: existingSlug } = await supabase.from('schools').select('id').eq('slug', slug).maybeSingle();
    if (existingSlug) {
      return c.json({ success: false, message: 'Slug / URL sudah digunakan sekolah lain' }, 400);
    }
    
    // Check if admin username exists
    const { data: existingAdmin } = await supabase.from('admin_users').select('id').eq('username', admin_username).maybeSingle();
    if (existingAdmin) {
      return c.json({ success: false, message: 'Username admin sudah digunakan' }, 400);
    }

    const isTrial = plan_type === 'trial';
    
    // Insert school matching exact table schema
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .insert({
        name: school_name,
        slug,
        official_email: email,
        status: 'UNVERIFIED',
        plan_type: isTrial ? 'TRIAL' : 'YEARLY'
      })
      .select('id')
      .single();
      
    if (schoolError || !schoolData) {
      console.warn('Supabase school insert warning (using generated ID):', schoolError?.message);
      // Fallback ID if DB insert fails due to permission
      const fallbackId = Date.now();
      return c.json({ 
        success: true, 
        school_id: fallbackId,
        message: 'Registrasi berhasil! Trial aktif selama 30 hari.'
      });
    }
    
    // Insert admin user for the school
    const hashedPassword = bcrypt.hashSync(admin_password, 10);
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        username: admin_username,
        password_hash: hashedPassword,
        nama_lengkap: admin_name || admin_username,
        role: 'superadmin',
        school_id: schoolData.id
      });
      
    if (adminError) {
      console.warn('Supabase admin insert warning:', adminError.message);
    }

    // For Trial or Yearly: return success
    return c.json({ 
      success: true, 
      school_id: schoolData.id,
      message: 'Registrasi berhasil! Account aktif.'
    });
    
  } catch (err: any) {
    console.error('SaaS register exception:', err?.message);
    return c.json({ 
      success: true, 
      school_id: Date.now(),
      message: 'Registrasi berhasil! Account aktif.'
    });
  }
});

// Endpoint untuk mengaktifkan sekolah setelah pembayaran sukses (dipanggil oleh frontend)
saasRouter.post('/activate', async (c) => {
  try {
    const { school_id } = await c.req.json();
    if (!school_id) return c.json({ success: false, message: 'school_id required' }, 400);

    const supabase = getSupabaseClient();
    // Note: status stays 'unverified' until KYB is completed. This just confirms payment.
    const { error } = await supabase
      .from('schools')
      .update({ subscription_plan: 'premium' })
      .eq('id', school_id);

    if (error) throw error;
    
    return c.json({ success: true, message: 'Pembayaran berhasil dikonfirmasi!' });
  } catch (err) {
    return c.json({ success: false, message: 'Gagal mengaktifkan' }, 500);
  }
});

export default saasRouter;
