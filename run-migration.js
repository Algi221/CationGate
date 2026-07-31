const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    
    // Add additional columns needed for SaaS and KYB Verification
    await client.query(`
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS email TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unverified';
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS logo_url TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;
      
      -- New KYB Columns
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS npsn VARCHAR(20);
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS dapodik_code VARCHAR(50);
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS official_email VARCHAR(100);
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS social_media JSONB;
    `);

    // Create Verification OTPs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.verification_otps (
        id SERIAL PRIMARY KEY,
        school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
        email VARCHAR(100) NOT NULL,
        otp_code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    const { rows } = await client.query(`SELECT id, name, slug FROM public.schools`);
    console.log("Schools:", rows);
    
    if (rows.length === 0) {
      await client.query(`
        INSERT INTO public.schools (id, name, address, phone, email, status, max_students, slug) 
        VALUES (gen_random_uuid(), 'SMK Taruna Bhakti', 'Depok', '08123', 'info@smk.com', 'verified', 500, 'smktarunabhakti')
      `);
      console.log("Inserted dummy school");
    } else {
      await client.query(`
        UPDATE public.schools SET status = 'verified', email = 'info@smktarunabhakti.sch.id' WHERE slug = 'smktarunabhakti'
      `);
    }
    
    // Also create admin_users for CationGate founder if doesn't exist
    // founder / superadmin
    await client.query(`
      INSERT INTO public.admin_users (username, password_hash, nama_lengkap, role)
      VALUES ('founder', '$2a$10$3pP98tK6m0iG5f02v9b3Tuz9B3Y32sI1e2qK9h3zQn73N2P4R7N', 'Founder CationGate', 'founder')
      ON CONFLICT (username) DO NOTHING;
    `);
    
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

main();
