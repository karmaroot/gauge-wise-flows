import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Play, Zap, Clock } from 'lucide-react';
import { useAllInstrumentIndicators, useAutoStartReports } from '@/hooks/useInstruments';
import { FREQUENCY_LABELS } from '@/lib/constants';
import { toast } from 'sonner';

function shouldStart(periodicity: string, lastStarted: string | null): boolean {
  if (!lastStarted) return true;
  const last = new Date(lastStarted);
  const now = new Date();
  const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  switch (periodicity) {
    case 'monthly': return diffDays >= 28;
    case 'quarterly': return diffDays >= 85;
    case 'annually': return diffDays >= 360;
    default: return diffDays >= 85;
  }
}

export default function AutoStart() {
  const { data: assignments, isLoading } = useAllInstrumentIndicators();
  const autoStart = useAutoStartReports();

  const pendingStart = (assignments ?? []).filter((a: any) =>
    a.auto_start && shouldStart(a.periodicity, a.last_started_at)
  );

  const alreadyStarted = (assignments ?? []).filter((a: any) =>
    a.auto_start && !shouldStart(a.periodicity, a.last_started_at)
  );

  const handleStartAll = () => {
    if (!pendingStart.length) { toast.info('No hay asignaciones pendientes de inicio'); return; }
    autoStart.mutate(pendingStart as any);
  };

  const handleStartOne = (assignment: any) => {
    autoStart.mutate([assignment]);
  };

  return (
    <AppLayout>
      <PageHeader title="Inicio Automático" description="Gestión del inicio automático de reportes por periodicidad">
        {pendingStart.length > 0 && (
          <Button onClick={handleStartAll} disabled={autoStart.isPending}>
            <Play className="h-4 w-4 mr-2" />
            Iniciar Todos ({pendingStart.length})
          </Button>
        )}
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      ) : !(assignments ?? []).filter((a: any) => a.auto_start).length ? (
        <EmptyState icon={Zap} title="Sin configuración de auto-inicio" description="No hay asignaciones con inicio automático habilitado. Activa el auto-inicio en la configuración de instrumentos." />
      ) : (
        <div className="space-y-6">
          {pendingStart.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Pendientes de Inicio ({pendingStart.length})
              </h3>
              <div className="space-y-3">
                {pendingStart.map((a: any) => (
                  <div key={a.id} className="bg-card rounded-lg shadow-card p-4 border-l-4 border-amber-400">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{(a.indicators as any)?.name}</h4>
                        <p className="text-xs text-muted-foreground">{(a.instruments as any)?.name} — {(a.instruments as any)?.institutions?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {FREQUENCY_LABELS[a.periodicity as keyof typeof FREQUENCY_LABELS] ?? a.periodicity}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleStartOne(a)} disabled={autoStart.isPending}>
                          <Play className="h-3 w-3 mr-1" />Iniciar
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {a.last_started_at ? `Último inicio: ${new Date(a.last_started_at).toLocaleDateString('es')}` : 'Nunca iniciado'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alreadyStarted.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" /> Ya Iniciados ({alreadyStarted.length})
              </h3>
              <div className="space-y-3">
                {alreadyStarted.map((a: any) => (
                  <div key={a.id} className="bg-card rounded-lg shadow-card p-4 opacity-70">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{(a.indicators as any)?.name}</h4>
                        <p className="text-xs text-muted-foreground">{(a.instruments as any)?.name} — {(a.instruments as any)?.institutions?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-[10px] bg-emerald-100 text-emerald-700">
                          {FREQUENCY_LABELS[a.periodicity as keyof typeof FREQUENCY_LABELS] ?? a.periodicity}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleStartOne(a)} disabled={autoStart.isPending}>
                          <Play className="h-3 w-3 mr-1" />Iniciar
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Último inicio: {new Date(a.last_started_at).toLocaleDateString('es')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
