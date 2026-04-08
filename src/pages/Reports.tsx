import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus, Search, FileBarChart, Eye } from 'lucide-react';
import { useReports } from '@/hooks/useSupabaseQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Reports() {
  const { user, userRole } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  
  const { data: reports, isLoading } = useReports({ 
    userId: user?.id, 
    role: userRole
  });
  const [search, setSearch] = useState('');

  const filtered = (reports ?? []).filter(r => {
    const matchesSearch = !search || (r.indicators as any)?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          (r.institutions as any)?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <PageHeader title="Reportes de Indicadores" description="Gestión y seguimiento de reportes por periodo">
        <Button><Plus className="h-4 w-4 mr-2" />Nuevo Reporte</Button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-card">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar reportes..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FileBarChart} title="Sin reportes" description="No se encontraron reportes." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Indicador</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Centro de Responsabilidad</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Periodo</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Reportado</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Meta</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Estado</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{(r.indicators as any)?.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{(r.institutions as any)?.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{(r.periods as any)?.name}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-foreground">{r.reported_value ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-right text-muted-foreground">{(r.indicators as any)?.target_value}</td>
                    <td className="px-6 py-4 text-center"><StatusBadge status={r.status as any} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/reports/${r.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
