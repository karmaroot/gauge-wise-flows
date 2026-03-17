import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Activity, FileBarChart, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useReports, useReportCounts } from '@/hooks/useSupabaseQuery';
import { useIndicators } from '@/hooks/useSupabaseQuery';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: reports, isLoading: reportsLoading } = useReports();
  const { data: counts, isLoading: countsLoading } = useReportCounts();
  const { data: indicators } = useIndicators();

  const approvedReports = reports?.filter(r => r.status === 'approved') ?? [];
  const barData = approvedReports.slice(0, 5).map(r => ({
    name: (r.indicators as any)?.name?.substring(0, 12) ?? '',
    target: (r.indicators as any)?.target_value ?? 0,
    reported: Number(r.reported_value) || 0,
  }));

  const recentReports = (reports ?? []).slice(0, 4);

  return (
    <AppLayout>
      <PageHeader title="Dashboard" description="Resumen general del sistema de indicadores" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {countsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
        ) : (
          <>
            <KpiCard title="Total Indicadores" value={indicators?.length ?? 0} icon={Activity} subtitle="Indicadores registrados" />
            <KpiCard title="Reportes Enviados" value={counts?.submitted ?? 0} icon={FileBarChart} subtitle="Pendientes de revisión" />
            <KpiCard title="Reportes Aprobados" value={counts?.approved ?? 0} icon={CheckCircle2} subtitle={`${counts?.total ? Math.round(((counts?.approved ?? 0) / counts.total) * 100) : 0}% tasa de aprobación`} />
            <KpiCard title="Observaciones" value={counts?.observed ?? 0} icon={AlertTriangle} subtitle="Reportes observados" />
          </>
        )}
      </div>

      {barData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Indicadores vs Meta (Aprobados)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(214 32% 91%)' }} />
                <Bar dataKey="target" fill="hsl(214 32% 91%)" radius={[4, 4, 0, 0]} name="Meta" />
                <Bar dataKey="reported" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} name="Reportado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg shadow-card">
        <div className="p-6 border-b">
          <h3 className="text-sm font-medium text-foreground">Reportes Recientes</h3>
        </div>
        <div className="divide-y">
          {reportsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 mx-6 my-2 rounded" />)
          ) : recentReports.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground text-center">No hay reportes aún.</p>
          ) : (
            recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{(report.indicators as any)?.name}</p>
                  <p className="text-xs text-muted-foreground">{(report.institutions as any)?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">{report.reported_value ?? '—'}</span>
                  <StatusBadge status={report.status as any} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
