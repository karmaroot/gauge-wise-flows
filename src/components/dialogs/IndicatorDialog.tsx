import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { INDICATOR_TYPE_LABELS, FREQUENCY_LABELS } from '@/lib/constants';

interface IndicatorValues {
  id?: string;
  name: string;
  description?: string;
  unit: string;
  target_value: number;
  weight: number;
  indicator_type: 'quantitative' | 'qualitative' | 'quantity';
  reporting_frequency: 'monthly' | 'quarterly' | 'annually';
  is_active: boolean;
  notes?: string;
  verification_means?: string;
  institution_id?: string | null;
  instrument_id?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator?: IndicatorValues | null;
  onSave: (values: IndicatorValues) => void;
  loading?: boolean;
  institutions?: Array<{ id: string; name: string }>;
  instruments?: Array<{ id: string; name: string; institution_id: string }>;
}

export function IndicatorDialog({ open, onOpenChange, indicator, onSave, loading, institutions = [], instruments = [] }: Props) {
  const [form, setForm] = useState<IndicatorValues>({
    name: '', description: '', unit: 'percentage', target_value: 0, weight: 0,
    indicator_type: 'quantitative', reporting_frequency: 'quarterly', is_active: true,
    notes: '', verification_means: '', institution_id: null, instrument_id: null,
  });

  useEffect(() => {
    if (indicator) {
      setForm({ ...indicator, target_value: Number(indicator.target_value), weight: Number(indicator.weight ?? 0) });
    } else {
      setForm({ name: '', description: '', unit: 'percentage', target_value: 0, weight: 0, indicator_type: 'quantitative', reporting_frequency: 'quarterly', is_active: true, notes: '', verification_means: '', institution_id: null, instrument_id: null });
    }
  }, [indicator, open]);

  const set = (key: keyof IndicatorValues, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleInstitutionChange = (value: string) => {
    const v = value === '__none__' ? null : value;
    setForm(prev => ({ ...prev, institution_id: v, instrument_id: null }));
  };

  const filteredInstruments = form.institution_id
    ? instruments.filter(i => i.institution_id === form.institution_id)
    : instruments;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: indicator?.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{indicator ? 'Editar Indicador' : 'Nuevo Indicador'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <Label>Fórmula de Cálculo</Label>
            <Textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={2} placeholder="Describa la fórmula aplicada para este indicador..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Centro de Responsabilidad</Label>
              <Select value={form.institution_id ?? '__none__'} onValueChange={handleInstitutionChange}>
                <SelectTrigger><SelectValue placeholder="Seleccionar centro" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Sin Centro de Responsabilidad —</SelectItem>
                  {institutions.map(inst => (
                    <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Instrumento</Label>
              <Select value={form.instrument_id ?? '__none__'} onValueChange={v => set('instrument_id', v === '__none__' ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar instrumento" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Sin instrumento —</SelectItem>
                  {filteredInstruments.map(inst => (
                    <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Unidad</Label>
              <Input value={form.unit} onChange={e => set('unit', e.target.value)} required />
            </div>
            <div>
              <Label>Meta</Label>
              <Input type="number" value={form.target_value} onChange={e => set('target_value', Number(e.target.value))} required />
            </div>
            <div>
              <Label>Ponderación (%)</Label>
              <Input type="number" min={0} max={100} step={0.01} value={form.weight} onChange={e => set('weight', Number(e.target.value))} required placeholder="0 - 100" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select value={form.indicator_type} onValueChange={v => set('indicator_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(INDICATOR_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frecuencia</Label>
              <Select value={form.reporting_frequency} onValueChange={v => set('reporting_frequency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQUENCY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} />
            <Label>Activo</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Medio de Verificación</Label>
              <Textarea 
                value={form.verification_means ?? ''} 
                onChange={e => set('verification_means', e.target.value)} 
                placeholder="Documentos, reportes o fuentes de verificación..." 
                rows={4}
              />
            </div>
            <div>
              <Label>Notas Técnicas</Label>
              <Textarea 
                value={form.notes ?? ''} 
                onChange={e => set('notes', e.target.value)} 
                placeholder="Información adicional o notas técnicas sobre el indicador..." 
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
