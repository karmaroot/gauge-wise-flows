import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MessageSquare } from 'lucide-react';
import { useObservations } from '@/hooks/useSupabaseQuery';
import { Skeleton } from '@/components/ui/skeleton';

export default function Observations() {
  const { data: observations, isLoading } = useObservations();

  return (
    <AppLayout>
      <PageHeader title="Observaciones" description="Seguimiento de observaciones de revisión" />

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}</div>
      ) : (observations ?? []).length === 0 ? (
        <div className="bg-card rounded-lg shadow-card p-12 text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay observaciones registradas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {observations!.map((obs: any) => (
            <div key={obs.id} className="bg-card rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{obs.profiles?.name}</h3>
                </div>
                <StatusBadge status={obs.status} type="observation" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{obs.comment}</p>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {obs.observation_responses?.length ?? 0} respuestas
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">{new Date(obs.created_at).toLocaleDateString('es')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
