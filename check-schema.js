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
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'schools';
    `);
    console.log(res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
