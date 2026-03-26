import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useInboxCounts(userId?: string) {
  return useQuery({
    queryKey: ['inbox-counts', userId],
    enabled: !!userId,
    refetchInterval: 30000, // poll every 30s
    queryFn: async () => {
      // Get user's assignments
      const { data: assignments, error: aErr } = await supabase
        .from('instrument_indicators')
        .select('indicator_id, informant_id, reviewer_id')
        .or(`informant_id.eq.${userId},reviewer_id.eq.${userId}`)
        .eq('is_active', true);
      if (aErr) throw aErr;

      const informantIndicatorIds = (assignments ?? [])
        .filter(a => a.informant_id === userId)
        .map(a => a.indicator_id);

      const reviewerIndicatorIds = (assignments ?? [])
        .filter(a => a.reviewer_id === userId)
        .map(a => a.indicator_id);

      // Get reports relevant to this user
      const { data: reports, error: rErr } = await supabase
        .from('indicator_reports')
        .select('id, status, indicator_id, created_by');
      if (rErr) throw rErr;

      const returned = (reports ?? []).filter(
        r => r.status === 'observed' && (r.created_by === userId || informantIndicatorIds.includes(r.indicator_id))
      ).length;

      const pendingReview = (reports ?? []).filter(
        r => reviewerIndicatorIds.includes(r.indicator_id) && ['submitted', 'responded'].includes(r.status)
      ).length;

      return { returned, pendingReview, total: returned + pendingReview };
    },
  });
}
