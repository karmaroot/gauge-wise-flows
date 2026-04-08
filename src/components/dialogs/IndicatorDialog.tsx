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
  jan_prog?: number;
  feb_prog?: number;
  mar_prog?: number;
  apr_prog?: number;
  may_prog?: number;
  jun_prog?: number;
  jul_prog?: number;
  aug_prog?: number;
  sep_prog?: number;
  oct_prog?: number;
  nov_prog?: number;
  dec_prog?: number;
  q1_prog: number;
  q2_prog: number;
  q3_prog: number;
  q4_prog: number;
  informant_id?: string | null;
  reviewer_id?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator?: IndicatorValues | null;
  onSave: (values: IndicatorValues) => void;
  loading?: boolean;
  institutions?: Array<{ id: string; name: string }>;
  instruments?: Array<{ id: string; name: string; institution_id: string }>;
  profiles?: Array<{ id: string; name: string }>;
}

export function IndicatorDialog({ open, onOpenChange, indicator, onSave, loading, institutions = [], instruments = [], profiles = [] }: Props) {
  const [form, setForm] = useState<IndicatorValues>({
    name: '', description: '', unit: 'percentage', target_value: 0, weight: 0,
    indicator_type: 'quantitative', reporting_frequency: 'quarterly', is_active: true,
    notes: '', verification_means: '', institution_id: null, instrument_id: null,
    q1_prog: 0, q2_prog: 0, q3_prog: 0, q4_prog: 0,
    informant_id: null, reviewer_id: null
  });

  useEffect(() => {
    if (indicator) {
      setForm({ 
        ...indicator, 
        target_value: Number(indicator.target_value), 
        weight: Number(indicator.weight ?? 0),
        q1_prog: Number(indicator.q1_prog ?? 0),
        q2_prog: Number(indicator.q2_prog ?? 0),
        q3_prog: Number(indicator.q3_prog ?? 0),
        q4_prog: Number(indicator.q4_prog ?? 0),
      });
    } else {
      setForm({ 
        name: '', description: '', unit: 'percentage', target_value: 0, weight: 0, 
        indicator_type: 'quantitative', reporting_frequency: 'quarterly', is_active: true, 
        notes: '', verification_means: '', institution_id: null, instrument_id: null,
        q1_prog: 0, q2_prog: 0, q3_prog: 0, q4_prog: 0,
        informant_id: null, reviewer_id: null
      });
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
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
          <div className="border p-4 rounded-md bg-muted/20">
            <Label className="text-base font-semibold mb-3 block text-primary">Programación Trimestral</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'q1_prog', label: 'Primer Trimestre' },
                { key: 'q2_prog', label: 'Segundo Trimestre' },
                { key: 'q3_prog', label: 'Tercer Trimestre' },
                { key: 'q4_prog', label: 'Cuarto Trimestre' }
              ].map((m) => (
                <div key={m.key}>
                  <Label className="text-xs text-muted-foreground">{m.label}</Label>
                  <Input 
                    type="number" 
                    value={form[m.key as keyof IndicatorValues] as number} 
                    onChange={e => set(m.key as keyof IndicatorValues, Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Informante</Label>
              <Select value={form.informant_id ?? '__none__'} onValueChange={v => set('informant_id', v === '__none__' ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar informante" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Sin asignar —</SelectItem>
                  {profiles.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Revisor</Label>
              <Select value={form.reviewer_id ?? '__none__'} onValueChange={v => set('reviewer_id', v === '__none__' ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar revisor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Sin asignar —</SelectItem>
                  {profiles.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Medio de Verificación</Label>
              <Textarea 
                value={form.verification_means ?? ''} 
                onChange={e => set('verification_means', e.target.value)} 
                placeholder="Documentos, reportes o fuentes de verificación..." 
                rows={3}
              />
            </div>
            <div>
              <Label>Notas Técnicas</Label>
              <Textarea 
                value={form.notes ?? ''} 
                onChange={e => set('notes', e.target.value)} 
                placeholder="Información adicional o notas técnicas sobre el indicador..." 
                rows={3}
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
