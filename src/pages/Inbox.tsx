import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox as InboxIcon, FileBarChart, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMyAssignments } from '@/hooks/useInstruments';
import { useReports } from '@/hooks/useSupabaseQuery';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FREQUENCY_LABELS } from '@/lib/constants';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';

export default function InboxPage() {
  const { user, userRole } = useAuth();
  const { data: assignments, isLoading } = useMyAssignments(user?.id);
  const { data: reports } = useReports();

  const myAsInformant = (assignments ?? []).filter((a: any) => a.informant_id === user?.id);
  const myAsReviewer = (assignments ?? []).filter((a: any) => a.reviewer_id === user?.id);

  // Reports where I'm informant
  const myReportIds = new Set(myAsInformant.map((a: any) => a.indicator_id));
  const myReports = (reports ?? []).filter(r => r.created_by === user?.id || myReportIds.has(r.indicator_id));

  // Reports I need to review
  const reviewIndicatorIds = new Set(myAsReviewer.map((a: any) => a.indicator_id));
  const reviewReports = (reports ?? []).filter(r => reviewIndicatorIds.has(r.indicator_id) && ['submitted', 'responded'].includes(r.status));

  return (
    <AppLayout>
      <PageHeader title="Bandeja de Entrada" description="Tus asignaciones y tareas pendientes" />

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">Mis Asignaciones</TabsTrigger>
          <TabsTrigger value="reports">Mis Reportes</TabsTrigger>
          <TabsTrigger value="review">Por Revisar</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
          ) : !(assignments ?? []).length ? (
            <EmptyState icon={InboxIcon} title="Sin asignaciones" description="No tienes instrumentos/indicadores asignados." />
          ) : (
            <div className="space-y-3">
              {(assignments ?? []).map((a: any) => (
                <div key={a.id} className="bg-card rounded-lg shadow-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{(a.indicators as any)?.name}</h4>
                      <p className="text-xs text-muted-foreground">{(a.instruments as any)?.name} — {(a.instruments as any)?.institutions?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {FREQUENCY_LABELS[a.periodicity as keyof typeof FREQUENCY_LABELS] ?? a.periodicity}
                      </Badge>
                      {a.informant_id === user?.id && <Badge className="text-[10px] bg-blue-100 text-blue-700">Informante</Badge>}
                      {a.reviewer_id === user?.id && <Badge className="text-[10px] bg-indigo-100 text-indigo-700">Revisor</Badge>}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Meta: {(a.indicators as any)?.target_value} {(a.indicators as any)?.unit}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {!myReports.length ? (
            <EmptyState icon={FileBarChart} title="Sin reportes" description="No tienes reportes asignados." />
          ) : (
            <div className="bg-card rounded-lg shadow-card divide-y">
              {myReports.map(r => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{(r.indicators as any)?.name}</p>
                    <p className="text-xs text-muted-foreground">{(r.institutions as any)?.name} — {(r.periods as any)?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status as any} />
                    <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                      <Link to={`/reports/${r.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="review">
          {!reviewReports.length ? (
            <EmptyState icon={Eye} title="Nada por revisar" description="No tienes reportes pendientes de revisión." />
          ) : (
            <div className="bg-card rounded-lg shadow-card divide-y">
              {reviewReports.map(r => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{(r.indicators as any)?.name}</p>
                    <p className="text-xs text-muted-foreground">{(r.institutions as any)?.name} — {(r.periods as any)?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status as any} />
                    <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                      <Link to={`/reports/${r.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
