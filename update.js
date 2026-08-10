const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://cation_user:CationGate2026!@db.hpnnzjpskvqwmbkcxfnm.supabase.co:5432/postgres' });
client.connect().then(() => client.query("UPDATE prospective_schools SET status = 'PENDING_VERIFICATION'"))
  .then(res => console.log('Updated rows:', res.rowCount))
  .catch(console.error).finally(() => client.end());
