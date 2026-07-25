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
      .select('id, name, logo_url, status, subscription_end_date')
      .eq('slug', slug)
      .single();
      
    if (error || !data) {
      return c.json({ success: false, message: 'Sekolah tidak ditemukan' }, 404);
    }
    
    // Check if subscription is active
    if (data.status !== 'active') {
      return c.json({ success: false, message: 'Status sekolah tidak aktif' }, 403);
    }
    
    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, message: 'Server error' }, 500);
  }
});

// Register new school from Landing Page and Generate Snap Token
saasRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { school_name, slug, email, phone, address, admin_name, admin_username, admin_password } = body;
    
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
    
    const order_id = `CATION-SAAS-${Date.now()}`;
    
    // Generate Midtrans Snap Token
    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: 750000
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: admin_name,
        email: email,
        phone: phone
      }
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // Insert school (status: pending payment)
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .insert({
        name: school_name,
        slug,
        email,
        phone,
        address,
        status: 'pending', // Menunggu pembayaran
        subscription_plan: 'premium',
        subscription_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select('id')
      .single();
      
    if (schoolError || !schoolData) {
      return c.json({ success: false, message: 'Gagal menyiapkan data sekolah' }, 500);
    }
    
    // Insert admin user for the school
    const hashedPassword = bcrypt.hashSync(admin_password, 10);
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        username: admin_username,
        password_hash: hashedPassword,
        nama_lengkap: admin_name,
        role: 'superadmin',
        school_id: schoolData.id
      });
      
    if (adminError) {
      return c.json({ success: false, message: 'Gagal membuat akun admin' }, 500);
    }
    
    return c.json({ 
      success: true, 
      token: snapToken, 
      order_id: order_id,
      school_id: schoolData.id
    });
    
  } catch (err) {
    console.error(err);
    return c.json({ success: false, message: 'Terjadi kesalahan server' }, 500);
  }
});

// Endpoint untuk mengaktifkan sekolah setelah pembayaran sukses (dipanggil oleh frontend)
saasRouter.post('/activate', async (c) => {
  try {
    const { school_id } = await c.req.json();
    if (!school_id) return c.json({ success: false, message: 'school_id required' }, 400);

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('schools')
      .update({ status: 'active' })
      .eq('id', school_id);

    if (error) throw error;
    
    return c.json({ success: true, message: 'Sekolah berhasil diaktifkan!' });
  } catch (err) {
    return c.json({ success: false, message: 'Gagal mengaktifkan' }, 500);
  }
});

export default saasRouter;
