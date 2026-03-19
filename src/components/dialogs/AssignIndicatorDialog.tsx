import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FREQUENCY_LABELS } from '@/lib/constants';

interface AssignmentValues {
  id?: string;
  instrument_id: string;
  indicator_id: string;
  informant_id: string;
  reviewer_id: string;
  periodicity: string;
  auto_start: boolean;
  unit_area: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: any;
  instrumentId: string;
  indicators: Array<{ id: string; name: string }>;
  profiles: Array<{ id: string; name: string; email?: string | null }>;
  onSave: (values: AssignmentValues) => void;
  loading?: boolean;
}

export function AssignIndicatorDialog({ open, onOpenChange, assignment, instrumentId, indicators, profiles, onSave, loading }: Props) {
  const [form, setForm] = useState<AssignmentValues>({
    instrument_id: instrumentId, indicator_id: '', informant_id: '', reviewer_id: '', periodicity: 'quarterly', auto_start: false, unit_area: '',
  });

  useEffect(() => {
    if (assignment) {
      setForm({
        id: assignment.id,
        instrument_id: instrumentId,
        indicator_id: assignment.indicator_id,
        informant_id: assignment.informant_id,
        reviewer_id: assignment.reviewer_id,
        periodicity: assignment.periodicity,
        auto_start: assignment.auto_start ?? false,
        unit_area: assignment.unit_area ?? '',
      });
    } else {
      setForm({ instrument_id: instrumentId, indicator_id: '', informant_id: '', reviewer_id: '', periodicity: 'quarterly', auto_start: false, unit_area: '' });
    }
  }, [assignment, open, instrumentId]);

  const set = (key: keyof AssignmentValues, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: assignment?.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{assignment ? 'Editar Asignación' : 'Asignar Indicador'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Indicador</Label>
            <Select value={form.indicator_id} onValueChange={v => set('indicator_id', v)} disabled={!!assignment}>
              <SelectTrigger><SelectValue placeholder="Seleccionar indicador" /></SelectTrigger>
              <SelectContent>
                {indicators.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Informante (responsable de reportar)</Label>
            <Select value={form.informant_id} onValueChange={v => set('informant_id', v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar informante" /></SelectTrigger>
              <SelectContent>
                {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name} {p.email ? `(${p.email})` : ''}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Revisor (responsable de validar)</Label>
            <Select value={form.reviewer_id} onValueChange={v => set('reviewer_id', v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar revisor" /></SelectTrigger>
              <SelectContent>
                {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name} {p.email ? `(${p.email})` : ''}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Periodicidad</Label>
            <Select value={form.periodicity} onValueChange={v => set('periodicity', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(FREQUENCY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.auto_start} onCheckedChange={v => set('auto_start', v)} />
            <Label>Inicio automático por periodicidad</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || !form.indicator_id || !form.informant_id || !form.reviewer_id}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
