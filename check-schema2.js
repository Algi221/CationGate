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
      WHERE table_name = 'prospective_schools';
    `);
    console.log("prospective_schools", res.rows);
    
    const res2 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'calon_siswa';
    `);
    console.log("calon_siswa", res2.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
