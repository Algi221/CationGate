const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Reset sequence using setval
    // setval(sequence_name, val, is_called)
    // If is_called is true, the next nextval() will return val + 1
    // So if we set it to 1 and true, the next ID will be 2.
    await client.query("SELECT setval('prospective_schools_id_seq', 1, true)");
    console.log('Reset sequence prospective_schools_id_seq to 2 using setval.');
    
    await client.query('COMMIT');
    console.log('Success!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
