import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Building2, ArrowRight } from 'lucide-react';
import { INSTITUTION_TYPE_LABELS } from '@/lib/constants';
import { useInstitutions } from '@/hooks/useSupabaseQuery';
import { useCreateInstitution, useUpdateInstitution, useDeleteInstitution } from '@/hooks/useSupabaseMutations';
import { Skeleton } from '@/components/ui/skeleton';
import { InstitutionDialog } from '@/components/dialogs/InstitutionDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

export default function Institutions() {
  const { data: institutions, isLoading } = useInstitutions();
  const createMut = useCreateInstitution();
  const updateMut = useUpdateInstitution();
  const deleteMut = useDeleteInstitution();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSave = (values: any) => {
    if (values.id) {
      updateMut.mutate(values, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMut.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Centros de Responsabilidad" description="Gestión de agrupaciones del sistema">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Nuevo Centro de Responsabilidad</Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(institutions ?? []).map((inst) => (
            <div key={inst.id} className="bg-card rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-primary/10 rounded-inner">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(inst); setDialogOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(inst.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{inst.name}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground mb-3">
                {INSTITUTION_TYPE_LABELS[inst.type as keyof typeof INSTITUTION_TYPE_LABELS]}
              </span>
              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-[10px] text-muted-foreground font-mono">{new Date(inst.created_at).toLocaleDateString('es')}</p>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link to={`/institutions/${inst.id}`}>Instrumentos <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InstitutionDialog open={dialogOpen} onOpenChange={setDialogOpen} institution={editing} onSave={handleSave} loading={createMut.isPending || updateMut.isPending} />
      <DeleteConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="¿Eliminar Centro de Responsabilidad?" description="Se eliminará permanentemente este centro." onConfirm={() => { if (deleteTarget) deleteMut.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) }); }} loading={deleteMut.isPending} />
    </AppLayout>
  );
}
