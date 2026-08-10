const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: 'postgresql://cation_user:CationGate2026!@db.hpnnzjpskvqwmbkcxfnm.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  const schools = await client.query('SELECT * FROM public.schools');
  const hash = bcrypt.hashSync('admin123', 10);
  
  for (const school of schools.rows) {
    const admin = await client.query('SELECT * FROM public.admin_users WHERE school_id = $1', [school.id]);
    if (admin.rows.length === 0) {
      const username = 'admin_' + school.slug;
      await client.query(
        'INSERT INTO public.admin_users (username, password_hash, nama_lengkap, role, school_id) VALUES ($1, $2, $3, $4, $5)',
        [username, hash, 'Admin ' + school.name, 'superadmin', school.id]
      );
      console.log('Created admin for ' + school.slug + ' -> ' + username);
    }
  }
}

run().then(() => console.log('Done')).catch(console.error).finally(() => client.end());
