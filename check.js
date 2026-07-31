const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = 'schools' OR table_name = 'admin_users' ORDER BY table_name, ordinal_position`);
  console.log(res.rows);
  await client.end();
}
main();
