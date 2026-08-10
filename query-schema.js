const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://cation_user:CationGate2026!@db.hpnnzjpskvqwmbkcxfnm.supabase.co:5432/postgres' });
client.connect()
  .then(() => client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'schools'"))
  .then(res => console.log('Columns:', res.rows))
  .catch(console.error)
  .finally(() => client.end());
