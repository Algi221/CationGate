import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache the client so we don't create thousands of connections
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (_authHeader?: string) => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = 
    process.env.SUPABASE_SECRET_KEY || 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.SUPABASE_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    '';

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
};
