const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    
    // Add additional columns needed for SaaS
    await client.query(`
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS email TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS logo_url TEXT;
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
      ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;
    `);
    
    const { rows } = await client.query(`SELECT id, name, slug FROM public.schools`);
    console.log("Schools:", rows);
    
    if (rows.length === 0) {
      await client.query(`
        INSERT INTO public.schools (id, name, address, phone, email, status, max_students, slug) 
        VALUES (gen_random_uuid(), 'SMK Taruna Bhakti', 'Depok', '08123', 'info@smk.com', 'active', 500, 'smktarunabhakti')
      `);
      console.log("Inserted dummy school");
    } else {
      await client.query(`
        UPDATE public.schools SET status = 'active', email = 'info@smktarunabhakti.sch.id' WHERE slug = 'smktarunabhakti'
      `);
    }
    
    // Also create admin_users for CationGate founder if doesn't exist
    // founder / superadmin
    await client.query(`
      INSERT INTO public.admin_users (id, username, password_hash, nama_lengkap, role)
      VALUES (gen_random_uuid(), 'founder', '$2a$10$3pP98tK6m0iG5f02v9b3Tuz9B3Y32sI1e2qK9h3zQn73N2P4R7N', 'Founder CationGate', 'founder')
      ON CONFLICT DO NOTHING;
    `);
    
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

main();
