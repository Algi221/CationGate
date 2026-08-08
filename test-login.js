const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://hpnnzjpskvqwmbkcxfnm.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_darPoHTkh_9GGLe0FmVMbQ_PlIt6C4g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('admin_users').select('*').eq('username', 'superadmin_sekolah').eq('school_id', 1).maybeSingle();
  console.log('db query:', data);
  if(data) {
    console.log('pwd match:', bcrypt.compareSync('admin123', data.password_hash));
  } else {
    console.log('db error:', error);
  }
}
test();
