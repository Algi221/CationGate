import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseServiceInstance: SupabaseClient | null = null;

export const getSupabaseClient = (_authHeader?: string) => {
  if (supabaseServiceInstance) return supabaseServiceInstance;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error('FATAL: SUPABASE_URL environment variable is not defined!');
  }

  if (!supabaseServiceKey) {
    throw new Error(
      'FATAL: SUPABASE_SERVICE_ROLE_KEY is not defined! ' +
      'Backend MUST use a service role key — anon key fallback is forbidden.'
    );
  }

  supabaseServiceInstance = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseServiceInstance;
};
