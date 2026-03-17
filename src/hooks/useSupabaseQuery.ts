import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useInstitutions() {
  return useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('institutions').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useIndicators() {
  return useQuery({
    queryKey: ['indicators'],
    queryFn: async () => {
      const { data, error } = await supabase.from('indicators').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function usePeriods() {
  return useQuery({
    queryKey: ['periods'],
    queryFn: async () => {
      const { data, error } = await supabase.from('periods').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*, user_roles(role)').order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('indicator_reports')
        .select('*, indicators(name, target_value, unit), institutions(name), periods(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: ['report', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('indicator_reports')
        .select('*, indicators(name, description, target_value, unit), institutions(name), periods(name), profiles!indicator_reports_created_by_fkey(name)')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useObservations(reportId?: string) {
  return useQuery({
    queryKey: ['observations', reportId],
    queryFn: async () => {
      let query = supabase
        .from('observations')
        .select('*, profiles!observations_user_id_fkey(name), observation_responses(*, profiles!observation_responses_user_id_fkey(name))')
        .order('created_at', { ascending: false });
      if (reportId) query = query.eq('report_id', reportId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useAttachments(reportId: string | undefined) {
  return useQuery({
    queryKey: ['attachments', reportId],
    enabled: !!reportId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('report_id', reportId!)
        .order('created_at');
      if (error) throw error;
      return data;
    },
  });
}

export function useReportCounts() {
  return useQuery({
    queryKey: ['report-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('indicator_reports').select('status');
      if (error) throw error;
      const counts = {
        total: data.length,
        submitted: data.filter(r => r.status === 'submitted').length,
        approved: data.filter(r => r.status === 'approved').length,
        observed: data.filter(r => r.status === 'observed').length,
      };
      return counts;
    },
  });
}
