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
  indicator_type: 'quantitative' | 'qualitative';
  reporting_frequency: 'monthly' | 'quarterly' | 'annually';
  is_active: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator?: IndicatorValues | null;
  onSave: (values: IndicatorValues) => void;
  loading?: boolean;
}

export function IndicatorDialog({ open, onOpenChange, indicator, onSave, loading }: Props) {
  const [form, setForm] = useState<IndicatorValues>({
    name: '', description: '', unit: 'percentage', target_value: 0,
    indicator_type: 'quantitative', reporting_frequency: 'quarterly', is_active: true,
  });

  useEffect(() => {
    if (indicator) {
      setForm({ ...indicator, target_value: Number(indicator.target_value) });
    } else {
      setForm({ name: '', description: '', unit: 'percentage', target_value: 0, indicator_type: 'quantitative', reporting_frequency: 'quarterly', is_active: true });
    }
  }, [indicator, open]);

  const set = (key: keyof IndicatorValues, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: indicator?.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{indicator ? 'Editar Indicador' : 'Nuevo Indicador'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Unidad</Label>
              <Input value={form.unit} onChange={e => set('unit', e.target.value)} required />
            </div>
            <div>
              <Label>Meta</Label>
              <Input type="number" value={form.target_value} onChange={e => set('target_value', Number(e.target.value))} required />
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
