import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Activity, FileBarChart, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const barData = [
  { name: 'Cobertura', target: 85, reported: 78 },
  { name: 'Eficiencia', target: 90, reported: 92 },
  { name: 'Calidad', target: 75, reported: 70 },
  { name: 'Impacto', target: 80, reported: 65 },
  { name: 'Satisfacción', target: 88, reported: 85 },
];

const trendData = [
  { period: 'Q1 2024', approved: 12, submitted: 18 },
  { period: 'Q2 2024', approved: 22, submitted: 28 },
  { period: 'Q3 2024', approved: 30, submitted: 35 },
  { period: 'Q4 2024', approved: 38, submitted: 42 },
];

const recentReports = [
  { id: '1', indicator: 'Cobertura Educativa', institution: 'Min. Educación', status: 'submitted' as const, value: '78%' },
  { id: '2', indicator: 'Eficiencia Fiscal', institution: 'Min. Hacienda', status: 'approved' as const, value: '92%' },
  { id: '3', indicator: 'Calidad Sanitaria', institution: 'Min. Salud', status: 'observed' as const, value: '70%' },
  { id: '4', indicator: 'Impacto Ambiental', institution: 'Min. Ambiente', status: 'draft' as const, value: '65%' },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" description="Resumen general del sistema de indicadores" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Indicadores" value={24} icon={Activity} subtitle="5 nuevos este periodo" trend={{ value: 12, positive: true }} />
        <KpiCard title="Reportes Enviados" value={42} icon={FileBarChart} subtitle="Este periodo" trend={{ value: 8, positive: true }} />
        <KpiCard title="Reportes Aprobados" value={38} icon={CheckCircle2} subtitle="90% tasa de aprobación" trend={{ value: 5, positive: true }} />
        <KpiCard title="Observaciones" value={7} icon={AlertTriangle} subtitle="Pendientes de respuesta" trend={{ value: -15, positive: false }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Indicadores vs Meta</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(214 32% 91%)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="target" fill="hsl(214 32% 91%)" radius={[4, 4, 0, 0]} name="Meta" />
              <Bar dataKey="reported" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} name="Reportado" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg shadow-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Tendencia de Reportes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(214 32% 91%)' }} />
              <Area type="monotone" dataKey="submitted" stroke="hsl(221 83% 53%)" fill="hsl(221 83% 53% / 0.1)" name="Enviados" />
              <Area type="monotone" dataKey="approved" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45% / 0.1)" name="Aprobados" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-card">
        <div className="p-6 border-b">
          <h3 className="text-sm font-medium text-foreground">Reportes Recientes</h3>
        </div>
        <div className="divide-y">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{report.indicator}</p>
                <p className="text-xs text-muted-foreground">{report.institution}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">{report.value}</span>
                <StatusBadge status={report.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
