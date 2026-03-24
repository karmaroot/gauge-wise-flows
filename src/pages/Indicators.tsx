import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { INDICATOR_TYPE_LABELS, FREQUENCY_LABELS } from '@/lib/constants';
import { useIndicators, useInstitutions } from '@/hooks/useSupabaseQuery';
import { useInstruments } from '@/hooks/useInstruments';
import { useCreateIndicator, useUpdateIndicator, useDeleteIndicator } from '@/hooks/useSupabaseMutations';
import { Skeleton } from '@/components/ui/skeleton';
import { IndicatorDialog } from '@/components/dialogs/IndicatorDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

export default function Indicators() {
  const { data: indicators, isLoading } = useIndicators();
  const { data: institutions } = useInstitutions();
  const { data: instruments } = useInstruments();
  const createMut = useCreateIndicator();
  const updateMut = useUpdateIndicator();
  const deleteMut = useDeleteIndicator();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = (indicators ?? []).filter(ind =>
    !search || ind.name.toLowerCase().includes(search.toLowerCase())
  );

  const institutionMap = Object.fromEntries((institutions ?? []).map(i => [i.id, i.name]));
  const instrumentMap = Object.fromEntries((instruments ?? []).map(i => [i.id, i.name]));

  const handleSave = (values: any) => {
    if (values.id) {
      updateMut.mutate(values, { onSuccess: () => setDialogOpen(false) });
    } else {
      const { id, ...rest } = values;
      createMut.mutate(rest, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Indicadores" description="Gestión de indicadores institucionales">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Nuevo Indicador</Button>
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
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Institución</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Instrumento</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Unidad</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Ponderación</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Tipo</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Frecuencia</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Estado</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((ind: any) => (
                  <tr key={ind.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{ind.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{ind.institution_id ? institutionMap[ind.institution_id] ?? '—' : '—'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{ind.instrument_id ? instrumentMap[ind.instrument_id] ?? '—' : '—'}</td>
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
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(ind); setDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(ind.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <IndicatorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        indicator={editing}
        onSave={handleSave}
        loading={createMut.isPending || updateMut.isPending}
        institutions={institutions ?? []}
        instruments={(instruments ?? []) as any}
      />
      <DeleteConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="¿Eliminar indicador?" description="Se eliminará permanentemente este indicador." onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) }); }} loading={deleteMut.isPending} />
    </AppLayout>
  );
}
