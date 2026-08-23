import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBrowserSupabase } from '@/lib/supabase-client';

export const useGatekeeperRealtime = (queryKeyToInvalidate = ['kyb-approvals']) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

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

          queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKeyToInvalidate]);
};
