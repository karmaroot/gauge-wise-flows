import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// --- Institutions ---
export function useCreateInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { name: string; type: 'public' | 'private' | 'autonomous' }) => {
      const { error } = await supabase.from('institutions').insert(values);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['institutions'] }); toast.success('Institución creada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; name: string; type: 'public' | 'private' | 'autonomous' }) => {
      const { error } = await supabase.from('institutions').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['institutions'] }); toast.success('Institución actualizada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('institutions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['institutions'] }); toast.success('Institución eliminada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// --- Indicators ---
export function useCreateIndicator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { name: string; description?: string; unit: string; target_value: number; indicator_type: 'quantitative' | 'qualitative'; reporting_frequency: 'monthly' | 'quarterly' | 'annually'; is_active: boolean; institution_id?: string | null; instrument_id?: string | null }) => {
      const { error } = await supabase.from('indicators').insert(values);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['indicators'] }); toast.success('Indicador creado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateIndicator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; name: string; description?: string; unit: string; target_value: number; indicator_type: 'quantitative' | 'qualitative'; reporting_frequency: 'monthly' | 'quarterly' | 'annually'; is_active: boolean; institution_id?: string | null; instrument_id?: string | null }) => {
      const { error } = await supabase.from('indicators').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['indicators'] }); toast.success('Indicador actualizado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteIndicator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('indicators').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['indicators'] }); toast.success('Indicador eliminado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// --- Periods ---
export function useCreatePeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { name: string; start_date: string; end_date: string; status: 'open' | 'closed' }) => {
      const { error } = await supabase.from('periods').insert(values);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['periods'] }); toast.success('Periodo creado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdatePeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; name: string; start_date: string; end_date: string; status: 'open' | 'closed' }) => {
      const { error } = await supabase.from('periods').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['periods'] }); toast.success('Periodo actualizado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeletePeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('periods').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['periods'] }); toast.success('Periodo eliminado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// --- User Roles ---
export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'reviewer' | 'informant' }) => {
      const { error } = await supabase.from('user_roles').update({ role }).eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); toast.success('Rol actualizado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, institution_id }: { id: string; name: string; institution_id: string | null }) => {
      const { error } = await supabase.from('profiles').update({ name, institution_id }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); toast.success('Perfil actualizado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// --- Submit Report (informant submits indicator report) ---
export function useSubmitReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      indicator_id: string;
      institution_id: string;
      period_id: string;
      numerator: number;
      denominator: number;
      reported_value: number;
      reporting_month: string;
      comment: string;
      created_by: string;
    }) => {
      const { error } = await supabase.from('indicator_reports').insert({
        indicator_id: values.indicator_id,
        institution_id: values.institution_id,
        period_id: values.period_id,
        numerator: values.numerator,
        denominator: values.denominator,
        reported_value: values.reported_value,
        reporting_month: values.reporting_month,
        comment: values.comment || null,
        created_by: values.created_by,
        status: 'submitted',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
      qc.invalidateQueries({ queryKey: ['my-assignments'] });
      toast.success('Reporte enviado exitosamente');
    },
    onError: (e: any) => toast.error(e.message),
  });
}
