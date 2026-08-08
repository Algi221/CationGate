const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://hpnnzjpskvqwmbkcxfnm.supabase.co';
const supabaseKey = 'sb_secret_darPoHTkh_9GGLe0FmVMbQ_PlIt6C4g'; // from .env.local
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const hash = bcrypt.hashSync('admin123', 10);
  
  // Update Kevin
  await supabase.from('admin_users').update({ password_hash: hash }).eq('username', 'Kevin');
  console.log('Kevin password updated to admin123');
  
  // Update admin_tb
  await supabase.from('admin_users').update({ password_hash: hash }).eq('username', 'admin_tb');
  console.log('admin_tb password updated to admin123');
}
run();
