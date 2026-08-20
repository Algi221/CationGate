import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserSupabase } from '@/lib/supabase-client';

/**
 * Isolated Realtime Hook for KYB Gatekeeper
 * 
 * Only active when the component is mounted.
 * Unsubscribes automatically when unmounted.
 */
export const useGatekeeperRealtime = (queryKeyToInvalidate = ['kyb-approvals']) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

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
