const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://cation_user:CationGate2026!@db.hpnnzjpskvqwmbkcxfnm.supabase.co:5432/postgres' });
client.connect()
  .then(() => client.query('GRANT USAGE, SELECT ON SEQUENCE ui_revisions_id_seq TO anon, authenticated, service_role;'))
  .then(() => console.log('Permissions granted successfully'))
  .catch(console.error)
  .finally(() => client.end());
