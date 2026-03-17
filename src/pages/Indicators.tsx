import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { INDICATOR_TYPE_LABELS, FREQUENCY_LABELS } from '@/lib/constants';
import { useIndicators } from '@/hooks/useSupabaseQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function Indicators() {
  const { data: indicators, isLoading } = useIndicators();
  const [search, setSearch] = useState('');

  const filtered = (indicators ?? []).filter(ind =>
    !search || ind.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader title="Indicadores" description="Gestión de indicadores institucionales">
        <Button><Plus className="h-4 w-4 mr-2" />Nuevo Indicador</Button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-card">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar indicadores..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Nombre</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Unidad</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Meta</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Tipo</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Frecuencia</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Estado</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((ind) => (
                  <tr key={ind.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{ind.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{ind.unit}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-foreground">{Number(ind.target_value)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{INDICATOR_TYPE_LABELS[ind.indicator_type as keyof typeof INDICATOR_TYPE_LABELS]}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{FREQUENCY_LABELS[ind.reporting_frequency as keyof typeof FREQUENCY_LABELS]}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ind.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {ind.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
