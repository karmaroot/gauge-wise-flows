import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Pencil, Trash2, LinkIcon, Users } from 'lucide-react';
import { useInstitutions, useIndicators, useProfiles } from '@/hooks/useSupabaseQuery';
import { useInstruments, useCreateInstrument, useUpdateInstrument, useDeleteInstrument, useInstrumentIndicators, useCreateInstrumentIndicator, useUpdateInstrumentIndicator, useDeleteInstrumentIndicator } from '@/hooks/useInstruments';
import { InstrumentDialog } from '@/components/dialogs/InstrumentDialog';
import { AssignIndicatorDialog } from '@/components/dialogs/AssignIndicatorDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { FREQUENCY_LABELS } from '@/lib/constants';
import { toast } from 'sonner';

export default function InstitutionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: institutions, isLoading: instLoading } = useInstitutions();
  const institution = institutions?.find(i => i.id === id);
  const { data: instruments, isLoading: instrLoading } = useInstruments(id);
  const { data: indicators } = useIndicators();
  const { data: profiles } = useProfiles();

  const createInstr = useCreateInstrument();
  const updateInstr = useUpdateInstrument();
  const deleteInstr = useDeleteInstrument();
  const createAssign = useCreateInstrumentIndicator();
  const updateAssign = useUpdateInstrumentIndicator();
  const deleteAssign = useDeleteInstrumentIndicator();

  const [instrDialog, setInstrDialog] = useState(false);
  const [editingInstr, setEditingInstr] = useState<any>(null);
  const [deleteInstrTarget, setDeleteInstrTarget] = useState<string | null>(null);

  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [assignDialog, setAssignDialog] = useState(false);
  const [editingAssign, setEditingAssign] = useState<any>(null);
  const [deleteAssignTarget, setDeleteAssignTarget] = useState<string | null>(null);

  const { data: assignments, isLoading: assignLoading } = useInstrumentIndicators(selectedInstrument ?? undefined);

  const handleSaveInstrument = (values: any) => {
    if (values.id) {
      updateInstr.mutate(values, { onSuccess: () => setInstrDialog(false) });
    } else {
      createInstr.mutate(values, { onSuccess: () => setInstrDialog(false) });
    }
  };

  const handleSaveAssignment = (values: any) => {
    if (values.id) {
      updateAssign.mutate(values, { onSuccess: () => setAssignDialog(false) });
    } else {
      createAssign.mutate(values, { onSuccess: () => setAssignDialog(false) });
    }
  };

  const profileList = (profiles ?? []).map((p: any) => ({ id: p.id, name: p.name, email: p.email }));

  if (instLoading) return <AppLayout><Skeleton className="h-96" /></AppLayout>;
  if (!institution) return (
    <AppLayout>
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Centro de Responsabilidad no encontrado</p>
        <Button asChild variant="outline"><Link to="/institutions"><ArrowLeft className="h-4 w-4 mr-2" />Volver</Link></Button>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm"><Link to="/institutions"><ArrowLeft className="h-4 w-4 mr-2" />Centros de Responsabilidad</Link></Button>
      </div>
      <PageHeader title={institution.name} description="Gestión de instrumentos y asignaciones de indicadores">
        <Button onClick={() => { setEditingInstr(null); setInstrDialog(true); }}><Plus className="h-4 w-4 mr-2" />Nuevo Instrumento</Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instruments list */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-2">Instrumentos</h3>
          {instrLoading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)
          ) : !instruments?.length ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No hay instrumentos creados</p>
          ) : instruments.map(instr => (
            <div
              key={instr.id}
              className={`bg-card rounded-lg shadow-card p-4 cursor-pointer transition-all border-2 ${selectedInstrument === instr.id ? 'border-primary' : 'border-transparent hover:border-muted'}`}
              onClick={() => setSelectedInstrument(instr.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground">{instr.name}</h4>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setEditingInstr(instr); setInstrDialog(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setDeleteInstrTarget(instr.id); }}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{instr.type}</Badge>
                {!instr.is_active && <Badge variant="outline" className="text-[10px] text-muted-foreground">Inactivo</Badge>}
              </div>
              {instr.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{instr.description}</p>}
            </div>
          ))}
        </div>

        {/* Assignments panel */}
        <div className="lg:col-span-2">
          {selectedInstrument ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Indicadores Asignados</h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={async () => {
                    const unassigned = (indicators ?? []).filter(ind => 
                      ind.institution_id === id && 
                      ind.instrument_id === selectedInstrument &&
                      !assignments?.some((a: any) => a.indicator_id === ind.id)
                    );
                    
                    if (unassigned.length === 0) {
                      toast.info("No hay indicadores pendientes de vincular para este instrumento.");
                      return;
                    }

                    for (const ind of unassigned) {
                      await createAssign.mutateAsync({
                        instrument_id: selectedInstrument!,
                        indicator_id: ind.id,
                        informant_id: ind.informant_id!,
                        reviewer_id: ind.reviewer_id!,
                        periodicity: ind.reporting_frequency,
                        auto_start: true,
                        unit_area: ""
                      });
                    }
                    toast.success(`${unassigned.length} indicadores vinculados automáticamente.`);
                  }} disabled={createAssign.isPending}>
                    Vincular Pendientes
                  </Button>
                  <Button size="sm" onClick={() => { setEditingAssign(null); setAssignDialog(true); }}>
                    <LinkIcon className="h-3.5 w-3.5 mr-1" />Asignar Indicador
                  </Button>
                </div>
              </div>
              {assignLoading ? (
                <Skeleton className="h-40 rounded-lg" />
              ) : !assignments?.length ? (
                <div className="bg-card rounded-lg shadow-card p-8 text-center">
                  <p className="text-sm text-muted-foreground">No hay indicadores asignados a este instrumento</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((a: any) => (
                    <div key={a.id} className="bg-card rounded-lg shadow-card p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{(a.indicators as any)?.name}</h4>
                          <p className="text-xs text-muted-foreground">Meta: {(a.indicators as any)?.target_value} {(a.indicators as any)?.unit}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingAssign(a); setAssignDialog(true); }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteAssignTarget(a.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground mb-0.5">Informante</p>
                          <p className="font-medium text-foreground flex items-center gap-1"><Users className="h-3 w-3" />{(a.informant as any)?.name}</p>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-muted-foreground mb-0.5">Revisor</p>
                          <p className="font-medium text-foreground flex items-center gap-1"><Users className="h-3 w-3" />{(a.reviewer as any)?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className="text-[10px]">
                          {FREQUENCY_LABELS[a.periodicity as keyof typeof FREQUENCY_LABELS] ?? a.periodicity}
                        </Badge>
                        {a.unit_area && <Badge variant="outline" className="text-[10px]">{a.unit_area}</Badge>}
                        {a.auto_start && <Badge className="text-[10px] bg-emerald-100 text-emerald-700">Auto-inicio</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-card rounded-lg shadow-card p-12 text-center">
              <LinkIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Selecciona un instrumento para ver sus indicadores asignados</p>
            </div>
          )}
        </div>
      </div>

      <InstrumentDialog open={instrDialog} onOpenChange={setInstrDialog} instrument={editingInstr} institutionId={id!} onSave={handleSaveInstrument} loading={createInstr.isPending || updateInstr.isPending} />
      <AssignIndicatorDialog open={assignDialog} onOpenChange={setAssignDialog} assignment={editingAssign} instrumentId={selectedInstrument ?? ''} indicators={indicators ?? []} profiles={profileList} onSave={handleSaveAssignment} loading={createAssign.isPending || updateAssign.isPending} />
      <DeleteConfirmDialog open={!!deleteInstrTarget} onOpenChange={() => setDeleteInstrTarget(null)} title="¿Eliminar instrumento?" description="Se eliminará el instrumento y todas sus asignaciones." onConfirm={() => { if (deleteInstrTarget) deleteInstr.mutate(deleteInstrTarget, { onSuccess: () => { setDeleteInstrTarget(null); if (selectedInstrument === deleteInstrTarget) setSelectedInstrument(null); } }); }} loading={deleteInstr.isPending} />
      <DeleteConfirmDialog open={!!deleteAssignTarget} onOpenChange={() => setDeleteAssignTarget(null)} title="¿Eliminar asignación?" description="Se eliminará la asignación de este indicador." onConfirm={() => { if (deleteAssignTarget) deleteAssign.mutate(deleteAssignTarget, { onSuccess: () => setDeleteAssignTarget(null) }); }} loading={deleteAssign.isPending} />
    </AppLayout>
  );
}
