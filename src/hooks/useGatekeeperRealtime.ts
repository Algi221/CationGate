import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';

// We create a single client instance for the realtime connection
const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Isolated Realtime Hook for KYB Gatekeeper
 * 
 * Only active when the component is mounted.
 * Unsubscribes automatically when unmounted.
 */
export const useGatekeeperRealtime = (queryKeyToInvalidate = ['kyb-approvals']) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Subscribe (Open Socket)
    const channel = supabase
      .channel('kyb-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kyb_approvals',
        },
        (payload) => {
          console.log('Realtime KYB update received!', payload);
          // 2. Invalidate query to trigger refetch
          queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
        }
      )
      .subscribe();

    // 3. Unsubscribe on unmount (Close Socket)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKeyToInvalidate]);
};
