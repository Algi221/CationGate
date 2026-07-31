import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hpnnzjpskvqwmbkcxfnm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbm56anBza3Zxd21ia2N4Zm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NDY3NDIsImV4cCI6MjEwMDAyMjc0Mn0.yXaqoyFyQrcTuY5_kfa_9KSvNNpwNJH_YBhntVzlpo8';

export const getSupabaseClient = (_authHeader?: string) => {
  return createClient(supabaseUrl, supabaseKey);
};
