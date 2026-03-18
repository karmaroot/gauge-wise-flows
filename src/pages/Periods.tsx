import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { usePeriods } from '@/hooks/useSupabaseQuery';
import { useCreatePeriod, useUpdatePeriod, useDeletePeriod } from '@/hooks/useSupabaseMutations';
import { Skeleton } from '@/components/ui/skeleton';
import { PeriodDialog } from '@/components/dialogs/PeriodDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

export default function Periods() {
  const { data: periods, isLoading } = usePeriods();
  const createMut = useCreatePeriod();
  const updateMut = useUpdatePeriod();
  const deleteMut = useDeletePeriod();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
      <PageHeader title="Periodos de Reporte" description="Gestión de periodos de evaluación">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Nuevo Periodo</Button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-card">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Periodo</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Inicio</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Fin</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Estado</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(periods ?? []).map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{p.start_date}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{p.end_date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {p.status === 'open' ? 'Abierto' : 'Cerrado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p.id)}>
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

      <PeriodDialog open={dialogOpen} onOpenChange={setDialogOpen} period={editing} onSave={handleSave} loading={createMut.isPending || updateMut.isPending} />
      <DeleteConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="¿Eliminar periodo?" description="Se eliminará permanentemente este periodo." onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) }); }} loading={deleteMut.isPending} />
    </AppLayout>
  );
}
