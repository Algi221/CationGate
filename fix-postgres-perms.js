const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:CationGate2026!@db.hpnnzjpskvqwmbkcxfnm.supabase.co:5432/postgres' });
client.connect()
  .then(() => client.query('GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role, cation_user;'))
  .then(() => console.log('Permissions granted successfully as postgres user'))
  .catch(console.error)
  .finally(() => client.end());
