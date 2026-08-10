const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://cation_user:CationGate2026!@db.hpnnzjpskvqwmbkcxfnm.supabase.co:5432/postgres' });
client.connect()
  .then(() => client.query("UPDATE prospective_schools SET status = 'FULL_VERIFIED', is_verified = true WHERE slug = 'smk'"))
  .then(res => console.log('Prospective Updated:', res.rowCount))
  .then(() => client.query("UPDATE schools SET status = 'FULL_VERIFIED', subscription_plan = 'PRO_750K' WHERE slug = 'smk'"))
  .then(res => console.log('Schools Updated:', res.rowCount))
  .catch(console.error)
  .finally(() => client.end());
