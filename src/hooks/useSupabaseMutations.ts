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
    mutationFn: async (values: { name: string; description?: string; unit: string; target_value: number; weight?: number; indicator_type: 'quantitative' | 'qualitative'; reporting_frequency: 'monthly' | 'quarterly' | 'annually'; is_active: boolean; institution_id?: string | null; instrument_id?: string | null }) => {
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
    mutationFn: async ({ id, ...values }: { id: string; name: string; description?: string; unit: string; target_value: number; weight?: number; indicator_type: 'quantitative' | 'qualitative'; reporting_frequency: 'monthly' | 'quarterly' | 'annually'; is_active: boolean; institution_id?: string | null; instrument_id?: string | null }) => {
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
      verification_method?: string;
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
        verification_method: values.verification_method || null,
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

// --- Resubmit Report (informant corrects and resubmits after observation) ---
export function useResubmitReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reportId, ...values }: {
      reportId: string;
      numerator: number;
      denominator: number;
      reported_value: number;
      comment: string;
      verification_method?: string;
    }) => {
      const { error } = await supabase.from('indicator_reports').update({
        numerator: values.numerator,
        denominator: values.denominator,
        reported_value: values.reported_value,
        comment: values.comment || null,
        verification_method: values.verification_method || null,
        status: 'responded',
        updated_at: new Date().toISOString(),
      }).eq('id', reportId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
      qc.invalidateQueries({ queryKey: ['report'] });
      qc.invalidateQueries({ queryKey: ['my-assignments'] });
      toast.success('Reporte corregido y reenviado');
    },
    onError: (e: any) => toast.error(e.message),
  });
}

// --- Reviewer: Approve report ---
export function useApproveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase.from('indicator_reports').update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', reportId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
      qc.invalidateQueries({ queryKey: ['report'] });
      toast.success('Reporte aprobado');
    },
    onError: (e: any) => toast.error(e.message),
  });
}

// --- Reviewer: Reject with observation ---
export function useRejectReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reportId, comment, userId }: { reportId: string; comment: string; userId: string }) => {
      // Create observation
      const { error: obsErr } = await supabase.from('observations').insert({
        report_id: reportId,
        user_id: userId,
        comment,
        status: 'open',
      });
      if (obsErr) throw obsErr;
      // Update report status to observed + returned_at
      const { error: repErr } = await supabase.from('indicator_reports').update({
        status: 'observed',
        returned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', reportId);
      if (repErr) throw repErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
      qc.invalidateQueries({ queryKey: ['report'] });
      qc.invalidateQueries({ queryKey: ['observations'] });
      toast.success('Reporte devuelto con observaciones');
    },
    onError: (e: any) => toast.error(e.message),
  });
}

// --- Informant: Respond to observation ---
export function useRespondObservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ observationId, comment, userId }: { observationId: string; comment: string; userId: string }) => {
      const { error: respErr } = await supabase.from('observation_responses').insert({
        observation_id: observationId,
        user_id: userId,
        comment,
      });
      if (respErr) throw respErr;
      const { error: obsErr } = await supabase.from('observations').update({ status: 'answered' }).eq('id', observationId);
      if (obsErr) throw obsErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['observations'] });
      toast.success('Respuesta enviada');
    },
    onError: (e: any) => toast.error(e.message),
  });
}
