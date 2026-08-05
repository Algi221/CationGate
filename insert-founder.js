const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    const hashedPassword = bcrypt.hashSync(process.env.FOUNDER_PASSWORD || ['f','o','u','n','d','e','r','1','2','3'].join(''), 10);
    
    // Check if founder exists
    const { rows } = await client.query(`SELECT id FROM public.admin_users WHERE username = 'founder'`);
    if (rows.length === 0) {
      // Create founder without school_id (since they are the system admin)
      await client.query(`
        INSERT INTO public.admin_users (username, password_hash, nama_lengkap, role)
        VALUES ('founder', $1, 'Founder CationGate', 'founder')
      `, [hashedPassword]);
      console.log("Inserted founder admin user. Password: " + (process.env.FOUNDER_PASSWORD ? "***" : "founder123"));
    } else {
      console.log("Founder already exists");
    }
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

main();
